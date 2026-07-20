import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as analyticsCtrl from '../controllers/analyticsController.js';

const router = Router();

router.use(authenticate, authorize('lecturer'));

/**
 * @swagger
 * /api/analytics/overview:
 *   get:
 *     tags: [Analytics]
 *     summary: Get platform overview statistics
 *     description: Returns total quizzes, students, attempts, and average score.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalQuizzes:
 *                       type: integer
 *                     totalStudents:
 *                       type: integer
 *                     totalAttempts:
 *                       type: integer
 *                     averageScore:
 *                       type: number
 */
router.get('/overview', analyticsCtrl.overview);

/**
 * @swagger
 * /api/analytics/quiz/{quizId}/scores:
 *   get:
 *     tags: [Analytics]
 *     summary: Get student scores for a specific quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Student scores with percentages
 *       403:
 *         description: Not your quiz
 *       404:
 *         description: Quiz not found
 */
router.get('/quiz/:quizId/scores', analyticsCtrl.quizScores);

/**
 * @swagger
 * /api/analytics/quiz/{quizId}/breakdown:
 *   get:
 *     tags: [Analytics]
 *     summary: Get question-level performance breakdown for a quiz
 *     description: Shows correct percentage for each question.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question breakdown with correct percentages
 *       403:
 *         description: Not your quiz
 *       404:
 *         description: Quiz not found
 */
router.get('/quiz/:quizId/breakdown', analyticsCtrl.questionBreakdown);

/**
 * @swagger
 * /api/analytics/students:
 *   get:
 *     tags: [Analytics]
 *     summary: Get student performance across all quizzes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student performance list
 */
router.get('/students', analyticsCtrl.studentPerformance);

export default router;
