{/* Credit System Explanation */}
<section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          How Credits Work
        </h2>
        <p className="text-lg text-gray-600">
          Credits are used across all tools - simple, transparent, and they never expire on paid plans
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Sparkles className="w-6 h-6 text-blue-600 mr-2" />
              What Are Credits?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-3">
              Credits are our universal currency. Each action on the platform costs a certain number of credits based on complexity and resources used.
            </p>
            <p>
              Simple actions like generating a logo might cost 5 credits, while building a complete website with Javari might cost 50 credits.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-6 h-6 text-blue-600 mr-2" />
              Credits Never Expire (Pro & Professional)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-3">
              <strong>Pro and Professional plan credits NEVER expire</strong> and roll over indefinitely as long as your plan is active. Accumulate credits month after month!
            </p>
            <p className="text-sm italic">
              Free plan credits expire monthly and do not roll over.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-6 h-6 text-green-600 mr-2" />
              Top Up Anytime
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-3">
              Running low? Purchase additional credits at any time at the current per-credit rate.
            </p>
            <p>
              Top-up credits follow the same rules as your plan: Free plan top-ups expire monthly, Pro/Professional top-ups never expire.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-6 h-6 text-orange-600 mr-2" />
              10-Day Grace Period
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-3">
              If your plan expires, you have <strong>10 days to renew</strong> and keep all your credits.
            </p>
            <p>
              Renew within 10 days = all credits preserved. After 10 days = credits are forfeited.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
          Credit Expiration Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
            <p className="font-bold text-gray-900 mb-2">Free Plan</p>
            <p className="text-red-600 font-semibold">✗ Credits expire monthly</p>
            <p className="text-gray-600 text-xs mt-1">Resets on your renewal date</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-blue-500">
            <p className="font-bold text-blue-900 mb-2">Pro Plan</p>
            <p className="text-green-600 font-semibold">✓ Credits NEVER expire</p>
            <p className="text-gray-600 text-xs mt-1">Accumulate indefinitely while active</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-purple-500">
            <p className="font-bold text-purple-900 mb-2">Professional Plan</p>
            <p className="text-green-600 font-semibold">✓ Credits NEVER expire</p>
            <p className="text-gray-600 text-xs mt-1">Shared pool never expires while active</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <HelpCircle className="w-6 h-6 text-blue-600 mr-2" />
          Example Credit Costs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Logo Generation</span>
            <span className="font-semibold text-blue-600">5 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Social Media Graphic</span>
            <span className="font-semibold text-blue-600">3 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Blog Post (AI)</span>
            <span className="font-semibold text-blue-600">10 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Video Edit (1 min)</span>
            <span className="font-semibold text-blue-600">15 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Landing Page (Javari)</span>
            <span className="font-semibold text-blue-600">25 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Complete Website</span>
            <span className="font-semibold text-blue-600">50+ credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Game Creation</span>
            <span className="font-semibold text-blue-600">30 credits</span>
          </div>
          <div className="flex justify-between items-center border-b border-blue-200 pb-2">
            <span className="text-gray-700">Chat Message (Javari)</span>
            <span className="font-semibold text-blue-600">1 credit</span>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4 text-center">
          * Credit costs may vary based on complexity and resource usage
        </p>
      </div>
    </div>
  </div>
</section>
