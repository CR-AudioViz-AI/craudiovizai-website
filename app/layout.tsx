import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CR AudioViz AI - Your Story. Our Design.',
  description: 'Unified AI-powered platform for creators, businesses, and communities',
  keywords: 'AI, creative tools, business tools, JavariAI, CRAIverse',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="border-b bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center gap-8">
                <a href="/" className="text-2xl font-bold text-blue-600">
                  CR AudioViz AI
                </a>
                <div className="hidden md:flex gap-6">
                  <a href="/javari" className="text-gray-700 hover:text-blue-600">JavariAI</a>
                  <a href="/craiverse" className="text-gray-700 hover:text-blue-600">CRAIverse</a>
                  <a href="/pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
                  <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="/login" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  Sign In
                </a>
                <a href="/signup" className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg">
                  Start Free
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t bg-gray-50 mt-20">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">CR AudioViz AI</h3>
                <p className="text-gray-600 text-sm">
                  Your Story. Our Design.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Products</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/javari">JavariAI</a></li>
                  <li><a href="/craiverse">CRAIverse</a></li>
                  <li><a href="/tools">Creative Tools</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                  <li><a href="/careers">Careers</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/privacy">Privacy</a></li>
                  <li><a href="/terms">Terms</a></li>
                  <li><a href="/ownership">Ownership</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
              © 2025 CR AudioViz AI, LLC. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
