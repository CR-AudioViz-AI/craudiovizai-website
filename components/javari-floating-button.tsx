'use client';

// CR AudioViz AI - Javari Floating Button
// Always-visible floating button to open Javari
// Version: 1.0 - Complete Integration

import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useJavari } from '@/contexts/javari-context';

export default function JavariFloatingButton() {
  const { isOpen, openJavari } = useJavari();
  const [isHovered, setIsHovered] = useState(false);

  // Don't show if chat is already open
  if (isOpen) return null;

  return (
    <button
      onClick={openJavari}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center text-white z-40 hover:scale-110 animate-pulse hover:animate-none"
      aria-label="Chat with Javari AI"
    >
      <MessageSquare className="w-6 h-6" />
      
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap shadow-xl">
          Chat with Javari AI
          <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Ping animation */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75 animate-ping"></span>
    </button>
  );
}
