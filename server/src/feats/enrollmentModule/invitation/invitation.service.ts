import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { sendEmail } from '../../email/email.service';
import { createEnrollment } from '../enrollment/enrollment.service';
import { Invitation } from './invitation.model';

const getExpiryDate = (option: string): Date => {
    const now = new Date();
    switch (option) {
        case '10m': return new Date(now.getTime() + 10 * 60000);
        case '1h': return new Date(now.getTime() + 60 * 60000);
        case '24h': return new Date(now.getTime() + 24 * 60 * 60000);
        case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60000);
        default: return new Date(now.getTime() + 24 * 60 * 60000); // Default 24h
    }
};

const generateCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendInvitation = async (data: any): Promise<Invitation> => {
    const { inst_id, email, role, academic_year, grade, section, expiry_option, roll_no, monthly_fee } = data;
    const assignedRole = role || 'student';

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if institution exists
        const instRes = await client.query('SELECT name, email FROM institutions WHERE id = $1', [inst_id]);
        if (instRes.rows.length === 0) {
            throw new CustomError('Institution not found', 404);
        }
        const institution = instRes.rows[0];

        const id = crypto.randomUUID();
        const code = generateCode();
        const expires_at = getExpiryDate(expiry_option);

        const query = `
            INSERT INTO invitations (
                id, inst_id, email, code, expires_at, role, academic_year, grade, section, roll_no, monthly_fee
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *
        `;
        const values = [id, inst_id, email, code, expires_at, assignedRole, academic_year || null, grade || null, section || null, roll_no || null, monthly_fee || null];
        
        const result = await client.query(query, values);
        const invitation = result.rows[0];

        // Send email based on role
        let emailText = '';
        let emailHtml = '';

        if (assignedRole === 'tutor') {
            emailText = `Hello,\n\nYou have been invited by ${institution.name} to join their portal as a Tutor.\n\nYour invitation code is: ${code}\n\nThis code will expire on ${expires_at.toLocaleString()}.\n\nPlease log in to your tutor account and enter this code to join the institution.\n\nBest regards,\nTutors Portal`;
            emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Institution Tutor Invitation</h2>
                    <p>Hello,</p>
                    <p>You have been invited by <strong>${institution.name}</strong> to join their portal as a Tutor.</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire on: ${expires_at.toLocaleString()}</p>
                    <p>Please log in to your tutor account and enter this code to join the institution.</p>
                    <br/>
                    <p>Best regards,<br/>Tutors Portal</p>
                </div>
            `;
        } else {
            emailText = `Hello,\n\nYou have been invited by ${institution.name} to enroll in ${grade} for the academic year ${academic_year}.\n\nYour invitation code is: ${code}\n\nThis code will expire on ${expires_at.toLocaleString()}.\n\nPlease log in to your account and enter this code to complete your enrollment.\n\nBest regards,\nTutors Portal`;
            emailHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>Institution Enrollment Invitation</h2>
                    <p>Hello,</p>
                    <p>You have been invited by <strong>${institution.name}</strong> to enroll in <strong>${grade}</strong> for the academic year <strong>${academic_year}</strong>.</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; border-radius: 5px; margin: 20px 0;">
                        ${code}
                    </div>
                    <p style="color: #666; font-size: 14px;">This code will expire on: ${expires_at.toLocaleString()}</p>
                    <p>Please log in to your account and enter this code to complete your enrollment.</p>
                    <br/>
                    <p>Best regards,<br/>Tutors Portal</p>
                </div>
            `;
        }

        await sendEmail({
            to: email,
            subject: assignedRole === 'tutor' ? `Tutor Invitation from ${institution.name}` : `Enrollment Invitation from ${institution.name}`,
            text: emailText,
            html: emailHtml,
            fromName: institution.name,
            replyTo: institution.email
        });

        await client.query('COMMIT');
        return invitation;
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [sendInvitation]:', error);
        throw new CustomError('Failed to send invitation', 500);
    } finally {
        client.release();
    }
};

