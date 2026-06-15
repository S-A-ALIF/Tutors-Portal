import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Institution, InstitutionCreationPayload } from './institution.model';

export const createInstitution = async (institutionData: any): Promise<InstitutionCreationPayload> => {
    const { name, email, phone_number, address, logo_url, user_id } = institutionData;
    
    if (!user_id) {
        throw new CustomError('User ID is required to link the institution', 400);
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Check if user exists
        const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [user_id]);
        if (userCheck.rows.length === 0) {
            throw new CustomError('User not found', 404);
        }

        // Check unique email constraint
        const emailCheck = await client.query('SELECT id FROM institutions WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            throw new CustomError('Institution with this email already exists', 409);
        }

        const id = crypto.randomUUID();
        
        // 1. Insert into core institutions table
        const instQuery = `
            INSERT INTO institutions (
                id, name, email, phone_number, address, logo_url
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;
        const instValues = [id, name, email, phone_number, address, logo_url];
        const instResult = await client.query(instQuery, instValues);

        // 2. Insert into user_institutions junction table
        await client.query(
            `INSERT INTO user_institutions (user_id, inst_id) VALUES ($1, $2)`,
            [user_id, id]
        );

        await client.query('COMMIT');

        return {
            ...instResult.rows[0],
            user_id
        };
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createInstitution]:', error);
        throw new CustomError('Database operation failed', 500);
    } finally {
        client.release();
    }
};

export const getAllInstitutions = async (): Promise<Institution[]> => {
    const result = await pool.query('SELECT * FROM institutions ORDER BY created_at DESC');
    return result.rows;
};

export const getInstitutionById = async (id: string): Promise<Institution> => {
    const result = await pool.query('SELECT * FROM institutions WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new CustomError('Institution not found', 404);
    return result.rows[0];
};

export const updateInstitution = async (id: string, updateData: Partial<Institution>): Promise<Institution> => {
    const keys = Object.keys(updateData);
    
    if (keys.length === 0) {
        throw new CustomError('No valid fields provided for update', 400);
    }

    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE institutions SET ${setClause} WHERE id = $1 RETURNING *`;
    
    try {
        const result = await pool.query(query, [id, ...values]);
        if (result.rows.length === 0) throw new CustomError('Institution not found', 404);
        return result.rows[0];
    } catch (error: any) {
        if (error.code === '23505') { // Postgres unique violation code
            throw new CustomError('Institution with this email already exists', 409);
        }
        console.error('Service Error [updateInstitution]:', error);
        throw new CustomError('Database operation failed during update', 500);
    }
};

export const deleteInstitution = async (id: string): Promise<void> => {
    // Note: Due to ON DELETE CASCADE on user_institutions, tutor_institutions, 
    // and institution_enrollments, deleting the core record handles relations automatically.
    const result = await pool.query('DELETE FROM institutions WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Institution not found', 404);
};