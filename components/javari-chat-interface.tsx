'use client';

// CR AudioViz AI - Javari Chat Interface
// Beautiful, professional chat interface for Javari AI
// Version: 1.0 - Complete Integration

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  Send, 
  Sparkles, 
  MessageSquare, 
  Minimize2, 
  Maximize2,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { useJavari } from '@/contexts/javari-context';
import { JavariMessage } from '@/lib/javari-api-client';

interface JavariChatInterfaceProps {
  mode?: 'widget' | 'fullpage';
  className?: string;
}

export default function JavariChatInterface({ 
  mode = 'widget',
  className = '' 
}: JavariChatInterfaceProps) {
  const {
    messages,
    isLoading,
    suggestions,
    sendMessage,
    clearConversation,
    closeJavari,
    context,
  } = useJavari();

  const router = useRouter();
  const [input, setInput] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (mode === 'widget' && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [mode, isMinimized]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput('');
    await sendMessage(message);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  // Handle navigation
  const handleNavigate = (path: string) => {
    router.push(path);
    if (mode === 'widget') {
      closeJavari();
    }
  };

  // Render message with metadata
  const renderMessage = (message: JavariMessage) => {
    const isUser = message.role === 'user';

    return (
      <div
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
          }`}
        >
          {!isUser && (
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                Javari AI
              </span>
            </div>
          )}
          
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>

          {/* Suggested actions */}
          {message.metadata?.suggestedActions && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.metadata.suggestedActions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (action.action === 'navigate') {
                      handleNavigate(action.data);
                    } else if (action.action === 'search') {
                      setInput(action.data);
                    }
                  }}
                  className="text-xs px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Navigation button */}
          {message.metadata?.navigateTo && (
            <button
              onClick={() => handleNavigate(message.metadata!.navigateTo!)}
              className="mt-3 flex items-center gap-2 text-xs px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Navigation className="w-3 h-3" />
              Go there
            </button>
          )}

          <span className="text-xs opacity-50 mt-2 block">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    );
  };

  // Widget mode (floating chat)
  if (mode === 'widget') {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 ${
          isMinimized ? 'w-auto' : 'w-96'
        } transition-all ${className}`}
      >
        {isMinimized ? (
          // Minimized state
          <button
            onClick={() => setIsMinimized(false)}
            className="w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white animate-pulse"
          >
            <MessageSquare className="w-6 h-6" />
          </button>
        ) : (
          // Expanded state
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-white" />
                <div>
                  <h3 className="font-semibold text-white">Javari AI</h3>
                  <p className="text-xs text-white/80">Your AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearConversation}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Clear conversation"
                >
                  <RotateCcw className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={closeJavari}
                  className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-950">
              {messages.length === 0 ? (
                // Welcome message
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2">
                    Hi! I'm Javari
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your AI assistant for CR AudioViz AI. I know everything about our platform and can help you navigate, find tools, and answer questions.
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Try asking me something or click a suggestion below
                  </p>
                </div>
              ) : (
                <>
                  {messages.map(renderMessage)}
                  {isLoading && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                          <span className="text-sm">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 0 && suggestions.length > 0 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.slice(0, 3).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs px-3 py-1.5 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={1}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Enter</kbd> to send, <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">Shift+Enter</kbd> for new line
              </p>
            </form>
          </div>
        )}
      </div>
    );
  }

  // Full page mode (for /javari page)
  return (
    <div className={`w-full h-screen flex flex-col ${className}`}>
      {/* Full page implementation - similar structure but different layout */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Javari AI</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Your intelligent assistant for everything CR AudioViz AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Welcome to Javari AI
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mb-8">
                I'm your expert guide to CR AudioViz AI. I know every tool, feature, and page inside and out. Ask me anything about our 60+ professional tools, 1,200+ games, pricing, or how to accomplish your goals.
              </p>
              <div className="grid grid-cols-2 gap-4 max-w-2xl">
                {suggestions.slice(0, 4).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="p-4 bg-white dark:bg-gray-800 rounded-xl hover:shadow-lg transition-all text-left border border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm font-medium">{suggestion}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map(renderMessage)}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-purple-500 animate-spin" />
                      <span>Javari is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input area */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Ask Javari anything about CR AudioViz AI..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none text-lg"
              rows={2}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="text-sm text-gray-500">
              Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">⌘K</kbd> or <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl+K</kbd> to focus
            </p>
            <button
              type="button"
              onClick={clearConversation}
              className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear conversation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
