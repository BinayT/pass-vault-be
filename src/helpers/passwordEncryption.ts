import crypto from 'crypto';

const encryptionKey = process.env.ENCRYPTION_KEY;

if (!encryptionKey) {
  throw new Error('ENCRYPTION_KEY is not defined in the environment variables');
}

const key = Buffer.from(encryptionKey, 'hex');
const algorithm = 'aes-256-cbc';

// Encrypt Function
export function encryptPassword(password: string) {
  const iv = crypto.randomBytes(16); // Generate a random IV for each encryption
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted
  };
}

// Decrypt Function
export function decryptPassword(encryptedData: string, iv: string) {
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
