// routes/weekplan.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getWeekPlan,
  createWeekEntry,
  updateWeekEntry,
  deleteWeekEntry,
} from '../controllers/weekPlanController.js';

const router = Router();

router.use(authenticate);

router.get('/', getWeekPlan);
router.post('/', createWeekEntry);
router.put('/:id', updateWeekEntry);
router.delete('/:id', deleteWeekEntry);

export default router;
