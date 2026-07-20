import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as quizCtrl from '../controllers/quizController.js';
import { startAttempt } from '../controllers/attemptController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     tags: [Quizzes]
 *     summary: List all quizzes
 *     description: Lecturers see only their own quizzes. Students see all quizzes.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of quizzes
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
 *                     quizzes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Quiz'
 */
router.get('/', quizCtrl.list);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     tags: [Quizzes]
 *     summary: Create a new quiz
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, timeLimit, questionIds]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Data Structures Midterm
 *               description:
 *                 type: string
 *               timeLimit:
 *                 type: integer
 *                 example: 30
 *               shuffle:
 *                 type: boolean
 *               showResults:
 *                 type: boolean
 *               questionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Quiz created
 *       400:
 *         description: Validation error
 */
router.post('/', quizCtrl.create);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quiz by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz details with questions
 *       404:
 *         description: Quiz not found
 */
router.get('/:id', quizCtrl.getById);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   put:
 *     tags: [Quizzes]
 *     summary: Update a quiz
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               timeLimit:
 *                 type: integer
 *               shuffle:
 *                 type: boolean
 *               showResults:
 *                 type: boolean
 *               questionIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Quiz updated
 *       403:
 *         description: Not your quiz
 *       404:
 *         description: Quiz not found
 */
router.put('/:id', quizCtrl.update);

/**
 * @swagger
 * /api/quizzes/{id}:
 *   delete:
 *     tags: [Quizzes]
 *     summary: Delete a quiz and all its attempts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Quiz deleted
 *       403:
 *         description: Not your quiz
 *       404:
 *         description: Quiz not found
 */
router.delete('/:id', quizCtrl.remove);

/**
 * @swagger
 * /api/quizzes/{quizId}/attempts/start:
 *   post:
 *     tags: [Attempts]
 *     summary: Start or resume a quiz attempt
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Attempt started or resumed
 *       400:
 *         description: Already submitted
 *       404:
 *         description: Quiz not found
 */
router.post('/:quizId/attempts/start', startAttempt);

export default router;
