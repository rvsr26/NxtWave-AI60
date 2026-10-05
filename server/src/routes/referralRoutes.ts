import { Router } from 'express';
import {
  getReferrals,
  getCodeStats,
  getReferralLeaderboard,
  getMyReferrals,
  verifyReferral,
  createOrUpdateReferralProfile,
} from '../controllers/referralController.js';

const router = Router();

router.get('/', getReferrals);
router.get('/my', getMyReferrals);
router.post('/verify', verifyReferral);
router.get('/leaderboard', getReferralLeaderboard);
router.get('/:code/stats', getCodeStats);
router.post('/profiles', createOrUpdateReferralProfile);

export default router;
