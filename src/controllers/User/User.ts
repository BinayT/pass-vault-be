import { Request, Response } from 'express';
import pool from '@config/db';
import bcrypt from 'bcrypt';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;
    const { userId } = req.params;
    
    // If from the frontend we do not recieve the userId params, we throw this error.
    if(!userId) {
        res.status(500).json({message: 'UserId params is missing!'})
        return;
    }

    try {
        const { rows: emailCheck } = await pool.query(
            'SELECT id FROM users WHERE email = $1 AND id <> $2',
            [email, userId]
        );

        const { rows: usernameCheck } = await pool.query(
            'SELECT id FROM users WHERE username = $1 AND id <> $2',
            [username, userId]
        );

        if (emailCheck.length > 0) {
            res.status(400).json({ message: 'Email already in use.' });
            return;
        }

        if (usernameCheck.length > 0) {
            res.status(400).json({ message: 'Username already in use.' });
            return;
        }

        let hashedPassword: string | undefined = undefined;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const fields: string[] = [];
        const values: any[] = [];
        let idx = 1;

        if (email) { fields.push(`email = $${idx++}`); values.push(email); }
        if (username) { fields.push(`username = $${idx++}`); values.push(username); }
        if (hashedPassword) { fields.push(`password = $${idx++}`); values.push(hashedPassword); }

        values.push(userId);

        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx}`;

        await pool.query(query, values);

        res.status(201).json({ message: 'User updated successfully' });
    } catch (updateError) {
        res.status(500).json({ message: 'Failed to update user.', updateError });
    }
};
