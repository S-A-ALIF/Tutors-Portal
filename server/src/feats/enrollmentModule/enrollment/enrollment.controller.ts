import { Request, Response, NextFunction } from 'express';
import * as enrollmentService from './enrollment.service';
import { sanitizeEnrollment } from './enrollment.sanitizer';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeEnrollment(req.body);
        const enrollment = await enrollmentService.createEnrollment(sanitizedData);
        res.status(201).json({ status: 'success', message: 'Enrollment created successfully', data: enrollment });
    } catch (error) { next(error); }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollmentService.getAllEnrollments();
        res.status(200).json({ status: 'success', data: enrollments });
    } catch (error) { next(error); }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollment = await enrollmentService.getEnrollmentById(req.params.id);
        res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) { next(error); }
};

export const getByStudentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollments = await enrollmentService.getEnrollmentsByStudentId(req.params.studentId);
        res.status(200).json({ status: 'success', data: enrollments });
    } catch (error) { next(error); }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const enrollment = await enrollmentService.updateEnrollment(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: enrollment });
    } catch (error) { next(error); }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await enrollmentService.deleteEnrollment(req.params.id);
        res.status(204).send();
    } catch (error) { next(error); }
};