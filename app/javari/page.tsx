import { Brain, Zap, MessageSquare, Code, BarChart, Shield } from 'lucide-react'

export default function JavariAIPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
            🤖 AI-Powered Intelligence
          </div>
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Meet JavariAI
          </h1>
          <p className="text-2xl text-gray-600 mb-8 max-w-4xl mx-auto">
            Your intelligent companion that learns, adapts, and evolves with your business. 
            Powered by advanced AI to help you build, create, and succeed faster.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all">
              Start Building with Javari
            </a>
            <a href="#features" className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all">
              Explore Capabilities
            </a>
          </div>
        </div>

        {/* Avatar Showcase */}
        <div className="bg-white rounded-2xl shadow-2xl p-12 mt-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-48 h-48 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold mb-6">Continuous Learning AI</h2>
              <p className="text-gray-600 text-lg mb-6">
                JavariAI doesn't just respond—it learns from every interaction, understands your 
                preferences, and gets smarter with each conversation. Built on advanced language 
                models with real-time adaptation.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Context-Aware:</strong>
                    <span className="text-gray-600"> Remembers your projects, preferences, and goals</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Multi-Modal:</strong>
                    <span className="text-gray-600"> Works with text, code, images, and data</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-600 text-sm">✓</span>
                  </div>
                  <div>
                    <strong className="text-gray-900">Real-Time:</strong>
                    <span className="text-gray-600"> Instant responses with streaming capabilities</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-4">Core Capabilities</h2>
        <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
          JavariAI is your all-in-one AI partner for building, creating, and managing your digital presence
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <CapabilityCard
            icon={<MessageSquare />}
            title="Intelligent Conversations"
            description="Natural language understanding that feels human. Ask questions, get insights, brainstorm ideas—Javari adapts to your communication style."
            features={[
              'Multi-turn context retention',
              'Sentiment analysis',
              'Intent recognition',
              '24/7 availability'
            ]}
          />
          <CapabilityCard
            icon={<Code />}
            title="Code Generation"
            description="Write, debug, and optimize code across 50+ languages. From simple scripts to complex applications, Javari is your coding partner."
            features={[
              'Full-stack development',
              'Automatic debugging',
              'Best practices enforcement',
              'Documentation generation'
            ]}
          />
          <CapabilityCard
            icon={<BarChart />}
            title="Data Analysis"
            description="Transform raw data into actionable insights. Upload CSVs, databases, or APIs—Javari analyzes, visualizes, and explains trends."
            features={[
              'Statistical analysis',
              'Predictive modeling',
              'Custom visualizations',
              'Automated reporting'
            ]}
          />
          <CapabilityCard
            icon={<Zap />}
            title="Task Automation"
            description="Automate repetitive workflows and save hours every week. From data entry to content creation, let Javari handle the busywork."
            features={[
              'Workflow orchestration',
              'API integrations',
              'Scheduled tasks',
              'Error handling'
            ]}
          />
          <CapabilityCard
            icon={<Brain />}
            title="Creative Assistance"
            description="Generate content, design assets, write copy, and brainstorm ideas. Javari helps with every creative step of your project."
            features={[
              'Content generation',
              'Image prompts',
              'Marketing copy',
              'Brand strategy'
            ]}
          />
          <CapabilityCard
            icon={<Shield />}
            title="Security & Privacy"
            description="Enterprise-grade security with end-to-end encryption. Your data stays yours—we never train on your conversations."
            features={[
              'Zero data retention',
              'SOC 2 compliant',
              'GDPR ready',
              'Role-based access'
            ]}
          />
        </div>
      </section>

      {/* The Avatar Team */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4 text-white">The Avatar Team</h2>
          <p className="text-xl text-blue-100 text-center mb-16 max-w-3xl mx-auto">
            JavariAI works alongside 4 specialized avatars, each an expert in their domain
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <AvatarCard
              name="CRAI"
              role="Customer Experience Director"
              description="Handles all customer interactions, support tickets, and user feedback with empathy and efficiency"
              color="bg-green-500"
            />
            <AvatarCard
              name="Kairo"
              role="Creative Director"
              description="Manages all creative projects, from design to content, ensuring brand consistency and quality"
              color="bg-purple-500"
            />
            <AvatarCard
              name="Pulse"
              role="Analytics Monitor"
              description="Tracks metrics, generates insights, and provides real-time performance dashboards"
              color="bg-orange-500"
            />
            <AvatarCard
              name="Scout"
              role="Operations Specialist"
              description="Finds opportunities, monitors trends, and keeps your business ahead of the curve"
              color="bg-cyan-500"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-5xl font-bold text-center mb-16">Built For Every Creator</h2>

        <div className="grid md:grid-cols-2 gap-8">
          <UseCaseCard
            title="For Developers"
            description="Build faster with AI pair programming, automatic documentation, and intelligent debugging"
            examples={[
              'Generate boilerplate code',
              'Debug complex issues',
              'Write unit tests',
              'Optimize performance'
            ]}
          />
          <UseCaseCard
            title="For Designers"
            description="Create stunning visuals with AI-assisted design, color palette generation, and layout suggestions"
            examples={[
              'Generate design concepts',
              'Create brand guidelines',
              'Optimize user flows',
              'Build prototypes'
            ]}
          />
          <UseCaseCard
            title="For Marketers"
            description="Create campaigns that convert with AI-powered copy, SEO optimization, and audience targeting"
            examples={[
              'Write ad copy',
              'Plan content calendars',
              'Analyze competitors',
              'Generate reports'
            ]}
          />
          <UseCaseCard
            title="For Entrepreneurs"
            description="Launch and scale your business with AI handling operations, customer service, and analytics"
            examples={[
              'Business plan creation',
              'Market research',
              'Financial projections',
              'Pitch deck design'
            ]}
          />
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-bold mb-6">Ready to Work with Javari?</h2>
          <p className="text-2xl mb-8 opacity-90">
            Start with 1,000 free credits. No credit card required.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/signup" className="px-10 py-5 bg-white text-blue-600 rounded-xl text-xl font-bold hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all">
              Get Started Free
            </a>
            <a href="/pricing" className="px-10 py-5 border-3 border-white text-white rounded-xl text-xl font-bold hover:bg-white hover:text-blue-600 transition-all">
              View Pricing
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function CapabilityCard({ icon, title, description, features }: {
  icon: React.ReactNode
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100">
      <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function AvatarCard({ name, role, description, color }: {
  name: string
  role: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4`}>
        {name[0]}
      </div>
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-sm text-gray-500 mb-3">{role}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

function UseCaseCard({ title, description, examples }: {
  title: string
  description: string
  examples: string[]
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3">
        {examples.map((example, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-blue-600 font-bold mt-1">→</span>
            <span className="text-gray-700">{example}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
