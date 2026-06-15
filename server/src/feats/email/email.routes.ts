    import { Router } from 'express';
    import { testSendEmail } from './email.controller';

const router = Router();

/**
 * @route   post /api/v1/test-email
 * @desc    Send a test email
 * @access  Public or Private
 */

router.post('/', testSendEmail);

export default router;