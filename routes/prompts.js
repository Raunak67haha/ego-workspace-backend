// routes/prompts.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getPrompts,
  createPrompt,
  updatePrompt,
  incrementPromptUses,
  deletePrompt,
} from '../controllers/promptsController.js';

const router = Router();

router.use(authenticate);

router.get('/', getPrompts);
router.post('/', createPrompt);
router.put('/:id', updatePrompt);
router.patch('/:id/use', incrementPromptUses);
router.delete('/:id', deletePrompt);

export default router;
