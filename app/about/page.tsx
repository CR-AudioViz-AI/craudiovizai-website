import { Heart, Target, Users, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold mb-6">Your Story. Our Design.</h1>
          <p className="text-2xl mb-8 max-w-3xl mx-auto opacity-95">
            We're building the internet we wish existed—where everyone has the tools to succeed, 
            communities come first, and technology serves humanity.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
              🎯 Our Mission
            </div>
            <h2 className="text-5xl font-bold mb-6">Democratizing Digital Creation</h2>
            <p className="text-xl text-gray-600 mb-6">
              We believe everyone deserves access to professional-grade tools and AI assistance—not 
              just large corporations with massive budgets.
            </p>
            <p className="text-xl text-gray-600 mb-6">
              CR AudioViz AI exists to level the playing field, giving small businesses, creators, 
              and individuals the same technological advantages as Fortune 500 companies.
            </p>
            <p className="text-xl text-gray-600">
              Through transparent pricing, complete code ownership, and customer-first policies, 
              we're changing how people build and succeed online.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <StatCard number="60+" label="Creative Tools" />
            <StatCard number="5" label="AI Avatars" />
            <StatCard number="20+" label="Social Modules" />
            <StatCard number="100%" label="Code Ownership" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-4">Our Core Values</h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            These principles guide every decision we make
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <ValueCard
              icon={<Heart />}
              title="Customer First"
              description="Your success is our success. We own our mistakes, refund automatically, and always put you first."
              color="from-red-500 to-pink-500"
            />
            <ValueCard
              icon={<Target />}
              title="Transparency"
              description="No hidden fees, no surprise charges. You see exactly what everything costs before you commit."
              color="from-blue-500 to-cyan-500"
            />
            <ValueCard
              icon={<Users />}
              title="Community"
              description="We're building this together. Your feedback shapes our roadmap. Vote on features you want most."
              color="from-purple-500 to-pink-500"
            />
            <ValueCard
              icon={<Zap />}
              title="Innovation"
              description="We push boundaries with cutting-edge AI while keeping tools simple and accessible for everyone."
              color="from-yellow-500 to-orange-500"
            />
          </div>
        </div>
      </section>

      {/* Founders Story */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold mb-8 text-center">Founded by Cindy & Roy Henderson</h2>
          
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <p className="text-xl text-gray-700 mb-6">
              CR AudioViz AI was born from a simple frustration: why do only big companies get access 
              to powerful AI tools and development platforms? Why do small businesses struggle with 
              expensive agencies when technology could empower them directly?
            </p>
            <p className="text-xl text-gray-700 mb-6">
              As entrepreneurs ourselves, Cindy and Roy experienced firsthand how difficult and 
              expensive it is to build an online presence, create professional content, and compete 
              with well-funded competitors.
            </p>
            <p className="text-xl text-gray-700 mb-6">
              We founded CR AudioViz AI in August 2025 as a Florida S-Corporation with a mission: 
              build the platform we wished existed. One where small businesses could access Fortune 50 
              tools, where creators owned their work completely, and where pricing was transparent and fair.
            </p>
            <p className="text-xl text-gray-700 font-semibold">
              Today, we're building that vision with thousands of users worldwide—and we're just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center mb-16">What Makes Us Different</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <DifferentiatorCard
              number="1"
              title="You Own Everything"
              description="Unlike competitors who lock you in, we give you complete code ownership. Export anywhere, use however you want."
            />
            <DifferentiatorCard
              number="2"
              title="Automatic Refunds"
              description="Platform errors? We refund your credits automatically. No tickets, no waiting, no questions asked."
            />
            <DifferentiatorCard
              number="3"
              title="Credits Never Expire"
              description="On paid plans, your credits roll over indefinitely. Buy once, use whenever you're ready."
            />
            <DifferentiatorCard
              number="4"
              title="Build Here, Host Anywhere"
              description="Export your code and host on your own servers. No vendor lock-in, no hidden restrictions."
            />
            <DifferentiatorCard
              number="5"
              title="Customer-First Policies"
              description="Grace periods, download windows, soft upsells—we treat you how we'd want to be treated."
            />
            <DifferentiatorCard
              number="6"
              title="Social Impact Focus"
              description="20+ modules built specifically to help underserved communities, first responders, and nonprofits."
            />
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6">Company Information</h2>
            <div className="space-y-4 text-lg">
              <InfoRow label="Legal Name" value="CR AudioViz AI, LLC" />
              <InfoRow label="Formation" value="August 2025" />
              <InfoRow label="Structure" value="Florida S-Corporation" />
              <InfoRow label="EIN" value="99-4151597" />
              <InfoRow label="Location" value="Fort Myers, Florida" />
              <InfoRow label="Contact" value="founders@craudiovizai.com" />
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-6">
              We love hearing from our community. Whether you have questions, feedback, 
              or partnership ideas—we're here.
            </p>
            <div className="space-y-4">
              <ContactMethod
                icon="📧"
                label="General Inquiries"
                value="hello@craudiovizai.com"
              />
              <ContactMethod
                icon="💼"
                label="Business & Partnerships"
                value="founders@craudiovizai.com"
              />
              <ContactMethod
                icon="🛟"
                label="Support"
                value="support@craudiovizai.com"
              />
              <ContactMethod
                icon="📞"
                label="Phone"
                value="(859) 446-9770"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-2xl mb-10 opacity-95">
            Be part of building a better internet. Start creating today.
          </p>
          <a href="/signup" className="inline-block px-12 py-6 bg-white text-blue-600 rounded-xl text-2xl font-bold hover:bg-gray-100 shadow-2xl transition-all">
            Start Free Today →
          </a>
        </div>
      </section>
    </div>
  )
}

function StatCard({ number, label }: { number: string, label: string }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
      <div className="text-5xl font-bold text-blue-600 mb-2">{number}</div>
      <div className="text-gray-600 font-semibold">{label}</div>
    </div>
  )
}

function ValueCard({ icon, title, description, color }: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-white mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function DifferentiatorCard({ number, title, description }: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-white/90">{description}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between border-b border-gray-200 pb-3">
      <span className="text-gray-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function ContactMethod({ icon, label, value }: {
  icon: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <div className="font-semibold">{label}</div>
        <div className="text-blue-600">{value}</div>
      </div>
    </div>
  )
}
