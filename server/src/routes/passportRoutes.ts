import { Router } from 'express';
import {
  generatePassport,
  getPassports,
  getPassportById,
} from '../controllers/passportController.js';

const router = Router();

router.post('/generate', generatePassport);
router.get('/', getPassports);
router.get('/:id', getPassportById);

export default router;
