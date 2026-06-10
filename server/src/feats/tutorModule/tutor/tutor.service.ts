import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Tutor } from './tutor.model';

export const createTutor = async (tutorData: any): Promise<Tutor> => {
    const { first_name, last_name, email, phone_number, bio, hourly_rate, monthly_salary, subjects, is_active } = tutorData;

    try {
        if (email) {
            const checkQuery = 'SELECT id FROM tutors WHERE email = $1';
            const existing = await pool.query(checkQuery, [email]);
            if (existing.rows.length > 0) {
                throw new CustomError('Tutor with this email already exists', 409);
            }
        }

        const id = crypto.randomUUID();
        const query = `
            INSERT INTO tutors (
                id, user_id, first_name, last_name, email, phone_number, bio, hourly_rate, monthly_salary, subjects, is_active
            ) VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
        // Pass arrays directly to postgres, node-postgres handles serialization
        const values = [id, first_name, last_name, email, phone_number, bio, hourly_rate, monthly_salary, subjects, is_active];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createTutor]:', error);
        throw new CustomError('Database operation failed', 500);
    }
};

export const linkTutorToUser = async (email: string, userId: string): Promise<boolean> => {
    const query = `
        UPDATE tutors 
        SET user_id = $1 
        WHERE email = $2 AND user_id IS NULL
    `;
    const result = await pool.query(query, [userId, email]);
    return result.rowCount !== null && result.rowCount > 0;
};

export const getAllTutors = async (): Promise<Tutor[]> => {
    const result = await pool.query('SELECT * FROM tutors');
    return result.rows;
};

export const getTutorById = async (id: string): Promise<Tutor> => {
    const result = await pool.query('SELECT * FROM tutors WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new CustomError('Tutor not found', 404);
    return result.rows[0];
};

export const updateTutor = async (id: string, updateData: Partial<Tutor>): Promise<Tutor> => {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    
    // Dynamically build the SET clause (e.g., "first_name = $2, last_name = $3")
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE tutors SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) throw new CustomError('Tutor not found', 404);
    return result.rows[0];
};

export const deleteTutor = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM tutors WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Tutor not found', 404);
};