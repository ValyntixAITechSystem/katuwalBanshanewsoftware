import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const draftSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  module: {
    type: String,
    enum: ['member', 'family', 'donation'],
    required: true,
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'submitted', 'cancelled'],
    default: 'draft',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes for performance
draftSchema.index({ module: 1, status: 1 });
draftSchema.index({ createdBy: 1 });

export default mongoose.model('Draft', draftSchema);