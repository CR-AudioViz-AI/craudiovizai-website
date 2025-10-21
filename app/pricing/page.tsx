
import { Check, Zap, Crown, Building2 } from 'lucide-react'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="inline-block px-6 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-6">
          💎 Transparent, Fair Pricing
        </div>
        <h1 className="text-6xl font-bold mb-6">
          Simple Pricing.<br />
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Powerful Platform.
          </span>
        </h1>
        <p className="text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Pay only for what you use. Credits never expire on paid plans. No hidden fees, no surprises.
        </p>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Free */}
          <PricingTier
            name="Free"
            price="$0"
            period="forever"
            credits="1,000"
            description="Perfect for trying out the platform"
            features={[
              'All 60+ creative tools',
              'Basic AI avatars',
              'CRAIverse access',
              'Community support',
              'Export your code',
              'Basic analytics'
            ]}
            cta="Start Free"
            ctaLink="/signup"
            popular={false}
            icon={<Zap />}
          />

          {/* Starter */}
          <PricingTier
            name="Starter"
            price="$19"
            period="per month"
            credits="5,000"
            description="For solo creators and hobbyists"
            features={[
              'Everything in Free',
              'Priority support',
              'Advanced AI features',
              'Credits never expire',
              'Unlimited exports',
              'Advanced analytics',
              'Email support'
            ]}
            cta="Get Started"
            ctaLink="/signup?plan=starter"
            popular={false}
            icon={<Zap />}
          />

          {/* Pro - MOST POPULAR */}
          <PricingTier
            name="Pro"
            price="$99"
            period="per month"
            credits="50,000"
            description="For professionals and teams"
            features={[
              'Everything in Starter',
              'White-label options',
              'API access',
              'Custom integrations',
              'Priority processing',
              'Advanced security',
              'Dedicated support',
              'Team collaboration'
            ]}
            cta="Start Pro"
            ctaLink="/signup?plan=pro"
            popular={true}
            icon={<Crown />}
          />

          {/* Enterprise */}
          <PricingTier
            name="Enterprise"
            price="Custom"
            period="pricing"
            credits="Unlimited"
            description="For large organizations"
            features={[
              'Everything in Pro',
              'Unlimited credits',
              'Custom SLAs',
              'On-premise option',
              'Dedicated account manager',
              'Custom training',
              'Advanced compliance',
              'Volume discounts'
            ]}
            cta="Contact Sales"
            ctaLink="/contact?type=enterprise"
            popular={false}
            icon={<Building2 />}
          />
        </div>

        {/* Credits Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg">
            💡 <strong>Credits never expire on paid plans</strong> — Roll over indefinitely
          </p>
          <p className="text-gray-500 mt-2">
            10-day grace period after subscription expires • 30-day asset download window
          </p>
        </div>
      </section>

      {/* Credit Costs */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">What Do Credits Buy?</h2>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Transparent pricing for every tool and feature
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <CreditCostCard
              category="Creative Tools"
              items={[
                { name: 'Logo Generation', cost: '10 credits' },
                { name: 'Image Creation', cost: '5-20 credits' },
                { name: 'Video Generation', cost: '50-200 credits' },
                { name: 'Music Creation', cost: '25-100 credits' },
                { name: 'Website Builder', cost: '100 credits' },
                { name: 'App Generation', cost: '200-500 credits' }
              ]}
            />
            <CreditCostCard
              category="AI Services"
              items={[
                { name: 'JavariAI Chat (1000 words)', cost: '10 credits' },
                { name: 'CRAI Support Ticket', cost: '5 credits' },
                { name: 'Kairo Design Review', cost: '20 credits' },
                { name: 'Pulse Analytics Report', cost: '15 credits' },
                { name: 'Scout Market Research', cost: '25 credits' },
                { name: 'Code Generation', cost: '50-200 credits' }
              ]}
            />
            <CreditCostCard
              category="Games & Apps"
              items={[
                { name: 'Simple Game Creation', cost: '200 credits' },
                { name: 'Advanced Game', cost: '500 credits' },
                { name: 'Mobile App', cost: '400 credits' },
                { name: 'Web Application', cost: '300 credits' },
                { name: 'API Integration', cost: '100 credits' },
                { name: 'Database Setup', cost: '50 credits' }
              ]}
            />
          </div>

          <div className="mt-12 bg-blue-50 border-2 border-blue-200 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">💰 Buy Extra Credits Anytime</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">$10</p>
                <p className="text-gray-600">1,000 credits</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">$45</p>
                <p className="text-gray-600">5,000 credits</p>
                <p className="text-xs text-green-600 font-semibold">Save 10%</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">$80</p>
                <p className="text-gray-600">10,000 credits</p>
                <p className="text-xs text-green-600 font-semibold">Save 20%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promises */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Our Customer-First Promises</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <PromiseCard
            icon="🔒"
            title="You Own Everything"
            description="Every asset you create is 100% yours. Export anywhere, use however you want. We never claim ownership of your work."
          />
          <PromiseCard
            icon="💰"
            title="Automatic Refunds"
            description="If the platform makes an error, we automatically refund your credits. No tickets, no waiting—just instant credit back."
          />
          <PromiseCard
            icon="📦"
            title="Build Here, Host Anywhere"
            description="Unlike competitors, you can export your code and host it anywhere. No lock-in, no restrictions."
          />
          <PromiseCard
            icon="⏰"
            title="Credits Never Expire"
            description="On paid plans, your credits roll over indefinitely. Buy once, use whenever you're ready."
          />
          <PromiseCard
            icon="🛟"
            title="Grace Periods"
            description="10-day grace period after subscription ends to renew and keep credits. 30 days to download all assets."
          />
          <PromiseCard
            icon="🚫"
            title="No Surprise Charges"
            description="See exactly what each action costs before you do it. Transparent pricing, always."
          />
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <FAQItem
              question="What happens if I run out of credits?"
              answer="You can purchase additional credits anytime, or upgrade your plan for more monthly credits. Free users can continue using basic features with ads."
            />
            <FAQItem
              question="Do credits expire?"
              answer="On paid plans (Starter, Pro, Enterprise), credits never expire and roll over indefinitely. Free plan credits expire after 90 days of inactivity."
            />
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! Cancel anytime with no penalties. You'll keep your credits and access until the end of your billing period, plus a 10-day grace period."
            />
            <FAQItem
              question="What if the platform makes an error?"
              answer="We automatically detect errors and refund credits immediately. You'll get a notification and your credits back within seconds."
            />
            <FAQItem
              question="Can I really export my code?"
              answer="Absolutely! Unlike platforms like Bolt.new, we give you complete code ownership. Download, modify, and host anywhere you want."
            />
            <FAQItem
              question="Is there a free trial?"
              answer="The Free plan is permanent—not a trial. You get 1,000 credits to explore the entire platform. No credit card required."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-16 text-center text-white shadow-2xl">
          <h2 className="text-5xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-2xl mb-10 opacity-95">
            Start with 1,000 free credits. Upgrade anytime.
          </p>
          <a href="/signup" className="inline-block px-12 py-6 bg-white text-blue-600 rounded-xl text-2xl font-bold hover:bg-gray-100 shadow-2xl transition-all">
            Start Free Today →
          </a>
        </div>
      </section>
    </div>
  )
}

