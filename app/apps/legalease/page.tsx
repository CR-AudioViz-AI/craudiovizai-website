'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { deductCredits } from '@/lib/credits'

export default function LegalEaseApp() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/signin?redirect=/apps/legalease')
        return
      }

      const handleMessage = async (event: MessageEvent) => {
        // Verify origin in production
        const legalEaseUrl = process.env.NEXT_PUBLIC_LEGALEASE_URL || 'https://crav-legalease.vercel.app'
        
        if (process.env.NODE_ENV === 'production' && event.origin !== legalEaseUrl) {
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
            }, legalEaseUrl)
            setIsReady(true)
            break

          case 'REQUEST_AUTH':
            // Re-send auth if requested
            iframeRef.current?.contentWindow?.postMessage({
              type: 'AUTH_TOKEN',
              payload: {
                userId: session.user.id,
                sessionToken: session.access_token,
              }
            }, legalEaseUrl)
            break

          case 'CREDIT_CHECK':
            // Get current credit balance
            const { data: profile } = await supabase
              .from('profiles')
              .select('credits_balance')
              .eq('id', payload.userId)
              .single()

            iframeRef.current?.contentWindow?.postMessage({
              type: 'CREDIT_UPDATE',
              payload: {
                balance: profile?.credits_balance || 0
              }
            }, legalEaseUrl)
            break

          case 'CREDIT_DEDUCT':
            // Deduct credits
            try {
              await deductCredits(
                payload.userId, 
                payload.amount, 
                payload.description
              )

              // Get new balance
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('credits_balance')
                .eq('id', payload.userId)
                .single()

              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_UPDATE',
                payload: {
                  success: true,
                  newBalance: updatedProfile?.credits_balance || 0
                }
              }, legalEaseUrl)
            } catch (error) {
              console.error('Credit deduction failed:', error)
              iframeRef.current?.contentWindow?.postMessage({
                type: 'CREDIT_UPDATE',
                payload: {
                  success: false,
                  error: 'Insufficient credits'
                }
              }, legalEaseUrl)
            }
            break

          case 'NAVIGATE':
            // Navigate parent window
            router.push(payload.path)
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
  }, [router, supabase])

  const legalEaseUrl = process.env.NEXT_PUBLIC_LEGALEASE_URL || 'https://crav-legalease.vercel.app'

  return (
    <div className="h-screen w-full bg-gray-50">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading LegalEase AI...</p>
            <p className="text-gray-500 text-sm mt-2">Connecting to secure environment</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={`${legalEaseUrl}/embedded`}
        className="w-full h-full border-0"
        allow="clipboard-read; clipboard-write"
        title="LegalEase AI"
      />
    </div>
  )
}
