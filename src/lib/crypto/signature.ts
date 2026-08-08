import crypto from 'crypto';

/**
 * Meta Webhook Signature Validator (X-Hub-Signature-256)
 * Enforces SHA-256 HMAC verification to ensure every webhook payload originated strictly from Meta.
 */

export function verifyMetaWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string | null | undefined,
  appSecret: string = process.env.META_APP_SECRET || ''
): boolean {
  if (!signatureHeader || !appSecret) {
    return false;
  }

  // Header format: "sha256=<signature_hex>"
  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') {
    return false;
  }

  const expectedSignature = parts[1];
  const hmac = crypto.createHmac('sha256', appSecret);
  const calculatedSignature = hmac.update(rawBody).digest('hex');

  try {
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');
    const calculatedBuffer = Buffer.from(calculatedSignature, 'hex');

    if (expectedBuffer.length !== calculatedBuffer.length) {
      return false;
    }

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(expectedBuffer, calculatedBuffer);
  } catch {
    return false;
  }
}
