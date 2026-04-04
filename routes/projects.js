// routes/projects.js
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectsController.js';

const router = Router();

router.use(authenticate);

router.get('/', getProjects);
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
