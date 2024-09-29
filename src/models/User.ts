import { VaultEntry } from '@models/Vault';

export interface User {
    id?: string;             // Unique identifier for the user
    email: string;         // User's email address
    username: string;      // User's chosen username
    password: string;  // Hashed password for security
    created_at: Date;       // Account creation timestamp
}

export const UserModel = {
    tableName: 'users',
    schema: {
        id: { type: 'uuid', unique: true },
        email: { type: 'string', unique: true, required: true },
        username: { type: 'string', unique: true, required: true },
        passwordHash: { type: 'string', required: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
