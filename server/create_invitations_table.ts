import { pool } from './src/config/db.config';

const createInvitationsTable = async () => {
    try {
        const query = `
        CREATE TABLE IF NOT EXISTS invitations (
            id UUID PRIMARY KEY,
            inst_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
            email VARCHAR(255) NOT NULL,
            code VARCHAR(6) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            status VARCHAR(20) DEFAULT 'pending',
            academic_year VARCHAR(20) NOT NULL,
            grade VARCHAR(50) NOT NULL,
            section VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        await pool.query(query);
        console.log("Invitations table created successfully.");
    } catch (error) {
        console.error("Error creating invitations table:", error);
    } finally {
        await pool.end();
    }
};

createInvitationsTable();
