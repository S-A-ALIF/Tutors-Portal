import { Request, Response, NextFunction } from 'express';
import * as institutionService from './institution.service';
import { sanitizeInstitution } from './institution.sanitizer';

export const create = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sanitizedData = sanitizeInstitution(req.body);
        const institution = await institutionService.createInstitution(sanitizedData);
        res.status(201).json({ status: 'success', message: 'Institution created successfully', data: institution });
    } catch (error) { 
        next(error); 
    }
};

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institutions = await institutionService.getAllInstitutions();
        res.status(200).json({ status: 'success', data: institutions });
    } catch (error) { 
        next(error); 
    }
};

export const getOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const institution = await institutionService.getInstitutionById(req.params.id);
        res.status(200).json({ status: 'success', data: institution });
    } catch (error) { 
        next(error); 
    }
};

export const updateOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Pass `true` to indicate this is an update operation
        const sanitizedData = sanitizeInstitution(req.body, true);
        
        const institution = await institutionService.updateInstitution(req.params.id, sanitizedData);
        res.status(200).json({ status: 'success', data: institution });
    } catch (error) { 
        next(error); 
    }
};

export const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await institutionService.deleteInstitution(req.params.id);
        res.status(204).send();
    } catch (error) { 
        next(error); 
    }
};