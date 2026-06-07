import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await authService.registerUser(req.body);
        res.status(201).json({ 
            status: 'success', 
            message: 'User registered successfully', 
            data: user 
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        
        // Validate input presence
        if (!email || !password) {
            return res.status(400).json({ status: 'error', message: 'Email and password are required' });
        }
        
        const authData = await authService.loginUser(email, password);
        
        res.status(200).json({ 
            status: 'success', 
            message: 'Logged in successfully',
            token: authData.token,
            data: authData.user 
        });
    } catch (error) {
        next(error);
    }
};