import { pool } from './src/config/db.config';

const alterInvitationsTable = async () => {
    try {
        console.log("Connecting to the database to alter 'invitations' table...");
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // 1. Add 'role' column if it doesn't exist
            console.log("Adding 'role' column...");
            await client.query(`
                ALTER TABLE invitations 
                ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';
            `);

            // 2. Drop NOT NULL constraints from academic_year and grade
            console.log("Dropping NOT NULL constraints for tutors...");
            await client.query(`
                ALTER TABLE invitations 
                ALTER COLUMN academic_year DROP NOT NULL;
            `);
            
            await client.query(`
                ALTER TABLE invitations 
                ALTER COLUMN grade DROP NOT NULL;
            `);

            await client.query('COMMIT');
            console.log("Migration successful: 'invitations' table is now ready for Tutors!");

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
};

alterInvitationsTable();
