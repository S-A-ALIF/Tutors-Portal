import { Request, Response, NextFunction } from 'express';
import * as tutorService from './tutor.service';
import { sanitizeTutor } from './tutor.sanitizer';
import { verifyToken } from '../../../config/jwt.config';
import { pool } from '../../../config/db.config';
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeTutor(req.body);
        const tutor = await tutorService.createTutor(sanitizedData);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Tutor profile created successfully', 
            data: tutor 
        });
    } catch (error) {
        next(error);
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        let instId = req.query.inst_id as string;
        if (!instId && decoded?.role === 'admin') {
            const instQuery = await pool.query('SELECT inst_id FROM user_institutions WHERE user_id = $1', [decoded.id]);
            if (instQuery.rows.length > 0) {
                instId = instQuery.rows[0].inst_id;
            }
        }

        if (!instId) {
            return res.status(400).json({ status: 'error', message: 'Institution ID required' });
        }

        const tutors = await tutorService.getAllTutors(instId);
        res.status(200).json({ status: 'success', data: tutors });
    } catch (error: any) { 
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tutor = await tutorService.getTutorById(req.params.id);
        res.status(200).json({ status: 'success', data: tutor });
    } catch (error) { 
        next(error); 
    }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeTutor(req.body, true);
        const tutor = await tutorService.updateTutor(req.params.id, sanitizedData);
        res.status(200).json({ status: 'success', message: 'Tutor updated successfully', data: tutor });
    } catch (error) { 
        next(error); 
    }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await tutorService.deleteTutor(req.params.id);
        res.status(204).send();
    } catch (error) { 
        next(error); 
    }
};