function PricingTier({ name, price, period, credits, description, features, cta, ctaLink, popular, icon }: {
  name: string
  price: string
  period: string
  credits: string
  description: string
  features: string[]
  cta: string
  ctaLink: string
  popular: boolean
  icon: React.ReactNode
}) {
  return (
    <div className={`rounded-3xl p-8 ${popular ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105 border-4 border-yellow-400' : 'bg-white shadow-lg'}`}>
      {popular && (
        <div className="inline-block px-4 py-1 bg-yellow-400 text-blue-900 rounded-full text-xs font-bold mb-4">
          ⭐ MOST POPULAR
        </div>
      )}
      <div className={`w-14 h-14 ${popular ? 'bg-white/20' : 'bg-blue-100'} rounded-2xl flex items-center justify-center ${popular ? 'text-white' : 'text-blue-600'} mb-4`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-5xl font-bold">{price}</span>
        {price !== 'Custom' && <span className={`text-lg ${popular ? 'text-white/80' : 'text-gray-600'}`}>/{period}</span>}
      </div>
      <p className={`text-lg mb-2 ${popular ? 'text-white/90' : 'text-gray-600'}`}>{credits} credits/month</p>
      <p className={`text-sm mb-6 ${popular ? 'text-white/70' : 'text-gray-500'}`}>{description}</p>
      
      <a
        href={ctaLink}
        className={`block text-center px-6 py-4 rounded-xl font-bold mb-8 transition-all ${
          popular
            ? 'bg-white text-blue-600 hover:bg-gray-100'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {cta}
      </a>

      <ul className="space-y-3">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${popular ? 'text-white' : 'text-blue-600'}`} />
            <span className={`text-sm ${popular ? 'text-white/90' : 'text-gray-700'}`}>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CreditCostCard({ category, items }: {
  category: string
  items: { name: string, cost: string }[]
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6">
      <h3 className="text-xl font-bold mb-6">{category}</h3>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex justify-between items-start">
            <span className="text-gray-700">{item.name}</span>
            <span className="text-blue-600 font-semibold text-sm whitespace-nowrap ml-2">{item.cost}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function PromiseCard({ icon, title, description }: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function FAQItem({ question, answer }: {
  question: string
  answer: string
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
