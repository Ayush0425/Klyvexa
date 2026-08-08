import { NextRequest, NextResponse } from 'next/server';
import {
  exchangeCodeForToken,
  getLongLivedUserToken,
  fetchUserInstagramAccounts,
  subscribePageToWebhooks,
} from '@/lib/meta/oauth';
import { encryptAccessToken } from '@/lib/crypto/token-vault';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  if (error) {
    console.error('[MetaOAuth Callback Error]', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL('/accounts?error=Missing+authorization+code', request.url));
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/auth/meta/callback`;

    // 1. Exchange short-lived authorization code
    const shortLived = await exchangeCodeForToken(code, redirectUri);

    // 2. Upgrade to 60-day long-lived token
    const longLived = await getLongLivedUserToken(shortLived.access_token);

    // 3. Fetch connected Facebook Pages and Instagram Professional Accounts
    const accountsData = await fetchUserInstagramAccounts(longLived.access_token);

    const connectedAccounts = [];

    for (const page of accountsData.data) {
      if (page.instagram_business_account) {
        const ig = page.instagram_business_account;

        // 4. Encrypt the Page Access Token (AES-256-GCM)
        const encrypted = encryptAccessToken(page.access_token);

        // 5. Automatically subscribe Page to Webhooks
        const isSubscribed = await subscribePageToWebhooks(page.id, page.access_token);

        connectedAccounts.push({
          pageId: page.id,
          pageName: page.name,
          igUserId: ig.id,
          username: ig.username || 'instagram_user',
          profilePic: ig.profile_picture_url || null,
          tokenIv: encrypted.iv,
          tokenAuthTag: encrypted.authTag,
          webhookSubscribed: isSubscribed,
        });
      }
    }

    return NextResponse.redirect(
      new URL(
        `/accounts?connected=${connectedAccounts.length}&success=true`,
        request.url
      )
    );
  } catch (err: any) {
    console.error('[MetaOAuth Exception]', err);
    return NextResponse.redirect(
      new URL(`/accounts?error=${encodeURIComponent(err.message || 'OAuth Connection Failed')}`, request.url)
    );
  }
}
