'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the actual admin dashboard
    // This can be changed to a subdomain once DNS is configured
    window.location.href = 'https://craudiovizai-admin-dashboard.vercel.app/dashboard'
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-6">
          <Shield className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Redirecting to Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Please wait while we connect you to the admin portal...
        </p>
        <div className="flex items-center justify-center gap-2 text-purple-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading...</span>
        </div>
        <p className="mt-8 text-sm text-gray-500">
          If you're not redirected automatically,{' '}
          <a 
            href="https://craudiovizai-admin-dashboard.vercel.app/dashboard"
            className="text-purple-600 hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  )
}
