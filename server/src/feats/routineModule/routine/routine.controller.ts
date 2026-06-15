import { Request, Response, NextFunction } from 'express';
import * as routineService from './routine.service';
import { verifyToken } from '../../../config/jwt.config';

const getInstId = (req: Request): string | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        verifyToken(token); // Just to verify it's valid
        // Frontend sends the correct inst_id from the user profile
        return req.body.inst_id || (req.query.inst_id as string);
    } catch (e) {
        return null;
    }
};

export const setupPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instId = getInstId(req);
        if (!instId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const periods = await routineService.setupPeriods(instId, req.body.periods);
        res.status(201).json({ status: 'success', data: periods });
    } catch (error) { next(error); }
};

export const getPeriods = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instId = getInstId(req);
        if (!instId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const periods = await routineService.getPeriods(instId);
        res.status(200).json({ status: 'success', data: periods });
    } catch (error) { next(error); }
};

export const saveSlot = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instId = getInstId(req);
        if (!instId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const slotData = { ...req.body, inst_id: instId };
        const slot = await routineService.saveSlot(instId, slotData);
        res.status(200).json({ status: 'success', data: slot });
    } catch (error) { next(error); }
};

export const getRoutine = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const instId = getInstId(req);
        if (!instId) return res.status(401).json({ status: 'error', message: 'Unauthorized' });

        const dayOfWeek = req.query.day_of_week as string;
        const routine = await routineService.getRoutine(instId, dayOfWeek);
        res.status(200).json({ status: 'success', data: routine });
    } catch (error) { next(error); }
};
