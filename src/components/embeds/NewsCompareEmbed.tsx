// CR AudioViz AI - News Compare Embed Component
// Add this to your main admin dashboard

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ExternalLink, RefreshCw } from 'lucide-react';

interface NewsCompareEmbedProps {
  defaultExpanded?: boolean;
  showControls?: boolean;
}

export function NewsCompareEmbed({ 
  defaultExpanded = false, 
  showControls = true 
}: NewsCompareEmbedProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isLoading, setIsLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const NEWS_APP_URL = "https://crav-news-compare-quvy77mmj-roy-hendersons-projects-1d3d5e94.vercel.app";

  // Handle messages from embedded app
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.source === 'crav-news-compare') {
        console.log('[NewsCompare Event]', event.data);
        
        // Handle specific events
        switch (event.data.type) {
          case 'article-saved':
            console.log('Article saved:', event.data.payload);
            break;
          case 'comparison-created':
            console.log('Comparison created:', event.data.payload);
            break;
          case 'expand-request':
            setIsExpanded(true);
            break;
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send message to embedded app
  const sendMessage = (type: string, payload?: any) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        source: 'crav-admin',
        type,
        payload
      }, '*');
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(NEWS_APP_URL, '_blank');
  };

  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-background">
        <div className="h-full flex flex-col">
          {/* Header Controls */}
          {showControls && (
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">News Comparison Platform</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRefresh}
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleOpenExternal}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(false)}
                  title="Minimize"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Iframe */}
          <div className="flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading news platform...</p>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={`${NEWS_APP_URL}?embedded=true&mode=dashboard`}
              className="w-full h-full border-0"
              title="News Comparison Platform"
              onLoad={() => setIsLoading(false)}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    );
  }

  // Compact card view
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          News Comparison
        </CardTitle>
        {showControls && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              title="Refresh"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleOpenExternal}
              title="Open in new tab"
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(true)}
              title="Expand"
            >
              <Maximize2 className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full h-[300px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <RefreshCw className="h-6 w-6 animate-spin" />
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={`${NEWS_APP_URL}?embedded=true&mode=card`}
            className="w-full h-full border-0"
            title="News Comparison"
            onLoad={() => setIsLoading(false)}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Usage Example 1: Grid Layout
export function DashboardWithNewsCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {/* Other dashboard cards */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Analytics content */}
        </CardContent>
      </Card>

      {/* News Comparison Card */}
      <NewsCompareEmbed showControls={true} />

      {/* More dashboard cards */}
    </div>
  );
}

// Usage Example 2: Dedicated Page
export function NewsComparePage() {
  return (
    <div className="container mx-auto p-4">
      <NewsCompareEmbed 
        defaultExpanded={true} 
        showControls={true} 
      />
    </div>
  );
}

// Usage Example 3: Modal/Dialog
export function NewsCompareModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 z-50 bg-background border rounded-lg shadow-lg">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">News Comparison</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Minimize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1">
            <iframe
              src="https://crav-news-compare-quvy77mmj-roy-hendersons-projects-1d3d5e94.vercel.app?embedded=true&mode=dashboard"
              className="w-full h-full border-0"
              title="News Comparison"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsCompareEmbed;
