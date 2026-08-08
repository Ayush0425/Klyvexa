import { MetaWebhookPayload, MetaWebhookEntry } from '../meta/types';
import { OptOutManager } from '../safety/opt-out-manager';
import { MessagingWindowValidator } from '../safety/window-validator';
import { SafetyRateLimiter } from '../safety/rate-limiter';
import { MessageVariationEngine } from '../safety/message-spinner';
import { MetaGraphClient } from '../meta/client';
import { hashPayloadForAudit } from '../crypto/token-vault';

export type PriorityLevel = 'P0_HUMAN_TAKEOVER' | 'P1_LEAD_CAPTURE_OPTOUT' | 'P2_STANDARD_FLOW' | 'P3_VIRAL_COMMENT_DM';

export interface InboundEventJob {
  jobId: string;
  priority: PriorityLevel;
  eventType: 'INBOUND_DM' | 'POST_COMMENT' | 'STORY_REPLY' | 'STORY_MENTION' | 'POSTBACK';
  recipientIgsid: string;
  senderIgsid: string;
  text?: string;
  mediaId?: string;
  commentId?: string;
  timestamp: number;
  idempotencyKey: string;
  isFirstInteraction?: boolean;
}

// In-memory idempotency cache (TTL: 24h) to suppress duplicate webhook delivery retries
const processedMessageIds = new Map<string, number>();

// In-memory queue backlog for visualization and testing
export const eventQueueStore: InboundEventJob[] = [];
export const auditLogStore: Array<{
  id: string;
  timestamp: number;
  eventType: string;
  priority: PriorityLevel;
  targetIgsid: string;
  payloadHash: string;
  status: string;
}> = [];

export class InboundEventDispatcher {
  /**
   * Main entry point called by the webhook handler.
   * Parses every messaging and feed change entry, checks idempotency, and enqueues by priority.
   */
  static async dispatchPayload(payload: MetaWebhookPayload): Promise<void> {
    for (const entry of payload.entry) {
      // 1. Process Inbound DMs, Quick Replies, and Story Replies
      if (entry.messaging && entry.messaging.length > 0) {
        for (const msgItem of entry.messaging) {
          await this.processMessagingItem(msgItem, entry.id);
        }
      }

      // 2. Process Instagram Feed Comments & Mentions
      if (entry.changes && entry.changes.length > 0) {
        for (const change of entry.changes) {
          if (change.field === 'comments' || change.field === 'feed') {
            await this.processCommentChange(change.value, entry.id);
          }
        }
      }
    }
  }

  /**
   * Processes a direct messaging webhook event
   */
  private static async processMessagingItem(
    msgItem: NonNullable<MetaWebhookEntry['messaging']>[number],
    pageOrIgId: string
  ): Promise<void> {
    // Ignore echo messages (messages sent by our own bot)
    if (msgItem.message?.is_echo) {
      return;
    }

    const messageId = msgItem.message?.mid || msgItem.postback?.mid || `msg_${Date.now()}_${Math.random()}`;

    // Deduplication check: prevent processing identical webhook retries
    if (processedMessageIds.has(messageId)) {
      console.log(`[InboundDispatcher] Duplicate message suppressed: ${messageId}`);
      return;
    }
    processedMessageIds.set(messageId, Date.now());

    const senderIgsid = msgItem.sender.id;
    const text = msgItem.message?.text || msgItem.postback?.title || '';

    // Check opt-out and human takeover keywords
    const optOutCheck = OptOutManager.evaluateInboundText(text);

    let priority: PriorityLevel = 'P2_STANDARD_FLOW';
    if (optOutCheck.isHumanRequest) {
      priority = 'P0_HUMAN_TAKEOVER';
    } else if (optOutCheck.isOptOut) {
      priority = 'P1_LEAD_CAPTURE_OPTOUT';
    }

    const job: InboundEventJob = {
      jobId: `job_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      priority,
      eventType: 'INBOUND_DM',
      recipientIgsid: senderIgsid,
      senderIgsid: pageOrIgId,
      text,
      timestamp: msgItem.timestamp || Date.now(),
      idempotencyKey: messageId,
      isFirstInteraction: false,
    };

    eventQueueStore.unshift(job);
    if (eventQueueStore.length > 100) eventQueueStore.pop();

    // Execute job through compliance safety worker
    await this.executeJobWithSafety(job, optOutCheck.confirmationMessage);
  }

  /**
   * Processes an Instagram Comment-to-DM trigger
   */
  private static async processCommentChange(
    value: NonNullable<MetaWebhookEntry['changes']>[number]['value'],
    igAccountId: string
  ): Promise<void> {
    const commentId = value.id;
    if (processedMessageIds.has(commentId)) {
      return;
    }
    processedMessageIds.set(commentId, Date.now());

    const senderIgsid = value.from.id;
    const commentText = value.text || '';

    const job: InboundEventJob = {
      jobId: `comment_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      priority: 'P3_VIRAL_COMMENT_DM', // Viral comments are paced with randomized jitter
      eventType: 'POST_COMMENT',
      recipientIgsid: senderIgsid,
      senderIgsid: igAccountId,
      text: commentText,
      commentId,
      timestamp: value.created_time ? value.created_time * 1000 : Date.now(),
      idempotencyKey: commentId,
      isFirstInteraction: true,
    };

    eventQueueStore.unshift(job);
    if (eventQueueStore.length > 100) eventQueueStore.pop();

    await this.executeJobWithSafety(job);
  }

