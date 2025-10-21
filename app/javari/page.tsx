export default function JavariPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <a href="/" className="text-gray-600 hover:text-blue-600">← Back to Home</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Meet JavariAI
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your AI builder that turns ideas into reality through conversation
          </p>
          
            href="/signup"
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block"
          >
            Start Building Free
          </a>
        </div>
      </section>

      {/* What JavariAI Does */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">What Can JavariAI Build?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-2">Websites</h3>
              <p className="text-gray-600">Complete websites with responsive design, animations, and functionality</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Apps</h3>
              <p className="text-gray-600">Web and mobile applications with databases and user authentication</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-bold mb-2">Games</h3>
              <p className="text-gray-600">Interactive games from puzzles to multiplayer experiences</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">Logos & Graphics</h3>
              <p className="text-gray-600">Professional logos, brand identities, and marketing materials</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-bold mb-2">Videos</h3>
              <p className="text-gray-600">Animated videos, presentations, and motion graphics</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-2">Business Tools</h3>
              <p className="text-gray-600">Dashboards, analytics, CRM systems, and automation tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tell JavariAI What You Need</h3>
                <p className="text-gray-600">Simply describe your project in plain English. "Build me a restaurant website" or "Create a todo app"</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">JavariAI Asks Questions</h3>
                <p className="text-gray-600">JavariAI will ask about your preferences, features, colors, and functionality to understand exactly what you want</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Watch It Build in Real-Time</h3>
                <p className="text-gray-600">JavariAI creates your project right in front of you, showing previews and explaining each step</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Iterate & Download</h3>
                <p className="text-gray-600">Request changes, add features, then download your complete project with full code ownership</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Building?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Get 50 free credits when you sign up. No credit card required.
          </p>
          
            href="/signup"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition inline-block"
          >
            Start Free Now
          </a>
        </div>
      </section>
    </div>
  )
}
