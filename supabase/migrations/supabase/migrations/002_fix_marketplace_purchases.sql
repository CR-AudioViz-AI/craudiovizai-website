-- Drop the existing table and recreate with correct structure
DROP TABLE IF EXISTS marketplace_purchases CASCADE;

CREATE TABLE marketplace_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES marketplace_items(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  commission DECIMAL(10, 2) NOT NULL,
  seller_earnings DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_marketplace_purchases_buyer_id ON marketplace_purchases(buyer_id);
CREATE INDEX idx_marketplace_purchases_seller_id ON marketplace_purchases(seller_id);

-- Enable RLS
ALTER TABLE marketplace_purchases ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY marketplace_purchases_select_own ON marketplace_purchases 
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY marketplace_purchases_insert_own ON marketplace_purchases 
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);
