// src/models/PasswordEntry.ts

import { v4 as uuidv4 } from 'uuid';

export interface VaultEntry {
    id: string;            // Unique identifier for the password entry
    user_email: string;       // Reference to the user who owns this entry
    website: string;  // Name of the website
    email?: string;        // Email associated with the account
    username?: string;     // Username for the account
    password: string;     // Password for the account (hashed in production)
    notes?: string;    // Additional comments or notes
    createdAt: Date;      // Timestamp when the entry was created
}

export const PasswordEntryModel = {
    tableName: 'vaults',
    schema: {
        id: { type: 'uuid', default: () => uuidv4() },
        user_email: { type: 'string', required: true, references: 'users(email)' },
        website: { type: 'string', required: true },
        email: { type: 'string' },
        username: { type: 'string' },
        password: { type: 'string', required: true },
        notes: { type: 'string', optional: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
