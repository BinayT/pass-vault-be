// src/models/PasswordEntry.ts

import { v4 as uuidv4 } from 'uuid';

export interface VaultEntry {
    id: string;            // Unique identifier for the password entry
    user_email: string;       // Reference to the user who owns this entry
    site: string;  // Name of the website
    site_email?: string;        // Email associated with the account
    site_username?: string;     // Username for the account
    site_password: string;     // Password for the account (hashed in production)
    notes?: string;    // Additional comments or notes
    createdAt: Date;      // Timestamp when the entry was created
}

export const PasswordEntryModel = {
    tableName: 'vaults',
    schema: {
        id: { type: 'uuid', default: () => uuidv4() },
        user_email: { type: 'string', required: true, references: 'users(email)' },
        site: { type: 'string', required: true },
        site_email: { type: 'string' },
        site_username: { type: 'string' },
        site_password: { type: 'string', required: true },
        notes: { type: 'string', optional: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
