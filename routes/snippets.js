// routes/snippets.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getSnippets,
  createSnippet,
  updateSnippet,
  deleteSnippet,
} from '../controllers/snippetsController.js';

const router = Router();

router.use(authenticate);

router.get('/', getSnippets);
router.post('/', createSnippet);
router.put('/:id', updateSnippet);
router.delete('/:id', deleteSnippet);

export default router;
