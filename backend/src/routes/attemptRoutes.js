import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import * as attemptCtrl from '../controllers/attemptController.js';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/attempts/mine:
 *   get:
 *     tags: [Attempts]
 *     summary: List current user's quiz attempts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's attempts
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
 *                     attempts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attempt'
 */
router.get('/mine', attemptCtrl.listMyAttempts);

/**
 * @swagger
 * /api/attempts/{id}:
 *   get:
 *     tags: [Attempts]
 *     summary: Get attempt details with answers
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
 *         description: Attempt details with answers
 *       403:
 *         description: Not your attempt
 *       404:
 *         description: Attempt not found
 */
router.get('/:id', attemptCtrl.getAttempt);

/**
 * @swagger
 * /api/attempts/{id}/submit:
 *   post:
 *     tags: [Attempts]
 *     summary: Submit a quiz attempt with answers
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
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: object
 *                 description: "Map of questionId to answer value"
 *                 additionalProperties:
 *                   type: string
 *     responses:
 *       200:
 *         description: Attempt submitted with score
 *       400:
 *         description: Already submitted
 *       403:
 *         description: Not your attempt
 */
router.post('/:id/submit', attemptCtrl.submitAttempt);

export default router;
