'use client'

function ModuleCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

export default function CRAIversePage() {
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

      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Welcome to CRAIverse
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            A virtual world built for connection, support, and social impact
          </p>
          <a href="/signup" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition inline-block">
            Enter CRAIverse Free
          </a>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">What is CRAIverse?</h2>
            <p className="text-xl text-gray-600">
              CRAIverse is more than a virtual world—it's a platform for meaningful connections. 
              Every user gets a free avatar, virtual car, and house in a community designed to 
              bring people together around causes that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">👤</div>
              <h3 className="text-xl font-bold mb-3">Free Avatar</h3>
              <p className="text-gray-600">Customize your digital identity with unlimited options</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-3">Virtual Home</h3>
              <p className="text-gray-600">Your own space to decorate and make your own</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="text-5xl mb-4">🚗</div>
              <h3 className="text-xl font-bold mb-3">Virtual Car</h3>
              <p className="text-gray-600">Travel between communities and explore the world</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">20 Social Impact Modules</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModuleCard 
              icon="🚨"
              title="First Responders Haven"
              description="Mental health support and community for police, fire, EMS, and military"
            />
            <ModuleCard 
              icon="🇺🇸"
              title="Together Anywhere"
              description="Connect military families and loved ones across distances"
            />
            <ModuleCard 
              icon="⛪"
              title="Faith Communities"
              description="Virtual spaces for churches, temples, mosques, and spiritual groups"
            />
            <ModuleCard 
              icon="🐾"
              title="Animal Rescue Network"
              description="Connect rescues, foster families, and adopters nationwide"
            />
            <ModuleCard 
              icon="💼"
              title="Small Business Suite"
              description="Tools and community for entrepreneurs to grow together"
            />
            <ModuleCard 
              icon="🏛️"
              title="Memorial Walls"
              description="Honor loved ones with digital memorials and family trees"
            />
            <ModuleCard 
              icon="🎓"
              title="Education Hub"
              description="Virtual classrooms and learning communities"
            />
            <ModuleCard 
              icon="❤️"
              title="Health & Wellness"
              description="Support groups and health communities"
            />
            <ModuleCard 
              icon="🌟"
              title="And 12 More..."
              description="Explore all modules when you join CRAIverse"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">1</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Create Your Avatar</h3>
                <p className="text-gray-600">Design your digital identity with unlimited customization options - completely free</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">2</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Choose Your Community</h3>
                <p className="text-gray-600">Join neighborhoods based on your location, interests, or causes you care about</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">3</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Connect & Support</h3>
                <p className="text-gray-600">Meet people, join events, support causes, and build meaningful relationships</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">4</div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Make an Impact</h3>
                <p className="text-gray-600">Participate in fundraisers, volunteer opportunities, and community initiatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Join CRAIverse?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create your free avatar and enter a world built for connection and purpose
          </p>
          <a href="/signup" className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-purple-700 transition inline-block">
            Enter CRAIverse Free
          </a>
        </div>
      </section>
    </div>
  )
}
