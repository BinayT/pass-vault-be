import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '@utils/generateJWTToken';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        res.status(401).json({ message: 'Unauthorized' });
        return ;
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Forbidden.' });
        return;
    }
};
