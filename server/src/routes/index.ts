import { Router } from 'express';
// Example imports - you will populate these as you build features
import authRoutes from '../feats/auth/auth.routes';
// import tutorRoutes from '../feats/tutor/tutor.routes';
// import studentRoutes from '../feats/student/student.routes';

const router = Router();

/**
 * API Route Definition
 * Routes are grouped by their respective feature modules
 */
router.use('/auth', authRoutes);
// router.use('/tutors', tutorRoutes);
// router.use('/students', studentRoutes);

export default router;