"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
exports.UserModel = {
    tableName: 'users',
    schema: {
        id: { type: 'uuid', unique: true },
        email: { type: 'string', unique: true, required: true },
        username: { type: 'string', unique: true, required: true },
        passwordHash: { type: 'string', required: true },
        createdAt: { type: 'timestamp', default: () => new Date() },
    },
};
