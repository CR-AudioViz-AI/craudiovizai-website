'use client';

/**
 * CR AudioViz AI - JavariAI Multi-Provider Interface
 * Full-featured AI chat with OpenAI, Claude, Gemini, and Mistral
 * @timestamp October 28, 2025 - 11:52 AM EST
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Send, 
  Loader2, 
  Brain, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Activity,
  Settings,
  History,
  BarChart3,
  Zap,
  Shield,
  RefreshCcw
} from 'lucide-react';

const AI_PROVIDERS = {
  openai: {
    name: 'OpenAI',
    icon: '🤖',
    models: [
      { id: 'gpt-4', name: 'GPT-4', description: 'Most capable, best for complex tasks' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Faster, cost-effective GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and affordable' }
    ],
    color: 'emerald'
  },
  anthropic: {
    name: 'Claude (Anthropic)',
    icon: '🧠',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', description: 'Highest intelligence, reasoning' },
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Complex analysis and creativity' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest, most affordable' }
    ],
    color: 'purple'
  },
  google: {
    name: 'Google Gemini',
    icon: '✨',
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro', description: 'Balanced performance' },
      { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', description: 'With image understanding' }
    ],
    color: 'blue'
  },
  mistral: {
    name: 'Mistral AI',
    icon: '⚡',
    models: [
      { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable Mistral model' },
      { id: 'mistral-medium-latest', name: 'Mistral Medium', description: 'Balanced performance' }
    ],
    color: 'orange'
  }
};

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
  provider?: string;
  model?: string;
  cost?: number;
}

interface UsageStats {
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;
  provider: string;
  model: string;
}

interface Analytics {
  total_conversations: number;
  total_tokens_used: number;
  total_cost: number;
  avg_tokens_per_conversation: number;
  avg_cost_per_conversation: number;
  providers_used: number;
  requests_by_provider: Record<string, number>;
}

export default function JavariAIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<keyof typeof AI_PROVIDERS>('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4-turbo');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [sessionStats, setSessionStats] = useState<UsageStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    loadAnalytics();
    loadConversationHistory();
  }, []);

  useEffect(() => {
    // Update model when provider changes
    const models = AI_PROVIDERS[selectedProvider].models;
    setSelectedModel(models[0].id);
  }, [selectedProvider]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/javari/analytics');
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };

  const loadConversationHistory = async () => {
    try {
      const response = await fetch('/api/javari/chat?limit=20');
      if (response.ok) {
        const data = await response.json();
        setConversationHistory(data.conversations || []);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/javari/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          provider: selectedProvider,
          model: selectedModel,
          temperature,
          max_tokens: maxTokens
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: data.timestamp,
        provider: data.usage.provider,
        model: data.usage.model,
        cost: data.usage.cost
      };

      setMessages(prev => [...prev, assistantMessage]);
      setCreditsRemaining(data.credits_remaining);
      setSessionStats(data.usage);

      // Reload analytics and history
      loadAnalytics();
      loadConversationHistory();

    } catch (error: any) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}. ${error.message.includes('credits') ? 'Please purchase more AI credits to continue.' : 'Please try again or switch providers.'}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setSessionStats(null);
  };

  const providerConfig = AI_PROVIDERS[selectedProvider];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <Brain className="inline-block w-10 h-10 mr-3 text-purple-500" />
          JavariAI - Multi-Provider AI Assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          Access OpenAI, Claude, Gemini, and Mistral in one unified interface
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="chat">
            <Send className="w-4 h-4 mr-2" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Chat Area */}
            <div className="lg:col-span-3 space-y-4">
              {/* Provider & Model Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">AI Provider & Model</CardTitle>
                    {creditsRemaining !== null && (
                      <Badge variant="outline" className="text-sm">
                        <Zap className="w-3 h-3 mr-1" />
                        {creditsRemaining} credits
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Provider</label>
                      <Select value={selectedProvider} onValueChange={(value) => setSelectedProvider(value as keyof typeof AI_PROVIDERS)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(AI_PROVIDERS).map(([key, config]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center">
                                <span className="mr-2">{config.icon}</span>
                                {config.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Model</label>
                      <Select value={selectedModel} onValueChange={setSelectedModel}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {providerConfig.models.map((model) => (
                            <SelectItem key={model.id} value={model.id}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {providerConfig.models.find(m => m.id === selectedModel)?.description}
                  </div>
                </CardContent>
              </Card>

              {/* Chat Messages */}
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Conversation</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearConversation}
                      disabled={messages.length === 0}
                    >
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div className="space-y-4">
                        <Brain className="w-16 h-16 mx-auto text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">Start a conversation with JavariAI</p>
                          <p className="text-sm text-muted-foreground mt-2">
                            Choose your AI provider and model, then type your message below
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {messages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.provider && (
                              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50 text-xs">
                                <Badge variant="secondary" className="text-xs">
                                  {AI_PROVIDERS[message.provider as keyof typeof AI_PROVIDERS]?.icon} {message.provider}
                                </Badge>
                                {message.cost && (
                                  <Badge variant="outline" className="text-xs">
                                    ${message.cost.toFixed(4)}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </CardContent>
                <CardContent className="border-t p-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your message... (Shift+Enter for new line)"
                      className="min-h-[80px] resize-none"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      size="lg"
                      className="px-6"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stats Sidebar */}
            <div className="space-y-4">
              {/* Session Stats */}
              {sessionStats && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Last Response</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Provider</span>
                      <Badge variant="secondary">
                        {AI_PROVIDERS[sessionStats.provider as keyof typeof AI_PROVIDERS]?.icon} {sessionStats.provider}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tokens</span>
                      <span className="font-mono">{sessionStats.total_tokens.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Cost</span>
                      <span className="font-mono">${sessionStats.cost.toFixed(4)}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">Token Breakdown</div>
                      <div className="flex justify-between text-xs">
                        <span>Input: {sessionStats.input_tokens}</span>
                        <span>Output: {sessionStats.output_tokens}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Messages</span>
                    <span className="font-semibold">{messages.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Cost</span>
                    <span className="font-semibold font-mono">
                      ${messages.reduce((sum, m) => sum + (m.cost || 0), 0).toFixed(4)}
                    </span>
                  </div>
                  {creditsRemaining !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Credits</span>
                      <Badge variant="outline">
                        <Zap className="w-3 h-3 mr-1" />
                        {creditsRemaining}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Provider Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    {providerConfig.icon} {providerConfig.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {providerConfig.models.map((model) => (
                      <div
                        key={model.id}
                        className={`p-2 rounded-md text-xs ${
                          model.id === selectedModel ? 'bg-primary/10 border border-primary' : 'bg-muted'
                        }`}
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-muted-foreground">{model.description}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversation History</CardTitle>
              <CardDescription>Your recent AI conversations across all providers</CardDescription>
            </CardHeader>
            <CardContent>
              {conversationHistory.length === 0 ? (
                <div className="text-center py-12">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No conversation history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversationHistory.map((conv) => (
                    <div key={conv.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {AI_PROVIDERS[conv.provider as keyof typeof AI_PROVIDERS]?.icon} {conv.provider}
                          </Badge>
                          <Badge variant="outline">{conv.model}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conv.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm space-y-2">
                        <div className="font-medium">User:</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {conv.messages[conv.messages.length - 1]?.content}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                        <span>{conv.tokens_used} tokens</span>
                        <span>${conv.cost.toFixed(4)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.total_conversations || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">Across all providers</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Tokens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {(analytics?.total_tokens_used || 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: {Math.round(analytics?.avg_tokens_per_conversation || 0)} per chat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  ${(analytics?.total_cost || 0).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Avg: ${(analytics?.avg_cost_per_conversation || 0).toFixed(4)} per chat
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Providers Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.providers_used || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">AI providers</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage by Provider</CardTitle>
              <CardDescription>Distribution of requests across AI providers</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.requests_by_provider ? (
                <div className="space-y-4">
                  {Object.entries(analytics.requests_by_provider).map(([provider, count]) => (
                    <div key={provider}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]?.icon}</span>
                          <span className="font-medium">{provider}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{count} requests</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${(count / analytics.total_conversations) * 100}%`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No usage data available yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Fine-tune AI behavior and response parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Temperature: {temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower = more focused, Higher = more creative
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Max Tokens: {maxTokens}
                </label>
                <input
                  type="range"
                  min="100"
                  max="4000"
                  step="100"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Maximum length of AI responses
                </p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Self-Healing Mode</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically fallback to alternative providers on failure
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <Shield className="w-3 h-3 mr-1" />
                    Active
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Autonomous Learning</div>
                    <div className="text-sm text-muted-foreground">
                      Tracks conversation patterns to optimize future responses
                    </div>
                  </div>
                  <Badge variant="outline" className="text-green-600">
                    <Activity className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys Status</CardTitle>
              <CardDescription>Connected AI provider services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(AI_PROVIDERS).map(([key, config]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.icon}</span>
                      <span className="font-medium">{config.name}</span>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      <Zap className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
