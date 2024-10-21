import { Request, Response } from 'express';
import { User } from '@models/User';
import supabase from '@config/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { generateToken } from '@utils/generateJWTToken';

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (userError) {
        res.status(400).json({ message: 'User already exists or error checking user', error: userError });
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

    const { error } = await supabase.from('users').insert(newUser);

    if (error) {
        res.status(500).json({ message: 'Error creating user', error });
        return;
    }

    res.status(201).json({message: 'User registered successfully'});
};

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
