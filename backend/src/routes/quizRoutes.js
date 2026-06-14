import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as quizCtrl from '../controllers/quizController.js';
import { startAttempt } from '../controllers/attemptController.js';

const router = Router();

router.use(authenticate);

router.get('/', quizCtrl.list);
router.post('/', quizCtrl.create);
router.get('/:id', quizCtrl.getById);
router.put('/:id', quizCtrl.update);
router.delete('/:id', quizCtrl.remove);
router.post('/:quizId/attempts/start', startAttempt);

export default router;
