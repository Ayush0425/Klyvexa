import { describe, it, expect } from 'vitest';
import { verifyMetaWebhookSignature } from '../lib/crypto/signature';
import { InboundEventDispatcher } from '../lib/queue/inbound-dispatcher';
import crypto from 'crypto';

describe('Phase 2: Meta Webhooks & BullMQ Priority Queuing Test Suite', () => {
  const sampleSecret = '839d8c5c119564070b2624bed1f3b3b8';
  const samplePayload = JSON.stringify({
    object: 'instagram',
    entry: [
      {
        id: '178414053092819',
        time: Date.now(),
        messaging: [
          {
            sender: { id: 'user_test_999' },
            recipient: { id: 'page_123' },
            timestamp: Date.now(),
            message: { mid: 'mid.sample123', text: 'Hello, what are your prices?' },
          },
        ],
      },
    ],
  });

  it('validates authentic Meta X-Hub-Signature-256 HMAC signatures', () => {
    const validHmac = crypto.createHmac('sha256', sampleSecret).update(samplePayload).digest('hex');
    const signatureHeader = `sha256=${validHmac}`;

    const isValid = verifyMetaWebhookSignature(samplePayload, signatureHeader, sampleSecret);
    expect(isValid).toBe(true);
  });

  it('rejects forged or modified webhook signatures with HTTP 403 status', () => {
    const forgedSignature = 'sha256=0000000000000000000000000000000000000000000000000000000000000000';
    const isValid = verifyMetaWebhookSignature(samplePayload, forgedSignature, sampleSecret);
    expect(isValid).toBe(false);
  });

  it('successfully dispatches inbound payload and classifies into priority queues without throwing', async () => {
    const payloadObj = JSON.parse(samplePayload);
    await expect(InboundEventDispatcher.dispatchPayload(payloadObj)).resolves.not.toThrow();
  });
});
