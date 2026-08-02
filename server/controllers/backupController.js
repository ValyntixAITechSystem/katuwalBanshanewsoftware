import Backup from '../models/Backup.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BACKUP_DIR = path.join(__dirname, '../../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

export const createBackup = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const backupData = {};
    const collectionNames = [];

    for (const collection of collections) {
      const name = collection.name;
      if (!name.startsWith('system.')) {
        const data = await db.collection(name).find({}).toArray();
        backupData[name] = data;
        collectionNames.push(name);
      }
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `backup-${timestamp}.json`;
    const filePath = path.join(BACKUP_DIR, fileName);

    fs.writeFileSync(filePath, JSON.stringify(backupData, null, 2));

    const stats = fs.statSync(filePath);

    const backup = new Backup({
      fileName,
      filePath,
      fileSize: stats.size,
      backupType: 'full',
      status: 'completed',
      collections: collectionNames,
      createdBy: req.user?._id || null,
    });

    await backup.save();

    res.json({
      message: 'Backup created successfully',
      backup,
      downloadUrl: `/api/backup/download/${backup._id}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBackups = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [backups, total] = await Promise.all([
      Backup.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Backup.countDocuments(),
    ]);

    res.json({
      data: backups,
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

export const downloadBackup = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    if (!fs.existsSync(backup.filePath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    res.download(backup.filePath, backup.fileName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreBackup = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    if (!fs.existsSync(backup.filePath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }

    const backupData = JSON.parse(fs.readFileSync(backup.filePath, 'utf8'));
    const db = mongoose.connection.db;

    // Clear existing data (optional - you might want to implement soft restore)
    // For safety, we'll only restore collections that exist in backup
    for (const [collectionName, data] of Object.entries(backupData)) {
      if (data.length > 0) {
        // Drop existing collection
        await db.collection(collectionName).drop().catch(() => {});
        // Insert backup data
        await db.collection(collectionName).insertMany(data);
      }
    }

    res.json({ 
      message: 'Backup restored successfully',
      collections: Object.keys(backupData),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBackup = async (req, res) => {
  try {
    const backup = await Backup.findById(req.params.id);
    if (!backup) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    // Delete file
    if (fs.existsSync(backup.filePath)) {
      fs.unlinkSync(backup.filePath);
    }

    await backup.deleteOne();

    res.json({ message: 'Backup deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};