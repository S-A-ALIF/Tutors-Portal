import { Router } from 'express';
import * as examController from './exam.controller';

const router = Router();

router.post('/', examController.createExam);
router.get('/', examController.getExams);

export default router;
