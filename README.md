# CR AudioViz AI Platform

**Your Story. Our Design.**

Complete AI-powered platform for creators, businesses, and communities.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account
- Stripe account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
```bash
git clone https://github.com/your-username/craudiovizai-website.git
cd craudiovizai-website
```

2. **Install dependencies**
```bash
npm install 
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values (see setup guides below)

4. **Run development server**
```bash
npm run dev
```

Visit http://localhost:3000

## 📦 Database Setup (Supabase)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Enter project details:
   - Name: `CRAudioViz Platform`
   - Database Password: (create strong password)
   - Region: (closest to your users)
4. Wait for project to be created (2-3 minutes)

### Step 2: Run Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New Query"**
3. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Paste into the query editor
5. Click **"Run"**
6. Verify tables were created in **Table Editor**

### Step 3: Get API Keys

1. Go to **Project Settings** → **API**
2. Copy these values to `.env.local`:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 💳 Payment Setup (Stripe)

### Step 1: Create Stripe Account

1. Go to https://stripe.com
2. Create account (use test mode initially)
3. Complete business verification

### Step 2: Get API Keys

1. In Stripe Dashboard, go to **Developers** → **API Keys**
2. Copy to `.env.local`:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### Step 3: Create Products & Prices

1. Go to **Products** → **Add Product**
2. Create these products:

**Starter Plan**
- Name: "Starter Plan"
- Description: "5,000 credits/month"
- Pricing: $19/month recurring
- Copy Price ID → `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`

**Pro Plan**
- Name: "Pro Plan"
- Description: "50,000 credits/month"
- Pricing: $99/month recurring
- Copy Price ID → `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`

**Enterprise Plan**
- Name: "Enterprise Plan"
- Description: "Unlimited credits"
- Pricing: $499/month recurring
- Copy Price ID → `NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID`

### Step 4: Set Up Webhook

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-domain.com/api/stripe` (update after deployment)
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy Signing Secret → `STRIPE_WEBHOOK_SECRET`

## 🌐 Deploy to Vercel

### Step 1: Connect GitHub

1. Go to https://vercel.com
2. Click **"Add New Project"**
3. Import your GitHub repository

### Step 2: Configure Project

1. Framework Preset: **Next.js** (auto-detected)
2. Root Directory: `./` (default)
3. Build Command: `npm run build` (default)
4. Output Directory: `.next` (default)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add ALL variables from `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_WEBHOOK_SECRET=...
(and all others from .env.example)
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Get your deployment URL
4. Test the site!

### Step 5: Add Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your domain (e.g., craudiovizai.com)
3. Follow DNS setup instructions
4. Wait for DNS propagation (can take up to 48 hours)

## 🔧 Post-Deployment

### Update Stripe Webhook URL

1. Go back to Stripe Dashboard → Webhooks
2. Edit your webhook endpoint
3. Update URL to: `https://your-actual-domain.com/api/stripe`
4. Save changes

### Test Payment Flow

1. Visit your site
2. Click "Sign Up"
3. Create test account
4. Try purchasing credits
5. Use Stripe test card: `4242 4242 4242 4242`
6. Verify credits are added to account

### Create Admin Account

1. Sign up for an account
2. Go to Supabase dashboard
3. Open **Table Editor** → **users**
4. Find your user record
5. Change `role` from `customer` to `admin`
6. Save
7. Now you can access `/admin` dashboard

## 📊 Monitoring

### Supabase Dashboard
- Monitor database usage
- View real-time queries
- Check API logs

### Vercel Dashboard
- Monitor deployments
- View function logs
- Check performance metrics

### Stripe Dashboard
- Track payments
- Monitor subscriptions
- Manage customers

## 🛠️ Development

### Project Structure
```
craudiovizai-website/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard
│   ├── javari/            # JavariAI pages
│   └── craiverse/         # CRAIverse pages
├── components/            # React components
├── lib/                   # Utility functions
├── public/               # Static assets
├── supabase/             # Database migrations
└── styles/               # CSS files
```

### Common Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Adding New Pages
1. Create file in `app/your-page/page.tsx`
2. Export default component
3. Page automatically available at `/your-page`

### Adding New API Routes
1. Create file in `app/api/your-route/route.ts`
2. Export HTTP method functions (GET, POST, etc.)
3. API available at `/api/your-route`

## 🐛 Troubleshooting

### "Supabase client is not configured"
- Check environment variables are set correctly
- Verify Supabase URL and keys are valid
- Restart development server

### "Stripe error: No such price"
- Verify Price IDs are correct in environment variables
- Ensure prices are in live/test mode matching your keys

### "Module not found" errors
- Run `npm install` to install dependencies
- Check import paths are correct

### Build fails on Vercel
- Check all environment variables are set
- Review build logs for specific errors
- Ensure database migrations have run

## 📝 TODO

- [ ] Add PayPal integration
- [ ] Build remaining CRAIverse modules
- [ ] Implement avatar chat interfaces
- [ ] Add email notifications
- [ ] Create mobile app
- [ ] Implement OAuth (Google, GitHub)

## 📧 Support

- Email: support@craudiovizai.com
- Website: https://craudiovizai.com
- Documentation: https://docs.craudiovizai.com

## 📄 License

Copyright © 2025 CR AudioViz AI, LLC. All rights reserved.

---

**Built with ❤️ by CR AudioViz AI**
