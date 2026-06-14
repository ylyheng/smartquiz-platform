import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as attemptCtrl from '../controllers/attemptController.js';

const router = Router();

router.use(authenticate);

router.get('/mine', attemptCtrl.listMyAttempts);
router.get('/:id', attemptCtrl.getAttempt);
router.post('/:id/submit', attemptCtrl.submitAttempt);

export default router;
