import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import pool from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHanlder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Use the user routes
app.use('/api', userRoutes);

// Error handling middleware
app.use(errorHandler);


// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT current_database()');
        res.send(`Hello, Tutor\'s Portal! Current database: ${result.rows[0].current_database}`);
    } finally {
        client.release();
    }
});



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});