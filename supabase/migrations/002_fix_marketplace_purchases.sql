-- =====================================================
-- FIX MARKETPLACE PURCHASES TABLE
-- =====================================================

-- Drop the existing table if it exists to start fresh
DROP TABLE IF EXISTS public.marketplace_purchases CASCADE;

-- Create marketplace_purchases table with correct structure and references
CREATE TABLE public.marketplace_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID NOT NULL REFERENCES marketplace_listings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    commission DECIMAL(10, 2) NOT NULL DEFAULT 0,
    seller_earnings DECIMAL(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    transaction_fee DECIMAL(10, 2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    payment_method TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_marketplace_purchases_buyer_id ON marketplace_purchases(buyer_id);
CREATE INDEX idx_marketplace_purchases_seller_id ON marketplace_purchases(seller_id);
CREATE INDEX idx_marketplace_purchases_listing_id ON marketplace_purchases(listing_id);
CREATE INDEX idx_marketplace_purchases_status ON marketplace_purchases(status);
CREATE INDEX idx_marketplace_purchases_created_at ON marketplace_purchases(created_at DESC);
CREATE INDEX idx_marketplace_purchases_stripe_payment_intent_id ON marketplace_purchases(stripe_payment_intent_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE RLS POLICIES
-- =====================================================

-- Buyers can view their own purchases
CREATE POLICY "marketplace_purchases_select_buyer" 
    ON marketplace_purchases 
    FOR SELECT 
    USING (auth.uid() = buyer_id);

-- Sellers can view their own sales
CREATE POLICY "marketplace_purchases_select_seller" 
    ON marketplace_purchases 
    FOR SELECT 
    USING (auth.uid() = seller_id);

-- Only buyers can create purchase records (when they complete checkout)
CREATE POLICY "marketplace_purchases_insert_buyer" 
    ON marketplace_purchases 
    FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

-- Buyers can update their own purchase records (for refund requests, etc.)
CREATE POLICY "marketplace_purchases_update_buyer" 
    ON marketplace_purchases 
    FOR UPDATE 
    USING (auth.uid() = buyer_id);

-- Sellers can update purchase records for their sales (for fulfillment status, etc.)
CREATE POLICY "marketplace_purchases_update_seller" 
    ON marketplace_purchases 
    FOR UPDATE 
    USING (auth.uid() = seller_id);

-- =====================================================
-- CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

CREATE TRIGGER update_marketplace_purchases_updated_at 
    BEFORE UPDATE ON marketplace_purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CREATE FUNCTION TO CALCULATE COMMISSION AND EARNINGS
-- =====================================================

-- Function to automatically calculate commission and seller earnings
CREATE OR REPLACE FUNCTION calculate_marketplace_commission()
RETURNS TRIGGER AS $$
DECLARE
    commission_rate DECIMAL(5, 4) := 0.15; -- 15% commission
BEGIN
    -- Calculate commission (15% of amount)
    NEW.commission := NEW.amount * commission_rate;
    
    -- Calculate seller earnings (amount minus commission)
    NEW.seller_earnings := NEW.amount - NEW.commission;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate commission on insert or update
CREATE TRIGGER calculate_purchase_commission 
    BEFORE INSERT OR UPDATE ON marketplace_purchases 
    FOR EACH ROW 
    EXECUTE FUNCTION calculate_marketplace_commission();

-- =====================================================
-- CREATE FUNCTION TO UPDATE SELLER STATISTICS
-- =====================================================

-- Function to update seller statistics when a purchase is made
CREATE OR REPLACE FUNCTION update_seller_stats_on_purchase()
RETURNS TRIGGER AS $$
BEGIN
    -- Update download count for the listing when purchase is completed
    IF NEW.status = 'completed' THEN
        UPDATE marketplace_listings 
        SET download_count = download_count + 1,
            updated_at = NOW()
        WHERE id = NEW.listing_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update seller statistics
CREATE TRIGGER update_seller_stats 
    AFTER INSERT OR UPDATE ON marketplace_purchases 
    FOR EACH ROW 
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_seller_stats_on_purchase();

-- =====================================================
-- CREATE VIEW FOR PURCHASE ANALYTICS
-- =====================================================

-- View for marketplace purchase analytics
CREATE OR REPLACE VIEW marketplace_purchase_analytics AS
SELECT 
    mp.id,
    mp.buyer_id,
    mp.seller_id,
    mp.listing_id,
    mp.amount,
    mp.commission,
    mp.seller_earnings,
    mp.status,
    mp.created_at,
    ml.title AS listing_title,
    ml.category_id,
    seller_profile.username AS seller_username,
    seller_profile.full_name AS seller_name,
    buyer_profile.username AS buyer_username,
    buyer_profile.full_name AS buyer_name
FROM marketplace_purchases mp
LEFT JOIN marketplace_listings ml ON mp.listing_id = ml.id
LEFT JOIN profiles seller_profile ON mp.seller_id = seller_profile.id
LEFT JOIN profiles buyer_profile ON mp.buyer_id = buyer_profile.id;

-- Grant access to the view
GRANT SELECT ON marketplace_purchase_analytics TO authenticated;

-- =====================================================
-- CREATE COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE marketplace_purchases IS 'Stores all marketplace purchase transactions';
COMMENT ON COLUMN marketplace_purchases.buyer_id IS 'Reference to the user who made the purchase';
COMMENT ON COLUMN marketplace_purchases.seller_id IS 'Reference to the user who created the listing';
COMMENT ON COLUMN marketplace_purchases.listing_id IS 'Reference to the marketplace listing being purchased';
COMMENT ON COLUMN marketplace_purchases.amount IS 'Total purchase amount in the specified currency';
COMMENT ON COLUMN marketplace_purchases.commission IS 'Platform commission (automatically calculated as 15% of amount)';
COMMENT ON COLUMN marketplace_purchases.seller_earnings IS 'Amount seller receives after commission (automatically calculated)';
COMMENT ON COLUMN marketplace_purchases.status IS 'Purchase status: pending, completed, failed, or refunded';
COMMENT ON COLUMN marketplace_purchases.stripe_payment_intent_id IS 'Stripe payment intent ID for tracking payments';
COMMENT ON COLUMN marketplace_purchases.stripe_charge_id IS 'Stripe charge ID for the transaction';
COMMENT ON COLUMN marketplace_purchases.transaction_fee IS 'Payment processor transaction fee';
COMMENT ON COLUMN marketplace_purchases.currency IS 'Currency code (default: USD)';
COMMENT ON COLUMN marketplace_purchases.payment_method IS 'Payment method used (card, bank transfer, etc.)';
COMMENT ON COLUMN marketplace_purchases.metadata IS 'Additional purchase metadata in JSON format';
COMMENT ON COLUMN marketplace_purchases.refund_reason IS 'Reason provided if purchase was refunded';
COMMENT ON COLUMN marketplace_purchases.refunded_at IS 'Timestamp when the purchase was refunded';
