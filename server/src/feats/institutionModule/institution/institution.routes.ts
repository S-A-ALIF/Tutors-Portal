import { Router } from 'express';
import * as controller from './institution.controller';
import { validateRequest } from '../../../middlewares/validateRequest';
import { institutionSchema } from './institution.validator';

const router = Router();

/**
 * @route   GET /api/v1/institutions
 * @desc    Get all institutions
 * @access  Private
 */
router.get('/', controller.getAll);

/**
 * @route   GET /api/v1/institutions/:id
 * @desc    Get a single institution by ID
 * @access  Private
 */
router.get('/:id', validateRequest(institutionSchema.getOne), controller.getOne);

/**
 * @route   POST /api/v1/institutions
 * @desc    Create a new institution
 * @access  Private
 */
router.post('/', validateRequest(institutionSchema.create), controller.create);

/**
 * @route   PATCH /api/v1/institutions/:id
 * @desc    Update a specific institution
 * @access  Private
 */
router.patch('/:id', validateRequest(institutionSchema.update), controller.updateOne);

/**
 * @route   DELETE /api/v1/institutions/:id
 * @desc    Delete an institution
 * @access  Private
 */
router.delete('/:id', validateRequest(institutionSchema.delete), controller.deleteOne);

export default router;