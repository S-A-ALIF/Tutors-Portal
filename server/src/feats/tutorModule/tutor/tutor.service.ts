import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Tutor, TutorDetails } from './tutor.model';

export const createTutor = async (tutorData: any): Promise<TutorDetails> => {
    const { 
        user_id, // This acts as user_id OR inst_id depending on user_role
        user_role,
        first_name, 
        last_name, 
        email, 
        phone_number, 
        bio, 
        hourly_rate, 
        monthly_salary, 
        subjects, 
        is_active 
    } = tutorData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Check for duplicate email
        if (email) {
            const checkQuery = 'SELECT id FROM tutors WHERE email = $1';
            const existing = await client.query(checkQuery, [email]);
            if (existing.rows.length > 0) {
                throw new CustomError('Tutor with this email already exists', 409);
            }
        }

        const id = crypto.randomUUID();
        
        // 2. Insert into core tutors table 
        const query = `
            INSERT INTO tutors (
                id, first_name, last_name, email, phone_number, bio, hourly_rate, monthly_salary, subjects, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
        const values = [id, first_name, last_name, email, phone_number, bio, hourly_rate, monthly_salary, subjects, is_active || true];
        const result = await client.query(query, values);

        // 3. Link records based on user_role
        if (user_role === 'tutor') {
            await client.query(
                `INSERT INTO user_tutors (user_id, tutor_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [user_id, id]
            );
        } else if (user_role === 'admin') {
            // The user_id is treated as the inst_id
            const instCheck = await client.query('SELECT id FROM institutions WHERE id = $1', [user_id]);
            if (instCheck.rows.length === 0) {
                throw new CustomError('Institution not found', 404);
            }
            
            await client.query(
                `INSERT INTO tutor_institutions (tutor_id, inst_id) VALUES ($1, $2)`,
                [id, user_id]
            );
        }

        await client.query('COMMIT');

        return result.rows[0];
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createTutor]:', error);
        throw new CustomError('Database operation failed', 500);
    } finally {
        client.release();
    }
};

export const linkTutorToUser = async (email: string, userId: string): Promise<boolean> => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const tutorRes = await client.query('SELECT id FROM tutors WHERE email = $1', [email]);
        if (tutorRes.rows.length === 0) {
            await client.query('ROLLBACK');
            return false;
        }

        const tutorId = tutorRes.rows[0].id;

        const query = `
            INSERT INTO user_tutors (user_id, tutor_id) 
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
        `;
        const result = await client.query(query, [userId, tutorId]);
        
        await client.query('COMMIT');
        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Service Error [linkTutorToUser]:', error);
        return false;
    } finally {
        client.release();
    }
};

export const getAllTutors = async (): Promise<TutorDetails[]> => {
    const query = `
        SELECT t.*, ti.inst_id 
        FROM tutors t
        LEFT JOIN tutor_institutions ti ON t.id = ti.tutor_id
        ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getTutorById = async (id: string): Promise<TutorDetails> => {
    const query = `
        SELECT t.*, ti.inst_id 
        FROM tutors t
        LEFT JOIN tutor_institutions ti ON t.id = ti.tutor_id
        WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) throw new CustomError('Tutor not found', 404);
    return result.rows[0];
};

export const updateTutor = async (id: string, updateData: Partial<Tutor>): Promise<Tutor> => {
    const keys = Object.keys(updateData);
    if (keys.length === 0) throw new CustomError('No valid fields provided for update', 400);

    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE tutors SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    
    try {
        const result = await pool.query(query, [id, ...values]);
        if (result.rows.length === 0) throw new CustomError('Tutor not found', 404);
        return result.rows[0];
    } catch (error: any) {
        if (error.code === '23505') { 
            throw new CustomError('Tutor with this email already exists', 409);
        }
        console.error('Service Error [updateTutor]:', error);
        throw new CustomError('Database operation failed during update', 500);
    }
};

export const deleteTutor = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM tutors WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Tutor not found', 404);
};