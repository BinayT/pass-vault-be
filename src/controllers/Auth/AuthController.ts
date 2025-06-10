import { Request, Response } from 'express';
import { User } from '@models/User';
import pool from '@config/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '@utils/generateJWTToken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    try {
        const { rows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);

        if (rows.length > 0) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser: User = {
            id: uuidv4(),
            email,
            username,
            password: hashedPassword,
            created_at: new Date(),
        };

        await pool.query(
            'INSERT INTO users (id, email, username, password, created_at) VALUES ($1, $2, $3, $4, $5)',
            [newUser.id, newUser.email, newUser.username, newUser.password, newUser.created_at]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { emailOrUsername, password } = req.body;

    try {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1 LIMIT 1',
            [emailOrUsername]
        );

        const user = rows[0];

        if (!user) {
            res.status(401).json({ message: 'Invalid email/username or password' });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email/username or password' });
            return;
        }

        const jwtToken = generateToken(user.id);

        res.status(200).json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            },
            jwtToken,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};
