'use client'

import { useState, useEffect } from 'react'
import { FileText, Sparkles, Download, Save, AlertCircle } from 'lucide-react'
import GlobalHeader from '@/components/GlobalHeader'
import CRRotatingBar from '@/components/CRRotatingBar'
import CreditsBar from '@/components/CreditsBar'
import { createSupabaseBrowserClient } from '@/lib/supabase-client'

export default function PDFBuilderAppPage() {
  const [user, setUser] = useState<any>(null)
  const [embedUrl, setEmbedUrl] = useState<string>('')

  useEffect(() => {
    checkAuthAndBuildUrl()
  }, [])

  async function checkAuthAndBuildUrl() {
    const supabase = createSupabaseBrowserClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (user) {
      setUser(user)
      
      // Get session token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Build iframe URL with auth token
        const appUrl = process.env.NEXT_PUBLIC_PDF_BUILDER_URL || 'https://crav-pdf-builder.vercel.app'
        setEmbedUrl(`${appUrl}/embed?token=${session.access_token}`)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Global Header (2 rows) */}
      <GlobalHeader />

      {/* CR= Rotating Bar */}
      <CRRotatingBar />

      {/* Credits Bar (only when logged in) */}
      {user && <CreditsBar />}

      {/* App Description Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start space-x-4">
            
            {/* App Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* App Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                PDF Builder Pro
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                Create professional PDFs with AI-powered content generation. Build business proposals, technical reports, creative portfolios, resumes, and more with our intuitive drag-and-drop editor.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">
                    <strong className="text-blue-600">5 credits</strong> per save
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">
                    <strong className="text-green-600">Free</strong> PDF exports
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700">
                    AI content generation
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span className="text-gray-700">
                    Professional templates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded App (iframe) */}
      <div className="flex-1 relative">
        {user && embedUrl ? (
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0"
            title="PDF Builder Pro"
            allow="clipboard-write"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center max-w-md p-8">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Login Required
              </h2>
              <p className="text-gray-600 mb-6">
                Please log in to access PDF Builder Pro and start creating professional documents.
              </p>
              <a
                href="/login?redirect=/apps/pdf-builder"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                <span>Log In</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
