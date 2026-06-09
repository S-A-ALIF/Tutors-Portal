import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Student } from './student.model';

export const enrollStudent = async (studentData: any): Promise<Student> => {
    const { first_name, last_name, email, phone_number, date_of_birth, guardian_name, guardian_phone } = studentData;

    try {
        if (email) {
            const checkQuery = 'SELECT id FROM students WHERE email = $1';
            const existing = await pool.query(checkQuery, [email]);
            if (existing.rows.length > 0) {
                throw new CustomError('Student with this email is already enrolled', 409);
            }
        }

        const id = crypto.randomUUID();
        const query = `
            INSERT INTO students (
                id, user_id, first_name, last_name, email, phone_number, date_of_birth, guardian_name, guardian_phone
            ) VALUES ($1, NULL, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *
        `;
        const values = [id, first_name, last_name, email, phone_number, date_of_birth, guardian_name, guardian_phone];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [enrollStudent]:', error);
        throw new CustomError('Database operation failed', 500);
    }
};

export const linkStudentToUser = async (email: string, userId: string): Promise<boolean> => {
    const query = `
        UPDATE students 
        SET user_id = $1 
        WHERE email = $2 AND user_id IS NULL
    `;
    const result = await pool.query(query, [userId, email]);
    return result.rowCount !== null && result.rowCount > 0;
};

export const getAllStudents = async (): Promise<Student[]> => {
    const result = await pool.query('SELECT * FROM students');
    return result.rows;
};

export const getStudentById = async (id: string): Promise<Student> => {
    const result = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
    if (result.rows.length === 0) throw new CustomError('Student not found', 404);
    return result.rows[0];
};

export const updateStudent = async (id: string, updateData: Partial<Student>): Promise<Student> => {
    const keys = Object.keys(updateData);
    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE students SET ${setClause} WHERE id = $1 RETURNING *`;
    const result = await pool.query(query, [id, ...values]);
    
    if (result.rows.length === 0) throw new CustomError('Student not found', 404);
    return result.rows[0];
};

export const deleteStudent = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Student not found', 404);
};

export const updateAllStudents = async (field: string, value: any): Promise<number> => {
    const query = `UPDATE students SET ${field} = $1`;
    const result = await pool.query(query, [value]);
    return result.rowCount || 0;
};