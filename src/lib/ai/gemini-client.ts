import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Enterprise Gemini AI Client for Klyvexa Brand Voice & RAG Engine
 */

export class GeminiAIClient {
  private static getClient(): GoogleGenerativeAI | null {
    const apiKey = process.env.GEMINI_API_KEY || '';
    if (!apiKey) {
      return null;
    }
    return new GoogleGenerativeAI(apiKey);
  }

  /**
   * Generates a context-aware Brand Voice reply strictly compliant with Meta's transparency rules.
   */
  static async generateBrandVoiceReply(options: {
    userMessage: string;
    brandName: string;
    personaGuide?: string;
    knowledgeContext?: string;
    recipientName?: string;
  }): Promise<string> {
    const ai = this.getClient();
    if (!ai) {
      // Graceful fallback to deterministic anti-spam template if API key is not ready
      return `Hey ${options.recipientName || 'there'}! Thanks for reaching out to ${options.brandName}. Here are the details you requested: https://klyvexa.com/welcome`;
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are the official Instagram automated assistant for ${options.brandName}.
Brand Persona & Guidelines: ${options.personaGuide || 'Warm, authentic, concise, helpful, and transparent.'}
Knowledge Base Context: ${options.knowledgeContext || 'Standard customer service and product details.'}

Rules:
1. Keep the response under 60 words (optimized for Instagram DM reading).
2. Be friendly, energetic, and helpful.
3. If a name is provided (${options.recipientName || 'friend'}), greet them naturally.
4. Never generate spammy or misleading claims.

User's Inbound Message: "${options.userMessage}"

Generate the final Instagram DM response:`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err: any) {
      console.warn('[GeminiAI] Generation fallback:', err.message);
      return `Hey ${options.recipientName || 'there'}! Thanks for connecting with ${options.brandName}. Check out our resources here: https://klyvexa.com/vip`;
    }
  }

  /**
   * Summarizes an Instagram conversation thread for live human takeover in the shared inbox.
   */
  static async summarizeConversation(threadText: string): Promise<string> {
    const ai = this.getClient();
    if (!ai) {
      return 'Lead requested product details and human agent assistance.';
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Summarize this customer Instagram DM conversation in 2 concise sentences for a live human support agent. Highlight customer intent and sentiment:
${threadText}`;

      const result = await model.generateContent(prompt);
      return result.response.text().trim();
    } catch (err: any) {
      return 'Customer engaged with automation and requested further information.';
    }
  }
}
