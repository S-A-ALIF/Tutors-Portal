import { pool } from './src/config/db.config';

const dropTables = async () => {
    const client = await pool.connect();
    try {
        console.log('⚠️ Starting to drop all tables...');
        await client.query('BEGIN');

        // Execute a query to drop all known tables using CASCADE
        // CASCADE ensures that dependent views or constraints are also dropped.
        await client.query(`
            DROP TABLE IF EXISTS 
                users, institutions, tutors, students, 
                user_institutions, user_tutors, user_students, 
                tutor_institutions, enrollments, student_enrollments, 
                institution_enrollments, classes, exams, 
                routine_periods, routine_slots, invitations
            CASCADE;
        `);

        await client.query('COMMIT');
        console.log('✅ Successfully dropped all tables!');

    } catch (e) {
        await client.query('ROLLBACK');
        console.error('❌ Failed to drop tables:', e);
    } finally {
        client.release();
        process.exit(0);
    }
};

dropTables();
