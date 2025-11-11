'use client';

import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Coins, ArrowUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UserPlan {
  plan_name: string;
  credits: number;
  is_admin: boolean;
}

export default function CreditsBar() {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadUserPlan() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        // Get user plan from profiles or subscriptions table
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('plan_name, credits, is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error loading user plan:', error);
          setLoading(false);
          return;
        }

        setUserPlan(profile);
      } catch (error) {
        console.error('Error in loadUserPlan:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserPlan();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        loadUserPlan();
      } else if (event === 'SIGNED_OUT') {
        setUserPlan(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Don't show anything if not logged in or still loading
  if (loading || !userPlan) {
    return null;
  }

  // Admin view
  if (userPlan.is_admin) {
    return (
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold text-sm">Admin - Unlimited Access</span>
              </div>
              <div className="hidden md:flex items-center space-x-1 text-xs text-white/80">
                <span>✓ All Tools Free</span>
                <span className="mx-2">•</span>
                <span>✓ Unlimited Credits</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Link href="/admin">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 h-8 text-xs"
                >
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer view
  const planColors = {
    'Free': 'from-gray-500 to-gray-600',
    'Starter': 'from-blue-500 to-blue-600',
    'Pro': 'from-purple-500 to-purple-600',
    'Enterprise': 'from-indigo-600 to-purple-600',
  }[userPlan.plan_name] || 'from-gray-500 to-gray-600';

  return (
    <div className={`bg-gradient-to-r ${planColors} text-white`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Coins className="w-5 h-5 text-yellow-300" />
              <span className="font-semibold text-sm">{userPlan.plan_name} Plan</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <span className="hidden sm:inline text-white/90">Credits:</span>
              <span className="font-bold">{userPlan.credits.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Link href="/pricing">
              <Button 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 border border-white/30 text-white h-8 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                <span className="hidden sm:inline">Top Up</span>
              </Button>
            </Link>
            {userPlan.plan_name === 'Free' && (
              <Link href="/pricing">
                <Button 
                  size="sm" 
                  className="bg-white text-purple-600 hover:bg-white/90 h-8 text-xs font-semibold"
                >
                  <ArrowUp className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
