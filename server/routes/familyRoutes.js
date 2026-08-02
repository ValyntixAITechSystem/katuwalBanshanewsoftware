// routes/familyRoutes.js
import express from 'express';
import {
  getFamilies,
  getFamilyTree,
  getFamilyById,
  createFamily,
  updateFamily,
  deleteFamily,
  getFamilyStats,
} from '../controllers/familyController.js';
import { validate, familyValidation } from '../middlewares/validation.js';
import { uploadSingleFamilyPhoto, handleUpload } from '../middlewares/upload.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// GET routes
router.get('/', getFamilies);
router.get('/tree', getFamilyTree);
router.get('/stats', getFamilyStats);
router.get('/:id', getFamilyById);

// POST routes with file upload
router.post(
  '/',
  handleUpload(uploadSingleFamilyPhoto),
  validate(familyValidation),
  createFamily
);

// PUT routes with file upload
router.put(
  '/:id',
  handleUpload(uploadSingleFamilyPhoto),
  validate(familyValidation),
  updateFamily
);

// DELETE routes
router.delete('/:id', deleteFamily);

export default router;