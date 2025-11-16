'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle, ArrowLeft, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function EbookCreatorApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const supabase = createClient()
  const router = useRouter()

  const APP_URL = process.env.NEXT_PUBLIC_EBOOK_URL || 'https://crav-ebook-creator.vercel.app'
  const CREDIT_COST = 8

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin?redirect=/apps/ebook-creator')
        return
      }

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
          return
        }

        if (!mounted) return

        const { type } = event.data

        switch (type) {
          case 'READY':
            iframeRef.current?.contentWindow?.postMessage({
              type: 'AUTH_TOKEN',
              payload: {
                userId: session.user.id,
                sessionToken: session.access_token,
              }
            }, APP_URL)
            setIsLoading(false)
            break

          case 'GENERATE_EBOOK':
            const { data: currentUser } = await supabase
              .from('user_profiles')
              .select('credits')
              .eq('id', session.user.id)
              .single()

            const currentCredits = currentUser?.credits || 0

            if (currentCredits < CREDIT_COST) {
              iframeRef.current?.contentWindow?.postMessage({
                type: 'INSUFFICIENT_CREDITS',
                payload: { required: CREDIT_COST, available: currentCredits }
              }, APP_URL)
              return
            }

            const { error: deductError } = await supabase
              .from('user_profiles')
              .update({ credits: currentCredits - CREDIT_COST })
              .eq('id', session.user.id)

            if (!deductError) {
              await supabase
                .from('credit_transactions')
                .insert({
                  user_id: session.user.id,
                  amount: -CREDIT_COST,
                  app_name: 'eBook Creator',
                  description: 'eBook generation',
                  created_at: new Date().toISOString()
                })

              setCredits(currentCredits - CREDIT_COST)

              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDITS_DEDUCTED',
                payload: { remaining: currentCredits - CREDIT_COST }
              }, APP_URL)
            }
            break

          case 'ERROR':
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

  return (
    <div className={`flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'min-h-screen bg-gray-50'}`}>
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/apps')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Apps
              </Button>
              
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-2xl">📚</span>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">eBook Creator</h1>
                  <p className="text-sm text-gray-600">
                    {credits !== null ? `${credits} credits` : 'Loading...'} • {CREDIT_COST} per book
                  </p>
                </div>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize2 className="w-4 h-4 mr-2" /> : <Maximize2 className="w-4 h-4 mr-2" />}
              <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 bg-white flex flex-col items-center justify-center z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading eBook Creator...</p>
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 bg-white flex items-center justify-center p-8 z-10">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                <p className="font-semibold mb-2">Failed to load eBook Creator</p>
                <Button size="sm" onClick={() => window.location.reload()} variant="outline" className="mr-2">
                  Retry
                </Button>
                <Button size="sm" onClick={() => router.push('/apps')}>
                  Back to Apps
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={APP_URL}
          title="eBook Creator"
          className="w-full h-full border-0"
          style={{ height: isFullscreen ? '100vh' : 'calc(100vh - 120px)', minHeight: '600px' }}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
        />
      </main>

      {!isFullscreen && (
        <footer className="bg-white border-t border-gray-200 py-3">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <p>Powered by <span className="font-semibold text-blue-600">CR AudioViz AI</span></p>
              <p className="hidden sm:block">Your Story. Our Design.</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
