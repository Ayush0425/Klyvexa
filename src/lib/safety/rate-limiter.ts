/**
 * Enterprise Rate Limiter, Viral Mode Spike Protector & Safety Score Engine
 * Incorporates all refined safety constraints approved for Phase 1:
 * - 250 msgs/hour soft cap
 * - 1,500 msgs/day soft cap
 * - 12 comments/min Viral Mode trigger
 * - 8 seconds minimum per-recipient cooldown
 * - Safe Mode: Mandatory human review on first 50 DMs
 * - Continuous 0-100 Safety Score calculation
 */

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: string;
  isSafeModeEngaged: boolean;
  requiresHumanReview: boolean;
  delayMs?: number;
  currentSafetyScore: number;
}

export interface AccountSafetyContext {
  accountId: string;
  isSafeMode: boolean;
  totalAutomatedDMs: number;
  hourlyCount: number;
  dailyCount: number;
  recentErrorsCount: number;
  recentSuccessCount: number;
  optOutCount: number;
  lastMessageSentToRecipientAt?: number; // timestamp ms
  currentInboundVelocityPerMinute: number;
}

// In-memory sliding window cache for rate limiting (fallback if Redis is initializing)
const recipientLastSentMap = new Map<string, number>();
const accountHourlyBucket = new Map<string, { count: number; windowStart: number }>();
const accountDailyBucket = new Map<string, { count: number; windowStart: number }>();

export class SafetyRateLimiter {
  // Refined Conservative Constants
  static readonly DEFAULT_HOURLY_LIMIT = 250;
  static readonly DEFAULT_DAILY_LIMIT = 1500;
  static readonly VIRAL_MODE_THRESHOLD = 12; // 12 inbound/minute triggers viral pacing
  static readonly MIN_RECIPIENT_COOLDOWN_MS = 8000; // 8 seconds minimum per recipient
  static readonly SAFE_MODE_GRADUATION_DMS = 50; // First 50 DMs under Safe Mode

  /**
   * Evaluates whether an outbound message can safely be sent.
   */
  static evaluateOutboundMessage(
    context: AccountSafetyContext,
    recipientIgsid: string
  ): RateLimitCheckResult {
    const now = Date.now();
    const safetyScore = this.calculateSafetyScore(context);

    // 1. Recipient Cooldown Check (8 seconds minimum)
    const recipientKey = `${context.accountId}:${recipientIgsid}`;
    const lastSent = recipientLastSentMap.get(recipientKey) || context.lastMessageSentToRecipientAt || 0;
    const timeSinceLastMsg = now - lastSent;

    if (timeSinceLastMsg < this.MIN_RECIPIENT_COOLDOWN_MS) {
      const waitNeeded = this.MIN_RECIPIENT_COOLDOWN_MS - timeSinceLastMsg;
      return {
        allowed: false,
        reason: `Recipient cooldown active. Minimum 8s interval required.`,
        isSafeModeEngaged: context.isSafeMode,
        requiresHumanReview: false,
        delayMs: waitNeeded,
        currentSafetyScore: safetyScore,
      };
    }

    // 2. Safe Mode Policy: If account is in Safe Mode and < 50 lifetime DMs, flag for human review
    if (context.isSafeMode && context.totalAutomatedDMs < this.SAFE_MODE_GRADUATION_DMS) {
      return {
        allowed: false,
        reason: `Safe Mode Active: First 50 DMs require human review (Current: ${context.totalAutomatedDMs}/${this.SAFE_MODE_GRADUATION_DMS}).`,
        isSafeModeEngaged: true,
        requiresHumanReview: true,
        currentSafetyScore: safetyScore,
      };
    }

    // 3. Hourly Soft Cap (250 msgs/hr)
    if (context.hourlyCount >= this.DEFAULT_HOURLY_LIMIT) {
      return {
        allowed: false,
        reason: `Hourly soft limit of ${this.DEFAULT_HOURLY_LIMIT} messages reached. Queueing for next window.`,
        isSafeModeEngaged: context.isSafeMode,
        requiresHumanReview: false,
        currentSafetyScore: safetyScore,
      };
    }

    // 4. Daily Soft Cap (1,500 msgs/day)
    if (context.dailyCount >= this.DEFAULT_DAILY_LIMIT) {
      return {
        allowed: false,
        reason: `Daily limit of ${this.DEFAULT_DAILY_LIMIT} messages reached. Outbound paused until daily reset.`,
        isSafeModeEngaged: context.isSafeMode,
        requiresHumanReview: false,
        currentSafetyScore: safetyScore,
      };
    }

    // 5. Viral Mode Spike Protection Check (>12 comments/minute)
    if (context.currentInboundVelocityPerMinute >= this.VIRAL_MODE_THRESHOLD) {
      // In Viral Mode, inject randomized jitter (10s to 60s) to pace out dispatches
      const jitterMs = Math.floor(Math.random() * (60000 - 10000 + 1)) + 10000;
      return {
        allowed: true,
        reason: `Viral Mode Active (Inbound velocity ${context.currentInboundVelocityPerMinute}/min). Applying ${Math.round(jitterMs / 1000)}s pacing jitter.`,
        isSafeModeEngaged: context.isSafeMode,
        requiresHumanReview: false,
        delayMs: jitterMs,
        currentSafetyScore: safetyScore,
      };
    }

    return {
      allowed: true,
      isSafeModeEngaged: context.isSafeMode,
      requiresHumanReview: false,
      currentSafetyScore: safetyScore,
    };
  }

  /**
   * Records a successful message dispatch to update local cooldown sliding window
   */
  static recordDispatchedMessage(accountId: string, recipientIgsid: string): void {
    const key = `${accountId}:${recipientIgsid}`;
    recipientLastSentMap.set(key, Date.now());
  }

  /**
   * Calculates continuous 0-100 Safety Score for an Instagram Account.
   * High score = Pristine compliance, zero policy errors, conservative pacing.
   */
  static calculateSafetyScore(context: AccountSafetyContext): number {
    let score = 100;

    // Deduct heavily for API error spikes (e.g. 4xx / 5xx from Meta)
    const totalCalls = context.recentErrorsCount + context.recentSuccessCount;
    if (totalCalls > 0) {
      const errorRate = context.recentErrorsCount / totalCalls;
      if (errorRate > 0.05) score -= 35;
      else if (errorRate > 0.02) score -= 15;
    }

    // Deduct if account is close to hourly/daily soft caps
    if (context.hourlyCount > this.DEFAULT_HOURLY_LIMIT * 0.9) score -= 10;
    if (context.dailyCount > this.DEFAULT_DAILY_LIMIT * 0.9) score -= 15;

    // Safe mode bonus (safe mode guarantees strict compliance)
    if (context.isSafeMode) {
      score = Math.min(100, score + 5);
    }

    return Math.max(10, Math.min(100, score));
  }
}
