import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Enrollment } from './enrollment.model';

export const createEnrollment = async (enrollmentData: any): Promise<Enrollment> => {
    const { student_id, inst_id, academic_year, grade, section, roll_no, monthly_fee, is_current_year } = enrollmentData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if student exists
        const studentCheck = await client.query('SELECT id FROM students WHERE id = $1', [student_id]);
        if (studentCheck.rows.length === 0) {
            throw new CustomError('Student not found', 404);
        }

        // If this is set as the current year, set all other enrollments for this student to false
        if (is_current_year) {
            await client.query(
                'UPDATE enrollments SET is_current_year = false WHERE student_id = $1',
                [student_id]
            );
        }

        const id = crypto.randomUUID();
        const query = `
            INSERT INTO enrollments (
                id, student_id, inst_id, academic_year, grade, section, roll_no, monthly_fee, is_current_year
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
            RETURNING *
        `;
        const values = [id, student_id, inst_id, academic_year, grade, section, roll_no, monthly_fee, is_current_year];
        const result = await client.query(query, values);

        await client.query('COMMIT');
        return result.rows[0];
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createEnrollment]:', error);
        throw new CustomError('Database operation failed', 500);
    } finally {
        client.release();
    }
};

export const getAllEnrollments = async (): Promise<Enrollment[]> => {
    const result = await pool.query('SELECT * FROM enrollments ORDER BY created_at DESC');
    return result.rows;
};

export const getEnrollmentById = async (id: string): Promise<Enrollment> => {
    const result = await pool.query('SELECT * FROM enrollments WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new CustomError('Enrollment record not found', 404);
    return result.rows[0];
};

export const getEnrollmentsByStudentId = async (studentId: string): Promise<Enrollment[]> => {
    const result = await pool.query('SELECT * FROM enrollments WHERE student_id = $1 ORDER BY academic_year DESC', [studentId]);
    return result.rows;
};

export const updateEnrollment = async (id: string, updateData: Partial<Enrollment>): Promise<Enrollment> => {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE enrollments SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) throw new CustomError('Enrollment record not found', 404);
    return result.rows[0];
};

export const deleteEnrollment = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Enrollment record not found', 404);
};