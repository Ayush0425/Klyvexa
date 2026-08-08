import { NextRequest, NextResponse } from 'next/server';
import { verifyMetaWebhookSignature } from '@/lib/crypto/signature';
import { InboundEventDispatcher } from '@/lib/queue/inbound-dispatcher';
import { MetaWebhookPayload } from '@/lib/meta/types';

/**
 * Official Meta Instagram Graph API Webhook Handler
 * 1. GET: Handshake verification challenge for developers.facebook.com
 * 2. POST: Inbound Instagram messaging and comment notifications with SHA-256 verification
 */

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.META_WEBHOOK_VERIFY_TOKEN || 'klyvexa_secret_token_secure_2026';

  // 1. Verify that mode is 'subscribe' and token matches our secret verify token
  if (mode === 'subscribe' && token === expectedToken) {
    console.log('[MetaWebhook Handshake] Challenge verified successfully.');
    // Must return challenge as raw text with status 200
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[MetaWebhook Handshake Failed] Token mismatch or invalid mode.');
  return new NextResponse('Forbidden: Webhook verify token mismatch', { status: 403 });
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');
    const appSecret = process.env.META_APP_SECRET || '';

    // 2. Cryptographic signature check (mandatory for compliance & security)
    const isSignatureValid = verifyMetaWebhookSignature(rawBody, signature, appSecret);

    // In local development sandbox mode, permit mock events if explicitly flagged
    const isDevSandbox = process.env.NODE_ENV === 'development' && request.headers.get('x-klyvexa-sandbox') === 'true';

    if (!isSignatureValid && !isDevSandbox) {
      console.error('[MetaWebhook Security Alert] Invalid X-Hub-Signature-256 signature.');
      return NextResponse.json({ error: 'Invalid HMAC signature' }, { status: 403 });
    }

    const payload: MetaWebhookPayload = JSON.parse(rawBody);

    // 3. Fast ACK (<500ms): Return 200 OK immediately to satisfy Meta SLAs
    // Meta requires webhook responses within a few seconds, otherwise it triggers exponential retries
    if (payload.object === 'instagram' || payload.object === 'page') {
      // Process payload asynchronously in the background queue
      InboundEventDispatcher.dispatchPayload(payload).catch((err) => {
        console.error('[MetaWebhook Background Dispatch Error]', err);
      });

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ status: 'IGNORED_OBJECT_TYPE' }, { status: 200 });
  } catch (error: any) {
    console.error('[MetaWebhook Inbound Processing Error]', error);
    // Still return 200 to prevent Meta from disabling the webhook subscription on malformed payloads
    return NextResponse.json({ status: 'ERROR_RECORDED', message: error.message }, { status: 200 });
  }
}
