import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const backupSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  fileName: {
    type: String,
    required: true,
    trim: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
  },
  backupType: {
    type: String,
    enum: ['full', 'partial'],
    default: 'full',
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  collections: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
});

// Indexes for performance
backupSchema.index({ createdAt: -1 });
backupSchema.index({ status: 1 });

export default mongoose.model('Backup', backupSchema);