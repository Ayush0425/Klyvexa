/**
 * Meta Graph API v20.0+ TypeScript Types
 * Designed strictly for official Instagram Messaging API & Business OAuth
 */

export interface MetaOAuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaLongLivedTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // typically ~60 days (5184000 seconds)
}

export interface MetaUserAccountsResponse {
  data: Array<{
    id: string;
    name: string;
    access_token: string;
    category?: string;
    tasks?: string[];
    instagram_business_account?: {
      id: string;
      username?: string;
      name?: string;
      profile_picture_url?: string;
    };
  }>;
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
  };
}

export interface InstagramProfile {
  id: string;
  username: string;
  name?: string;
  profile_picture_url?: string;
  biography?: string;
  followers_count?: number;
  follows_count?: number;
  media_count?: number;
}

// Inbound Webhook Payload Types
export interface MetaWebhookEntry {
  id: string;
  time: number;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    timestamp: number;
    message?: {
      mid: string;
      text?: string;
      quick_reply?: { payload: string };
      attachments?: Array<{
        type: 'image' | 'video' | 'audio' | 'file';
        payload: { url: string };
      }>;
      is_echo?: boolean;
    };
    postback?: {
      mid?: string;
      title: string;
      payload: string;
    };
    reaction?: {
      mid: string;
      action: 'react' | 'unreact';
      reaction?: string;
      emoji?: string;
    };
    read?: {
      watermark: number;
    };
    delivery?: {
      mids?: string[];
      watermark: number;
    };
  }>;
  changes?: Array<{
    field: string;
    value: {
      from: { id: string; username?: string };
      media: { id: string; media_product_type?: string };
      id: string;
      text: string;
      parent_id?: string;
      created_time: number;
    };
  }>;
}

export interface MetaWebhookPayload {
  object: 'instagram' | 'page';
  entry: MetaWebhookEntry[];
}

// Outbound Message Request Payload
export interface SendMessagePayload {
  recipient: { id: string };
  message: {
    text?: string;
    attachment?: {
      type: 'template';
      payload: {
        template_type: 'generic' | 'button';
        text?: string;
        buttons?: Array<{
          type: 'web_url' | 'postback';
          title: string;
          url?: string;
          payload?: string;
        }>;
      };
    };
    quick_replies?: Array<{
      content_type: 'text';
      title: string;
      payload: string;
    }>;
  };
  messaging_type?: 'RESPONSE' | 'UPDATE' | 'MESSAGE_TAG';
  tag?: 'HUMAN_AGENT'; // Only used within 7-day human-agent window by human operators
}

export interface SendMessageResponse {
  recipient_id: string;
  message_id: string;
}
