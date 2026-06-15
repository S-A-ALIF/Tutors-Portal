import crypto from 'crypto';
import { pool } from '../../../config/db.config';
import { CustomError } from '../../../error/customErrors';

export const setupPeriods = async (instId: string, periods: any[]) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        // Delete old periods (will cascade delete routine_slots)
        await client.query('DELETE FROM routine_periods WHERE inst_id = $1', [instId]);
        
        for (const p of periods) {
            const id = crypto.randomUUID();
            await client.query(
                `INSERT INTO routine_periods (id, inst_id, period_number, start_time, end_time) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [id, instId, p.period_number, p.start_time, p.end_time]
            );
        }
        
        await client.query('COMMIT');
        return getPeriods(instId);
    } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('setupPeriods err', err);
        throw new CustomError('Failed to setup periods', 500);
    } finally {
        client.release();
    }
};

export const getPeriods = async (instId: string) => {
    const result = await pool.query('SELECT * FROM routine_periods WHERE inst_id = $1 ORDER BY period_number ASC', [instId]);
    return result.rows;
};

export const saveSlot = async (instId: string, slotData: any) => {
    const { day_of_week, class_id, period_id, subject, tutor_id } = slotData;
    
    // Check if slot exists
    const existing = await pool.query(
        `SELECT id FROM routine_slots WHERE inst_id = $1 AND day_of_week = $2 AND class_id = $3 AND period_id = $4`,
        [instId, day_of_week, class_id, period_id]
    );

    let id;
    if (existing.rows.length > 0) {
        id = existing.rows[0].id;
        await pool.query(
            `UPDATE routine_slots SET subject = $1, tutor_id = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
            [subject || null, tutor_id || null, id]
        );
    } else {
        id = crypto.randomUUID();
        await pool.query(
            `INSERT INTO routine_slots (id, inst_id, day_of_week, class_id, period_id, subject, tutor_id)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, instId, day_of_week, class_id, period_id, subject || null, tutor_id || null]
        );
    }

    const result = await pool.query(`SELECT rs.*, t.first_name, t.last_name FROM routine_slots rs LEFT JOIN tutors t ON rs.tutor_id = t.id WHERE rs.id = $1`, [id]);
    return result.rows[0];
};

export const getRoutine = async (instId: string, dayOfWeek: string) => {
    const result = await pool.query(
        `SELECT rs.*, t.first_name, t.last_name 
         FROM routine_slots rs 
         LEFT JOIN tutors t ON rs.tutor_id = t.id 
         WHERE rs.inst_id = $1 AND rs.day_of_week = $2`,
        [instId, dayOfWeek]
    );
    return result.rows;
};
