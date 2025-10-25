-- CR AudioViz AI - Expense Tracker RLS Policies
-- Migration: 20251025_expense_tracker_policies
-- Description: Row Level Security policies for expense tracker tables

-- Enable RLS on all tables
alter table orgs enable row level security;
alter table vendors enable row level security;
alter table categories enable row level security;
alter table subscriptions enable row level security;
alter table expenses enable row level security;
alter table attachments enable row level security;
alter table alerts enable row level security;
alter table audit_log enable row level security;

-- Drop existing policies if they exist
drop policy if exists vendors_rw on vendors;
drop policy if exists categories_rw on categories;
drop policy if exists subscriptions_rw on subscriptions;
drop policy if exists expenses_rw on expenses;
drop policy if exists attachments_rw on attachments;
drop policy if exists alerts_rw on alerts;
drop policy if exists audit_log_ro on audit_log;

-- Create policies for authenticated users
-- Note: In production, refine these to check org_id from JWT claims

create policy vendors_rw on vendors 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy categories_rw on categories 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy subscriptions_rw on subscriptions 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy expenses_rw on expenses 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy attachments_rw on attachments 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy alerts_rw on alerts 
  for all 
  using (auth.uid() is not null) 
  with check (auth.uid() is not null);

create policy audit_log_ro on audit_log 
  for select 
  using (auth.uid() is not null);

-- Grant usage on sequences
grant usage on sequence alerts_id_seq to authenticated;
grant usage on sequence audit_log_id_seq to authenticated;

