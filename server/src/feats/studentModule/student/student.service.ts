import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { Student, StudentDetails } from './student.model';

export const createStudent = async (studentData: any): Promise<StudentDetails> => {
    const { 
        user_id,
        first_name, 
        last_name, 
        email, 
        phone_number, 
        address, 
        date_of_birth, 
        gender, 
        guardian_name, 
        guardian_phone 
    } = studentData;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Check if user already has a student profile linked
        if (user_id) {
            const checkLinkQuery = 'SELECT student_id FROM user_students WHERE user_id = $1';
            const existingLink = await client.query(checkLinkQuery, [user_id]);
            
            if (existingLink.rows.length > 0) {
                throw new CustomError('This user is already linked to a student profile', 409);
            }
        }

        // 2. Check for duplicate email if provided
        if (email) {
            const emailCheck = await client.query('SELECT id FROM students WHERE email = $1', [email]);
            if (emailCheck.rows.length > 0) {
                throw new CustomError('Student with this email already exists', 409);
            }
        }

        const id = crypto.randomUUID();

        // 3. Insert into core students table
        const insertStudentQuery = `
            INSERT INTO students (
                id, first_name, last_name, email, phone_number, address, date_of_birth, gender, guardian_name, guardian_phone
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
            RETURNING *
        `;
        const studentValues = [id, first_name, last_name, email, phone_number, address, date_of_birth, gender, guardian_name, guardian_phone];
        const studentResult = await client.query(insertStudentQuery, studentValues);

        // 4. Insert into the junction table
        if (user_id) {
            const insertJunctionQuery = `
                INSERT INTO user_students (user_id, student_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING
            `;
            await client.query(insertJunctionQuery, [user_id, id]);
        }

        await client.query('COMMIT');
        
        return studentResult.rows[0];
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createStudent]:', error);
        throw new CustomError('Database operation failed during student creation', 500);
    } finally {
        client.release();
    }
};

export const getAllStudents = async (): Promise<StudentDetails[]> => {
    const query = `
        SELECT s.*, us.user_id 
        FROM students s
        LEFT JOIN user_students us ON s.id = us.student_id
        ORDER BY s.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getStudentById = async (id: string): Promise<StudentDetails> => {
    const query = `
        SELECT s.*, us.user_id 
        FROM students s
        LEFT JOIN user_students us ON s.id = us.student_id
        WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) throw new CustomError('Student not found', 404);
    return result.rows[0];
};

export const updateStudent = async (id: string, updateData: Partial<Student>): Promise<Student> => {
    const keys = Object.keys(updateData);
    if (keys.length === 0) throw new CustomError('No valid fields provided for update', 400);

    const values = Object.values(updateData);
    const setClause = keys.map((key, index) => `${key} = $${index + 2}`).join(', ');

    const query = `UPDATE students SET ${setClause}, updated_at = NOW() WHERE id = $1 RETURNING *`;
    
    try {
        const result = await pool.query(query, [id, ...values]);
        if (result.rows.length === 0) throw new CustomError('Student not found', 404);
        return result.rows[0];
    } catch (error: any) {
        if (error.code === '23505') { 
            throw new CustomError('Student with this email already exists', 409);
        }
        console.error('Service Error [updateStudent]:', error);
        throw new CustomError('Database operation failed during update', 500);
    }
};

export const deleteStudent = async (id: string): Promise<void> => {
    const result = await pool.query('DELETE FROM students WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Student not found', 404);
};