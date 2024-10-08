"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptPassword = encryptPassword;
exports.decryptPassword = decryptPassword;
const crypto_1 = __importDefault(require("crypto"));
const encryptionKey = process.env.ENCRYPTION_KEY;
if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY is not defined in the environment variables');
}
const key = Buffer.from(encryptionKey, 'hex');
const algorithm = 'aes-256-cbc';
// Encrypt Function
function encryptPassword(password) {
    const iv = crypto_1.default.randomBytes(16); // Generate a random IV for each encryption
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return {
        iv: iv.toString('hex'),
        encryptedData: encrypted
    };
}
// Decrypt Function
function decryptPassword(encryptedData, iv) {
    const decipher = crypto_1.default.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
