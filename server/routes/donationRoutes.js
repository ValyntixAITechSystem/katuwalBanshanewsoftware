// import express from 'express';
// import {
//   getDonations,
//   getDonationById,
//   createDonation,
//   updateDonation,
//   deleteDonation,
//   getDonationStats,
//   exportAllDonationsToExcel,
//   exportDonationToExcel,
// } from '../controllers/donationController.js';
// import { validate, donationValidation } from '../middlewares/validation.js';

// const router = express.Router();

// // Public routes
// router.get('/', getDonations);
// router.get('/stats', getDonationStats);
// router.get('/:id', getDonationById);

// // Excel export routes
// router.get('/export/all', exportAllDonationsToExcel);
// router.get('/export/:id', exportDonationToExcel);

// // Protected routes
// router.post('/', validate(donationValidation), createDonation);
// router.put('/:id', validate(donationValidation), updateDonation);
// router.delete('/:id', deleteDonation);

// export default router;


import express from 'express';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
  exportAllDonationsToExcel,
  exportDonationToExcel,
} from '../controllers/donationController.js';
import { validate, donationValidation } from '../middlewares/validation.js';

const router = express.Router();

// ✅ IMPORTANT: Put specific routes BEFORE dynamic routes
router.get('/', getDonations);
router.get('/stats', getDonationStats);

// Excel export routes - must come before /:id
router.get('/export/all', exportAllDonationsToExcel);
router.get('/export/:id', exportDonationToExcel);

// Dynamic route must come LAST
router.get('/:id', getDonationById);

// Protected routes
router.post('/', validate(donationValidation), createDonation);
router.put('/:id', validate(donationValidation), updateDonation);
router.delete('/:id', deleteDonation);

export default router;