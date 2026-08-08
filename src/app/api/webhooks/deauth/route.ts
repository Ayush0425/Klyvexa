import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Meta Data Deletion & App Deauthorization Callback Handler
 * Required by Meta Platform Terms for User Privacy and GDPR/CCPA Compliance.
 */

function parseSignedRequest(signedRequest: string, secret: string): any {
  const [encodedSig, payload] = signedRequest.split('.');
  const sig = Buffer.from(encodedSig.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('hex');
  const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));

  const expectedSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');

  if (sig !== expectedSig) {
    throw new Error('Invalid signature in signed_request');
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const signedRequest = formData.get('signed_request') as string;
    const appSecret = process.env.META_APP_SECRET || '';

    if (!signedRequest || !appSecret) {
      return NextResponse.json({ error: 'Missing signed_request or app secret' }, { status: 400 });
    }

    const data = parseSignedRequest(signedRequest, appSecret);
    const userId = data.user_id;

    // Generate unique confirmation code for tracking deletion status
    const confirmationCode = `del_${crypto.randomBytes(8).toString('hex')}`;
    const statusUrl = `${request.nextUrl.origin}/deletion-status?code=${confirmationCode}`;

    console.log(`[Meta Deauthorization / Data Deletion Request] User ID: ${userId}, Code: ${confirmationCode}`);

    // Return official Meta response schema
    return NextResponse.json({
      url: statusUrl,
      confirmation_code: confirmationCode,
    });
  } catch (err: any) {
    console.error('[Meta Deauth Handler Error]', err);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
