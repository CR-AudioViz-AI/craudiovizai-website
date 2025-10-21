import { Heart, Users, Building, Sparkles, Globe, Shield } from 'lucide-react'

export default function CRAIversePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur rounded-full text-sm font-semibold mb-6">
            🌍 Virtual World for Real Impact
          </div>
          <h1 className="text-7xl font-bold mb-6">
            Welcome to the CRAIverse
          </h1>
          <p className="text-2xl mb-8 max-w-4xl mx-auto opacity-95">
            A revolutionary virtual world where every user gets a free avatar, car, and house. 
            Connect with communities, build relationships, and create real-world impact.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="px-10 py-5 bg-white text-blue-600 rounded-xl text-xl font-bold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all">
              Enter the CRAIverse Free
            </a>
            <a href="#modules" className="px-10 py-5 border-3 border-white text-white rounded-xl text-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              Explore Modules
            </a>
          </div>
        </div>
      </section>

      {/* What is CRAIverse */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6">Your Digital Home</h2>
            <p className="text-xl text-gray-600 mb-6">
              CRAIverse isn't just another virtual world—it's a purposeful ecosystem designed 
              to bring people together, support communities, and create lasting change.
            </p>
            <p className="text-xl text-gray-600 mb-8">
              Every user starts with a fully furnished home, a virtual car, and a customizable 
              avatar. No paywalls, no grinding—just instant access to a world built for connection.
            </p>
            <div className="space-y-4">
              <FeatureBadge icon={<Users />} text="100% Free to Join & Explore" />
              <FeatureBadge icon={<Globe />} text="Geographic Communities from Local to Global" />
              <FeatureBadge icon={<Heart />} text="20+ Social Impact Modules" />
              <FeatureBadge icon={<Shield />} text="Safe, Moderated, Family-Friendly" />
            </div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl p-12 text-white shadow-2xl">
              <h3 className="text-3xl font-bold mb-6">What You Get Free:</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <strong>Virtual Home:</strong> Fully furnished, customizable, yours forever
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <strong>Virtual Car:</strong> Travel the CRAIverse in style
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">👤</span>
                  <div>
                    <strong>Custom Avatar:</strong> Be whoever you want to be
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <strong>Community Access:</strong> Join local, regional, and global communities
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact Modules */}
      <section id="modules" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Social Impact Modules</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Purpose-built spaces designed to support communities and create real-world change
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <ModuleCard
              emoji="🚒"
              title="First Responders Haven"
              description="Mental health support, peer counseling, and community for firefighters, police, EMTs, and dispatchers"
              impact="Supporting heroes who support us"
              color="from-red-500 to-orange-500"
            />
            <ModuleCard
              emoji="🎖️"
              title="Military Families Hub"
              description="Connect military families during deployments, provide resources, and maintain relationships across distances"
              impact="Keeping families together"
              color="from-blue-600 to-blue-800"
            />
            <ModuleCard
              emoji="⛪"
              title="Faith Communities"
              description="Virtual churches, temples, mosques, and spiritual gathering spaces for worship and fellowship"
              impact="Faith without borders"
              color="from-purple-500 to-pink-500"
            />
            <ModuleCard
              emoji="🐾"
              title="Animal Rescue Network"
              description="Connect shelters, rescues, fosters, and adopters. Showcase adoptable pets and coordinate resources"
              impact="Every pet deserves a home"
              color="from-green-500 to-teal-500"
            />
            <ModuleCard
              emoji="💼"
              title="Small Business Suite"
              description="Tools, networking, and resources for small businesses to compete with enterprise companies"
              impact="Leveling the playing field"
              color="from-yellow-500 to-orange-500"
            />
            <ModuleCard
              emoji="🌟"
              title="OnlyAvatars"
              description="Fantasy fulfillment with AI avatars—safe, private, ethical digital relationships"
              impact="Connection without exploitation"
              color="from-pink-500 to-rose-500"
            />
            <ModuleCard
              emoji="📍"
              title="Geographic Targeting"
              description="Hyper-local marketing and community building from neighborhood to national scale"
              impact="Reach the right people"
              color="from-cyan-500 to-blue-500"
            />
            <ModuleCard
              emoji="🛍️"
              title="Trending Products"
              description="Event-driven merchandise marketplace responding to current events and viral moments"
              impact="Capitalize on trends instantly"
              color="from-indigo-500 to-purple-500"
            />
            <ModuleCard
              emoji="🎨"
              title="Creator Marketplace"
              description="Sell games, apps, templates, and assets with 70/30 revenue split in your favor"
              impact="Creators first, always"
              color="from-violet-500 to-fuchsia-500"
            />
            <ModuleCard
              emoji="🪦"
              title="Memorial Walls"
              description="Digital memorials, family genealogy, and legacy preservation"
              impact="Honoring those we've lost"
              color="from-gray-600 to-gray-800"
            />
            <ModuleCard
              emoji="💝"
              title="Avatar Dating"
              description="Meet people through avatars first, build connections based on personality"
              impact="Love beyond appearances"
              color="from-red-400 to-pink-400"
            />
            <ModuleCard
              emoji="🗳️"
              title="Democratic Voting"
              description="Community votes on new features, modules, and platform direction"
              impact="Your platform, your voice"
              color="from-blue-500 to-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-16">How the CRAIverse Works</h2>

        <div className="grid md:grid-cols-4 gap-8">
          <StepCard
            number="1"
            title="Sign Up Free"
            description="Create your account in 60 seconds. No credit card, no trial period—just instant access."
          />
          <StepCard
            number="2"
            title="Claim Your Assets"
            description="Get your avatar, home, and car immediately. Customize everything to match your style."
          />
          <StepCard
            number="3"
            title="Join Communities"
            description="Find your local neighborhood, join interest groups, and connect with like-minded people."
          />
          <StepCard
            number="4"
            title="Make Impact"
            description="Participate in modules, support causes, build relationships, and create change."
          />
        </div>
      </section>

      {/* Geographic Communities */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">Geographic Communities</h2>

          <div className="grid md:grid-cols-5 gap-6">
            <GeographicLevel
              level="Neighborhood"
              description="Your block, your street, your local area"
              icon="🏘️"
            />
            <GeographicLevel
              level="City"
              description="Connect with everyone in your metro area"
              icon="🏙️"
            />
            <GeographicLevel
              level="State/Region"
              description="State-wide communities and resources"
              icon="📍"
            />
            <GeographicLevel
              level="National"
              description="Country-level networking and support"
              icon="🗺️"
            />
            <GeographicLevel
              level="Global"
              description="Connect with the entire CRAIverse"
              icon="🌍"
            />
          </div>
        </div>
      </section>

      {/* Why Different */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-16">Why the CRAIverse is Different</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <ComparisonCard
            title="Other Virtual Worlds"
            points={[
              "Pay to play or pay to win",
              "Endless grinding for basic items",
              "Focus on entertainment only",
              "Isolated experiences",
              "Corporate profit focus"
            ]}
            negative={true}
          />
          <ComparisonCard
            title="The CRAIverse"
            points={[
              "100% free to start and explore",
              "Instant access to home, car, avatar",
              "Built for social impact and purpose",
              "Connected geographic communities",
              "Mission-driven with heart"
            ]}
            negative={false}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 rounded-3xl p-16 text-center text-white shadow-2xl">
          <h2 className="text-6xl font-bold mb-6">Ready to Enter?</h2>
          <p className="text-2xl mb-10 opacity-95">
            Join thousands building a better virtual world. Free forever.
          </p>
          <a href="/signup" className="inline-block px-12 py-6 bg-white text-blue-600 rounded-xl text-2xl font-bold hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all">
            Claim Your Free Avatar Now →
          </a>
        </div>
      </section>
    </div>
  )
}

function FeatureBadge({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 text-lg">
      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <span className="font-semibold text-gray-900">{text}</span>
    </div>
  )
}

function ModuleCard({ emoji, title, description, impact, color }: {
  emoji: string
  title: string
  description: string
  impact: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all border border-gray-100">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-3xl mb-4`}>
        {emoji}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{impact}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function GeographicLevel({ level, description, icon }: {
  level: string
  description: string
  icon: string
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold mb-2">{level}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </div>
  )
}

function ComparisonCard({ title, points, negative }: {
  title: string
  points: string[]
  negative: boolean
}) {
  return (
    <div className={`rounded-2xl p-8 ${negative ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-600'}`}>
      <h3 className="text-2xl font-bold mb-6">{title}</h3>
      <ul className="space-y-4">
        {points.map((point, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={`text-xl ${negative ? 'text-red-500' : 'text-green-500'}`}>
              {negative ? '✗' : '✓'}
            </span>
            <span className="text-gray-700">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
