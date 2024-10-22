import { Request, Response } from 'express';
import supabase from '@config/db';
import bcrypt from 'bcrypt';

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { email, username, password } = req.body;
    const { userId } = req.params;
    
    // If from the frontend we do not recieve the userId params, we throw this error.
    if(!userId) {
        res.status(500).json({message: 'UserId params is missing!'})
        return;
    }

    // I check if the email exists and it's not equal to the same user id.
    const { data: emailCheck, error: emailError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .neq('id', userId);

    // I check if the username exists and it's not equal to the same user id.
    const { data: usernameCheck, error: usernameError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .neq('id', userId);

    // If any error occurs, i throw an error.
    if(usernameError || emailError){
        res.status(500).json({ message: 'An error occurred during validation.', usernameError, emailError });
        return;
    }

    // If email exists where the same email is being used but with different user id, means email is already in use.
    if (emailCheck.length > 0) {
        res.status(400).json({ message: 'Email already in use.' });
        return;
    }

    // Same here, if username exists where the same username is being used but with different user id, means username is already in use.
    if (usernameCheck.length > 0) {
        res.status(400).json({ message: 'Username already in use.' });
        return;
    }

    // If we reach here, it means the email and username isn't in use. So we hash the password.
    let hashedPassword = undefined;
    if (password) {
        const salt = await bcrypt.genSalt(10);
        hashedPassword = await bcrypt.hash(password, salt);
    }

    // Here we update the user.
    const { error: updateError } = await supabase
        .from('users')
        .update({
            email,
            username,
            ...(hashedPassword && { password: hashedPassword })
        })
        .eq('id', userId);

    // If there is any error, we send the error.
    if (updateError) {
        res.status(500).json({ message: 'Failed to update user.', updateError });
        return;
    }

    // If everything goes right, we update the user.
    res.status(201).json({message: 'User updated successfully'});
};
