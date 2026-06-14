import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as questionCtrl from '../controllers/questionController.js';

const router = Router({ mergeParams: true });

router.use(authenticate, authorize('lecturer'));

router.get('/', questionCtrl.listByBank);
router.post('/', questionCtrl.create);
router.put('/:id', questionCtrl.update);
router.delete('/:id', questionCtrl.remove);

export default router;
