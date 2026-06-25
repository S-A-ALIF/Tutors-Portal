import { pool } from './src/config/db.config';

const queryTutors = async () => {
    try {
        const res = await pool.query('SELECT * FROM tutors');
        console.table(res.rows);
    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        pool.end();
    }
};

queryTutors();
