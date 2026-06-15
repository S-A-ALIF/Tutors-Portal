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
