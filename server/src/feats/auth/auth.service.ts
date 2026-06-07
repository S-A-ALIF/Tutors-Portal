import bcrypt from 'bcrypt';
import { pool } from '../../config/db.config';
import { CustomError } from '../../error/customErrors';
import { generateToken } from '../../config/jwt.config';

export const registerUser = async (userData: any) => {
    const { name, email, password, role } = userData;

    try {
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        
        if (existingUser.rows.length > 0) {
            throw new CustomError('User with this email already exists', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const query = `
            INSERT INTO users (name, email, password, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, name, email, role
        `;
        const result = await pool.query(query, [name, email, hashedPassword, role]);

        return result.rows[0];
    } catch (error: any) {
        if (error instanceof CustomError) throw error;
        console.error('Service Error [registerUser]:', error);
        throw new CustomError('Database operation failed during registration', 500);
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        // 1. Fetch user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        // 2. Validate user existence
        if (!user) {
            throw new CustomError('Invalid email or password', 401);
        }

        // 3. Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new CustomError('Invalid email or password', 401);
        }

        // 4. Generate JWT
        const token = generateToken({ id: user.id, role: user.role });

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        };
    } catch (error: any) {
        // If it is our CustomError, rethrow it to the controller
        if (error instanceof CustomError) throw error;
        
        // If it is a new/unexpected error, log it and throw a 500
        console.error('Service Error [loginUser]:', error);
        throw new CustomError('Database operation failed during login', 500);
    }
};