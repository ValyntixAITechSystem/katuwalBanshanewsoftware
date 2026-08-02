import Family from '../models/Family.js';
import Member from '../models/Member.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';

export const getFamilies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { familyName: { $regex: search, $options: 'i' } },
          { familyNumber: { $regex: search, $options: 'i' } },
          { clan: { $regex: search, $options: 'i' } },
        ],
      };
    }

    const [families, total] = await Promise.all([
      Family.find(query)
        .populate('headOfFamily', 'name photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Family.countDocuments(query),
    ]);

    res.json({
      data: families,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
 
};

export const getFamilyTree = async (req, res) => {
  try {
    const members = await Member.find()
      .populate("family", "familyName familyNumber")
      .populate("father", "name")
      .populate("mother", "name")
      .populate("husband", "name")
      .populate("wife", "name")
      .lean();

    res.status(200).json({
      success: true,
      count: members.length,
      data: members,
    });
  } catch (error) {
    console.error("Family Tree Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id)
      .populate('headOfFamily', 'name photo phone email');

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Get all members in this family
    const members = await Member.find({ family: family._id })
      .select('name photo gender dob isAlive relation')
      .limit(100);

    res.json({
      ...family.toObject(),
      members,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFamily = async (req, res) => {
  try {
    const familyData = {
      ...req.body,
      familyPhoto: req.file?.path || null,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    };

    const family = new Family(familyData);
    await family.save();

    // Create notification
    const notification = new Notification({
      type: 'family_added',
      title: 'New Family Added',
      message: `Family "${family.familyName}" has been added to the system.`,
      data: { familyId: family._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    // Emit socket event
    io.emit('family:created', family);
    io.emit('notification:new', notification);

    res.status(201).json(family);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Family number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};



export const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Delete old photo if new one uploaded
    if (req.file && family.familyPhoto) {
      const publicId = family.familyPhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    const updatedFamily = await Family.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        familyPhoto: req.file?.path || family.familyPhoto,
        updatedBy: req.user?._id || null,
      },
      { new: true, runValidators: true }
    );

    // Create notification
    const notification = new Notification({
      type: 'family_updated',
      title: 'Family Updated',
      message: `Family "${updatedFamily.familyName}" has been updated.`,
      data: { familyId: updatedFamily._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('family:updated', updatedFamily);
    io.emit('notification:new', notification);

    res.json(updatedFamily);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Family number already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

export const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Check if family has members
    const memberCount = await Member.countDocuments({ family: family._id });
    if (memberCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete family with members. Transfer members first.' 
      });
    }

    // Delete photo from Cloudinary
    if (family.familyPhoto) {
      const publicId = family.familyPhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await family.deleteOne();

    io.emit('family:deleted', { id: req.params.id });

    res.json({ message: 'Family deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFamilyStats = async (req, res) => {
  try {
    const [totalFamilies, memberStats] = await Promise.all([
      Family.countDocuments(),
      Member.aggregate([
        {
          $group: {
            _id: '$family',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const familiesWithMembers = memberStats.length;

    res.json({
      totalFamilies,
      familiesWithMembers,
      averageMembersPerFamily: totalFamilies > 0 ? 
        Math.round(memberStats.reduce((acc, curr) => acc + curr.count, 0) / totalFamilies) : 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};