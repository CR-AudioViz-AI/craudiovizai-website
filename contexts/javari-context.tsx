'use client';

// CR AudioViz AI - Javari Context Provider
// Global state management for Javari AI integration
// Version: 1.0 - Complete Integration

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { javariAPI, JavariMessage, JavariContext as JavariContextType } from '@/lib/javari-api-client';

interface JavariState {
  isOpen: boolean;
  messages: JavariMessage[];
  isLoading: boolean;
  suggestions: string[];
  context: JavariContextType;
}

interface JavariContextValue extends JavariState {
  openJavari: () => void;
  closeJavari: () => void;
  toggleJavari: () => void;
  sendMessage: (message: string) => Promise<void>;
  clearConversation: () => void;
  getSuggestedQuestions: () => Promise<string[]>;
}

const JavariContext = createContext<JavariContextValue | undefined>(undefined);

export function JavariProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const [state, setState] = useState<JavariState>({
    isOpen: false,
    messages: [],
    isLoading: false,
    suggestions: [],
    context: {
      currentPage: pathname,
    },
  });

  // Update context when page changes
  useEffect(() => {
    setState(prev => ({
      ...prev,
      context: {
        ...prev.context,
        currentPage: pathname,
      },
    }));

    // Load suggestions for new page
    loadSuggestions();
  }, [pathname]);

  // Load suggestions based on current context
  const loadSuggestions = useCallback(async () => {
    const suggestions = await javariAPI.getSuggestions({
      currentPage: pathname,
    });
    
    setState(prev => ({
      ...prev,
      suggestions,
    }));
  }, [pathname]);

  // Open Javari chat
  const openJavari = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: true }));
    
    // If first time opening, load suggestions
    if (state.suggestions.length === 0) {
      loadSuggestions();
    }
  }, [loadSuggestions, state.suggestions.length]);

  // Close Javari chat
  const closeJavari = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  // Toggle Javari chat
  const toggleJavari = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    
    if (!state.isOpen && state.suggestions.length === 0) {
      loadSuggestions();
    }
  }, [state.isOpen, state.suggestions.length, loadSuggestions]);

  // Send message to Javari
  const sendMessage = useCallback(async (message: string) => {
    // Add user message immediately
    const userMessage: JavariMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      // Send to Javari API
      const response = await javariAPI.sendMessage(message, state.context);

      // Add assistant response
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response],
        isLoading: false,
      }));

      // Handle navigation if suggested
      if (response.metadata?.navigateTo) {
        // Navigation will be handled by the chat interface component
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message
      const errorMessage: JavariMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "I'm having trouble right now. Please try again in a moment.",
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));
    }
  }, [state.context]);

  // Clear conversation
  const clearConversation = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
    }));
    javariAPI.resetConversation();
  }, []);

  // Get suggested questions
  const getSuggestedQuestions = useCallback(async (): Promise<string[]> => {
    return await javariAPI.getSuggestions(state.context);
  }, [state.context]);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleJavari();
      }
      
      // Escape to close
      if (e.key === 'Escape' && state.isOpen) {
        closeJavari();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleJavari, closeJavari, state.isOpen]);

  const value: JavariContextValue = {
    ...state,
    openJavari,
    closeJavari,
    toggleJavari,
    sendMessage,
    clearConversation,
    getSuggestedQuestions,
  };

  return (
    <JavariContext.Provider value={value}>
      {children}
    </JavariContext.Provider>
  );
}

// Hook to use Javari context
export function useJavari() {
  const context = useContext(JavariContext);
  if (context === undefined) {
    throw new Error('useJavari must be used within a JavariProvider');
  }
  return context;
}

// Hook to open Javari with a pre-filled message
export function useJavariWithMessage() {
  const { openJavari, sendMessage } = useJavari();
  
  return useCallback((message: string) => {
    openJavari();
    // Wait a tick for the chat to open before sending
    setTimeout(() => {
      sendMessage(message);
    }, 100);
  }, [openJavari, sendMessage]);
}
