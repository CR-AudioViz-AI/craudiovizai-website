-- =====================================================
-- MIGRATION 001c: ROW LEVEL SECURITY POLICIES
-- This enables RLS and creates all security policies
-- Run after 001b completes successfully
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL TABLES
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Marketplace listings policies
CREATE POLICY "Listings are viewable by everyone" 
    ON marketplace_listings FOR SELECT 
    USING (status = 'active');

CREATE POLICY "Sellers can create listings" 
    ON marketplace_listings FOR INSERT 
    WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own listings" 
    ON marketplace_listings FOR UPDATE 
    USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own listings" 
    ON marketplace_listings FOR DELETE 
    USING (auth.uid() = seller_id);

-- Marketplace reviews policies
CREATE POLICY "Reviews are viewable by everyone" 
    ON marketplace_reviews FOR SELECT 
    USING (true);

CREATE POLICY "Users can create reviews" 
    ON marketplace_reviews FOR INSERT 
    WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews" 
    ON marketplace_reviews FOR UPDATE 
    USING (auth.uid() = reviewer_id);

CREATE POLICY "Users can delete own reviews" 
    ON marketplace_reviews FOR DELETE 
    USING (auth.uid() = reviewer_id);

-- Marketplace favorites policies
CREATE POLICY "Users can view own favorites" 
    ON marketplace_favorites FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" 
    ON marketplace_favorites FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" 
    ON marketplace_favorites FOR DELETE 
    USING (auth.uid() = user_id);

-- Blog posts policies
CREATE POLICY "Published posts are viewable by everyone" 
    ON blog_posts FOR SELECT 
    USING (status = 'published');

CREATE POLICY "Authors can create posts" 
    ON blog_posts FOR INSERT 
    WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts" 
    ON blog_posts FOR UPDATE 
    USING (auth.uid() = author_id);

-- Games policies
CREATE POLICY "Active games are viewable by everyone" 
    ON games FOR SELECT 
    USING (is_active = true);

-- Game scores policies
CREATE POLICY "Users can view all scores" 
    ON game_scores FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert own scores" 
    ON game_scores FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- AI generations policies
CREATE POLICY "Users can view own generations" 
    ON ai_generations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create generations" 
    ON ai_generations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- User credits policies
CREATE POLICY "Users can view own credits" 
    ON user_credits FOR SELECT 
    USING (auth.uid() = user_id);

-- Credit transactions policies
CREATE POLICY "Users can view own transactions" 
    ON credit_transactions FOR SELECT 
    USING (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" 
    ON subscriptions FOR SELECT 
    USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view own payments" 
    ON payments FOR SELECT 
    USING (auth.uid() = user_id);

-- Tutorials policies
CREATE POLICY "Published tutorials are viewable by everyone" 
    ON tutorials FOR SELECT 
    USING (is_published = true);

-- Tutorial progress policies
CREATE POLICY "Users can view own progress" 
    ON tutorial_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" 
    ON tutorial_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
    ON tutorial_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- Job applications policies
CREATE POLICY "Users can view own applications" 
    ON job_applications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create applications" 
    ON job_applications FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" 
    ON notifications FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" 
    ON notifications FOR UPDATE 
    USING (auth.uid() = user_id);
```

---

## ✅ **Step 5: Verify File #4**

**File:** `supabase/migrations/002_fix_marketplace_purchases.sql`  
**Action:** **LEAVE AS IS** - Don't touch this file, it's already correct!

---

## 📋 **Final Checklist**

Your `supabase/migrations/` folder should now contain:
```
✅ 001a_core_tables.sql              (NEW - you created)
✅ 001b_indexes_triggers.sql         (NEW - you created)
✅ 001c_rls_policies.sql             (NEW - you created)
✅ 002_fix_marketplace_purchases.sql (EXISTING - left alone)
🗑️ 001_initial_schema.sql           (DELETED or renamed)
