import crypto from 'crypto';

/**
 * Enterprise AES-256-GCM Token Vault
 * Strictly compliant with Meta Platform Developer Policies regarding credential security.
 * All access tokens (Page Access Tokens, User Long-Lived Tokens) are encrypted at rest.
 */

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag
const DEFAULT_KEY_SALT = 'meta_token_vault_security_salt_v1';

export interface EncryptedPayload {
  encryptedData: string; // Hex-encoded ciphertext
  iv: string;            // Hex-encoded initialization vector
  authTag: string;       // Hex-encoded 16-byte authentication tag
  algorithm: string;
}

export interface DecryptedToken {
  token: string;
  decryptedAt: number;
}

/**
 * Derives a 32-byte key from master secret and salt using PBKDF2
 */
function getMasterKey(): Buffer {
  const masterSecret = process.env.TOKEN_VAULT_MASTER_SECRET || process.env.NEXTAUTH_SECRET || 'default_super_secret_master_key_32_bytes_min!';
  return crypto.pbkdf2Sync(masterSecret, DEFAULT_KEY_SALT, 100_000, 32, 'sha512');
}

/**
 * Encrypts an Instagram / Meta Graph API Access Token at rest.
 * @param plainToken The plain text access token string.
 * @returns EncryptedPayload containing ciphertext, iv, and authTag.
 */
export function encryptAccessToken(plainToken: string): EncryptedPayload {
  if (!plainToken || typeof plainToken !== 'string') {
    throw new Error('[TokenVault] Invalid token input for encryption.');
  }

  const key = getMasterKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plainToken, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedData: encrypted,
    iv: iv.toString('hex'),
    authTag,
    algorithm: ALGORITHM,
  };
}

/**
 * Decrypts an encrypted token in memory strictly when required for outbound Graph API dispatch.
 * Performs authenticated tag verification to prevent any tampering.
 * @param encryptedData Hex-encoded ciphertext
 * @param ivHex Hex-encoded IV
 * @param authTagHex Hex-encoded Auth Tag
 * @returns Decrypted plain token string
 */
export function decryptAccessToken(encryptedData: string, ivHex: string, authTagHex: string): string {
  if (!encryptedData || !ivHex || !authTagHex) {
    throw new Error('[TokenVault] Missing cryptographic parameters for decryption.');
  }

  try {
    const key = getMasterKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });

    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    // Intentionally sanitized error to avoid leaking cryptographic traces
    throw new Error('[TokenVault] Authentication tag verification failed or token data corrupted.');
  }
}

/**
 * Generates a SHA-256 cryptographic hash of message payloads for compliance audit logs
 * without storing plain personal data indefinitely.
 */
export function hashPayloadForAudit(payload: unknown): string {
  const jsonStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return crypto.createHash('sha256').update(jsonStr).digest('hex');
}
