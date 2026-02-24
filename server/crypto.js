import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
const KEY_FILE = path.join(DATA_DIR, '.encryption-key');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;
const ENCRYPTED_PREFIX = 'enc:';

// Sensitive fields that should be encrypted at rest
export const SENSITIVE_FIELDS = [
  'bearerToken',
  'clientId',
  'clientSecret',
  'username',
  'password',
  'apiToken',
];

/**
 * Get or create the encryption key.
 * The key is stored in data/.encryption-key and should be
 * added to .gitignore (already covered by the data/ rule).
 */
function getEncryptionKey() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(KEY_FILE)) {
    const hex = fs.readFileSync(KEY_FILE, 'utf-8').trim();
    return Buffer.from(hex, 'hex');
  }

  // Generate a new 256-bit key
  const key = crypto.randomBytes(32);
  fs.writeFileSync(KEY_FILE, key.toString('hex'), 'utf-8');
  console.log('Generated new encryption key at', KEY_FILE);
  return key;
}

const encryptionKey = getEncryptionKey();

/**
 * Encrypt a plaintext string.
 * Returns a string in the format: enc:<iv>:<authTag>:<ciphertext> (all hex).
 */
export function encrypt(plaintext) {
  if (!plaintext || typeof plaintext !== 'string') return plaintext;

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, encryptionKey, iv);

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');
  return `${ENCRYPTED_PREFIX}${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a previously encrypted string.
 * If the value doesn't carry the enc: prefix it is returned as-is
 * (supports transparent migration of legacy plaintext values).
 */
export function decrypt(ciphertext) {
  if (!ciphertext || typeof ciphertext !== 'string') return ciphertext;
  if (!ciphertext.startsWith(ENCRYPTED_PREFIX)) return ciphertext; // plaintext passthrough

  const payload = ciphertext.slice(ENCRYPTED_PREFIX.length);
  const [ivHex, authTagHex, encryptedHex] = payload.split(':');

  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

/**
 * Returns true if the value is already encrypted.
 */
export function isEncrypted(value) {
  return typeof value === 'string' && value.startsWith(ENCRYPTED_PREFIX);
}

/**
 * Encrypt all sensitive fields on an object (in-place) before persisting.
 */
export function encryptSensitiveFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const field of SENSITIVE_FIELDS) {
    if (obj[field] && !isEncrypted(obj[field])) {
      obj[field] = encrypt(obj[field]);
    }
  }
  return obj;
}

/**
 * Decrypt all sensitive fields on an object (returns a copy).
 */
export function decryptSensitiveFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const copy = { ...obj };
  for (const field of SENSITIVE_FIELDS) {
    if (copy[field]) {
      copy[field] = decrypt(copy[field]);
    }
  }
  return copy;
}
