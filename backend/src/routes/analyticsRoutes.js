import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as analyticsCtrl from '../controllers/analyticsController.js';

const router = Router();

router.use(authenticate, authorize('lecturer'));

router.get('/overview', analyticsCtrl.overview);
router.get('/quiz/:quizId/scores', analyticsCtrl.quizScores);
router.get('/quiz/:quizId/breakdown', analyticsCtrl.questionBreakdown);
router.get('/students', analyticsCtrl.studentPerformance);

export default router;
