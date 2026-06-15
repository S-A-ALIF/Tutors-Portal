import { Request, Response, NextFunction } from 'express';
import * as classService from './class.service';
import { verifyToken } from '../../../config/jwt.config';

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        
        // Frontend sends the correct inst_id from the user profile
        const instId = req.body.inst_id;
        
        const classData = { ...req.body, inst_id: instId };

        const newClass = await classService.createClass(classData);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Class created successfully', 
            data: newClass 
        });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};

export const getClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        let instId = req.query.inst_id as string;
        if (!instId && decoded?.role === 'admin') {
            instId = decoded.id;
        }

        if (!instId) {
            return res.status(400).json({ status: 'error', message: 'Institution ID required' });
        }

        const classes = await classService.getClassesByInstitution(instId);

        res.status(200).json({ status: 'success', data: classes });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};
