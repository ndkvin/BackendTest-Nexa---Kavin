import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const ALGORITHM = 'aes-256-cbc';
const SECRET = process.env.SECRET;
const SECRET_KEY = crypto.createHash('sha256').update(SECRET).digest();
const IV = Buffer.alloc(16, 0); 

export default class AES {
  encrypt(text) {
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}