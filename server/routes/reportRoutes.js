// // src/routes/reportRoutes.js
// import express from 'express';
// import {
//   generateGenealogyReport,
//   generateFamilyReport,
//   generateGenerationReport,
//   generateDonationReport,
//   generateDemographicReport,
//   generateQRReport,
// } from '../controllers/reportController.js';

// const router = express.Router();

// router.get('/genealogy', generateGenealogyReport);
// router.get('/family', generateFamilyReport);
// router.get('/generation', generateGenerationReport);
// router.get('/donations', generateDonationReport);
// router.get('/demographic', generateDemographicReport);
// router.get('/qr', generateQRReport);

// export default router;

import express from 'express';
import {
  generateGenealogyReport,
  generateFamilyReport,
  generateGenerationReport,
  generateDonationReport,
  generateDemographicReport,
  generateQRReport,
} from '../controllers/reportController.js';

const router = express.Router();

// All report routes
router.get('/genealogy', generateGenealogyReport);
router.get('/family', generateFamilyReport);
router.get('/generation', generateGenerationReport);
router.get('/donations', generateDonationReport);
router.get('/demographic', generateDemographicReport);
router.get('/qr', generateQRReport);

export default router;