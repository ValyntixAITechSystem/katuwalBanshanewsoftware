// // routes/familyRoutes.js
// import express from 'express';
// import {
//   getFamilies,
//   getFamilyTreeByFamily,
//   // getFamilyTree,
//   getFamilyById,
//   createFamily,
//   updateFamily,
//   deleteFamily,
//   getFamilyStats,
// } from '../controllers/familyController.js';
// import { validate, familyValidation } from '../middlewares/validation.js';
// import { uploadSingleFamilyPhoto, handleUpload } from '../middlewares/upload.js';
// import { rateLimit } from '../middlewares/rateLimit.js';

// const router = express.Router();

// // Apply rate limiting
// router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// // GET routes
// router.get('/', getFamilies);
// // src/routes/familyRoutes.js - Ensure route is correct
// // router.get('/:familyId/tree', getFamilyTreeByFamily);
// router.get('/stats', getFamilyStats);
// router.get('/:id', getFamilyById);
// // src/routes/familyRoutes.js - Add this route
// router.get('/:familyId/tree', getFamilyTreeByFamily);

// // POST routes with file upload
// router.post(
//   '/',
//   handleUpload(uploadSingleFamilyPhoto),
//   validate(familyValidation),
//   createFamily
// );

// // PUT routes with file upload
// router.put(
//   '/:id',
//   handleUpload(uploadSingleFamilyPhoto),
//   validate(familyValidation),
//   updateFamily
// );

// // DELETE routes
// router.delete('/:id', deleteFamily);

// export default router;

import express from 'express';
import {
  getFamilies,
  getFamilyTreeByFamily,
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

// GET routes - ORDER MATTERS! Put specific routes before parameter routes
router.get('/', getFamilies);
router.get('/stats', getFamilyStats);
router.get('/:familyId/tree', getFamilyTreeByFamily); // Specific route first
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