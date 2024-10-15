import jwt from 'jsonwebtoken';

const JWT_SECRET = process?.env?.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is missing.');
}

export const generateToken = (userId: string): string => {
    return jwt.sign({userId}, JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const verifyToken = (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error('Invalid token.');
    }
  };