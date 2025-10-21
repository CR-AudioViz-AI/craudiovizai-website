export default function PricingPage() {
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
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Pay as you go or subscribe. Credits never expire on paid plans. Build here, host anywhere.
          </p>
        </div>
      </section>

      {/* Subscription Plans */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Monthly Subscriptions</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Free */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-4">$0<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6 text-gray-600"><span className="font-bold">50 credits</span> welcome bonus</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Access to all 60+ tools</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Community support</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Full code ownership</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Build & export anywhere</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-gray-100 hover:bg-gray-200 transition">
                Get Started
              </a>
            </div>

            {/* Starter */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-200">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">$19<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6 text-gray-600"><span className="font-bold">200 credits</span> every month</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Everything in Free</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Priority support</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>No ads</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Credits never expire</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition">
                Get Started
              </a>
            </div>

            {/* Pro */}
            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-xl border-4 border-blue-400 relative transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-blue-900 px-4 py-1 rounded-full text-sm font-bold">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">$49<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6"><span className="font-bold">750 credits</span> every month</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><span>✓</span><span>Everything in Starter</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>70/30 marketplace split</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>API access</span></li>
                <li className="flex items-start gap-2"><span>✓</span><span>White label option</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-white text-blue-600 hover:bg-gray-100 transition">
                Get Started
              </a>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-900">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-4">$149<span className="text-lg font-normal">/mo</span></div>
              <p className="mb-6 text-gray-600"><span className="font-bold">3000 credits</span> every month</p>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Everything in Pro</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Dedicated support</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Custom branding</span></li>
                <li className="flex items-start gap-2"><span className="text-green-600">✓</span><span>Team management</span></li>
              </ul>
              <a href="/signup" className="block text-center py-3 rounded-lg font-bold bg-gray-900 text-white hover:bg-gray-800 transition">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">One-Time Credit Packages</h2>
          <p className="text-center text-gray-600 mb-12">No subscription needed. Perfect for occasional use.</p>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="p-6 border-2 border-gray-200 rounded-xl">
              <div className="text-2xl font-bold mb-2">100 Credits</div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$10</div>
              <p className="text-sm text-gray-600 mb-4">$0.10 per credit</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
            </div>
            <div className="p-6 border-2 border-blue-400 rounded-xl bg-blue-50">
              <div className="text-sm text-blue-600 font-bold mb-1">+50 BONUS</div>
              <div className="text-2xl font-bold mb-2">550 Credits</div>
              <div className="text-3xl font-bold text-blue-600 mb-4">$45</div>
              <p className="text-sm text-gray-600 mb-4">$0.08 per credit</p>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
            </div>
            <div className="p-6 border-2 border-purple-400 rounded-xl bg-purple-50">
              <div className="text-sm text-purple-600 font-bold mb-1">+150 BONUS</div>
              <div className="text-2xl font-bold mb-2">1,150 Credits</div>
              <div className="text-3xl font-bold text-purple-600 mb-4">$80</div>
              <p className="text-sm text-gray-600 mb-4">$0.07 per credit</p>
              <button className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                Buy Now
              </button>
            </div>
            <div className="p-6 border-2 border-green-400 rounded-xl bg-green-50">
              <div className="text-sm text-green-600 font-bold mb-1">+1000 BONUS</div>
              <div className="text-2xl font-bold mb-2">6,000 Credits</div>
              <div className="text-3xl font-bold text-green-600 mb-4">$350</div>
              <p className="text-sm text-gray-600 mb-4">$0.06 per credit</p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">Do credits expire?</h3>
              <p className="text-gray-600">Credits never expire on paid subscription plans. For one-time purchases, credits are valid for 1 year.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes! Cancel anytime. You keep your credits for 10 days after cancellation and have 30 days to download your projects.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">Do I own the code?</h3>
              <p className="text-gray-600">Absolutely! You own 100% of everything JavariAI creates for you. Download and host anywhere.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-bold text-lg mb-2">What if something breaks?</h3>
              <p className="text-gray-600">We automatically refund credits if there's an error on our side. Your satisfaction is guaranteed.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
