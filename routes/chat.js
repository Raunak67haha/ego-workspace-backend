// routes/chat.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
} from '../controllers/chatController.js';

const router = Router();

router.use(authenticate);

router.post('/', sendChatMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearChatHistory);

export default router;
