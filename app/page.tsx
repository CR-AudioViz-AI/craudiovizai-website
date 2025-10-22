'use client'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <nav className="hidden md:flex gap-6">
              <a href="/apps" className="text-gray-600 hover:text-blue-600">Apps</a>
              <a href="/games" className="text-gray-600 hover:text-blue-600">Games</a>
              <a href="/craiverse" className="text-gray-600 hover:text-blue-600">CRAIverse</a>
              <a href="/pricing" className="text-gray-600 hover:text-blue-600">Pricing</a>
            </nav>
            <div className="flex gap-3">
              <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
              <a href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Sign Up</a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Story. Our Design.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Build websites, apps, and games with AI-powered tools. No coding required.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition">
              Get Started Free
            </a>
            <a href="/pricing" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-blue-600 transition">
              View Pricing
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Everything You Need to Create</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">60+ Creative Tools</h3>
              <p className="text-gray-600">Website builders, logo makers, video editors, and more</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-3">1,200+ Games</h3>
              <p className="text-gray-600">Instant access to our complete game library</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">5 AI Avatars</h3>
              <p className="text-gray-600">JavariAI, CRAI, Kairo, Pulse, and Scout guide you</p>
            </div>
          </div>
        </div>
      </section>

      {/* CRAIverse Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Enter CRAIverse</h2>
            <p className="text-xl text-gray-600 mb-8">
              A virtual world built for connection and social impact. Free avatar, virtual home, and car included.
            </p>
            <a href="/craiverse" className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition inline-block">
              Explore CRAIverse
            </a>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <p className="text-4xl font-bold mb-4">$0<span className="text-lg text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>100 credits/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Basic tools access</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>CRAIverse membership</span>
                </li>
              </ul>
              <a href="/signup" className="block w-full bg-gray-200 text-center py-3 rounded-lg font-bold hover:bg-gray-300 transition">
                Start Free
              </a>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg transform scale-105">
              <div className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-full text-sm font-bold inline-block mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <p className="text-4xl font-bold mb-4">$29<span className="text-lg opacity-90">/mo</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>10,000 credits/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>All tools & games</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <a href="/signup" className="block w-full bg-white text-blue-600 text-center py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                Start Pro
              </a>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
              <p className="text-4xl font-bold mb-4">$299<span className="text-lg text-gray-600">/mo</span></p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Unlimited credits</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>White-label options</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
              <a href="/contact" className="block w-full bg-gray-900 text-white text-center py-3 rounded-lg font-bold hover:bg-gray-800 transition">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Creating?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of creators building their dreams with CR AudioViz AI
          </p>
          <a href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block">
            Get Started Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CR AudioViz AI</h3>
              <p className="text-gray-400">Your story. Our design. Build the future with AI.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="/apps" className="text-gray-400 hover:text-white">Apps</a></li>
                <li><a href="/games" className="text-gray-400 hover:text-white">Games</a></li>
                <li><a href="/craiverse" className="text-gray-400 hover:text-white">CRAIverse</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CR AudioViz AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
