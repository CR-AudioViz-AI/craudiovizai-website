'use client';

import { useState } from 'react';
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react';

export default function JavariWidget() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-white z-50"
        aria-label="Open Javari AI Assistant"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className={`fixed ${minimized ? 'bottom-6 right-6' : 'bottom-6 right-6'} z-50 transition-all ${minimized ? 'w-80 h-14' : 'w-96 h-[600px]'} max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]`}>
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <h3 className="font-semibold">Javari AI</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMinimized(!minimized)}
              className="hover:bg-white/20 p-1 rounded"
              aria-label={minimized ? 'Maximize' : 'Minimize'}
            >
              {minimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="hover:bg-white/20 p-1 rounded"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* iframe */}
        {!minimized && (
          <iframe
            src="https://crav-javari.vercel.app"
            className="flex-1 w-full border-0"
            title="Javari AI Assistant"
            allow="clipboard-write"
          />
        )}
      </div>
    </div>
  );
}
