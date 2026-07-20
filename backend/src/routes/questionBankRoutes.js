import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as bankCtrl from '../controllers/questionBankController.js';

const router = Router();

router.use(authenticate, authorize('lecturer'));

/**
 * @swagger
 * /api/banks:
 *   get:
 *     tags: [Question Banks]
 *     summary: List all question banks
 *     description: Returns banks with question counts. Lecturer only.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of question banks
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
 *                     banks:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/QuestionBank'
 *       403:
 *         description: Not a lecturer
 */
router.get('/', bankCtrl.list);

/**
 * @swagger
 * /api/banks:
 *   post:
 *     tags: [Question Banks]
 *     summary: Create a new question bank
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Data Structures & Algorithms
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Bank created
 *       400:
 *         description: Validation error
 */
router.post('/', bankCtrl.create);

/**
 * @swagger
 * /api/banks/{id}:
 *   get:
 *     tags: [Question Banks]
 *     summary: Get question bank with all questions
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
 *         description: Bank details with questions
 *       404:
 *         description: Bank not found
 */
router.get('/:id', bankCtrl.getById);

/**
 * @swagger
 * /api/banks/{id}:
 *   put:
 *     tags: [Question Banks]
 *     summary: Update question bank title/description
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
 *     responses:
 *       200:
 *         description: Bank updated
 *       404:
 *         description: Bank not found
 */
router.put('/:id', bankCtrl.update);

/**
 * @swagger
 * /api/banks/{id}:
 *   delete:
 *     tags: [Question Banks]
 *     summary: Delete a question bank and all its questions
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
 *         description: Bank deleted
 *       404:
 *         description: Bank not found
 */
router.delete('/:id', bankCtrl.remove);

export default router;
