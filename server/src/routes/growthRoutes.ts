import { Router } from 'express';
import {
  getOverview,
  getFunnel,
  getSources,
  getReferralMetrics,
  getCampusMetrics,
} from '../controllers/growthController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/funnel', getFunnel);
router.get('/sources', getSources);
router.get('/referrals', getReferralMetrics);
router.get('/campuses', getCampusMetrics);

export default router;
