'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function PDFBuilderApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const APP_URL = process.env.NEXT_PUBLIC_PDF_BUILDER_URL || 'https://crav-pdf-builder.vercel.app'
  const CREDIT_COST = 5 // 5 credits per PDF generation

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin?redirect=/apps/pdf-builder')
        return
      }

      // Fetch user credits
      const { data: userData } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single()

      if (mounted && userData) {
        setCredits(userData.credits || 0)
      }

      const handleMessage = async (event: MessageEvent) => {
        if (process.env.NODE_ENV === 'production' && event.origin !== APP_URL) {
          console.warn('Rejected message from:', event.origin)
          return
        }

        if (!mounted) return

        const { type, payload } = event.data

        switch (type) {
          case 'READY':
            // Send auth token to embedded app
            iframeRef.current?.contentWindow?.postMessage({
              type: 'AUTH_TOKEN',
              payload: {
                userId: session.user.id,
                sessionToken: session.access_token,
              }
            }, APP_URL)
            setIsReady(true)
            setIsLoading(false)
            break

          case 'GENERATE_PDF':
            // Deduct credits before allowing PDF generation
            const { data: currentUser } = await supabase
              .from('user_profiles')
              .select('credits')
              .eq('id', session.user.id)
              .single()

            const currentCredits = currentUser?.credits || 0

            if (currentCredits < CREDIT_COST) {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'INSUFFICIENT_CREDITS',
                payload: {
                  required: CREDIT_COST,
                  available: currentCredits
                }
              }, APP_URL)
              return
            }

            // Deduct credits
            const { error: deductError } = await supabase
              .from('user_profiles')
              .update({ credits: currentCredits - CREDIT_COST })
              .eq('id', session.user.id)

            if (deductError) {
              console.error('Credit deduction error:', deductError)
              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_ERROR',
                payload: { error: 'Failed to deduct credits' }
              }, APP_URL)
              return
            }

            // Log transaction
            await supabase
              .from('credit_transactions')
              .insert({
                user_id: session.user.id,
                amount: -CREDIT_COST,
                app_name: 'PDF Builder',
                description: 'PDF generation',
                created_at: new Date().toISOString()
              })

            // Update local credits display
            setCredits(currentCredits - CREDIT_COST)

            // Allow PDF generation
            iframeRef.current?.contentWindow?.postMessage({
              type: 'CREDITS_DEDUCTED',
              payload: {
                remaining: currentCredits - CREDIT_COST
              }
            }, APP_URL)
            break

          case 'ERROR':
            console.error('App error:', payload)
            setHasError(true)
            break
        }
      }

      window.addEventListener('message', handleMessage)
      return () => {
        mounted = false
        window.removeEventListener('message', handleMessage)
      }
    }

    checkAuth()
  }, [supabase, router])

  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  const handleIframeError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleBack = () => {
    router.push('/apps')
  }

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
                <span className="text-2xl">📄</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">PDF Builder Pro</h1>
                  <p className="text-sm text-gray-600">
                    {credits !== null ? `${credits} credits available` : 'Loading credits...'}
                    {' • '}
                    <span className="text-blue-600 font-medium">{CREDIT_COST} credits per PDF</span>
                  </p>
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
          <div className="sm:hidden mt-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">📄</span>
              <h1 className="text-base font-semibold text-gray-900">PDF Builder Pro</h1>
            </div>
            <p className="text-sm text-gray-600">
              {credits !== null ? `${credits} credits` : 'Loading...'} • {CREDIT_COST} per PDF
            </p>
          </div>
        </div>
      </header>

      {/* App Container */}
      <main className="flex-1 relative bg-gray-100">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading PDF Builder...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 bg-white flex items-center justify-center p-8 z-10">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">Failed to load PDF Builder</p>
                <p className="text-sm mb-4">
                  The app could not be loaded. Please try again or contact support if the problem persists.
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
          ref={iframeRef}
          src={APP_URL}
          title="PDF Builder Pro"
          className="w-full h-full border-0"
          style={{
            height: isFullscreen ? '100vh' : 'calc(100vh - 120px)',
            minHeight: '600px',
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
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
  )
}
