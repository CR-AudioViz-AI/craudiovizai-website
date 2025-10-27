export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <a href="/" className="text-2xl font-bold text-blue-600">CR AudioViz AI</a>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">CR=</span>
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <a href="/pricing" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                Buy Credits
              </a>
              <button className="text-gray-600 hover:text-gray-900">Sign Out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Your Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-gray-600 text-sm mb-1">Credits Balance</div>
            <div className="text-3xl font-bold text-blue-600">0</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-gray-600 text-sm mb-1">Projects Created</div>
            <div className="text-3xl font-bold">0</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-gray-600 text-sm mb-1">Credits Spent</div>
            <div className="text-3xl font-bold">0</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="text-gray-600 text-sm mb-1">Subscription</div>
            <div className="text-xl font-bold">Free</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center">
              <div className="text-4xl mb-3">🤖</div>
              <div className="font-bold">Chat with JavariAI</div>
              <div className="text-sm text-gray-600 mt-1">Start building something new</div>
            </a>
            <a href="/pricing" className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center">
              <div className="text-4xl mb-3">💳</div>
              <div className="font-bold">Buy Credits</div>
              <div className="text-sm text-gray-600 mt-1">Get more credits to build</div>
            </a>
            <a href="/apps" className="p-6 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition text-center">
              <div className="text-4xl mb-3">🎨</div>
              <div className="font-bold">Browse Tools</div>
              <div className="text-sm text-gray-600 mt-1">Explore 60+ creative tools</div>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📭</div>
            <p>No activity yet. Start building something!</p>
            <a href="https://javari-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
              Chat with JavariAI
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
