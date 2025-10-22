-- Add seller_id column to marketplace_purchases table
ALTER TABLE marketplace_purchases 
ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Update any existing rows to have a seller_id (set to buyer_id temporarily if needed)
-- You may need to adjust this based on your data
UPDATE marketplace_purchases 
SET seller_id = buyer_id 
WHERE seller_id IS NULL;

-- Make seller_id NOT NULL after updating existing rows
ALTER TABLE marketplace_purchases 
ALTER COLUMN seller_id SET NOT NULL;

-- Create the index
CREATE INDEX IF NOT EXISTS idx_marketplace_purchases_seller_id ON marketplace_purchases(seller_id);

-- Update the RLS policy to include seller_id
DROP POLICY IF EXISTS marketplace_purchases_select_own ON marketplace_purchases;
CREATE POLICY marketplace_purchases_select_own ON marketplace_purchases 
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
