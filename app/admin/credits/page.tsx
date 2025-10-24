// CR AudioViz AI - Credits Management Page
// Session: 2025-10-24 1:03 PM EST
// Complete credits management with purchase options and transaction history

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { CreditCard, TrendingUp, TrendingDown, Package, Zap } from 'lucide-react';

// Credit packages
const CREDIT_PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 100,
    price: 10,
    priceId: 'price_starter_100',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 500,
    price: 45,
    priceId: 'price_pro_500',
    popular: true,
    savings: '10%',
  },
  {
    id: 'premium',
    name: 'Premium Pack',
    credits: 1000,
    price: 80,
    priceId: 'price_premium_1000',
    popular: false,
    savings: '20%',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 5000,
    price: 350,
    priceId: 'price_enterprise_5000',
    popular: false,
    savings: '30%',
  },
];

export default async function CreditsManagementPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null; // Layout will redirect
  }

  // Get user credits
  const { data: userData } = await supabase
    .from('users')
    .select('credits, monthly_credits, subscription_tier')
    .eq('id', session.user.id)
    .single();

  const currentCredits = userData?.credits || 0;
  const monthlyAllocation = userData?.monthly_credits || 0;
  const subscriptionTier = userData?.subscription_tier || 'free';

  // Get transaction history
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Calculate stats
  const totalPurchased = transactions
    ?.filter((t) => t.transaction_type === 'purchase' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalUsed = transactions
    ?.filter((t) => t.transaction_type === 'deduction')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Credits Management</h1>
        <p className="mt-2 text-gray-600">
          Manage your credit balance, purchase credits, and view transaction history
        </p>
      </div>

      {/* Current Balance */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-blue-100 text-sm font-medium mb-2">Current Balance</div>
            <div className="text-5xl font-bold">{currentCredits.toLocaleString()}</div>
            <div className="text-blue-100 text-sm mt-2">credits available</div>
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <Zap className="w-12 h-12" />
          </div>
        </div>

        {monthlyAllocation > 0 && (
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-100">Monthly Allocation ({subscriptionTier})</span>
              <span className="font-semibold">{monthlyAllocation.toLocaleString()} credits/month</span>
            </div>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-sm text-gray-600">Total Purchased</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalPurchased.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">credits</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-sm text-gray-600">Total Used</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {totalUsed.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500 mt-1">credits</div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {transactions?.length || 0}
          </div>
          <div className="text-sm text-gray-500 mt-1">total</div>
        </div>
      </div>

      {/* Purchase Credits */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREDIT_PACKAGES.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-all ${
                pack.popular ? 'border-blue-600 border-2' : 'border-gray-200'
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-2">{pack.name}</div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  {pack.credits.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-4">credits</div>

                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${pack.price}
                </div>
                <div className="text-sm text-gray-500 mb-4">
                  ${(pack.price / pack.credits).toFixed(3)}/credit
                </div>

                {pack.savings && (
                  <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
                    Save {pack.savings}
                  </div>
                )}

                <Link
                  href={`/billing?package=${pack.id}`}
                  className={`block w-full px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    pack.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 inline mr-2" />
                  Purchase
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h2>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance After
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => {
                    const isCredit = transaction.amount > 0;
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(transaction.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              isCredit
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.transaction_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.source || 'N/A'}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                            isCredit ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isCredit ? '+' : ''}
                          {transaction.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 font-medium">
                          {transaction.balance_after?.toLocaleString() || 'N/A'}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No transactions yet. Purchase your first credit pack to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <div className="font-medium text-gray-900 mb-1">How do credits work?</div>
            <div className="text-sm text-gray-600">
              Credits are used to access AI-powered features. Each app consumes a different amount
              of credits based on computational requirements.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Do credits expire?</div>
            <div className="text-sm text-gray-600">
              No, purchased credits never expire and roll over month to month. Subscription credits
              refresh monthly.
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-900 mb-1">Can I get a refund?</div>
            <div className="text-sm text-gray-600">
              Unused credits can be refunded within 30 days of purchase. Contact support for
              assistance.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
