-- Neon Onslaught Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: neon_onslaught_scores
-- Stores individual game scores
CREATE TABLE IF NOT EXISTS neon_onslaught_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  player_name TEXT NOT NULL DEFAULT 'Anonymous',
  score BIGINT NOT NULL DEFAULT 0,
  wave_reached INTEGER NOT NULL DEFAULT 1,
  ship_type TEXT NOT NULL,
  game_mode TEXT NOT NULL DEFAULT 'story',
  kills INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  play_duration INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: neon_onslaught_profiles
-- Stores aggregate user statistics
CREATE TABLE IF NOT EXISTS neon_onslaught_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_score BIGINT DEFAULT 0,
  total_kills INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  highest_wave INTEGER DEFAULT 0,
  total_playtime INTEGER DEFAULT 0,
  achievements JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_scores_mode_score ON neon_onslaught_scores(game_mode, score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user ON neon_onslaught_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_created ON neon_onslaught_scores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scores_wave ON neon_onslaught_scores(wave_reached DESC);

-- Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE neon_onslaught_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE neon_onslaught_profiles ENABLE ROW LEVEL SECURITY;

-- Scores policies
-- Anyone can read scores (public leaderboard)
CREATE POLICY "Anyone can view scores"
  ON neon_onslaught_scores FOR SELECT
  USING (true);

-- Anyone can insert scores (anonymous play supported)
CREATE POLICY "Anyone can insert scores"
  ON neon_onslaught_scores FOR INSERT
  WITH CHECK (true);

-- Users can only update their own scores
CREATE POLICY "Users can update own scores"
  ON neon_onslaught_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- Profiles policies
-- Anyone can read profiles
CREATE POLICY "Anyone can view profiles"
  ON neon_onslaught_profiles FOR SELECT
  USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON neon_onslaught_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON neon_onslaught_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_neon_onslaught_profiles_updated_at
  BEFORE UPDATE ON neon_onslaught_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- INSERT INTO neon_onslaught_scores (player_name, score, wave_reached, ship_type, game_mode, kills)
-- VALUES 
--   ('TestPlayer1', 50000, 10, 'interceptor', 'story', 150),
--   ('TestPlayer2', 75000, 15, 'titan', 'story', 200),
--   ('TestPlayer3', 100000, 20, 'phantom', 'story', 300);

-- Grant permissions (if needed)
GRANT ALL ON neon_onslaught_scores TO authenticated;
GRANT ALL ON neon_onslaught_profiles TO authenticated;
GRANT ALL ON neon_onslaught_scores TO anon;
GRANT ALL ON neon_onslaught_profiles TO anon;
