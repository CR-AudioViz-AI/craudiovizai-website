'use client';

// CR AudioViz AI - Enhanced Javari Widget
// Floating chat widget with expandable interface
// Version: 1.0 - Complete Integration

import React from 'react';
import { useJavari } from '@/contexts/javari-context';
import JavariChatInterface from './javari-chat-interface';

export default function JavariWidget() {
  const { isOpen, toggleJavari } = useJavari();

  if (isOpen) {
    return <JavariChatInterface mode="widget" />;
  }

  // When closed, show nothing (the interface handles its own button when minimized)
  return null;
}
