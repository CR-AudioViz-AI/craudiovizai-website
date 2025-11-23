'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { MobileInput, MobileButton } from '@/components/mobile';

export default function LoginPage() {
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

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if admin
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', data.user.id)
          .single();

        // Redirect based on admin status
        if (profile?.is_admin) {
          router.push('/admin');
        } else {
          router.push('/');
        }
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
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome Back</h1>
          <p className="text-base md:text-lg text-gray-600">Sign in to continue building</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email - Uses MobileInput (16px font, prevents iOS zoom) */}
            <MobileInput
              type="email"
              label="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="you@example.com"
              icon={<Mail className="w-5 h-5" />}
              error={error && email === '' ? 'Email is required' : undefined}
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
              error={error && password === '' ? 'Password is required' : undefined}
            />

            {/* Error Message */}
            {error && (
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
              {loading ? 'Signing in...' : 'Sign In'}
            </MobileButton>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-4 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="mt-6 md:mt-8 text-center text-sm md:text-base text-gray-600">
          Don't have an account?{' '}
          <Link 
            href="/signup" 
            className="text-purple-600 hover:text-purple-700 font-bold transition-colors"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
