// src/routes/dashboardRoutes.js
import express from 'express';
import {
  getDashboardStats,
  getQuickStats,
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/stats', getDashboardStats);
router.get('/quick-stats', getQuickStats);

export default router;