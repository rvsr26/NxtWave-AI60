import { Router } from 'express';
import {
  getCaptains,
  getCaptainById,
  createCaptain,
} from '../controllers/captainController.js';

const router = Router();

router.get('/', getCaptains);
router.get('/:id', getCaptainById);
router.post('/', createCaptain);

export default router;
