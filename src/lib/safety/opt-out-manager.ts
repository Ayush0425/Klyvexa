/**
 * Instant Keyword Opt-Out & Human Handoff Interceptor
 * Compliant with Meta Platform Terms and consumer protection requirements.
 */

export interface OptOutCheckResult {
  isOptOut: boolean;
  isHumanRequest: boolean;
  actionRequired: 'NONE' | 'PROCESS_OPT_OUT' | 'NOTIFY_HUMAN_OPERATOR';
  confirmationMessage?: string;
}

export class OptOutManager {
  private static readonly OPT_OUT_KEYWORDS = [
    'STOP',
    'UNSUBSCRIBE',
    'CANCEL',
    'QUIT',
    'OPTOUT',
    'OPT OUT',
    'END',
    'NO MORE',
  ];

  private static readonly HUMAN_KEYWORDS = [
    'HUMAN',
    'AGENT',
    'REAL PERSON',
    'REPRESENTATIVE',
    'SUPPORT',
    'TALK TO SOMEONE',
    'OPERATOR',
  ];

  /**
   * Checks if an incoming user message requests an instant opt-out or human handoff.
   */
  static evaluateInboundText(text: string | undefined | null): OptOutCheckResult {
    if (!text || typeof text !== 'string') {
      return { isOptOut: false, isHumanRequest: false, actionRequired: 'NONE' };
    }

    const clean = text.trim().toUpperCase();

    // Check opt-out keywords
    const isOptOut = this.OPT_OUT_KEYWORDS.some((kw) => clean === kw || clean.startsWith(`${kw} `));
    if (isOptOut) {
      return {
        isOptOut: true,
        isHumanRequest: false,
        actionRequired: 'PROCESS_OPT_OUT',
        confirmationMessage:
          'You have been unsubscribed from automated messages. Type START anytime if you wish to re-subscribe.',
      };
    }

    // Check human agent requests
    const isHumanRequest = this.HUMAN_KEYWORDS.some((kw) => clean === kw || clean.includes(kw));
    if (isHumanRequest) {
      return {
        isOptOut: false,
        isHumanRequest: true,
        actionRequired: 'NOTIFY_HUMAN_OPERATOR',
        confirmationMessage:
          'Connecting you with a team member. Automated responses are now paused for this chat.',
      };
    }

    return {
      isOptOut: false,
      isHumanRequest: false,
      actionRequired: 'NONE',
    };
  }
}
