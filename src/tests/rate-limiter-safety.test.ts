import { describe, it, expect } from 'vitest';
import { SafetyRateLimiter } from '../lib/safety/rate-limiter';
import { MessagingWindowValidator } from '../lib/safety/window-validator';
import { MessageVariationEngine } from '../lib/safety/message-spinner';
import { OptOutManager } from '../lib/safety/opt-out-manager';

describe('Klyvexa Safety Guardrails & Rate Limiting Test Suite', () => {
  it('enforces 8 seconds minimum cooldown between messages to the same recipient', () => {
    const context = {
      accountId: 'acc_1',
      isSafeMode: false,
      totalAutomatedDMs: 100,
      hourlyCount: 10,
      dailyCount: 50,
      recentErrorsCount: 0,
      recentSuccessCount: 50,
      optOutCount: 0,
      currentInboundVelocityPerMinute: 2,
    };

    const recipient = 'igsid_user_99';
    SafetyRateLimiter.recordDispatchedMessage('acc_1', recipient);

    // Immediate second message should be BLOCKED due to 8s cooldown
    const result = SafetyRateLimiter.evaluateOutboundMessage(context, recipient);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('8s interval required');
  });

  it('enforces Safe Mode requirement for mandatory human review on the first 50 DMs', () => {
    const context = {
      accountId: 'acc_new',
      isSafeMode: true,
      totalAutomatedDMs: 12, // Less than 50
      hourlyCount: 2,
      dailyCount: 12,
      recentErrorsCount: 0,
      recentSuccessCount: 12,
      optOutCount: 0,
      currentInboundVelocityPerMinute: 1,
    };

    const result = SafetyRateLimiter.evaluateOutboundMessage(context, 'igsid_user_new_123');
    expect(result.allowed).toBe(false);
    expect(result.requiresHumanReview).toBe(true);
    expect(result.reason).toContain('First 50 DMs require human review');
  });

  it('enforces conservative 250 hourly and 1,500 daily soft caps', () => {
    const contextHourlyFull = {
      accountId: 'acc_busy',
      isSafeMode: false,
      totalAutomatedDMs: 200,
      hourlyCount: 250, // Reached limit
      dailyCount: 400,
      recentErrorsCount: 0,
      recentSuccessCount: 200,
      optOutCount: 0,
      currentInboundVelocityPerMinute: 1,
    };

    const resHourly = SafetyRateLimiter.evaluateOutboundMessage(contextHourlyFull, 'igsid_user_456');
    expect(resHourly.allowed).toBe(false);
    expect(resHourly.reason).toContain('Hourly soft limit of 250');

    const contextDailyFull = {
      ...contextHourlyFull,
      hourlyCount: 50,
      dailyCount: 1500, // Reached daily limit
    };

    const resDaily = SafetyRateLimiter.evaluateOutboundMessage(contextDailyFull, 'igsid_user_456');
    expect(resDaily.allowed).toBe(false);
    expect(resDaily.reason).toContain('Daily limit of 1500');
  });

  it('triggers Viral Mode spike protection when inbound velocity >= 12/min', () => {
    const contextViral = {
      accountId: 'acc_viral',
      isSafeMode: false,
      totalAutomatedDMs: 200,
      hourlyCount: 50,
      dailyCount: 300,
      recentErrorsCount: 0,
      recentSuccessCount: 200,
      optOutCount: 0,
      currentInboundVelocityPerMinute: 15, // >= 12 threshold
    };

    const result = SafetyRateLimiter.evaluateOutboundMessage(contextViral, 'igsid_user_viral_999');
    expect(result.allowed).toBe(true);
    expect(result.delayMs).toBeGreaterThanOrEqual(10000); // Randomized pacing jitter active
  });

  it('strictly hard-blocks automated messages when 24-hour window has expired', () => {
    const now = Date.now();
    const twentyFiveHoursAgo = new Date(now - 25 * 60 * 60 * 1000);

    const checkBot = MessagingWindowValidator.validate(twentyFiveHoursAgo, false);
    expect(checkBot.isValid).toBe(false);
    expect(checkBot.reason).toContain('24-hour messaging window expired');

    // But human operator handoff within 7 days is permitted with HUMAN_AGENT tag
    const checkHuman = MessagingWindowValidator.validate(twentyFiveHoursAgo, true);
    expect(checkHuman.isValid).toBe(true);
    expect(checkHuman.useHumanAgentTag).toBe(true);
  });

  it('generates at least 5 distinct paraphrased variations and prepends transparent disclosure on first message', () => {
    const messageResult = MessageVariationEngine.generateMessage({
      brandName: 'Klyvexa',
      recipientName: 'Sarah',
      isFirstMessage: true,
      baseIntent: 'COMMENT_ACK',
      customLinkOrValue: 'https://klyvexa.com/vip',
    });

    expect(messageResult.totalVariantsAvailable).toBeGreaterThanOrEqual(5);
    expect(messageResult.includesDisclosure).toBe(true);
    expect(messageResult.text).toContain('Automated Assistant for Klyvexa');
    expect(messageResult.text).toContain('Hey Sarah!');
  });

  it('instantly intercepts STOP keyword and flags immediate opt-out', () => {
    const checkStop = OptOutManager.evaluateInboundText('STOP');
    expect(checkStop.isOptOut).toBe(true);
    expect(checkStop.actionRequired).toBe('PROCESS_OPT_OUT');

    const checkHuman = OptOutManager.evaluateInboundText('I want to speak with a HUMAN');
    expect(checkHuman.isHumanRequest).toBe(true);
    expect(checkHuman.actionRequired).toBe('NOTIFY_HUMAN_OPERATOR');
  });
});
