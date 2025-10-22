-- ==========================================
-- ENABLE EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- SUBSCRIPTIONS & PAYMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- CREDITS
-- ==========================================
CREATE TABLE IF NOT EXISTS credits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- PROJECTS
-- ==========================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('app', 'game', 'website', 'music', 'art', 'video')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  data JSONB,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- TRANSACTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('credit_purchase', 'credit_usage', 'subscription', 'marketplace_sale', 'marketplace_purchase')),
  amount DECIMAL(10, 2) NOT NULL,
  credits INTEGER,
  description TEXT,
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MARKETPLACE ITEMS
-- ==========================================
CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('app', 'game', 'website', 'template', 'asset', 'music', 'art', 'video')),
  price DECIMAL(10, 2) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  preview_images TEXT[],
  tags TEXT[],
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- MARKETPLACE PURCHASES
-- ==========================================
CREATE TABLE IF NOT EXISTS marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  seller_earnings DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- REVIEWS
-- ==========================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES marketplace_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_user_id ON credits(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_user_id ON marketplace_items(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_category ON marketplace_items(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_items_status ON marketplace_items(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_buyer_id ON marketplace_purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_seller_id ON marketplace_purchases(seller_id);
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY IF NOT EXISTS users_select_own ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY IF NOT EXISTS users_update_own ON users FOR UPDATE USING (auth.uid() = id);

-- Subscriptions policies
CREATE POLICY IF NOT EXISTS subscriptions_select_own ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS subscriptions_insert_own ON subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS subscriptions_update_own ON subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Credits policies
CREATE POLICY IF NOT EXISTS credits_select_own ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS credits_insert_own ON credits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS credits_update_own ON credits FOR UPDATE USING (auth.uid() = user_id);

-- Projects policies
CREATE POLICY IF NOT EXISTS projects_select_own ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS projects_insert_own ON projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS projects_update_own ON projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS projects_delete_own ON projects FOR DELETE USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY IF NOT EXISTS transactions_select_own ON transactions FOR SELECT USING (auth.uid() = user_id);

-- Marketplace items policies
CREATE POLICY IF NOT EXISTS marketplace_items_select_all ON marketplace_items FOR SELECT USING (status = 'approved');
CREATE POLICY IF NOT EXISTS marketplace_items_select_own ON marketplace_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS marketplace_items_insert_own ON marketplace_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS marketplace_items_update_own ON marketplace_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS marketplace_items_delete_own ON marketplace_items FOR DELETE USING (auth.uid() = user_id);

-- Marketplace purchases policies
CREATE POLICY IF NOT EXISTS marketplace_purchases_select_own ON marketplace_purchases FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY IF NOT EXISTS marketplace_purchases_insert_own ON marketplace_purchases FOR INSERT WITH CHECK (auth.uid() = buyer_id);

-- Reviews policies
CREATE POLICY IF NOT EXISTS reviews_select_all ON reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS reviews_insert_own ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS reviews_update_own ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS reviews_delete_own ON reviews FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY IF NOT EXISTS notifications_select_own ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS notifications_update_own ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS notifications_delete_own ON notifications FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- FUNCTIONS
-- ==========================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_credits_updated_at ON credits;
CREATE TRIGGER update_credits_updated_at BEFORE UPDATE ON credits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_marketplace_items_updated_at ON marketplace_items;
CREATE TRIGGER update_marketplace_items_updated_at BEFORE UPDATE ON marketplace_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
