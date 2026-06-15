import { Request, Response, NextFunction } from 'express';
import * as studentService from './student.service';
import { sanitizeStudent } from './student.sanitizer';

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
        const students = await studentService.getAllStudents();
        res.status(200).json({ status: 'success', data: students });
    } catch (error) { 
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