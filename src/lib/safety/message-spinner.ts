/**
 * Anti-Spam Message Variation & Personalization Engine for Klyvexa
 * Meta anti-spam algorithms flag identical strings sent repeatedly at volume.
 * This engine guarantees:
 * 1. At least 5 distinct paraphrased template variations for every step.
 * 2. Light personalization (First name if available, friendly greeting fallback).
 * 3. Transparent automation disclosure integration for first-touch conversations.
 */

export interface VariationOptions {
  recipientName?: string | null;
  brandName?: string;
  isFirstMessage: boolean;
  baseIntent: 'COMMENT_ACK' | 'LEAD_EMAIL_REQUEST' | 'PRICE_INFO' | 'GENERAL_LINK' | 'HUMAN_HANDOFF';
  customLinkOrValue?: string;
}

export interface GeneratedMessageVariant {
  text: string;
  variantIndex: number;
  totalVariantsAvailable: number;
  includesDisclosure: boolean;
  hasPersonalization: boolean;
}

export class MessageVariationEngine {
  /**
   * Generates a randomized, compliant, personalized message variation from 5 distinct templates.
   */
  static generateMessage(options: VariationOptions): GeneratedMessageVariant {
    const brandName = options.brandName || 'Klyvexa';
    const nameGreeting = options.recipientName
      ? `Hey ${options.recipientName.trim()}!`
      : 'Hey there!';

    const value = options.customLinkOrValue || '';
    const templates = this.getTemplatesForIntent(options.baseIntent, nameGreeting, value, brandName);

    // Pick one of the 5 variations at random
    const selectedIndex = Math.floor(Math.random() * templates.length);
    let selectedText = templates[selectedIndex];

    // Prepend mandatory transparent disclosure if it's the initial message
    let includesDisclosure = false;
    if (options.isFirstMessage) {
      const disclosure = `[Automated Assistant for ${brandName} • Type HUMAN anytime for live support]\n\n`;
      selectedText = `${disclosure}${selectedText}`;
      includesDisclosure = true;
    }

    return {
      text: selectedText,
      variantIndex: selectedIndex + 1,
      totalVariantsAvailable: templates.length,
      includesDisclosure,
      hasPersonalization: Boolean(options.recipientName),
    };
  }

  /**
   * Returns a pool of at least 5 distinct, natural-sounding copy variations
   */
  private static getTemplatesForIntent(
    intent: VariationOptions['baseIntent'],
    greeting: string,
    value: string,
    brand: string
  ): string[] {
    switch (intent) {
      case 'COMMENT_ACK':
        return [
          `${greeting} Saw your comment and wanted to send the full details right over. Here is the link you requested: ${value}`,
          `${greeting} Thanks for reaching out on our recent post! As promised, here is the information: ${value}`,
          `${greeting} Appreciate your comment! Dropping the link you asked for directly into your DMs: ${value}`,
          `${greeting} Great seeing you on our feed! Here are all the details and next steps: ${value}`,
          `${greeting} Following up on your comment! Here is the exclusive access link for ${brand}: ${value}`,
        ];

      case 'LEAD_EMAIL_REQUEST':
        return [
          `${greeting} Where is the best email address to send your guide and resources?`,
          `${greeting} What email should we send your confirmation and details to?`,
          `${greeting} Please share your preferred email address so we can forward the materials over immediately!`,
          `${greeting} To get you access right away, what email works best for you?`,
          `${greeting} Drop your email address below and I'll deliver the PDF straight to your inbox!`,
        ];

      case 'PRICE_INFO':
        return [
          `${greeting} Here is the complete breakdown of our pricing and current packages: ${value}`,
          `${greeting} Happy to share our pricing details with you! Check out the full overview here: ${value}`,
          `${greeting} You got it! Here are our current plans and feature comparisons: ${value}`,
          `${greeting} Everything you need regarding pricing and options can be found here: ${value}`,
          `${greeting} Here is the transparent pricing guide for ${brand}: ${value}`,
        ];

      case 'HUMAN_HANDOFF':
        return [
          `${greeting} I've notified our team! A specialist will join this chat shortly to assist you personally.`,
          `${greeting} You got it. Pausing automation and connecting you with a live team member right now.`,
          `${greeting} Understood! I've flagged this conversation for human takeover. Someone will be with you in just a moment.`,
          `${greeting} Handing you over to our support team! A human agent is reviewing your message now.`,
          `${greeting} No problem at all. A member of the ${brand} team is jumping in to help you out.`,
        ];

      case 'GENERAL_LINK':
      default:
        return [
          `${greeting} Here is the direct link you requested: ${value}`,
          `${greeting} You can access everything right here: ${value}`,
          `${greeting} Here are the details you were looking for: ${value}`,
          `${greeting} Check out the full resource here: ${value}`,
          `${greeting} Follow this link to get started: ${value}`,
        ];
    }
  }
}
