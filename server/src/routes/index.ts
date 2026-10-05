import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import registrationRoutes from './registrationRoutes.js';
import passportRoutes from './passportRoutes.js';
import referralRoutes from './referralRoutes.js';
import campusRoutes from './campusRoutes.js';
import captainRoutes from './captainRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import growthRoutes from './growthRoutes.js';
import experimentRoutes from './experimentRoutes.js';
import decisionRoutes from './decisionRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

import { createOrUpdateReferralProfile } from '../controllers/referralController.js';

router.use('/health', healthRoutes);
router.use('/registrations', registrationRoutes);
router.use('/passports', passportRoutes);
router.use('/referrals', referralRoutes);
router.post('/referral-profiles', createOrUpdateReferralProfile);
router.use('/campuses', campusRoutes);
router.use('/captains', captainRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/growth', growthRoutes);
router.use('/experiments', experimentRoutes);
router.use('/decisions', decisionRoutes);
router.use('/admin', adminRoutes);

export default router;
