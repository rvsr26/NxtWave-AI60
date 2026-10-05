import { Router } from 'express';
import {
  getCampuses,
  getCampusByCode,
  createCampus,
  getCampusLeaderboard,
} from '../controllers/campusController.js';

const router = Router();

router.get('/', getCampuses);
router.get('/leaderboard', getCampusLeaderboard);
router.get('/:code', getCampusByCode);
router.post('/', createCampus);

export default router;
