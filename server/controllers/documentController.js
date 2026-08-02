// controllers/documentController.js
import Document from '../models/Document.js';
import Member from '../models/Member.js';
import Notification from '../models/Notification.js';
import cloudinary from '../config/cloudinary.js';
import { io } from '../server.js';

export const getDocuments = async (req, res) => {
  try {
    const { memberId, documentType, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (memberId) query.member = memberId;
    if (documentType) query.documentType = documentType;

    const [documents, total] = await Promise.all([
      Document.find(query)
        .populate('member', 'name photo')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Document.countDocuments(query),
    ]);

    res.json({
      data: documents,
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

export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('member', 'name photo phone email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadDocument = async (req, res) => {
  try {
    const { memberId, documentType, title, description, isVerified } = req.body;

    // Validate member exists
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const document = new Document({
      member: memberId,
      documentType,
      title,
      description,
      fileUrl: req.file.path,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      isVerified: isVerified === 'true',
      uploadedBy: req.user?._id || null,
    });

    await document.save();

    // Create notification
    const notification = new Notification({
      type: 'document_uploaded',
      title: 'Document Uploaded',
      message: `Document "${title}" uploaded for ${member.name}`,
      data: { 
        documentId: document._id,
        memberId: member._id,
        documentType,
      },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('document:uploaded', document);
    io.emit('notification:new', notification);

    res.status(201).json(document);
  } catch (error) {
    // Delete uploaded file if error
    if (req.file?.path) {
      try {
        const publicId = req.file.path.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }
    res.status(400).json({ message: error.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const updateData = {
      ...req.body,
      uploadedBy: req.user?._id || null,
    };

    // If new file uploaded, delete old one
    if (req.file) {
      // Delete old file from Cloudinary
      if (document.fileUrl) {
        try {
          const publicId = document.fileUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error deleting old file:', err);
        }
      }
      updateData.fileUrl = req.file.path;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
      updateData.mimeType = req.file.mimetype;
    }

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    io.emit('document:updated', updatedDocument);

    res.json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete file from Cloudinary
    if (document.fileUrl) {
      try {
        const publicId = document.fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error deleting file:', err);
      }
    }

    await document.deleteOne();

    io.emit('document:deleted', { id: req.params.id });

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDocumentsByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const documents = await Document.find({ member: memberId })
      .sort({ createdAt: -1 });

    // Group by document type
    const grouped = documents.reduce((acc, doc) => {
      if (!acc[doc.documentType]) {
        acc[doc.documentType] = [];
      }
      acc[doc.documentType].push(doc);
      return acc;
    }, {});

    res.json({
      member: {
        id: member._id,
        name: member.name,
        photo: member.photo,
      },
      documents: grouped,
      total: documents.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    document.isVerified = true;
    document.uploadedBy = req.user?._id || null;
    await document.save();

    io.emit('document:verified', document);

    res.json({ message: 'Document verified successfully', document });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};