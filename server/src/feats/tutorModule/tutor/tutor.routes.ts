import { Router } from 'express';
import * as tutorController from './tutor.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { tutorSchema } from './tutor.validator';

const router = Router();

/**
 * @route   GET /api/v1/tutors
 * @desc    Get a list of all tutors
 * @access  Public or Private
 */
router.get('/', tutorController.getAll);

/**
 * @route   GET /api/v1/tutors/:id
 * @desc    Get a specific tutor's details by their ID
 * @access  Public or Private
 */
router.get(
    '/:id', 
    validateRequest(tutorSchema.getOne), 
    tutorController.getOne
);

/**
 * @route   POST /api/v1/tutors
 * @desc    Create a new tutor profile
 * @access  Private
 */
router.post(
    '/', 
    validateRequest(tutorSchema.create), 
    tutorController.create
);

/**
 * @route   PATCH /api/v1/tutors/:id
 * @desc    Update a specific tutor's details (including isActive status)
 * @access  Private
 */
router.patch(
    '/:id', 
    validateRequest(tutorSchema.update), 
    tutorController.updateOne
);

/**
 * @route   DELETE /api/v1/tutors/:id
 * @desc    Delete a tutor profile
 * @access  Private
 */
router.delete(
    '/:id', 
    validateRequest(tutorSchema.delete), 
    tutorController.deleteOne
);

export default router;