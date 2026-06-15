import { Request, Response, NextFunction } from 'express';
import * as invitationService from './invitation.service';

export const send = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invitation = await invitationService.sendInvitation(req.body);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Invitation sent successfully', 
            data: {
                id: invitation.id,
                email: invitation.email,
                expires_at: invitation.expires_at,
                status: invitation.status
            } 
        });
    } catch (error) { 
        next(error); 
    }
};

export const verifyInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code, user_id } = req.body;
        const result = await invitationService.verifyInvitation(code, user_id);
        res.status(200).json({
            status: 'success',
            message: 'Invitation verified successfully',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const getPendingInvitations = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.params;
        const result = await invitationService.getPendingInvitations(email);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export const rejectInvitation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, email } = req.body;
        await invitationService.rejectInvitation(id, email);
        res.status(200).json({
            status: 'success',
            message: 'Invitation rejected successfully'
        });
    } catch (error) {
        next(error);
    }
};
