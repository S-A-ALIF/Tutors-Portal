import { pool } from './src/config/db.config';

async function alterEnrollmentsTable() {
    try {
        await pool.query(`
            ALTER TABLE enrollments 
            ADD COLUMN IF NOT EXISTS department VARCHAR(100);
        `);
        console.log('Enrollments table altered successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error altering enrollments table:', error);
        process.exit(1);
    }
}

alterEnrollmentsTable();
