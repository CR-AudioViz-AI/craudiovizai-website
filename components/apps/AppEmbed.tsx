'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AppEmbedProps {
  src: string;
  title: string;
  description: string;
  icon: string;
}

export function AppEmbed({ src, title, description, icon }: AppEmbedProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Reset loading state when src changes
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleBack = () => {
    router.push('/apps');
  };

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button + App Info */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Apps
              </Button>
              
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </div>

            {/* Right: Fullscreen Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleFullscreen}
              className="hover:bg-gray-100"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </Button>
          </div>

          {/* Mobile: App Title */}
          <div className="sm:hidden mt-3 flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <h1 className="text-base font-semibold text-gray-900">{title}</h1>
          </div>
        </div>
      </header>

      {/* App Container */}
      <main className="flex-1 relative bg-gray-100">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading {title}...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-white flex items-center justify-center p-8 z-10">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">Failed to load {title}</p>
                <p className="text-sm mb-4">
                  The app could not be loaded. This might be due to network issues or the app being temporarily unavailable.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => window.location.reload()}
                    variant="outline"
                  >
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleBack}
                  >
                    Back to Apps
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Iframe */}
        <iframe
          src={src}
          title={title}
          className="w-full h-full border-0"
          style={{
            height: isFullscreen ? '100vh' : 'calc(100vh - 100px)',
            minHeight: '600px',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
      </main>

      {/* Footer - Only show when not fullscreen */}
      {!isFullscreen && (
        <footer className="bg-white border-t border-gray-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>
                Powered by <span className="font-semibold text-blue-600">CR AudioViz AI</span>
              </p>
              <p className="hidden sm:block">
                Your Story. Our Design.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
