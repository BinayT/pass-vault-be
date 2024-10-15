import { Request, Response } from 'express';
import supabase from '@config/db';
import bcrypt from 'bcrypt';
import { generateToken } from '@utils/generateJWTToken';

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { emailOrUsername, password } = req.body;

    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single();
    
    if (!user || error) {
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
        jwtToken
    });
};
