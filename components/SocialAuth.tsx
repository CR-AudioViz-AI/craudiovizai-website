'use client'

import { Facebook, Twitter, Github, Chrome } from 'lucide-react'

export default function SocialAuthComponent() {
  const socialProviders = [
    { name: 'Google', icon: Chrome, color: 'bg-red-500', enabled: true },
    { name: 'Facebook', icon: Facebook, color: 'bg-blue-600', enabled: true },
    { name: 'Twitter', icon: Twitter, color: 'bg-sky-500', enabled: true },
    { name: 'GitHub', icon: Github, color: 'bg-gray-800', enabled: true }
  ]

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-lg mb-4">Sign in with Social Account</h3>
      <div className="grid grid-cols-2 gap-4">
        {socialProviders.map((provider) => {
          const IconComponent = provider.icon
          return (
            <button
              key={provider.name}
              disabled={!provider.enabled}
              className={`${provider.color} text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold`}
            >
              <IconComponent size={20} />
              {provider.name}
            </button>
          )
        })}
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or continue with email</span>
        </div>
      </div>

      <form className="space-y-4">
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
          Sign In
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold mb-2">OAuth Integration Features:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ Secure authentication via trusted providers</li>
          <li>✓ No password management required</li>
          <li>✓ Quick account creation</li>
          <li>✓ Automatic profile sync</li>
        </ul>
      </div>
    </div>
  )
}
