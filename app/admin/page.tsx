// CR AudioViz AI - Admin Dashboard Main Page
// Session: 2025-10-24 12:56 PM EST
// Adapted from crav-dashboard-app with full production integration

import Link from "next/link";
import {
  Crown,
  ShieldCheck,
  Sparkles,
  CreditCard,
  Gauge,
  Package2,
  Wallet2,
  Zap,
} from "lucide-react";
import { createServerClient } from '@/lib/supabase-server';

/* ---------- Presentational Components ---------- */

function Stat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-gray-600">{label}</div>
        {Icon ? <Icon className="h-5 w-5 text-gray-400" /> : null}
      </div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {value}
      </div>
      {hint ? <div className="mt-2 text-sm text-gray-500">{hint}</div> : null}
    </div>
  );
}

function AppTile({
  name,
  blurb,
  href = "#",
  status = "active",
}: {
  name: string;
  blurb: string;
  href?: string;
  status?: "active" | "inactive" | "beta";
}) {
  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-50 text-gray-600 border-gray-200",
    beta: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}
        >
          {status === "active" ? "Active" : status === "beta" ? "Beta" : "Inactive"}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600 flex-1">{blurb}</p>
      <div className="mt-4">
        <Link
          href={href}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Open App
        </Link>
      </div>
    </div>
  );
}

/* ---------- Main Page ---------- */

export default async function AdminDashboardPage() {
  // Get authenticated user
  const supabase = createServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return null; // Layout will redirect
  }

  // Fetch user data
  const { data: userData } = await supabase
    .from('users')
    .select('credits, subscription_tier, subscription_status')
    .eq('id', session.user.id)
    .single();

  const creditBalance = userData?.credits || 0;
  const planName = userData?.subscription_tier || 'Free';
  const subscriptionStatus = userData?.subscription_status || 'inactive';

  // Check if admin
  const { data: profileData } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  const isAdmin = profileData?.role === 'admin';
  const creditValue = isAdmin ? "Unlimited" : creditBalance.toLocaleString();

  // Get monthly credits based on plan
  const monthlyCreditsMap: Record<string, number> = {
    free: 100,
    basic: 500,
    pro: 2000,
    premium: 10000,
  };
  const monthlyCredits = monthlyCreditsMap[planName.toLowerCase()] || 100;

  // Get app stats
  const { count: totalApps } = await supabase
    .from('ai_generations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', session.user.id);

  // CR AudioViz AI Apps
  const apps = [
    {
      name: "Javari AI Assistant",
      blurb: "Your personal AI assistant powered by OpenAI GPT-4 Turbo with streaming responses.",
      href: "/apps/javari",
      status: "active" as const,
    },
    {
      name: "AI Image Generator",
      blurb: "Create stunning images with DALL-E 3. Generate, refine, and export high-quality visuals.",
      href: "/apps/image-generator",
      status: "active" as const,
    },
    {
      name: "AI Video Creator",
      blurb: "Transform ideas into professional videos with AI-powered editing and effects.",
      href: "/apps/video-creator",
      status: "active" as const,
    },
    {
      name: "Music Builder",
      blurb: "Compose tracks with AI instruments. Stem export, mastering, and mixdown.",
      href: "/apps/music-builder",
      status: "active" as const,
    },
    {
      name: "Code Generator",
      blurb: "Generate production-ready code in any language with AI assistance.",
      href: "/apps/code-generator",
      status: "active" as const,
    },
    {
      name: "Website Builder",
      blurb: "Launch production-grade sites with modular blocks and built-in SEO.",
      href: "/apps/website-builder",
      status: "active" as const,
    },
    {
      name: "Game Creator",
      blurb: "Build and deploy games with AI-powered game development tools.",
      href: "/apps/game-creator",
      status: "beta" as const,
    },
    {
      name: "Business Planner",
      blurb: "Create comprehensive business plans with AI-powered market analysis.",
      href: "/apps/business-planner",
      status: "active" as const,
    },
    {
      name: "Learning Assistant",
      blurb: "Personalized learning experiences with adaptive AI tutoring.",
      href: "/apps/learning",
      status: "active" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero / Intro */}
      <section>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome to CR AudioViz AI Admin
              </h1>
              <p className="mt-2 text-gray-600">
                Unified command center for <strong>apps</strong>,{" "}
                <strong>credits</strong>, and <strong>billing</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  <Crown className="h-4 w-4" />
                  Admin: Unlimited
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                <ShieldCheck className="h-4 w-4" />
                Enterprise-grade
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat
          label="Credit Balance"
          value={creditValue}
          hint={isAdmin ? "No limits for administrators" : "credits available"}
          icon={Wallet2}
        />
        <Stat
          label="Current Plan"
          value={planName.charAt(0).toUpperCase() + planName.slice(1)}
          hint={`${monthlyCredits.toLocaleString()} credits/month`}
          icon={Package2}
        />
        <Stat
          label="Total Generations"
          value={String(totalApps || 0)}
          hint="across all apps"
          icon={Sparkles}
        />
        <Stat label="API Response" value="~120ms" hint="last 24 hours" icon={Gauge} />
      </section>

      {/* Apps Catalog */}
      <section>
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="h-6 w-6 text-blue-600" />
              Apps Catalog
            </h2>
            <p className="text-gray-600 mt-1">
              Discover tools. Try for free. Install with one click.
            </p>
          </div>
          <Link
            href="/admin/apps"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.slice(0, 6).map((app) => (
            <AppTile key={app.name} {...app} />
          ))}
        </div>
      </section>

      {/* Unified Credits + Billing */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unified Credits */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900">Unified Credits</h3>
          <p className="text-gray-600 mt-1">
            One balance powers all apps. Share across tools, carry over, and top-up anytime.
          </p>

          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Current Balance</div>
              <div className="text-2xl font-bold mt-1 text-gray-900">{creditValue}</div>
              {!isAdmin && (
                <div className="text-xs text-gray-500 mt-1">credits</div>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Monthly Allocation</div>
              <div className="text-2xl font-bold mt-1 text-gray-900">{monthlyCredits.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-1">credits/month</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/admin/credits"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Manage Credits
            </Link>
            <Link
              href="/admin/apps"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              Browse Apps
            </Link>
          </div>
        </div>

        {/* Billing & Payments */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900">Billing & Payments</h3>
          <p className="text-gray-600 mt-1">
            Upgrade your plan or purchase credits via Stripe or PayPal.
          </p>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Current Plan</div>
              <div className="text-xl font-semibold mt-1 text-gray-900">
                {planName.charAt(0).toUpperCase() + planName.slice(1)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {monthlyCredits.toLocaleString()} credits/month
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="text-sm text-gray-600">Status</div>
              <div className="text-xl font-semibold mt-1 text-gray-900">
                {subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
              </div>
              <div className="text-xs text-gray-500 mt-1">subscription status</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/billing"
              className="inline-flex items-center gap-2 px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="h-4 w-4" />
              Manage Billing
            </Link>
            <Link
              href="/admin/billing"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Billing Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-sell */}
      <section>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Supercharge your workflow with connected apps
              </h3>
              <p className="text-gray-600 mt-1">
                All apps share credits, assets, and settings. Install one and they work together.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/admin/apps"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Explore Apps
              </Link>
              <Link
                href="/admin/assets"
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Manage Assets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
