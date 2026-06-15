import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { EnrollmentDetails } from './enrollment.model';

export const createEnrollment = async (enrollmentData: any): Promise<EnrollmentDetails> => {
    const { student_id, inst_id, academic_year, grade, department, section, roll_no, monthly_fee, status } = enrollmentData;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Check if student exists
        const studentCheck = await client.query('SELECT id FROM students WHERE id = $1', [student_id]);
        if (studentCheck.rows.length === 0) {
            throw new CustomError('Student not found', 404);
        }

        // Check if institution exists
        const instCheck = await client.query('SELECT id FROM institutions WHERE id = $1', [inst_id]);
        if (instCheck.rows.length === 0) {
            throw new CustomError('Institution not found', 404);
        }

        // If this is set as the active enrollment, set previous active enrollments for this student to 'transferred'
        if (status === 'active') {
            await client.query(
                `UPDATE student_enrollments SET status = 'transferred', left_at = CURRENT_TIMESTAMP 
                 WHERE student_id = $1 AND status = 'active'`,
                [student_id]
            );
        }

        const id = crypto.randomUUID();
        
        // 1. Insert into core enrollments table
        const enrollmentQuery = `
            INSERT INTO enrollments (id, academic_year, grade, department, section, roll_no, monthly_fee) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `;
        
        // CRITICAL FIX: The pg driver crashes if given 'undefined'. We must fallback to 'null'.
        const enrollmentValues = [
            id, 
            academic_year, 
            grade, 
            department || null,
            section || null, 
            roll_no || null, 
            monthly_fee ?? null // Use ?? to allow a fee of 0
        ];
        
        const enrollmentResult = await client.query(enrollmentQuery, enrollmentValues);

        // 2. Insert into student_enrollments junction
        await client.query(
            `INSERT INTO student_enrollments (student_id, enrollment_id, status) VALUES ($1, $2, $3)`,
            [student_id, id, status || 'active']
        );

        // 3. Insert into institution_enrollments junction
        await client.query(
            `INSERT INTO institution_enrollments (inst_id, enrollment_id) VALUES ($1, $2)`,
            [inst_id, id]
        );

        await client.query('COMMIT');

        // Return combined data
        return {
            ...enrollmentResult.rows[0],
            student_id,
            inst_id,
            status: status || 'active'
        };
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [createEnrollment]:', error);
        throw new CustomError('Database operation failed', 500);
    } finally {
        client.release();
    }
};

export const getAllEnrollments = async (): Promise<EnrollmentDetails[]> => {
    const query = `
        SELECT e.*, se.student_id, se.status, se.joined_at, se.left_at, ie.inst_id
        FROM enrollments e
        JOIN student_enrollments se ON e.id = se.enrollment_id
        JOIN institution_enrollments ie ON e.id = ie.enrollment_id
        ORDER BY e.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const getEnrollmentById = async (id: string): Promise<EnrollmentDetails> => {
    const query = `
        SELECT e.*, se.student_id, se.status, se.joined_at, se.left_at, ie.inst_id
        FROM enrollments e
        JOIN student_enrollments se ON e.id = se.enrollment_id
        JOIN institution_enrollments ie ON e.id = ie.enrollment_id
        WHERE e.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) throw new CustomError('Enrollment record not found', 404);
    return result.rows[0];
};

export const getEnrollmentsByStudentId = async (studentId: string): Promise<EnrollmentDetails[]> => {
    const query = `
        SELECT e.*, se.student_id, se.status, se.joined_at, se.left_at, ie.inst_id
        FROM enrollments e
        JOIN student_enrollments se ON e.id = se.enrollment_id
        JOIN institution_enrollments ie ON e.id = ie.enrollment_id
        WHERE se.student_id = $1 
        ORDER BY e.academic_year DESC
    `;
    const result = await pool.query(query, [studentId]);
    return result.rows;
};

export const updateEnrollment = async (id: string, updateData: any): Promise<EnrollmentDetails> => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // Check if enrollment exists
        const checkRecord = await client.query('SELECT id FROM enrollments WHERE id = $1', [id]);
        if (checkRecord.rows.length === 0) throw new CustomError('Enrollment record not found', 404);

        // Update Junction Table if status is provided
        if (updateData.status) {
            if (updateData.status === 'active') {
                // Find student ID attached to this enrollment
                const studentCheck = await client.query('SELECT student_id FROM student_enrollments WHERE enrollment_id = $1', [id]);
                if (studentCheck.rows.length > 0) {
                    const studentId = studentCheck.rows[0].student_id;
                    // Deactivate others
                    await client.query(
                        `UPDATE student_enrollments SET status = 'transferred', left_at = CURRENT_TIMESTAMP 
                         WHERE student_id = $1 AND enrollment_id != $2 AND status = 'active'`,
                        [studentId, id]
                    );
                }
            }
            
            // Update status of current target
            const leftAt = updateData.status === 'active' ? null : new Date();
            await client.query(
                `UPDATE student_enrollments SET status = $1, left_at = $2 WHERE enrollment_id = $3`,
                [updateData.status, leftAt, id]
            );
        }

        // Update Core Enrollment Table
        const coreKeys = Object.keys(updateData).filter(k => k !== 'status');
        if (coreKeys.length > 0) {
            // CRITICAL FIX: Convert undefined map values to null for the pg driver
            const values = coreKeys.map(k => updateData[k] === undefined ? null : updateData[k]);
            const setClause = coreKeys.map((key, index) => `${key} = $${index + 2}`).join(', ');
            
            const query = `UPDATE enrollments SET ${setClause} WHERE id = $1`;
            await client.query(query, [id, ...values]);
        }

        await client.query('COMMIT');

        // Fetch and return the updated composite record
        return await getEnrollmentById(id);
    } catch (error: any) {
        await client.query('ROLLBACK');
        if (error instanceof CustomError) throw error;
        console.error('Service Error [updateEnrollment]:', error);
        throw new CustomError('Database operation failed during update', 500);
    } finally {
        client.release();
    }
};

export const deleteEnrollment = async (id: string): Promise<void> => {
    // With ON DELETE CASCADE in the schema, deleting from 'enrollments'
    // will automatically drop the linked records in 'student_enrollments' and 'institution_enrollments'
    const result = await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
    if (result.rowCount === 0) throw new CustomError('Enrollment record not found', 404);
};