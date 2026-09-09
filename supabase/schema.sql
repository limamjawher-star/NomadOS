-- ==============================================================================
-- NomadOS Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (Linked to Supabase Auth)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  tag text,
  email text,
  avatar_url text,
  nationality text default 'France',
  nationality_code text default 'FR',
  current_city text default 'Canggu, Bali',
  current_country text default 'Indonesia',
  current_country_code text default 'ID',
  is_pro boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- 2. State Snapshot Table for fast, multi-device JSON synchronization
create table if not exists public.user_nomad_state (
  user_id uuid references auth.users on delete cascade primary key,
  state_payload jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_nomad_state enable row level security;

create policy "Users can view own state"
  on public.user_nomad_state for select
  using (auth.uid() = user_id);

create policy "Users can insert or update own state"
  on public.user_nomad_state for all
  using (auth.uid() = user_id);

-- 3. Normalized Trips Table
create table if not exists public.trips (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  city text not null,
  country text not null,
  country_code text not null,
  arrival_date date not null,
  departure_date date not null,
  housing_cost_usd numeric default 0,
  accommodation_status text default 'Booked',
  visa_type text default 'Tourist',
  timezone text default 'UTC',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.trips enable row level security;

create policy "Users can manage own trips"
  on public.trips for all
  using (auth.uid() = user_id);

-- 4. Normalized Expenses Table
create table if not exists public.expenses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  category text not null,
  amount numeric not null,
  currency text default 'USD',
  amount_usd numeric not null,
  date date not null default current_date,
  is_deductible boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

create policy "Users can manage own expenses"
  on public.expenses for all
  using (auth.uid() = user_id);

-- 5. Trigger: Auto-create Profile on new Supabase User Sign-up (Google, Apple, or Email)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url, tag)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    coalesce(new.raw_user_meta_data->>'tag', '@' || split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
