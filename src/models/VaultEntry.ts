// src/models/PasswordEntry.ts

import { v4 as uuidv4 } from 'uuid';

export interface PasswordEntry {
    id: string;            // Unique identifier for the password entry
    userId: string;       // Reference to the user who owns this entry
    websiteName: string;  // Name of the website
    email?: string;        // Email associated with the account
    username?: string;     // Username for the account
    password: string;     // Password for the account (hashed in production)
    comments?: string;    // Additional comments or notes
    createdAt: Date;      // Timestamp when the entry was created
}

export const PasswordEntryModel = {
    tableName: 'password_entries',
    schema: {
        id: { type: 'uuid', default: () => uuidv4() },
        userId: { type: 'uuid', required: true },
        websiteName: { type: 'string', required: true },
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string', required: true },
        comments: { type: 'string', optional: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
