import { pool } from './src/config/db.config';

async function createExamsTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS exams (
                id UUID PRIMARY KEY,
                creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                inst_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                subject VARCHAR(255) NOT NULL,
                exam_date DATE NOT NULL,
                exam_time TIME NOT NULL,
                grade VARCHAR(50) NOT NULL,
                section VARCHAR(50),
                duration_minutes INTEGER NOT NULL,
                total_marks NUMERIC NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Exams table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating exams table:', error);
        process.exit(1);
    }
}

createExamsTable();
