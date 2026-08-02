// routes/memberRoutes.js
import express from 'express';
import {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getMembersByFamily,
  getMemberStats,
} from '../controllers/memberController.js';
import { validate, memberValidation } from '../middlewares/validation.js';
import { uploadSinglePhoto, handleUpload } from '../middlewares/upload.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting to all member routes
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// GET routes
router.get('/', getMembers);
router.get('/stats', getMemberStats);
router.get('/search', searchMembers);
router.get('/family/:familyId', getMembersByFamily);
router.get('/:id', getMemberById);

// POST routes with file upload
router.post(
  '/',
  handleUpload(uploadSinglePhoto),
  validate(memberValidation),
  createMember
);

// PUT routes with file upload
router.put(
  '/:id',
  handleUpload(uploadSinglePhoto),
  validate(memberValidation),
  updateMember
);

// DELETE routes
router.delete('/:id', deleteMember);

export default router;