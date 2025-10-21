import { supabase } from './supabase/client'

export const CREDIT_PRICES = {
  tier1: { credits: 100, price: 10, bonus: 0 },
  tier2: { credits: 500, price: 45, bonus: 50 },
  tier3: { credits: 1000, price: 80, bonus: 150 },
  tier4: { credits: 5000, price: 350, bonus: 1000 },
}

export const SUBSCRIPTION_TIERS = {
  starter: { price: 19, credits: 200, name: 'Starter' },
  pro: { price: 49, credits: 750, name: 'Pro' },
  enterprise: { price: 149, credits: 3000, name: 'Enterprise' },
}

export async function deductCredits(userId: string, amount: number, description: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  if (!profile || profile.credits_balance < amount) {
    throw new Error('Insufficient credits')
  }

  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount: -amount,
    transaction_type: 'spend',
    description,
  })

  return true
}

export async function addCredits(
  userId: string,
  amount: number,
  type: string,
  description: string
) {
  await supabase.from('credit_transactions').insert({
    user_id: userId,
    amount,
    transaction_type: type,
    description,
  })

  return true
}
