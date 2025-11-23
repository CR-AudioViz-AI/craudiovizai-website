'use client';

// CR AudioViz AI - Javari AI Page
// Full-page Javari AI interface with native integration
// Version: 2.0 - Complete Native Integration

import JavariChatInterface from '@/components/javari-chat-interface';

export default function JavariAIPage() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      <JavariChatInterface mode="fullpage" />
    </div>
  );
}
