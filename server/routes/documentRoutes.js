// routes/documentRoutes.js
import express from 'express';
import {
  getDocuments,
  getDocumentById,
  uploadDocument,
  updateDocument,
  deleteDocument,
  getDocumentsByMember,
  verifyDocument,
} from '../controllers/documentController.js';
import { validate, documentValidation } from '../middlewares/validation.js';
import { uploadSingleDocument, handleUpload } from '../middlewares/upload.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// GET routes
router.get('/', getDocuments);
router.get('/member/:memberId', getDocumentsByMember);
router.get('/:id', getDocumentById);

// POST routes with file upload
router.post(
  '/',
  handleUpload(uploadSingleDocument),
  validate(documentValidation),
  uploadDocument
);

// PUT routes with file upload
router.put(
  '/:id',
  handleUpload(uploadSingleDocument),
  updateDocument
);

// DELETE routes
router.delete('/:id', deleteDocument);

// Verification route
router.patch('/:id/verify', verifyDocument);

export default router;