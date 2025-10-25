'use client';

/**
 * CR AudioViz AI - Javari AI Chat Interface Component
 * Modern chat interface with conversation history and streaming support
 * @timestamp October 25, 2025 - 4:15 PM EST
 */

import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Trash2, MessageSquare, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface Conversation {
  id: string;
  title: string;
  messageCount: number;
  lastMessageAt: string;
  createdAt: string;
}

export default function JavariChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load all conversations
  const loadConversations = async () => {
    try {
      const response = await fetch('/api/javari/chat');
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Load a specific conversation
  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/javari/chat?conversationId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.conversation.messages || []);
        setConversationId(id);
      }
    } catch (error) {
      console.error('Failed to load conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    // Add user message to UI immediately
    const newMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    
    setIsLoading(true);

    try {
      const response = await fetch('/api/javari/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          conversationId: conversationId || undefined
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Update conversation ID for subsequent messages
      if (data.conversationId) {
        setConversationId(data.conversationId);
      }

      // Reload conversations list
      loadConversations();

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Start new conversation
  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    inputRef.current?.focus();
  };

  // Delete conversation
  const deleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await fetch('/api/javari/chat', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ conversationId: id })
      });

      if (response.ok) {
        loadConversations();
        if (conversationId === id) {
          startNewConversation();
        }
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Sidebar - Conversations */}
      {showSidebar && (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={startNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.map(conv => (
              <div
                key={conv.id}
                className={`group p-3 rounded-lg cursor-pointer transition-all ${
                  conversationId === conv.id
                    ? 'bg-blue-50 border-2 border-blue-500'
                    : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <div
                  onClick={() => loadConversation(conv.id)}
                  className="flex-1"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <MessageSquare size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {conv.title}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded transition-all"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {conv.messageCount} messages • {new Date(conv.lastMessageAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}

            {conversations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare size={48} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">J</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Javari AI
              </h1>
              <p className="text-xs text-gray-500">Your Creative Assistant</p>
            </div>
          </div>

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showSidebar ? 'Hide' : 'Show'} History
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                  <MessageSquare size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome to Javari AI
                </h2>
                <p className="text-gray-600 mb-6">
                  I'm your intelligent creative assistant. Ask me anything about content creation, tools, or workflows!
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setInputMessage('How do I create a video?')}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <p className="font-medium text-gray-900">🎥 Video Creation</p>
                    <p className="text-gray-500 mt-1">How do I create a video?</p>
                  </button>
                  <button
                    onClick={() => setInputMessage('What tools are available?')}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <p className="font-medium text-gray-900">🛠️ Available Tools</p>
                    <p className="text-gray-500 mt-1">What tools are available?</p>
                  </button>
                  <button
                    onClick={() => setInputMessage('Help me plan a project')}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <p className="font-medium text-gray-900">📋 Project Planning</p>
                    <p className="text-gray-500 mt-1">Help me plan a project</p>
                  </button>
                  <button
                    onClick={() => setInputMessage('Optimize my workflow')}
                    className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <p className="font-medium text-gray-900">⚡ Optimization</p>
                    <p className="text-gray-500 mt-1">Optimize my workflow</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-sm">J</span>
                    </div>
                  )}
                  
                  <div
                    className={`max-w-3xl px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-600 font-bold text-sm">U</span>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">J</span>
                  </div>
                  <div className="max-w-3xl px-4 py-3 rounded-2xl bg-white border border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Javari AI anything..."
              disabled={isLoading}
              rows={1}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  <Send size={20} />
                  <span className="font-medium">Send</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-center text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
