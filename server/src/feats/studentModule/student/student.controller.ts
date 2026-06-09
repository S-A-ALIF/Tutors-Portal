import { Request, Response, NextFunction } from 'express';
import * as studentService from './student.service';
import { sanitizeStudent } from './student.sanitizer';
import { CustomError } from '../../../error/customErrors';

export const enroll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeStudent(req.body);
        const student = await studentService.enrollStudent(sanitizedData);
        res.status(201).json({ status: 'success', message: 'Student enrolled successfully', data: student });
    } catch (error) { next(error); }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const students = await studentService.getAllStudents();
        res.status(200).json({ status: 'success', data: students });
    } catch (error) { next(error); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const student = await studentService.getStudentById(req.params.id);
        res.status(200).json({ status: 'success', data: student });
    } catch (error) { next(error); }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const student = await studentService.updateStudent(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: student });
    } catch (error) { next(error); }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await studentService.deleteStudent(req.params.id);
        res.status(204).send();
    } catch (error) { next(error); }
};

export const updateAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { field, value } = req.body;
        const allowedFields = ['guardian_name', 'guardian_phone'];
        if (!allowedFields.includes(field)) throw new CustomError('Invalid field for bulk update', 400);
        
        const count = await studentService.updateAllStudents(field, value);
        res.status(200).json({ status: 'success', message: `Updated ${count} students` });
    } catch (error) { next(error); }
};