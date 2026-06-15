import { Router } from 'express';
import * as routineController from './routine.controller';

const router = Router();

router.post('/periods', routineController.setupPeriods);
router.get('/periods', routineController.getPeriods);
router.post('/slots', routineController.saveSlot);
router.get('/slots', routineController.getRoutine);

export default router;
