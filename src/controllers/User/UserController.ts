import { Request, Response } from 'express';
import { User } from '@models/User';
import supabase from '../../config/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Function to register a new user
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const { data } = await supabase
    .from('users')
    .select('*')
    .single()

    res.status(201).json({ data: data });
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;

    // Check if the user already exists
    const { data, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email);

    if (userError) {
        res.status(400).json({ message: 'User already exists or error checking user', error: userError });
        return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user object
    const newUser: User = {
        id: uuidv4(),
        email,
        username,
        password: hashedPassword,
        created_at: new Date(),
    };

    // Save the new user to the database
    const { error } = await supabase.from('users').insert(newUser);

    if (error) {
        res.status(500).json({ message: 'Error creating user', error });
        return;
    }

    res.status(201).json({ message: 'User registered successfully' });
};

// Function to log in a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { emailOrUsername, password } = req.body;

    // Check if the user exists
    const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single();
    
    if (!user || error) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email/username or password' });
        return;
    }

    // If login is successful, return a success message (consider using JWT for actual authentication)
    res.status(200).json({ message: 'Login successful', userId: user.id });
};
