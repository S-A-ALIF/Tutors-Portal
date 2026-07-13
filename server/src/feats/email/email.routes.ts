    import { Router } from 'express';
    import { testSendEmail, sendBulkNotification, getMyNotifications, markNotificationAsRead } from './email.controller';

const router = Router();

/**
 * @route   post /api/v1/test-email
 * @desc    Send a test email
 * @access  Public or Private
 */

router.post('/', testSendEmail);
router.post('/bulk', sendBulkNotification);
router.get('/notifications', getMyNotifications);
router.patch('/notifications/:id/read', markNotificationAsRead);

export default router;