import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Institution } from './institution.model';

export const createInstitution = async (institutionData: any): Promise<Institution> => {
    const { name, email, phone_number, address, logo_url, is_active } = institutionData;

    try {
        if (email) {
            const checkQuery = 'SELECT id FROM institutions WHERE email = $1';
            const existing = await pool.query(checkQuery, [email]);
            if (existing.rows.length > 0) {
                throw new CustomError('Institution with this email already exists', 409);
            }
        }

        const id = crypto.randomUUID();
        const query = `
            INSERT INTO institutions (
                id, name, email, phone_number, address, logo_url, is_active
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *
        `;
        const values = [id, name, email, phone_number, address, logo_url, is_active];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createInstitution]:', error);
        throw new CustomError('Database operation failed', 500);
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
    
    // Safety check: Prevent malformed SQL if no valid fields are provided
    if (keys.length === 0) {
        throw new CustomError('No valid fields provided for update', 400);
    }

    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE institutions SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) throw new CustomError('Institution not found', 404);
    return result.rows[0];
};

export const deleteInstitution = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM institutions WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Institution not found', 404);
};