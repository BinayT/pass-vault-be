"use strict";
// src/models/PasswordEntry.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordEntryModel = void 0;
const uuid_1 = require("uuid");
exports.PasswordEntryModel = {
    tableName: 'vaults',
    schema: {
        id: { type: 'uuid', default: () => (0, uuid_1.v4)() },
        user_email: { type: 'string', required: true, references: 'users(email)' },
        site: { type: 'string', required: true },
        site_email: { type: 'string' },
        site_username: { type: 'string' },
        site_password: { type: 'string', required: true },
        notes: { type: 'string', optional: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
