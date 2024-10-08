import jwt from 'jsonwebtoken';

const JWT_SECRET = process?.env?.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in the environment variables');
  }

export const generateToken = (payload: object): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '1h',
    });
};
