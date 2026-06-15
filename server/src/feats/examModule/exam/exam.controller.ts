import { Request, Response, NextFunction } from 'express';
import * as examService from './exam.service';
import { verifyToken } from '../../../config/jwt.config';

export const createExam = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const creatorId = decoded?.id;
        
        if (!creatorId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const exam = await examService.createExam(creatorId, req.body);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Exam created successfully', 
            data: exam 
        });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};

export const getExams = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        const userId = decoded?.id;
        
        if (!userId) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }

        const instId = req.query.inst_id as string;

        let exams;

        if (instId) {
            exams = await examService.getExamsByInstitution(instId);
        } else {
            exams = await examService.getExamsByCreator(userId);
        }

        res.status(200).json({ status: 'success', data: exams });
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};
