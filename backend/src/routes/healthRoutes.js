import { Router } from 'express';
import { check } from '../controllers/healthController.js';

const router = Router();

router.get('/', check);

export default router;
