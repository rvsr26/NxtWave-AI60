import { Router } from 'express';
import { trackEvent, getEvents } from '../controllers/analyticsController.js';

const router = Router();

router.post('/events', trackEvent);
router.get('/events', getEvents);

export default router;
