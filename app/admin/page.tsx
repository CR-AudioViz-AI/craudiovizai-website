'use client';

import { useEffect } from 'react';
import { Shield, Loader2, ExternalLink } from 'lucide-react';

export default function AdminRedirectPage() {
  const ADMIN_DASHBOARD_URL = 'https://craudiovizai-admin-dashboard.vercel.app/dashboard';

  useEffect(() => {
    // Redirect to the actual admin dashboard
    window.location.href = ADMIN_DASHBOARD_URL;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-white" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Admin Dashboard
        </h1>
        
        <p className="text-gray-600 mb-6">
          Redirecting you to the CR AudioViz AI Admin Dashboard...
        </p>
        
        <div className="flex items-center justify-center gap-2 text-purple-600 mb-6">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Loading dashboard...</span>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-4">
            If you are not redirected automatically:
          </p>
          <a 
            href={ADMIN_DASHBOARD_URL}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            <span>Open Admin Dashboard</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