export const verifyInvitation = async (code: string, user_id: string): Promise<any> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Find invitation
        const invRes = await client.query('SELECT * FROM invitations WHERE code = $1', [code]);
        if (invRes.rows.length === 0) {
            throw new CustomError('Invalid invitation code', 400);
        }
        const invitation = invRes.rows[0];

        if (invitation.status !== 'pending') {
            throw new CustomError(`This invitation has already been ${invitation.status}`, 400);
        }

        if (new Date() > new Date(invitation.expires_at)) {
            await client.query('UPDATE invitations SET status = $1 WHERE id = $2', ['expired', invitation.id]);
            await client.query('COMMIT');
            throw new CustomError('This invitation code has expired', 400);
        }

        let resultData = null;

        if (invitation.role === 'tutor') {
            // Tutor verification
            const tutorRes = await client.query('SELECT email FROM tutors WHERE id = $1', [user_id]);
            if (tutorRes.rows.length === 0) {
                throw new CustomError('Tutor profile not found', 404);
            }
            const tutorEmail = tutorRes.rows[0].email;

            if (tutorEmail.toLowerCase() !== invitation.email.toLowerCase()) {
                throw new CustomError('This invitation was sent to a different email address', 403);
            }

            // Check if already linked
            const checkLink = await client.query(
                'SELECT * FROM tutor_institutions WHERE tutor_id = $1 AND inst_id = $2',
                [user_id, invitation.inst_id]
            );
            
            if (checkLink.rows.length === 0) {
                // Link tutor to institution
                await client.query(
                    'INSERT INTO tutor_institutions (tutor_id, inst_id) VALUES ($1, $2)',
                    [user_id, invitation.inst_id]
                );
            }
            resultData = { linked: true, role: 'tutor' };
        } else {
            // Student verification
            const studentRes = await client.query('SELECT email FROM students WHERE id = $1', [user_id]);
            if (studentRes.rows.length === 0) {
                throw new CustomError('Student profile not found', 404);
            }
            const studentEmail = studentRes.rows[0].email;

            if (studentEmail.toLowerCase() !== invitation.email.toLowerCase()) {
                throw new CustomError('This invitation was sent to a different email address', 403);
            }

            // Create the enrollment
            const enrollmentData = {
                student_id: user_id,
                inst_id: invitation.inst_id,
                academic_year: invitation.academic_year,
                grade: invitation.grade,
                section: invitation.section,
                roll_no: invitation.roll_no,
                monthly_fee: invitation.monthly_fee,
                status: 'active'
            };

            resultData = await createEnrollment(enrollmentData);
        }

        // Mark invitation as accepted
        await client.query('UPDATE invitations SET status = $1 WHERE id = $2', ['accepted', invitation.id]);

        await client.query('COMMIT');
        return resultData;
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [verifyInvitation]:', error);
        throw new CustomError('Failed to verify invitation', 500);
    } finally {
        client.release();
    }
};

export const getPendingInvitations = async (email: string): Promise<any[]> => {
    const query = `
        SELECT i.id, i.inst_id, i.email, i.expires_at, i.status, i.role, i.academic_year, i.grade, inst.name as institution_name
        FROM invitations i
        JOIN institutions inst ON i.inst_id = inst.id
        WHERE i.email = $1 AND i.status = 'pending'
    `;
    try {
        const result = await pool.query(query, [email]);
        return result.rows;
    } catch (error) {
        console.error('Service Error [getPendingInvitations]:', error);
        throw new CustomError('Failed to fetch invitations', 500);
    }
};

export const rejectInvitation = async (id: string, email: string): Promise<void> => {
    const query = `
        UPDATE invitations 
        SET status = 'rejected' 
        WHERE id = $1 AND email = $2 AND status = 'pending'
    `;
    try {
        const result = await pool.query(query, [id, email]);
        if (result.rowCount === 0) {
            throw new CustomError('Invitation not found or already processed', 404);
        }
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [rejectInvitation]:', error);
        throw new CustomError('Failed to reject invitation', 500);
    }
};
