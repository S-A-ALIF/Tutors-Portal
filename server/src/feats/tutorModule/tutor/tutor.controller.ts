import { Request, Response, NextFunction } from 'express';
import * as tutorService from './tutor.service';
import { sanitizeTutor } from './tutor.sanitizer';

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
        const tutors = await tutorService.getAllTutors();
        res.status(200).json({ status: 'success', data: tutors });
    } catch (error) { 
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
        const tutor = await tutorService.updateTutor(req.params.id, req.body);
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