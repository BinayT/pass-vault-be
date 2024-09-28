
import { v4 as uuidv4 } from 'uuid';

export interface User {
    id: string;             // Unique identifier for the user
    email: string;         // User's email address
    username: string;      // User's chosen username
    passwordHash: string;  // Hashed password for security
    createdAt: Date;       // Account creation timestamp
}

export const UserModel = {
    tableName: 'users',
    schema: {
        id: { type: 'uuid', default: () => uuidv4() },
        email: { type: 'string', unique: true, required: true },
        username: { type: 'string', unique: true, required: true },
        passwordHash: { type: 'string', required: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
