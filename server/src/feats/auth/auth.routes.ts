import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', authController.register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login a user and return a token
 * @access  Public
 */
router.post('/login', authController.login);

export default router;