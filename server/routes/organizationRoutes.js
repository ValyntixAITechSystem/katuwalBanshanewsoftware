// routes/organizationRoutes.js
import express from 'express';
import {
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  uploadOrganizationLogo,
} from '../controllers/organizationController.js';
import { uploadSingleLogo, handleUpload } from '../middlewares/upload.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));

// GET routes
router.get('/', getOrganization);

// POST routes with file upload
router.post(
  '/',
  handleUpload(uploadSingleLogo),
  createOrganization
);

// PUT routes with file upload
router.put(
  '/',
  handleUpload(uploadSingleLogo),
  updateOrganization
);

// DELETE routes
router.delete('/', deleteOrganization);

// Logo upload endpoint
router.post(
  '/logo',
  handleUpload(uploadSingleLogo),
  uploadOrganizationLogo
);

export default router;