import { Router } from 'express';
import { getExperiments, updateExperiment } from '../controllers/experimentController.js';

const router = Router();

router.get('/', getExperiments);
router.patch('/:id', updateExperiment);

export default router;
