'use client'

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <nav className="hidden md:flex gap-6">
              <a href="/apps" className="text-gray-600 hover:text-blue-600 font-semibold">Apps</a>
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
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            60+ Creative Apps
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Everything you need to build your digital empire. All powered by AI.
          </p>
        </div>
      </section>

      {/* Apps Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">All Apps & Tools</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="font-bold text-lg mb-2">Website Builder</h3>
              <p className="text-gray-600 text-sm">Create stunning websites</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="font-bold text-lg mb-2">Logo Maker</h3>
              <p className="text-gray-600 text-sm">Design your brand identity</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="font-bold text-lg mb-2">Content Writer</h3>
              <p className="text-gray-600 text-sm">AI-powered content creation</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🎬</div>
              <h3 className="font-bold text-lg mb-2">Video Editor</h3>
              <p className="text-gray-600 text-sm">Professional video editing</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className="font-bold text-lg mb-2">Image Generator</h3>
              <p className="text-gray-600 text-sm">AI art and images</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="font-bold text-lg mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">Track your success</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-bold text-lg mb-2">Business Tools</h3>
              <p className="text-gray-600 text-sm">Complete business suite</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🎵</div>
              <h3 className="font-bold text-lg mb-2">Music Maker</h3>
              <p className="text-gray-600 text-sm">Create original music</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-bold text-lg mb-2">App Builder</h3>
              <p className="text-gray-600 text-sm">Build mobile apps</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="font-bold text-lg mb-2">Game Creator</h3>
              <p className="text-gray-600 text-sm">Make your own games</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📧</div>
              <h3 className="font-bold text-lg mb-2">Email Marketing</h3>
              <p className="text-gray-600 text-sm">Campaign management</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🛒</div>
              <h3 className="font-bold text-lg mb-2">E-commerce</h3>
              <p className="text-gray-600 text-sm">Online store builder</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="font-bold text-lg mb-2">Photo Editor</h3>
              <p className="text-gray-600 text-sm">Professional editing</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">🎤</div>
              <h3 className="font-bold text-lg mb-2">Podcast Studio</h3>
              <p className="text-gray-600 text-sm">Create podcasts</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">📚</div>
              <h3 className="font-bold text-lg mb-2">Course Creator</h3>
              <p className="text-gray-600 text-sm">Build online courses</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="font-bold text-lg mb-2">Chatbot Builder</h3>
              <p className="text-gray-600 text-sm">AI chatbots</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Creating?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get access to all 60+ apps with any paid plan
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
