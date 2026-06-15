import { Router } from 'express';
// Example imports - you will populate these as you build features
import authRoutes from '../feats/auth/auth.routes';
import tutorRoutes from '../feats/tutorModule/tutor/tutor.routes';
import studentRoutes from '../feats/studentModule/student/student.routes';
import institutionRoutes from '../feats/institutionModule/institution/institution.routes';
import { enrollmentRoutes } from '../feats/enrollmentModule/enrollment';
import invitationRoutes from '../feats/enrollmentModule/invitation/invitation.routes';
import { emailRoutes } from '../feats/email';
import examRoutes from '../feats/examModule/exam/exam.routes';
import classRoutes from '../feats/classModule/class/class.routes';
import routineRoutes from '../feats/routineModule/routine/routine.routes';

const router = Router();

/**
 * API Route Definition
 * Routes are grouped by their respective feature modules
 */
router.use('/auth', authRoutes);
router.use('/tutors', tutorRoutes);
router.use('/students', studentRoutes);
router.use('/institutions', institutionRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/invitations', invitationRoutes);
router.use('/send-emails', emailRoutes);
router.use('/exams', examRoutes);
router.use('/classes', classRoutes);
router.use('/routines', routineRoutes);

export default router;