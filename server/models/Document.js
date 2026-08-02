import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const documentSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  member: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
    index: true,
  },
  documentType: {
    type: String,
    enum: ['citizenship', 'birth_certificate', 'marriage_certificate', 'death_certificate', 'migration_certificate', 'educational_certificate', 'passport', 'photo_album', 'other'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    trim: true,
  },
  fileSize: {
    type: Number,
  },
  mimeType: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes for performance
documentSchema.index({ member: 1, documentType: 1 });
documentSchema.index({ documentType: 1 });

export default mongoose.model('Document', documentSchema);