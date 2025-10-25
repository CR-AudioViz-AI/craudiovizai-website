// CR AUDIOVIZ AI - Javari AI Chat Interface
// Session: 2025-10-25 - Phase 4
// Purpose: Interactive AI assistant powered by OpenAI GPT-4

'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, User, Bot, X, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface JavariAIChatProps {
  initialMessage?: string;
  className?: string;
  fullScreen?: boolean;
  onClose?: () => void;
}

export default function JavariAIChat({ 
  initialMessage = "Hi! I'm Javari, your CR AudioViz AI assistant. How can I help you create something amazing today?",
  className = '',
  fullScreen = false,
  onClose
}: JavariAIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/javari/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Javari');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message || data.content || 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Javari chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 z-50"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`
      ${fullScreen 
        ? 'fixed inset-0 z-50 bg-white' 
        : 'fixed bottom-6 right-6 w-[400px] h-[600px] z-50'
      }
      ${className}
      flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden
    `}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 rounded-full p-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Javari AI</h3>
            <p className="text-xs text-white/80">Your Creative Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!fullScreen && (
            <button
              onClick={() => setIsMinimized(true)}
              className="hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
            
            <div
              className={`
                max-w-[80%] rounded-2xl px-4 py-3 
                ${message.role === 'user' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-auto' 
                  : 'bg-white border border-gray-200 shadow-sm'
                }
              `}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className={`
                text-xs mt-2 
                ${message.role === 'user' ? 'text-white/60' : 'text-gray-400'}
              `}>
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="bg-gray-200 rounded-full p-2">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="flex-shrink-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2">
                <Bot className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Javari anything..."
            rows={1}
            disabled={isLoading}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-4 py-3 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
