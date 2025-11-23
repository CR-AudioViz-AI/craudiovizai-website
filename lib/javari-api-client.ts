// CR AudioViz AI - Javari API Client
// Handles all communication with Javari AI backend
// Version: 1.0 - Complete Integration

export interface JavariMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  metadata?: {
    toolsUsed?: string[];
    suggestedActions?: SuggestedAction[];
    navigateTo?: string;
  };
}

export interface SuggestedAction {
  label: string;
  action: 'navigate' | 'search' | 'execute';
  data: string;
}

export interface JavariContext {
  currentPage: string;
  userHistory?: string[];
  userCredits?: number;
  userTier?: string;
}

class JavariAPIClient {
  private baseURL: string;
  private conversationId: string | null = null;

  constructor() {
    // Use environment variable or fallback to production Javari URL
    this.baseURL = process.env.NEXT_PUBLIC_JAVARI_API_URL || 
                    'https://crav-javari.vercel.app/api';
  }

  /**
   * Send a message to Javari AI
   */
  async sendMessage(
    message: string, 
    context?: JavariContext
  ): Promise<JavariMessage> {
    try {
      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId: this.conversationId,
          context: {
            ...context,
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Javari API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Store conversation ID for continuity
      if (data.conversationId) {
        this.conversationId = data.conversationId;
      }

      return {
        id: data.id || Date.now().toString(),
        role: 'assistant',
        content: data.content || data.message,
        timestamp: new Date(),
        metadata: data.metadata,
      };
    } catch (error) {
      console.error('Javari API error:', error);
      
      // Return fallback response
      return {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      };
    }
  }

  /**
   * Get suggested questions based on context
   */
  async getSuggestions(context: JavariContext): Promise<string[]> {
    const suggestions: Record<string, string[]> = {
      '/': [
        'What can you help me with?',
        'Show me all available tools',
        'How does the credit system work?',
        'What pricing plans do you offer?'
      ],
      '/dashboard': [
        'What should I create today?',
        'Show me my most-used tools',
        'How many credits do I have?',
        'Recommend a tool for my project'
      ],
      '/pricing': [
        'Which plan is best for me?',
        'How do credits work?',
        'Can I buy credits without a subscription?',
        'What happens when I run out of credits?'
      ],
      '/apps/legalease': [
        'How do I create a contract?',
        'What types of legal documents can you generate?',
        'Is this legally binding?',
        'Can I customize the templates?'
      ],
      '/apps/market-oracle': [
        'How do the AI models compete?',
        'Can I trust these stock picks?',
        'How often are recommendations updated?',
        'What's the win rate?'
      ],
      '/apps/logo-studio': [
        'How do I create a logo?',
        'Can I get multiple design options?',
        'What file formats can I download?',
        'Can I trademark this logo?'
      ],
    };

    return suggestions[context.currentPage] || suggestions['/'];
  }

  /**
   * Search the knowledge base
   */
  async search(query: string): Promise<any> {
    // This can be enhanced to call backend search
    // For now, use local knowledge base
    const { searchKnowledgeBase } = await import('./javari-knowledge-base');
    return searchKnowledgeBase(query);
  }

  /**
   * Reset conversation
   */
  resetConversation() {
    this.conversationId = null;
  }

  /**
   * Get conversation history
   */
  async getHistory(): Promise<JavariMessage[]> {
    if (!this.conversationId) return [];

    try {
      const response = await fetch(
        `${this.baseURL}/conversations/${this.conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) return [];

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Failed to get conversation history:', error);
      return [];
    }
  }
}

// Singleton instance
export const javariAPI = new JavariAPIClient();

// Export types
export type { JavariContext, SuggestedAction };
