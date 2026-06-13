import { Router } from 'express';
import * as controller from './enrollment.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { enrollmentSchema } from './enrollment.validator';

const router = Router();

/**
 * @route   GET /api/v1/enrollments
 * @desc    Get all enrollments
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/v1/enrollments/student/:studentId
 * @desc    Get all enrollments for a specific student
 * @access  Private
 */
router.get('/student/:studentId', validateRequest(enrollmentSchema.getByStudent), controller.getByStudentId);

/**
 * @route   GET /api/v1/enrollments/:id
 * @desc    Get a single enrollment record by ID
 * @access  Private
 */
router.get('/:id', validateRequest(enrollmentSchema.getOne), controller.getOne);

/**
 * @route   POST /api/v1/enrollments
 * @desc    Create a new enrollment record for a student
 * @access  Private
 */
router.post('/', validateRequest(enrollmentSchema.create), controller.create);

/**
 * @route   PATCH /api/v1/enrollments/:id
 * @desc    Update a specific enrollment record
 * @access  Private
 */
router.patch('/:id', validateRequest(enrollmentSchema.update), controller.updateOne);

/**
 * @route   DELETE /api/v1/enrollments/:id
 * @desc    Delete an enrollment record
 * @access  Private
 */
router.delete('/:id', validateRequest(enrollmentSchema.delete), controller.deleteOne);

export default router;