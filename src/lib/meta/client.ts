import { decryptAccessToken } from '../crypto/token-vault';
import { SendMessagePayload, SendMessageResponse } from './types';

const META_GRAPH_VERSION = 'v20.0';
const META_GRAPH_BASE = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export interface SendMessageOptions {
  pageAccessTokenEncrypted: string;
  tokenIv: string;
  tokenAuthTag: string;
  recipientIgsid: string;
  text?: string;
  quickReplies?: Array<{ title: string; payload: string }>;
  isHumanAgentTag?: boolean;
}

export interface MetaApiError {
  message: string;
  type: string;
  code: number;
  error_subcode?: number;
  fbtrace_id?: string;
}

/**
 * Official Meta Instagram Messaging API Client
 * Always performs token decryption in-memory at dispatch time and verifies safety constraints.
 */
export class MetaGraphClient {
  /**
   * Sends an outbound Instagram Direct Message to a recipient.
   */
  static async sendInstagramMessage(options: SendMessageOptions): Promise<SendMessageResponse> {
    const {
      pageAccessTokenEncrypted,
      tokenIv,
      tokenAuthTag,
      recipientIgsid,
      text,
      quickReplies,
      isHumanAgentTag,
    } = options;

    if (!recipientIgsid) {
      throw new Error('[MetaClient] Recipient IGSID is required.');
    }

    if (!text && (!quickReplies || quickReplies.length === 0)) {
      throw new Error('[MetaClient] Message must contain text or quick replies.');
    }

    // Decrypt access token strictly in memory
    const token = decryptAccessToken(pageAccessTokenEncrypted, tokenIv, tokenAuthTag);

    const payload: SendMessagePayload = {
      recipient: { id: recipientIgsid },
      message: {},
      messaging_type: isHumanAgentTag ? 'MESSAGE_TAG' : 'RESPONSE',
    };

    if (text) {
      payload.message.text = text;
    }

    if (quickReplies && quickReplies.length > 0) {
      payload.message.quick_replies = quickReplies.map((qr) => ({
        content_type: 'text',
        title: qr.title.substring(0, 20), // Meta limit 20 chars
        payload: qr.payload,
      }));
    }

    if (isHumanAgentTag) {
      payload.tag = 'HUMAN_AGENT';
    }

    const url = `${META_GRAPH_BASE}/me/messages?access_token=${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: { message: res.statusText, code: res.status } }));
      const metaError: MetaApiError = errData.error || { message: res.statusText, type: 'GraphMethodException', code: res.status };
      
      const enhancedError = new Error(`[MetaGraphAPI Error ${metaError.code}] ${metaError.message}`);
      (enhancedError as unknown as { metaError: MetaApiError }).metaError = metaError;
      throw enhancedError;
    }

    return res.json();
  }

  /**
   * Replies publicly to an Instagram comment on a Post or Reel
   * Useful as a safe first-touch acknowledgement before sending DM ("Check your DM! 📩")
   */
  static async replyToComment(
    commentId: string,
    message: string,
    pageAccessTokenEncrypted: string,
    tokenIv: string,
    tokenAuthTag: string
  ): Promise<{ id: string }> {
    const token = decryptAccessToken(pageAccessTokenEncrypted, tokenIv, tokenAuthTag);
    const url = `${META_GRAPH_BASE}/${commentId}/replies?access_token=${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: { message: res.statusText, code: res.status } }));
      throw new Error(`[MetaCommentAPI Error] ${errData.error?.message || res.statusText}`);
    }

    return res.json();
  }
}
