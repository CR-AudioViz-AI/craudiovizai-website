'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, User, AlertCircle, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MobileInput, MobileButton } from '@/components/mobile';

export default function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Update profile with name (profile created automatically by trigger)
        await supabase
          .from('profiles')
          .update({ full_name: fullName })
          .eq('id', data.user.id);

        // Redirect to home page
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 md:mb-8">
          <Link href="/" className="inline-block mb-4 md:mb-6">
            <Image
              src="/logo.png"
              alt="CR AudioViz AI"
              width={180}
              height={60}
              className="h-12 md:h-16 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Create Account</h1>
          <p className="text-base md:text-lg text-gray-600">Get 50 free credits to start building</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Uses MobileInput (16px font, prevents iOS zoom) */}
            <MobileInput
              type="text"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={loading}
              placeholder="John Doe"
              icon={<User className="w-5 h-5" />}
              hint="This will be displayed on your profile"
            />

            {/* Email - Uses MobileInput */}
            <MobileInput
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
            />

            {/* Password - Uses MobileInput */}
            <MobileInput
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder="••••••••"
              icon={<Lock className="w-5 h-5" />}
              hint="Minimum 6 characters"
              error={error && error.includes('Password') ? error : undefined}
            />

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div className="flex items-center gap-2 text-sm">
                {password.length >= 6 ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Strong password</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-yellow-600">Password too short</span>
                  </>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && !error.includes('Password') && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button - Uses MobileButton (48px+ min height) */}
            <MobileButton
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </MobileButton>

            {/* Terms Notice */}
            <p className="text-xs text-gray-500 text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-purple-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-purple-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-600">
          Already have an account?{' '}
          <Link 
            href="/login" 
            className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
