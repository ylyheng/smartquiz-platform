import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import authRoutes from './authRoutes.js';
import questionBankRoutes from './questionBankRoutes.js';
import questionRoutes from './questionRoutes.js';
import quizRoutes from './quizRoutes.js';
import attemptRoutes from './attemptRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/banks', questionBankRoutes);
router.use('/banks/:bankId/questions', questionRoutes);
router.use('/quizzes', quizRoutes);
router.use('/attempts', attemptRoutes);
router.use('/analytics', analyticsRoutes);

export default router;
