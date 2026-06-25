import { Request, Response, NextFunction } from 'express';
import * as studentService from './student.service';
import { sanitizeStudent } from './student.sanitizer';
import { verifyToken } from '../../../config/jwt.config';
import { pool } from '../../../config/db.config';
export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeStudent(req.body);
        const student = await studentService.createStudent(sanitizedData);
        
        res.status(201).json({ 
            status: 'success', 
            message: 'Student profile created successfully', 
            data: student 
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

        const students = await studentService.getAllStudents(instId);
        res.status(200).json({ status: 'success', data: students });
    } catch (error: any) { 
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
             return res.status(401).json({ status: 'error', message: 'Invalid token' });
        }
        next(error); 
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.status(200).json({ status: 'success', data: student });
    } catch (error) { 
        next(error); 
    }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeStudent(req.body, true);
        const student = await studentService.updateStudent(req.params.id, sanitizedData);
        res.status(200).json({ status: 'success', message: 'Student updated successfully', data: student });
    } catch (error) { 
        next(error); 
    }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await studentService.deleteStudent(req.params.id);
        res.status(204).send();
    } catch (error) { 
        next(error); 
    }
};