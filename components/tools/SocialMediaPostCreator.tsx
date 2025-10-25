'use client';

import { useState } from 'react';
import { Share2, Download, Copy, Check, Loader2, Sparkles } from 'lucide-react';

/**
 * Social Media Post Creator
 * Generate engaging social media content with AI
 * 
 * Features:
 * - Platform-specific optimization (Twitter, LinkedIn, Instagram, Facebook)
 * - Hashtag suggestions
 * - Emoji integration
 * - Multiple variations
 * - Character count
 * - Engagement tips
 * 
 * Session: 2025-10-25 - Saturday
 */

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter/X', maxChars: 280, icon: '𝕏' },
  { id: 'linkedin', name: 'LinkedIn', maxChars: 3000, icon: '💼' },
  { id: 'instagram', name: 'Instagram', maxChars: 2200, icon: '📸' },
  { id: 'facebook', name: 'Facebook', maxChars: 63206, icon: '👍' },
];

const TONES = [
  { id: 'professional', name: 'Professional', emoji: '💼' },
  { id: 'casual', name: 'Casual', emoji: '😊' },
  { id: 'enthusiastic', name: 'Enthusiastic', emoji: '🎉' },
  { id: 'informative', name: 'Informative', emoji: '📚' },
  { id: 'humorous', name: 'Humorous', emoji: '😄' },
  { id: 'inspirational', name: 'Inspirational', emoji: '✨' },
];

interface GeneratedPost {
  id: string;
  content: string;
  hashtags: string[];
  platform: string;
  tone: string;
}

export default function SocialMediaPostCreator() {
  const [topic, setTopic] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('twitter');
  const [selectedTone, setSelectedTone] = useState('professional');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setIsGenerating(true);

    try {
      const response = await fetch('/api/tools/social-media-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          platform: selectedPlatform,
          tone: selectedTone,
          include_hashtags: includeHashtags,
          include_emojis: includeEmojis,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate post');
      }

      const data = await response.json();

      const newPosts: GeneratedPost[] = data.posts.map((post: any, index: number) => ({
        id: `${Date.now()}_${index}`,
        content: post.content,
        hashtags: post.hashtags || [],
        platform: selectedPlatform,
        tone: selectedTone,
      }));

      setGeneratedPosts(newPosts);

    } catch (error) {
      console.error('Error generating post:', error);
      alert('Failed to generate post. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const platform = PLATFORMS.find(p => p.id === selectedPlatform);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Social Media Post Creator</h1>
              <p className="text-slate-600 dark:text-slate-400">Generate engaging content for any platform</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Topic Input */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">What's Your Post About?</h3>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Launching a new product, sharing industry insights, promoting an event..."
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
            </div>

            {/* Platform Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Platform</h3>
              <div className="grid grid-cols-2 gap-3">
                {PLATFORMS.map(plat => (
                  <button
                    key={plat.id}
                    onClick={() => setSelectedPlatform(plat.id)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedPlatform === plat.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{plat.icon}</div>
                    <p className="font-medium text-sm text-slate-900 dark:text-white">{plat.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{plat.maxChars} chars</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selection */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Tone</h3>
              <div className="grid grid-cols-3 gap-2">
                {TONES.map(tone => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={`p-3 rounded-lg text-center transition-all ${
                      selectedTone === tone.id
                        ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                        : 'bg-slate-50 dark:bg-slate-900 border-2 border-transparent hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{tone.emoji}</div>
                    <p className="text-xs font-medium text-slate-900 dark:text-white">{tone.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Options</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={(e) => setIncludeHashtags(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Include hashtags</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={(e) => setIncludeEmojis(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-700 dark:text-slate-300">Include emojis</span>
                </label>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Posts...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Posts
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedPosts.length > 0 ? (
              generatedPosts.map(post => (
                <div key={post.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">
                          {PLATFORMS.find(p => p.id === post.platform)?.icon}
                        </span>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {PLATFORMS.find(p => p.id === post.platform)?.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {post.content.length} / {platform?.maxChars} chars
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">
                      {post.content}
                    </p>

                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.hashtags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-sm"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => copyToClipboard(post.content + '\n\n' + post.hashtags.map(t => '#' + t).join(' '), post.id)}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        {copiedId === post.id ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Post
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-12 text-center">
                <Share2 className="w-16 h-16 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  No Posts Yet
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter a topic and generate your first social media post
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
