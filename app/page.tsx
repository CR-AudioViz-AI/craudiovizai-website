export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Your Story. Our Design.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            The unified AI ecosystem where everyone can create, connect, and succeed
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            
              href="/signup"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
            >
              Start Free
            </a>
            
              href="/javari"
              className="border-2 border-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition"
            >
              Meet JavariAI
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Everything You Need</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-2xl font-bold mb-3">60+ Creative Tools</h3>
              <p className="text-gray-600">Build websites, apps, logos, videos, and more</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold mb-3">JavariAI Assistant</h3>
              <p className="text-gray-600">Your AI partner that builds what you imagine</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-2xl font-bold mb-3">CRAIverse World</h3>
              <p className="text-gray-600">Connect with communities and causes you care about</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Simple, Fair Pricing</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6"><span className="font-bold">50 credits</span> welcome bonus</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span>✓</span><span>Access to all tools</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>Community support</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>Build & export</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 transition">
                Get Started
              </a>
            </div>

            {/* Starter */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">$19<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6"><span className="font-bold">200 credits</span>/month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span>✓</span><span>Everything in Free</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>Priority support</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>No ads</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition">
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-xl border-4 border-blue-400 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$49<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6"><span className="font-bold">750 credits</span>/month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span>✓</span><span>Everything in Starter</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>70/30 marketplace</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>API access</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-white text-blue-600 hover:bg-gray-100 transition">
                Get Started
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">$149<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6"><span className="font-bold">3000 credits</span>/month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2"><span>✓</span><span>Everything in Pro</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>White label</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>Dedicated support</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-gray-900 text-white hover:bg-gray-800 transition">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">CR AudioViz AI</h3>
          <p className="text-gray-400 mb-4">Your Story. Our Design.</p>
          <p className="text-gray-500 text-sm">© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
