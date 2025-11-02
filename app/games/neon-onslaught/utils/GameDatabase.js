/**
 * Supabase Integration for Neon Onslaught
 * 
 * Features:
 * - Leaderboards (global, daily, friends)
 * - User profiles and stats
 * - Game session tracking
 * - Achievements
 * 
 * Database Schema (to be created in Supabase):
 * 
 * TABLE: neon_onslaught_scores
 * - id (uuid, primary key)
 * - user_id (uuid, foreign key to auth.users)
 * - player_name (text)
 * - score (bigint)
 * - wave_reached (int)
 * - ship_type (text)
 * - game_mode (text: 'story', 'endless', 'boss_rush', 'daily')
 * - kills (int)
 * - accuracy (float)
 * - play_duration (int, seconds)
 * - created_at (timestamp)
 * 
 * TABLE: neon_onslaught_profiles
 * - user_id (uuid, primary key, foreign key to auth.users)
 * - total_score (bigint)
 * - total_kills (int)
 * - games_played (int)
 * - highest_wave (int)
 * - total_playtime (int, seconds)
 * - achievements (jsonb)
 * - created_at (timestamp)
 * - updated_at (timestamp)
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kteobfyferrukqeolofj.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0ZW9iZnlmZXJydWtxZW9sb2ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNDU3MzgsImV4cCI6MjA3NjcyMTczOH0.IB-yO0LnkZ4BYYET6YwRmn6Z4fZPwQYMjChBYIp25SM';

const supabase = createClient(supabaseUrl, supabaseKey);

export class GameDatabase {
  constructor() {
    this.supabase = supabase;
    this.currentUser = null;
  }

  // Submit score to leaderboard
  async submitScore(scoreData) {
    try {
      const { data, error } = await this.supabase
        .from('neon_onslaught_scores')
        .insert([{
          user_id: this.currentUser?.id,
          player_name: scoreData.playerName || 'Anonymous',
          score: scoreData.score,
          wave_reached: scoreData.wave,
          ship_type: scoreData.ship,
          game_mode: scoreData.mode || 'story',
          kills: scoreData.kills || 0,
          accuracy: scoreData.accuracy || 0,
          play_duration: scoreData.duration || 0,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      // Update profile stats
      await this.updateProfileStats(scoreData);
      
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting score:', error);
      return { success: false, error };
    }
  }

  // Get leaderboard
  async getLeaderboard(mode = 'story', limit = 10, timeframe = 'all') {
    try {
      let query = this.supabase
        .from('neon_onslaught_scores')
        .select('*')
        .eq('game_mode', mode)
        .order('score', { ascending: false })
        .limit(limit);

      // Filter by timeframe
      if (timeframe === 'daily') {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        query = query.gte('created_at', yesterday.toISOString());
      } else if (timeframe === 'weekly') {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        query = query.gte('created_at', lastWeek.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('neon_onslaught_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      // Create profile if doesn't exist
      if (!data) {
        return await this.createUserProfile(userId);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error };
    }
  }

  // Create user profile
  async createUserProfile(userId) {
    try {
      const { data, error } = await this.supabase
        .from('neon_onslaught_profiles')
        .insert([{
          user_id: userId,
          total_score: 0,
          total_kills: 0,
          games_played: 0,
          highest_wave: 0,
          total_playtime: 0,
          achievements: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { success: false, error };
    }
  }

  // Update profile stats
  async updateProfileStats(scoreData) {
    if (!this.currentUser) return;

    try {
      const profile = await this.getUserProfile(this.currentUser.id);
      
      if (!profile.success || !profile.data) return;

      const currentStats = profile.data;

      const { data, error } = await this.supabase
        .from('neon_onslaught_profiles')
        .update({
          total_score: currentStats.total_score + scoreData.score,
          total_kills: currentStats.total_kills + (scoreData.kills || 0),
          games_played: currentStats.games_played + 1,
          highest_wave: Math.max(currentStats.highest_wave, scoreData.wave),
          total_playtime: currentStats.total_playtime + (scoreData.duration || 0),
          updated_at: new Date().toISOString()
        })
        .eq('user_id', this.currentUser.id);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating profile stats:', error);
      return { success: false, error };
    }
  }

  // Get user rank
  async getUserRank(userId, mode = 'story') {
    try {
      // Get user's best score
      const { data: userScores, error: userError } = await this.supabase
        .from('neon_onslaught_scores')
        .select('score')
        .eq('user_id', userId)
        .eq('game_mode', mode)
        .order('score', { ascending: false })
        .limit(1);

      if (userError) throw userError;
      if (!userScores || userScores.length === 0) return { success: true, rank: null };

      const userScore = userScores[0].score;

      // Count how many scores are higher
      const { count, error: countError } = await this.supabase
        .from('neon_onslaught_scores')
        .select('*', { count: 'exact', head: true })
        .eq('game_mode', mode)
        .gt('score', userScore);

      if (countError) throw countError;

      return { success: true, rank: count + 1, score: userScore };
    } catch (error) {
      console.error('Error getting user rank:', error);
      return { success: false, error };
    }
  }

  // Check if user is authenticated
  async checkAuth() {
    const { data: { user } } = await this.supabase.auth.getUser();
    this.currentUser = user;
    return user;
  }

  // Anonymous submission (no auth required)
  async submitAnonymousScore(scoreData) {
    try {
      const { data, error } = await this.supabase
        .from('neon_onslaught_scores')
        .insert([{
          player_name: scoreData.playerName || 'Anonymous',
          score: scoreData.score,
          wave_reached: scoreData.wave,
          ship_type: scoreData.ship,
          game_mode: scoreData.mode || 'story',
          kills: scoreData.kills || 0,
          accuracy: scoreData.accuracy || 0,
          play_duration: scoreData.duration || 0,
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting anonymous score:', error);
      return { success: false, error };
    }
  }
}

export default new GameDatabase();
