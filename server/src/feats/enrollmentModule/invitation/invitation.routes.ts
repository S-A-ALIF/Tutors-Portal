import { Router } from 'express';
import * as invitationController from './invitation.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { invitationSchema } from './invitation.validator';

const router = Router();

/**
 * @route   POST /api/v1/invitations/send
 * @desc    Generate and send an email invitation with a 6-digit code
 * @access  Private (Institution Admin)
 */
router.post(
    '/send', 
    validateRequest(invitationSchema.send), 
    invitationController.send
);

/**
 * @route   POST /api/v1/invitations/verify
 * @desc    Verify a 6-digit code and create an enrollment
 * @access  Private (Student)
 */
router.post(
    '/verify', 
    validateRequest(invitationSchema.verify), 
    invitationController.verifyInvitation
);

router.get('/pending/:email', validateRequest(invitationSchema.pending), invitationController.getPendingInvitations);
router.post('/reject', validateRequest(invitationSchema.reject), invitationController.rejectInvitation);

export default router;
