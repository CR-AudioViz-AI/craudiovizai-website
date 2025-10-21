import { Sparkles, Zap, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Your Story. Our Design.
        </h1>
        <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          The unified AI-powered platform that transforms how you create, connect, and succeed online.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700">
            Start Free Today
          </a>
          <a href="/demo" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50">
            Watch Demo
          </a>
        </div>
        <p className="mt-4 text-gray-500">1,000 free credits • No credit card required</p>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Everything You Need in One Place</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Sparkles />}
            title="60+ Creative Tools"
            description="Build websites, apps, games, videos, music, and more with AI assistance"
          />
          <FeatureCard
            icon={<Zap />}
            title="5 AI Avatars"
            description="JavariAI, CRAI, Kairo, Pulse, and Scout work together to help you succeed"
          />
          <FeatureCard
            icon={<Users />}
            title="CRAIverse World"
            description="Connect with communities, build relationships, and make real impact"
          />
          <FeatureCard
            icon={<Shield />}
            title="You Own Everything"
            description="Complete code ownership, export anywhere, host everywhere"
          />
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <PricingCard
            name="Free"
            price="$0"
            credits="1,000"
            features={['All 60+ tools', 'Basic AI avatars', 'Community access']}
          />
          <PricingCard
            name="Starter"
            price="$19"
            credits="5,000"
            features={['Everything in Free', 'Priority support', 'Advanced AI features']}
            highlight={false}
          />
          <PricingCard
            name="Pro"
            price="$99"
            credits="50,000"
            features={['Everything in Starter', 'White-label options', 'API access']}
            highlight={true}
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            credits="Unlimited"
            features={['Everything in Pro', 'Dedicated support', 'Custom integrations']}
          />
        </div>
        <p className="text-center mt-8 text-gray-600">
          Credits never expire on paid plans • Roll over indefinitely
        </p>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Build Your Future?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands creating amazing things with CR AudioViz AI
          </p>
          <a href="/signup" className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100">
            Start Creating Now
          </a>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-6 border rounded-xl hover:shadow-lg transition-shadow">
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, credits, features, highlight = false }: {
  name: string
  price: string
  credits: string
  features: string[]
  highlight?: boolean
}) {
  return (
    <div className={`p-6 border-2 rounded-xl ${highlight ? 'border-blue-600 shadow-lg' : 'border-gray-200'}`}>
      {highlight && (
        <div className="text-xs font-bold text-blue-600 mb-2">MOST POPULAR</div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-4">
        <span className="text-4xl font-bold">{price}</span>
        {price !== 'Custom' && <span className="text-gray-600">/month</span>}
      </div>
      <div className="text-sm text-gray-600 mb-6">{credits} credits/month</div>
      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">✓</span>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <a
        href="/signup"
        className={`block text-center mt-6 px-4 py-3 rounded-lg font-semibold ${
          highlight
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
        }`}
      >
        Get Started
      </a>
    </div>
  )
}
