import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as bankCtrl from '../controllers/questionBankController.js';

const router = Router();

router.use(authenticate, authorize('lecturer'));

router.get('/', bankCtrl.list);
router.post('/', bankCtrl.create);
router.get('/:id', bankCtrl.getById);
router.put('/:id', bankCtrl.update);
router.delete('/:id', bankCtrl.remove);

export default router;
