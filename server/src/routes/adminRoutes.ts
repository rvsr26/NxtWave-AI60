import { Router } from 'express';
import {
  getAdminOverview,
  runSeed,
  clearSimulated,
  clearAll,
} from '../controllers/adminController.js';

const router = Router();

router.get('/overview', getAdminOverview);
router.post('/seed', runSeed);
router.post('/clear-simulated', clearSimulated);
router.post('/clear-all', clearAll);

export default router;
