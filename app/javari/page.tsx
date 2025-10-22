'use client'

export default function JavariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-teal-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🤖</div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Meet JavariAI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your AI master builder. Just tell Javari what you want to create, and watch it come to life.
          </p>
          <a href="/signup" className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block">
            Start Building with Javari
          </a>
        </div>
      </section>

      {/* What Javari Does */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Can Javari Build?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-3">Websites</h3>
              <p className="text-gray-600">Full-featured websites with custom design, responsive layouts, and modern functionality</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-3">Mobile Apps</h3>
              <p className="text-gray-600">iOS and Android apps with native features and beautiful interfaces</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-3">Games</h3>
              <p className="text-gray-600">Interactive games with physics, scoring, multiplayer, and more</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="text-xl font-bold mb-3">E-commerce Stores</h3>
              <p className="text-gray-600">Complete online stores with payment processing and inventory management</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">Business Tools</h3>
              <p className="text-gray-600">CRMs, dashboards, analytics tools, and workflow automation</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-3">Creative Tools</h3>
              <p className="text-gray-600">Design tools, editors, generators, and content creation apps</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How Javari Works</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tell Javari What You Want</h3>
                <p className="text-gray-600">Describe your project in plain English. "I need a restaurant website with online ordering"</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Javari Asks Questions</h3>
                <p className="text-gray-600">Like a real developer, Javari asks clarifying questions to understand your vision</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Watch It Build</h3>
                <p className="text-gray-600">Javari writes code, designs interfaces, and builds your project in real-time</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Launch & Own It</h3>
                <p className="text-gray-600">Deploy instantly or export the code. You own everything 100%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Javari is Different</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex gap-4">
              <div className="text-3xl">💬</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Conversational Building</h3>
                <p className="text-gray-600">Talk to Javari like you would a developer. No technical jargon required.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">⚡</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Real-Time Preview</h3>
                <p className="text-gray-600">See your project come to life as Javari builds it.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Unlimited Revisions</h3>
                <p className="text-gray-600">Ask Javari to change anything, anytime. Iterate until perfect.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-3xl">📦</div>
              <div>
                <h3 className="font-bold text-lg mb-2">Full Code Export</h3>
                <p className="text-gray-600">Own your code completely. Host anywhere you want.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Build with Javari?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start creating professional websites, apps, and games today. No coding skills required.
          </p>
          <a href="/signup" className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block">
            Start Building Free
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
