const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16; // Initialization vector length
const TAG_LENGTH = 16; // Auth tag length

// Encrypt text using a user's secret key
function encrypt(text, userKey) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(userKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

// Decrypt text using user's secret key
function decrypt(encryptedText, userKey) {
    const [ivHex, tagHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(userKey, 'hex'), iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

module.exports = { encrypt, decrypt };
