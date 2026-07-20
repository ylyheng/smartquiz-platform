import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as questionCtrl from '../controllers/questionController.js';

const router = Router({ mergeParams: true });

router.use(authenticate, authorize('lecturer'));

/**
 * @swagger
 * /api/banks/{bankId}/questions:
 *   get:
 *     tags: [Questions]
 *     summary: List all questions in a bank
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of questions
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
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Question'
 *       404:
 *         description: Bank not found
 */
router.get('/', questionCtrl.listByBank);

/**
 * @swagger
 * /api/banks/{bankId}/questions:
 *   post:
 *     tags: [Questions]
 *     summary: Create a new question in a bank
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, questionText, correctAnswer]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [mcq, true-false]
 *               questionText:
 *                 type: string
 *               options:
 *                 type: string
 *                 description: "MCQ options separated by newline, e.g. A. Opt1\nB. Opt2"
 *               correctAnswer:
 *                 type: string
 *               explanation:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *               points:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Question created
 *       404:
 *         description: Bank not found
 */
router.post('/', questionCtrl.create);

/**
 * @swagger
 * /api/banks/{bankId}/questions/{id}:
 *   put:
 *     tags: [Questions]
 *     summary: Update a question
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: integer
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
 *               type:
 *                 type: string
 *                 enum: [mcq, true-false]
 *               questionText:
 *                 type: string
 *               options:
 *                 type: string
 *               correctAnswer:
 *                 type: string
 *               explanation:
 *                 type: string
 *               mediaUrl:
 *                 type: string
 *               points:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Question updated
 *       404:
 *         description: Question not found
 */
router.put('/:id', questionCtrl.update);

/**
 * @swagger
 * /api/banks/{bankId}/questions/{id}:
 *   delete:
 *     tags: [Questions]
 *     summary: Delete a question from a bank
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bankId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Question deleted
 *       404:
 *         description: Question not found
 */
router.delete('/:id', questionCtrl.remove);

export default router;
