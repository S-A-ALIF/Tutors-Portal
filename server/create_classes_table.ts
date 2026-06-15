import { pool } from './src/config/db.config';

async function createClassesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS classes (
                id UUID PRIMARY KEY,
                inst_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
                grade VARCHAR(50) NOT NULL,
                department VARCHAR(100),
                section VARCHAR(50),
                floor VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('Classes table created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating classes table:', error);
        process.exit(1);
    }
}

createClassesTable();
