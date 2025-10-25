// CR AUDIOVIZ AI - Analytics Tracking System
// Session: 2025-10-25 - Phase 4
// Purpose: Track user actions, events, and platform usage

'use client';

import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  userId?: string;
  metadata?: Record<string, any>;
}

class AnalyticsService {
  private endpoint = '/api/analytics/track';
  private userId: string | null = null;
  private sessionId: string;
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startFlushInterval();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private startFlushInterval() {
    // Flush queue every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flush();
    }, 30000);
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  track(event: string, properties?: Omit<AnalyticsEvent, 'event'>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      userId: this.userId || undefined,
      ...properties,
      metadata: {
        ...properties?.metadata,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      }
    };

    this.queue.push(analyticsEvent);

    // Flush immediately for important events
    const importantEvents = ['error', 'purchase', 'signup', 'conversion'];
    if (importantEvents.includes(event)) {
      this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events: eventsToSend })
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-add failed events to queue
      this.queue.push(...eventsToSend);
    }
  }

  // Convenience methods for common events
  pageView(path?: string) {
    this.track('page_view', {
      category: 'navigation',
      label: path || (typeof window !== 'undefined' ? window.location.pathname : 'unknown')
    });
  }

  buttonClick(label: string, location?: string) {
    this.track('button_click', {
      category: 'engagement',
      label,
      metadata: { location }
    });
  }

  appUse(appId: string, creditsUsed?: number) {
    this.track('app_use', {
      category: 'tools',
      label: appId,
      value: creditsUsed
    });
  }

  creditPurchase(amount: number, credits: number) {
    this.track('credit_purchase', {
      category: 'revenue',
      value: amount,
      metadata: { credits }
    });
  }

  error(errorMessage: string, errorType?: string) {
    this.track('error', {
      category: 'error',
      label: errorType || 'unknown',
      metadata: { message: errorMessage }
    });
  }

  featureUse(featureName: string, details?: Record<string, any>) {
    this.track('feature_use', {
      category: 'engagement',
      label: featureName,
      metadata: details
    });
  }

  search(query: string, resultCount?: number) {
    this.track('search', {
      category: 'discovery',
      label: query,
      value: resultCount
    });
  }

  chatMessage(messageLength: number) {
    this.track('chat_message', {
      category: 'ai_interaction',
      value: messageLength
    });
  }

  cleanup() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush(); // Final flush
  }
}

// Singleton instance
const analytics = new AnalyticsService();

// React hook for analytics
export function useAnalytics() {
  useEffect(() => {
    // Track page view on mount
    analytics.pageView();

    // Cleanup on unmount
    return () => {
      analytics.flush();
    };
  }, []);

  return {
    track: useCallback((event: string, properties?: Omit<AnalyticsEvent, 'event'>) => {
      analytics.track(event, properties);
    }, []),
    
    pageView: useCallback((path?: string) => {
      analytics.pageView(path);
    }, []),
    
    buttonClick: useCallback((label: string, location?: string) => {
      analytics.buttonClick(label, location);
    }, []),
    
    appUse: useCallback((appId: string, creditsUsed?: number) => {
      analytics.appUse(appId, creditsUsed);
    }, []),
    
    creditPurchase: useCallback((amount: number, credits: number) => {
      analytics.creditPurchase(amount, credits);
    }, []),
    
    error: useCallback((errorMessage: string, errorType?: string) => {
      analytics.error(errorMessage, errorType);
    }, []),
    
    featureUse: useCallback((featureName: string, details?: Record<string, any>) => {
      analytics.featureUse(featureName, details);
    }, []),
    
    search: useCallback((query: string, resultCount?: number) => {
      analytics.search(query, resultCount);
    }, []),
    
    chatMessage: useCallback((messageLength: number) => {
      analytics.chatMessage(messageLength);
    }, []),

    setUserId: useCallback((userId: string) => {
      analytics.setUserId(userId);
    }, [])
  };
}

// HOC for automatic page view tracking
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AnalyticsWrapper(props: P) {
    useAnalytics();
    return <Component {...props} />;
  };
}

export default analytics;
