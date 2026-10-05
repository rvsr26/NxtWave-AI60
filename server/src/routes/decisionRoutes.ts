import { Router } from 'express';
import { getDecisions, createDecision } from '../controllers/decisionController.js';

const router = Router();

router.get('/', getDecisions);
router.post('/', createDecision);

export default router;
