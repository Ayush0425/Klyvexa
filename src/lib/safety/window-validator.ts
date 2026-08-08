/**
 * 24-Hour Messaging Window & Human Agent Tag Validator
 * Meta Graph API Strictly allows standard messages within 24 hours of the user's last inbound interaction.
 * After 24 hours, regular bot messages MUST HARD-FAIL.
 * Only HUMAN_AGENT tagged messages sent by authenticated human agents are permitted within 7 days.
 */

export interface WindowValidationResult {
  isValid: boolean;
  reason?: string;
  isWithin24Hours: boolean;
  isWithin7DaysHumanWindow: boolean;
  hoursRemaining: number;
  useHumanAgentTag: boolean;
}

export class MessagingWindowValidator {
  static readonly TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
  static readonly SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

  /**
   * Validates whether a message can be dispatched under official Meta rules.
   */
  static validate(
    lastUserInboundAt: Date | number,
    isHumanOperatorInitiated: boolean = false
  ): WindowValidationResult {
    const inboundTime = typeof lastUserInboundAt === 'number' ? lastUserInboundAt : lastUserInboundAt.getTime();
    const now = Date.now();
    const elapsedMs = now - inboundTime;

    const isWithin24Hours = elapsedMs <= this.TWENTY_FOUR_HOURS_MS;
    const isWithin7Days = elapsedMs <= this.SEVEN_DAYS_MS;
    const hoursRemaining = Math.max(0, (this.TWENTY_FOUR_HOURS_MS - elapsedMs) / (60 * 60 * 1000));

    // Case 1: Within normal 24-hour window
    if (isWithin24Hours) {
      return {
        isValid: true,
        isWithin24Hours: true,
        isWithin7DaysHumanWindow: isWithin7Days,
        hoursRemaining: Math.round(hoursRemaining * 10) / 10,
        useHumanAgentTag: false,
      };
    }

    // Case 2: Window expired (>24h), but within 7 days AND initiated by a verified human agent in the UI
    if (isWithin7Days && isHumanOperatorInitiated) {
      return {
        isValid: true,
        isWithin24Hours: false,
        isWithin7DaysHumanWindow: true,
        hoursRemaining: 0,
        useHumanAgentTag: true, // Official Meta tag for human operator handoff
      };
    }

    // Case 3: 24h window closed and bot automation is trying to message -> HARD BLOCK
    return {
      isValid: false,
      reason: '24-hour messaging window expired. Automated messages strictly blocked to prevent Meta policy violations.',
      isWithin24Hours: false,
      isWithin7DaysHumanWindow: isWithin7Days,
      hoursRemaining: 0,
      useHumanAgentTag: false,
    };
  }
}
