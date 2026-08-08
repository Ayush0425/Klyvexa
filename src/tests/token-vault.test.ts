import { describe, it, expect } from 'vitest';
import { encryptAccessToken, decryptAccessToken, hashPayloadForAudit } from '../lib/crypto/token-vault';

describe('TokenVault (AES-256-GCM Compliance)', () => {
  const sampleToken = 'EAAGm0PX4ZCpsBAK123456789LongLivedInstagramBusinessPageTokenSampleValue';

  it('should successfully encrypt and decrypt an access token', () => {
    const encrypted = encryptAccessToken(sampleToken);

    expect(encrypted.encryptedData).toBeDefined();
    expect(encrypted.iv).toHaveLength(24); // 12 bytes = 24 hex chars
    expect(encrypted.authTag).toHaveLength(32); // 16 bytes = 32 hex chars
    expect(encrypted.encryptedData).not.toEqual(sampleToken);

    const decrypted = decryptAccessToken(encrypted.encryptedData, encrypted.iv, encrypted.authTag);
    expect(decrypted).toEqual(sampleToken);
  });

  it('should detect ciphertext tampering and throw an authentication error', () => {
    const encrypted = encryptAccessToken(sampleToken);
    
    // Tamper with one character of ciphertext
    const tamperedCipher = encrypted.encryptedData.substring(0, 10) + 'f' + encrypted.encryptedData.substring(11);

    expect(() => {
      decryptAccessToken(tamperedCipher, encrypted.iv, encrypted.authTag);
    }).toThrow(/Authentication tag verification failed/);
  });

  it('should detect authTag tampering and reject decryption', () => {
    const encrypted = encryptAccessToken(sampleToken);
    const tamperedTag = '00000000000000000000000000000000';

    expect(() => {
      decryptAccessToken(encrypted.encryptedData, encrypted.iv, tamperedTag);
    }).toThrow(/Authentication tag verification failed/);
  });

  it('should generate consistent SHA-256 hashes for audit logs without logging plain text', () => {
    const payload = { recipient: '178414053092819', message: 'Hello!' };
    const hash1 = hashPayloadForAudit(payload);
    const hash2 = hashPayloadForAudit(payload);

    expect(hash1).toEqual(hash2);
    expect(hash1).toHaveLength(64); // 32 bytes hex = 64 chars
  });
});