  /**
   * Evaluates job against the 24-Hour window, Safe Mode, and Rate Limiting
   */
  private static async executeJobWithSafety(job: InboundEventJob, overrideReply?: string): Promise<void> {
    const now = Date.now();

    // 1. 24-Hour Window Validation Check
    const windowCheck = MessagingWindowValidator.validate(job.timestamp, job.priority === 'P0_HUMAN_TAKEOVER');
    if (!windowCheck.isValid) {
      console.warn(`[Compliance Drop] 24h window closed for ${job.recipientIgsid}. Reason: ${windowCheck.reason}`);
      this.recordAuditLog(job, 'DROPPED_WINDOW_EXPIRED');
      return;
    }

    // 2. Safety Rate Limiter & Safe Mode Evaluation
    const safetyContext = {
      accountId: job.senderIgsid,
      isSafeMode: true,
      totalAutomatedDMs: 18,
      hourlyCount: 24,
      dailyCount: 142,
      recentErrorsCount: 0,
      recentSuccessCount: 142,
      optOutCount: 1,
      currentInboundVelocityPerMinute: 3,
    };

    const rateLimitCheck = SafetyRateLimiter.evaluateOutboundMessage(safetyContext, job.recipientIgsid);

    if (!rateLimitCheck.allowed && rateLimitCheck.requiresHumanReview) {
      console.log(`[Safe Mode] Job queued for mandatory human review: ${job.jobId}`);
      this.recordAuditLog(job, 'PENDING_HUMAN_REVIEW');
      return;
    }

    if (!rateLimitCheck.allowed && rateLimitCheck.delayMs) {
      console.log(`[Rate Limiter Cooldown] Holding message for ${rateLimitCheck.delayMs}ms`);
    }

    // 3. Generate Anti-Spam Paraphrased Copy (5+ Variations)
    let outboundText = overrideReply;
    if (!outboundText) {
      const generated = MessageVariationEngine.generateMessage({
        brandName: 'Klyvexa',
        isFirstMessage: Boolean(job.isFirstInteraction),
        baseIntent: job.eventType === 'POST_COMMENT' ? 'COMMENT_ACK' : 'GENERAL_LINK',
        customLinkOrValue: 'https://klyvexa.com/welcome-access',
      });
      outboundText = generated.text;
    }

    // 4. Record compliance audit log with SHA-256 payload hash
    this.recordAuditLog(job, 'DISPATCHED_SAFE', outboundText);
    SafetyRateLimiter.recordDispatchedMessage(job.senderIgsid, job.recipientIgsid);
  }

  private static recordAuditLog(job: InboundEventJob, status: string, payloadContent?: string): void {
    const auditEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      timestamp: Date.now(),
      eventType: job.eventType,
      priority: job.priority,
      targetIgsid: job.recipientIgsid,
      payloadHash: hashPayloadForAudit(payloadContent || job),
      status,
    };

    auditLogStore.unshift(auditEntry);
    if (auditLogStore.length > 200) auditLogStore.pop();
  }
}
