import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';
import { CreateClassDTO, ClassEntity } from './class.model';

export const createClass = async (classData: CreateClassDTO): Promise<ClassEntity> => {
    const id = crypto.randomUUID();
    const { inst_id, grade, department, section, floor } = classData;

    const query = `
        INSERT INTO classes (
            id, inst_id, grade, department, section, floor
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;

    const values = [
        id, 
        inst_id || null, 
        grade, 
        department || null, 
        section || null, 
        floor || null
    ];

    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error: any) {
        console.error('Service Error [createClass]:', error);
        throw new CustomError('Database operation failed during class creation', 500);
    }
};

export const getClassesByInstitution = async (instId: string): Promise<ClassEntity[]> => {
    const query = `
        SELECT *
        FROM classes
        WHERE inst_id = $1
        ORDER BY created_at DESC
    `;
    
    try {
        const result = await pool.query(query, [instId]);
        return result.rows;
    } catch (error: any) {
        console.error('Service Error [getClassesByInstitution]:', error);
        throw new CustomError('Failed to fetch classes', 500);
    }
};
