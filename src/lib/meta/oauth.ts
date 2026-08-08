import {
  MetaLongLivedTokenResponse,
  MetaOAuthTokenResponse,
  MetaUserAccountsResponse,
  InstagramProfile,
} from './types';

const META_GRAPH_VERSION = 'v20.0';
const META_GRAPH_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export const REQUIRED_META_SCOPES = [
  'public_profile',
  'instagram_basic',
  'instagram_manage_messages',
  'instagram_manage_comments',
  'pages_show_list',
  'pages_manage_metadata',
];

/**
 * Builds the official Meta OAuth 2.0 Authorization URL for Instagram Business connection.
 * Supports Meta Business Login config_id if configured.
 */
export function getMetaOAuthUrl(state: string, redirectUri: string): string {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID || process.env.META_APP_ID || '';
  const configId = process.env.NEXT_PUBLIC_META_CONFIG_ID || process.env.META_CONFIG_ID || '';

  const paramsObj: Record<string, string> = {
    client_id: appId,
    redirect_uri: redirectUri,
    state,
    response_type: 'code',
    auth_type: 'rerequest',
  };

  if (configId) {
    paramsObj.config_id = configId;
  } else {
    paramsObj.scope = REQUIRED_META_SCOPES.join(',');
  }

  const params = new URLSearchParams(paramsObj);
  return `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchanges authorization code for short-lived User Access Token
 */
export async function exchangeCodeForToken(
  code: string,
  redirectUri: string
): Promise<MetaOAuthTokenResponse> {
  const appId = process.env.META_APP_ID || '';
  const appSecret = process.env.META_APP_SECRET || '';

  const params = new URLSearchParams({
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: redirectUri,
    code,
  });

  const res = await fetch(`${META_GRAPH_BASE}/oauth/access_token?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[MetaOAuth] Code exchange failed: ${err.error?.message || res.statusText}`);
  }

  return res.json();
}

/**
 * Exchanges short-lived token for long-lived (~60 days) access token
 */
export async function getLongLivedUserToken(
  shortLivedToken: string
): Promise<MetaLongLivedTokenResponse> {
  const appId = process.env.META_APP_ID || '';
  const appSecret = process.env.META_APP_SECRET || '';

  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(`${META_GRAPH_BASE}/oauth/access_token?${params.toString()}`, {
    method: 'GET',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[MetaOAuth] Long-lived token exchange failed: ${err.error?.message || res.statusText}`);
  }

  return res.json();
}

/**
 * Fetches Facebook Pages managed by user along with connected Instagram Business Accounts
 */
export async function fetchUserInstagramAccounts(
  longLivedUserToken: string
): Promise<MetaUserAccountsResponse> {
  const fields = 'id,name,access_token,category,instagram_business_account{id,username,name,profile_picture_url}';
  const url = `${META_GRAPH_BASE}/me/accounts?fields=${encodeURIComponent(fields)}&access_token=${longLivedUserToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[MetaOAuth] Fetch accounts failed: ${err.error?.message || res.statusText}`);
  }

  return res.json();
}

/**
 * Subscribes a Facebook Page to Instagram Webhooks (messages, comments, postbacks)
 */
export async function subscribePageToWebhooks(
  pageId: string,
  pageAccessToken: string
): Promise<boolean> {
  const subscribedFields = 'messages,messaging_postbacks,message_reactions,message_reads,message_deliveries,feed,comments';
  const url = `${META_GRAPH_BASE}/${pageId}/subscribed_apps?subscribed_fields=${encodeURIComponent(subscribedFields)}&access_token=${pageAccessToken}`;

  const res = await fetch(url, {
    method: 'POST',
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('[MetaWebhook] Page subscription error:', err);
    return false;
  }

  const data = await res.json();
  return data.success === true;
}

/**
 * Fetches detailed Instagram Business Profile
 */
export async function fetchInstagramProfile(
  igAccountId: string,
  pageAccessToken: string
): Promise<InstagramProfile> {
  const fields = 'id,username,name,profile_picture_url,biography,followers_count,follows_count,media_count';
  const url = `${META_GRAPH_BASE}/${igAccountId}?fields=${encodeURIComponent(fields)}&access_token=${pageAccessToken}`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(`[MetaOAuth] Fetch IG profile failed: ${err.error?.message || res.statusText}`);
  }

  return res.json();
}
