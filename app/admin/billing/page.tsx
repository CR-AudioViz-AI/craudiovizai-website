// CR AudioViz AI - Billing Management Page
// Session: 2025-10-24 1:04 PM EST
// Complete billing management with payment history and subscription control

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';
import { CreditCard, Download, FileText, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default async function BillingManagementPage() {
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return null; // Layout will redirect
  }

  // Get user subscription info
  const { data: userData } = await supabase
    .from('users')
    .select('subscription_tier, subscription_status, stripe_customer_id, stripe_subscription_id, monthly_credits')
    .eq('id', session.user.id)
    .single();

  const subscriptionTier = userData?.subscription_tier || 'free';
  const subscriptionStatus = userData?.subscription_status || 'inactive';
  const monthlyCredits = userData?.monthly_credits || 0;

  // Get payment history
  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(20);

  // Calculate total spent
  const totalSpent = payments
    ?.filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0) || 0;

  // Subscription plans
  const plans = [
    {
      name: 'Free',
      price: 0,
      credits: 100,
      features: ['Basic AI tools', 'Email support', 'Community access'],
      current: subscriptionTier === 'free',
    },
    {
      name: 'Basic',
      price: 9.99,
      credits: 500,
      features: ['All AI tools', 'Priority support', 'API access', 'Advanced features'],
      current: subscriptionTier === 'basic',
      popular: false,
    },
    {
      name: 'Pro',
      price: 29.99,
      credits: 2000,
      features: ['All AI tools', 'Priority support', 'API access', 'White label', 'Custom integrations'],
      current: subscriptionTier === 'pro',
      popular: true,
    },
    {
      name: 'Premium',
      price: 99.99,
      credits: 10000,
      features: ['Everything in Pro', 'Dedicated support', 'Custom models', 'SLA guarantee', 'Unlimited API'],
      current: subscriptionTier === 'premium',
      popular: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="mt-2 text-gray-600">
          Manage your subscription, view payment history, and download invoices
        </p>
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Subscription</h2>
            <p className="text-gray-600">Your current plan and billing information</p>
          </div>
          {userData?.stripe_customer_id && (
            <Link
              href="/api/billing/stripe/portal"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Manage in Stripe
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Plan</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {subscriptionTier}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-lg font-semibold text-gray-900 capitalize">
                {subscriptionStatus}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Monthly Credits</div>
              <div className="text-lg font-semibold text-gray-900">
                {monthlyCredits.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-all ${
                plan.current
                  ? 'border-blue-600 border-2'
                  : plan.popular
                  ? 'border-purple-600 border-2'
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && !plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                    Recommended
                  </span>
                </div>
              )}

              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-600 text-white">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</div>
                <div className="text-4xl font-bold text-gray-900 mb-1">
                  ${plan.price}
                </div>
                <div className="text-sm text-gray-500 mb-4">/month</div>
                <div className="text-sm font-medium text-gray-700">
                  {plan.credits.toLocaleString()} credits/month
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.current ? (
                <button
                  disabled
                  className="w-full px-4 py-3 rounded-md text-sm font-medium bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  Current Plan
                </button>
              ) : (
                <Link
                  href={`/billing?plan=${plan.name.toLowerCase()}`}
                  className={`block w-full px-4 py-3 rounded-md text-center text-sm font-medium transition-colors ${
                    plan.popular
                      ? 'bg-purple-600 text-white hover:bg-purple-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total Spent</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalSpent.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {payment.currency?.toUpperCase()} Payment
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'failed'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <button className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No payment history yet. Upgrade your plan to get started!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Billing Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help with Billing?</h3>
            <p className="text-gray-700 mb-4">
              Contact our support team for assistance with billing questions, refunds, or account issues.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
