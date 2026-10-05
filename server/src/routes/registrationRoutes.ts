import { Router } from 'express';
import {
  createRegistration,
  getRegistrations,
  checkEmailAvailability,
} from '../controllers/registrationController.js';

const router = Router();

router.post('/', createRegistration);
router.get('/', getRegistrations);
router.get('/check-email', checkEmailAvailability);

export default router;
