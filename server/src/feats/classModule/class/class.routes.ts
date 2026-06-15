import { Router } from 'express';
import * as classController from './class.controller';

const router = Router();

router.post('/', classController.createClass);
router.get('/', classController.getClasses);

export default router;
