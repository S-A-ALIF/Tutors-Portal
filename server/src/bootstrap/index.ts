import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { config } from '../config/env.config';
import { pool } from '../config/db.config';

const app: Application = express();

// Global Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/health', async (req: Request, res: Response) => {
    try {
        // Run a simple query to verify the Neon DB connection is active
        const result = await pool.query('SELECT NOW()');
        
        res.status(200).json({
            status: 'success',
            message: 'Server is running perfectly.',
            databaseTime: result.rows[0].now,
        });
    } catch (error) {
        console.error('Database connection failed during health check:', error);
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});

// Start the Server
const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${config.nodeEnv}`);
});