import express from 'express';
import {
  globalSearch,
  searchMembers,
  searchFamilies,
} from '../controllers/searchController.js';

const router = express.Router();

router.get('/', globalSearch);
router.get('/members', searchMembers);
router.get('/families', searchFamilies);

export default router;