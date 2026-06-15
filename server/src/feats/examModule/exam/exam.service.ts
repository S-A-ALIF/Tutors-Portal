import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { CreateExamDTO, Exam } from './exam.model';

export const createExam = async (creatorId: string, examData: CreateExamDTO): Promise<Exam> => {
    const id = crypto.randomUUID();
    const { inst_id, name, subject, exam_date, exam_time, grade, section, duration_minutes, total_marks } = examData;

    const query = `
        INSERT INTO exams (
            id, creator_id, inst_id, name, subject, exam_date, exam_time, grade, section, duration_minutes, total_marks
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
    `;

    // Ensure undefined is converted to null for pg driver
    const values = [
        id, 
        creatorId, 
        inst_id || null, 
        name, 
        subject, 
        exam_date, 
        exam_time, 
        grade, 
        section || null, 
        duration_minutes, 
        total_marks
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error: any) {
        console.error('Service Error [createExam]:', error);
        throw new CustomError('Database operation failed during exam creation', 500);
    }
};

export const getExamsByCreator = async (creatorId: string): Promise<Exam[]> => {
    const query = `
        SELECT e.*, i.name as institution_name
        FROM exams e
        LEFT JOIN institutions i ON e.inst_id = i.id
        WHERE e.creator_id = $1
        ORDER BY e.created_at DESC
    `;
    
    try {
        const result = await pool.query(query, [creatorId]);
        return result.rows;
    } catch (error: any) {
        console.error('Service Error [getExamsByCreator]:', error);
        throw new CustomError('Failed to fetch exams', 500);
    }
};

export const getExamsByInstitution = async (instId: string): Promise<Exam[]> => {
    const query = `
        SELECT e.*, i.name as institution_name
        FROM exams e
        LEFT JOIN institutions i ON e.inst_id = i.id
        WHERE e.inst_id = $1
        ORDER BY e.created_at DESC
    `;
    
    try {
        const result = await pool.query(query, [instId]);
        return result.rows;
    } catch (error: any) {
        console.error('Service Error [getExamsByInstitution]:', error);
        throw new CustomError('Failed to fetch institution exams', 500);
    }
};
