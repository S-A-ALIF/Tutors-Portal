import { Router } from 'express';
import * as controller from './student.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { studentSchema } from './student.validator';

const router = Router();

/**
 * @route   GET /api/v1/students
 * @desc    Get all students
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/v1/students/:id
 * @desc    Get a single student by ID
 * @access  Private
 */
router.get('/:id', validateRequest(studentSchema.getOne), controller.getOne);

/**
 * @route   POST /api/v1/students
 * @desc    Enroll a new student
 * @access  Private
 */
router.post('/', validateRequest(studentSchema.enroll), controller.enroll);

/**
 * @route   PATCH /api/v1/students/:id
 * @desc    Update a specific student
 * @access  Private
 */
router.patch('/:id', validateRequest(studentSchema.update), controller.updateOne);

/**
 * @route   DELETE /api/v1/students/:id
 * @desc    Delete a student
 * @access  Private
 */
router.delete('/:id', validateRequest(studentSchema.delete), controller.deleteOne);

/**
 * @route   PUT /api/v1/students/update-all
 * @desc    Bulk update a specific field for all students
 * @access  Private
 */
router.put('/update-all', controller.updateAll);

export default router;