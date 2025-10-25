-- CR AudioViz AI - Expense & Subscription Tracker Schema
-- Migration: 20251025_expense_tracker_base
-- Description: Core tables for expense tracking, subscriptions, vendors, categories

create extension if not exists "uuid-ossp";

-- Organizations table (if not exists)
create table if not exists orgs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  created_at timestamptz not null default now()
);

-- Vendors table
create table if not exists vendors (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  website text,
  tax_id text,
  notes text,
  created_at timestamptz not null default now(),
  unique (org_id, name)
);

-- Categories table
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  name text not null,
  type text check (type in ('subscription','one_time','payroll','tax','other')) default 'subscription',
  deductible boolean default true,
  tax_category text,
  created_at timestamptz not null default now()
);

-- Subscriptions table
create table if not exists subscriptions (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  name text not null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  billing_interval text check (billing_interval in ('day','week','month','quarter','year')) default 'month',
  start_date date not null,
  end_date date,
  category_id uuid references categories(id) on delete set null,
  tags text[] default '{}',
  notes text,
  active boolean not null default true,
  renewal_term text default 'annual',
  auto_renew boolean default true,
  grace_days int default 0,
  created_at timestamptz not null default now()
);

-- Expenses table (per-charge logging)
create table if not exists expenses (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  vendor_id uuid references vendors(id) on delete set null,
  subscription_id uuid references subscriptions(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  amount numeric(12,2) not null,
  currency text not null default 'USD',
  txn_date date not null,
  due_on date,
  description text,
  tags text[] default '{}',
  payment_method text,
  receipt_url text,
  created_at timestamptz not null default now()
);

-- Attachments table
create table if not exists attachments (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references orgs(id) on delete cascade,
  expense_id uuid references expenses(id) on delete cascade,
  file_url text not null,
  mime_type text,
  uploaded_at timestamptz not null default now()
);

-- Alerts table (for renewal notifications)
create table if not exists alerts (
  id bigserial primary key,
  org_id uuid not null references orgs(id) on delete cascade,
  source text not null, -- 'subscription' | 'expense'
  source_id uuid not null,
  kind text not null, -- 'renewal_due' | 'payment_due'
  title text not null,
  description text,
  due_on date not null,
  first_triggered_at timestamptz not null default now(),
  last_triggered_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  snooze_until date,
  created_at timestamptz not null default now(),
  unique (org_id, source, source_id, kind, due_on)
);

-- Audit log table
create table if not exists audit_log (
  id bigint generated always as identity primary key,
  org_id uuid not null references orgs(id) on delete cascade,
  actor text not null,
  action text not null,
  entity text not null,
  entity_id text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists idx_expenses_org_date on expenses(org_id, txn_date);
create index if not exists idx_subscriptions_org_active on subscriptions(org_id, active);
create index if not exists idx_vendors_org on vendors(org_id);
create index if not exists idx_categories_org on categories(org_id);
create index if not exists idx_alerts_org_active on alerts(org_id, acknowledged_at, snooze_until);
create index if not exists idx_audit_log_org on audit_log(org_id, created_at);

-- View for active alerts
create or replace view v_active_alerts as
select * from alerts 
where acknowledged_at is null 
  and (snooze_until is null or snooze_until < now()::date);

