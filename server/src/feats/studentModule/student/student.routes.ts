import { Router } from 'express';
import * as studentController from './student.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { studentSchema } from './student.validator';

const router = Router();

/**
 * @route   GET /api/v1/students
 * @desc    Get all students
 * @access  Public or Private
 */
router.get('/', studentController.getAll);

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get a single student by ID
 * @access  Public or Private
 */
router.get(
    '/:id', 
    validateRequest(studentSchema.getOne), 
    studentController.getOne
);

/**
 * @route   POST /api/v1/students
 * @desc    Create a new student profile and link to a user
 * @access  Private
 */
router.post(
    '/', 
    validateRequest(studentSchema.create), 
    studentController.create
);

/**
 * @route   PATCH /api/v1/students/:id
 * @desc    Update a specific student profile
 * @access  Private
 */
router.patch(
    '/:id', 
    validateRequest(studentSchema.update), 
    studentController.updateOne
);

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete a student profile
 * @access  Private
 */
router.delete(
    '/:id', 
    validateRequest(studentSchema.delete), 
    studentController.deleteOne
);

export default router;