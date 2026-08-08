// src/models/Family.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const familySchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  familyName: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  familyNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  clan: {
    type: String,
    trim: true,
  },
  origin: {
    type: String,
    trim: true,
  },
  currentAddress: {
    type: String,
    trim: true,
  },
  headOfFamily: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  totalMembers: {
    type: Number,
    default: 0,
  },
  familyPhoto: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    trim: true,
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
familySchema.index({ familyName: 'text' });
familySchema.index({ familyNumber: 1 });
familySchema.index({ clan: 1 });

// Virtual populate: Family -> Members
familySchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'family',
});

familySchema.set('toJSON', { virtuals: true });
familySchema.set('toObject', { virtuals: true });

familySchema.pre('save', async function (next) {
  if (this.isNew) {
    if (!this.familyNumber) {
      const lastFamily = await this.constructor.findOne().sort({ familyNumber: -1 });
      const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber) : 0;
      this.familyNumber = String(lastNumber + 1).padStart(3, '0');
    }
  }
  next();
});

export default mongoose.model('Family', familySchema);