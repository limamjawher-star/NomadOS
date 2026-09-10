-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  home_currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile." ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- TRIPS
CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  accommodation_status TEXT NOT NULL,
  housing_cost_usd NUMERIC NOT NULL DEFAULT 0,
  visa_type TEXT,
  timezone TEXT,
  cover_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own trips." ON trips FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own trips." ON trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips." ON trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips (soft)." ON trips FOR DELETE USING (auth.uid() = user_id);

-- SCHENGEN STAYS
CREATE TABLE schengen_stays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  entry_date DATE NOT NULL,
  exit_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE schengen_stays ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own schengen stays." ON schengen_stays FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own schengen stays." ON schengen_stays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own schengen stays." ON schengen_stays FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own schengen stays (soft)." ON schengen_stays FOR DELETE USING (auth.uid() = user_id);

-- EXPENSES
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  amount_usd NUMERIC NOT NULL,
  is_deductible BOOLEAN DEFAULT false,
  notes TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own expenses." ON expenses FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own expenses." ON expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses." ON expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses (soft)." ON expenses FOR DELETE USING (auth.uid() = user_id);

-- INCOME STREAMS
CREATE TABLE income_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  source TEXT NOT NULL,
  type TEXT NOT NULL,
  monthly_amount_usd NUMERIC NOT NULL,
  currency TEXT NOT NULL,
  original_amount NUMERIC NOT NULL,
  client_country TEXT,
  taxable BOOLEAN DEFAULT true,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE income_streams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own income." ON income_streams FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own income." ON income_streams FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own income." ON income_streams FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own income (soft)." ON income_streams FOR DELETE USING (auth.uid() = user_id);

-- FINANCIAL GOALS
CREATE TABLE financial_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  title TEXT NOT NULL,
  target_usd NUMERIC NOT NULL,
  current_usd NUMERIC NOT NULL DEFAULT 0,
  deadline DATE NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals." ON financial_goals FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own goals." ON financial_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals." ON financial_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals (soft)." ON financial_goals FOR DELETE USING (auth.uid() = user_id);

-- TAX PRESENCE
CREATE TABLE tax_presence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  days_spent INTEGER NOT NULL DEFAULT 0,
  year INTEGER NOT NULL,
  max_safe_days INTEGER NOT NULL,
  max_days_allowed INTEGER,
  tax_residency_risk TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE tax_presence ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tax presence." ON tax_presence FOR SELECT USING (auth.uid() = user_id AND deleted_at IS NULL);
CREATE POLICY "Users can insert own tax presence." ON tax_presence FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tax presence." ON tax_presence FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tax presence (soft)." ON tax_presence FOR DELETE USING (auth.uid() = user_id);

-- SYNC QUEUE (Offline operations)
-- We'll handle sync locally in Dexie, but having a sync_logs table for audit could be good.
-- For now, the client will push changes directly to the tables above with updated_at.

-- TRIGGERS for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_trips_modtime BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_schengen_stays_modtime BEFORE UPDATE ON schengen_stays FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_expenses_modtime BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_income_streams_modtime BEFORE UPDATE ON income_streams FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_financial_goals_modtime BEFORE UPDATE ON financial_goals FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_tax_presence_modtime BEFORE UPDATE ON tax_presence FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('receipts', 'receipts', false) ON CONFLICT DO NOTHING;

-- STORAGE POLICIES
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid() = owner);
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid() = owner);
CREATE POLICY "Users can update own documents" ON storage.objects FOR UPDATE USING (bucket_id = 'documents' AND auth.uid() = owner);
CREATE POLICY "Users can delete own documents" ON storage.objects FOR DELETE USING (bucket_id = 'documents' AND auth.uid() = owner);

CREATE POLICY "Users can view own receipts" ON storage.objects FOR SELECT USING (bucket_id = 'receipts' AND auth.uid() = owner);
CREATE POLICY "Users can upload own receipts" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'receipts' AND auth.uid() = owner);
CREATE POLICY "Users can update own receipts" ON storage.objects FOR UPDATE USING (bucket_id = 'receipts' AND auth.uid() = owner);
CREATE POLICY "Users can delete own receipts" ON storage.objects FOR DELETE USING (bucket_id = 'receipts' AND auth.uid() = owner);

