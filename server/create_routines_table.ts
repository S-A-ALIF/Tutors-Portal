import { pool } from './src/config/db.config';

async function createRoutinesTable() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS routine_periods (
                id UUID PRIMARY KEY,
                inst_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
                period_number INTEGER NOT NULL,
                start_time VARCHAR(20) NOT NULL,
                end_time VARCHAR(20) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(inst_id, period_number)
            );

            CREATE TABLE IF NOT EXISTS routine_slots (
                id UUID PRIMARY KEY,
                inst_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
                day_of_week VARCHAR(15) NOT NULL,
                class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
                period_id UUID REFERENCES routine_periods(id) ON DELETE CASCADE,
                subject VARCHAR(100),
                tutor_id UUID REFERENCES tutors(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(inst_id, day_of_week, class_id, period_id)
            );
        `);
        console.log('Routine tables created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating routine tables:', error);
        process.exit(1);
    }
}

createRoutinesTable();
