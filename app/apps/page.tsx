'use client'

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <a href="/" className="text-gray-600 hover:text-blue-600">← Back to Home</a>
          </div>
        </div>
      </header>

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

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">All Apps & Tools</h2>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { icon: '🌐', name: 'Website Builder', desc: 'Create stunning websites' },
              { icon: '🎨', name: 'Logo Maker', desc: 'Design your brand identity' },
              { icon: '📝', name: 'Content Writer', desc: 'AI-powered content creation' },
              { icon: '🎬', name: 'Video Editor', desc: 'Professional video editing' },
              { icon: '🖼️', name: 'Image Generator', desc: 'AI art and images' },
              { icon: '📊', name: 'Analytics', desc: 'Track your success' },
              { icon: '💼', name: 'Business Tools', desc: 'Complete business suite' },
              { icon: '🎵', name: 'Music Maker', desc: 'Create original music' },
              { icon: '📱', name: 'App Builder', desc: 'Build mobile apps' },
              { icon: '🎮', name: 'Game Creator', desc: 'Make your own games' },
              { icon: '📧', name: 'Email Marketing', desc: 'Campaign management' },
              { icon: '🛒', name: 'E-commerce', desc: 'Online store builder' },
              { icon: '📸', name: 'Photo Editor', desc: 'Professional editing' },
              { icon: '🎤', name: 'Podcast Studio', desc: 'Create podcasts' },
              { icon: '📚', name: 'Course Creator', desc: 'Build online courses' },
              { icon: '💬', name: 'Chatbot Builder', desc: 'AI chatbots' }
            ].map((app, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition cursor-pointer">
                <div className="text-5xl mb-4">{app.icon}</div>
                <h3 className="font-bold text-lg mb-2">{app.name}</h3>
                <p className="text-gray-600 text-sm">{app.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  )
}
