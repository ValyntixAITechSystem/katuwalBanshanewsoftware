import express from 'express';
import {
  getDrafts,
  getDraftById,
  createDraft,
  updateDraft,
  deleteDraft,
  submitDraft,
} from '../controllers/draftController.js';

const router = express.Router();

router.get('/', getDrafts);
router.get('/:id', getDraftById);
router.post('/', createDraft);
router.put('/:id', updateDraft);
router.delete('/:id', deleteDraft);
router.put('/:id/submit', submitDraft);

export default router;