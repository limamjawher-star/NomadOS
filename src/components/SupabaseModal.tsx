import React, { useState } from 'react';
import { 
  Database, 
  Check, 
  Copy, 
  ExternalLink, 
  X, 
  ShieldCheck, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  Layers,
  Smartphone
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
}

const SQL_SCHEMA = `-- ==============================================================================
-- NomadOS Supabase Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

create extension if not exists "uuid-ossp";

-- 1. Profiles Table
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

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- 2. State Snapshot Table for multi-device sync
create table if not exists public.user_nomad_state (
  user_id uuid references auth.users on delete cascade primary key,
  state_payload jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_nomad_state enable row level security;

create policy "Users can view own state"
  on public.user_nomad_state for select using (auth.uid() = user_id);
create policy "Users can update own state"
  on public.user_nomad_state for all using (auth.uid() = user_id);

-- 3. Auto-create Profile Trigger
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'sql' | 'oauth'>('overview');
  const isConfigured = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleCopySQL = async () => {
    try {
      await navigator.clipboard.writeText(SQL_SCHEMA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      id="supabase-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Database className="w-4 h-4" strokeWidth={1.75} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-stone-900">Supabase Cloud Integration</h3>
                {isConfigured ? (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Connected</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span>Ready for Keys</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-stone-500 font-normal">
                PostgreSQL database, Row Level Security & Google / Apple Auth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-100 px-6 bg-white gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            1. Setup Guide
          </button>
          <button
            onClick={() => setActiveTab('oauth')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'oauth'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            2. Google & Apple Sign-In
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sql'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            3. Database Schema (SQL)
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-600 flex-1">
          
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" strokeWidth={1.75} />
                  <span>Free Tier Ready — Scale as Traffic Grows</span>
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed">
                  Supabase offers a generous free tier (500MB database, 50,000 monthly active users, unlimited API requests). You can run NomadOS on the free plan and upgrade anytime directly from your Supabase dashboard when user traffic increases.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  3 Simple Steps to Link Your Supabase Project:
                </h4>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center shrink-0 text-xs">
                    1
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 text-xs">Create a Project on Supabase</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-700 font-medium underline inline-flex items-center gap-0.5">supabase.com <ExternalLink className="w-3 h-3" /></a> and create a new project in your preferred region.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center shrink-0 text-xs">
                    2
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 text-xs">Copy API Credentials</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      In your Supabase project, go to <strong>Project Settings → API</strong>. Copy your <strong>Project URL</strong> and <strong>anon public key</strong> into your environment settings:
                    </p>
                    <div className="p-2 bg-stone-900 text-emerald-400 rounded-lg font-mono text-[11px] select-all mt-1.5 space-y-1">
                      <div>VITE_SUPABASE_URL=https://your-project.supabase.co</div>
                      <div>VITE_SUPABASE_ANON_KEY=eyJhbGciOi...</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200/80">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-semibold flex items-center justify-center shrink-0 text-xs">
                    3
                  </span>
                  <div className="space-y-1">
                    <p className="font-semibold text-stone-900 text-xs">Run the SQL Schema</p>
                    <p className="text-[11px] text-stone-500 leading-relaxed">
                      Click the <strong>Database Schema (SQL)</strong> tab above, copy the schema, and paste it into your Supabase <strong>SQL Editor</strong> to create all tables and RLS security policies with 1 click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'oauth' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-2">
                <h4 className="text-xs font-semibold text-stone-900">Configuring Google & Apple Sign-In</h4>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Supabase Auth handles Google and Apple identity providers out of the box. Once enabled in your Supabase dashboard, users can sign in with one click on both web and mobile.
                </p>
              </div>

              {/* Google Guide */}
              <div className="p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 font-semibold flex items-center justify-center text-[10px]">G</span>
                    Google Provider Setup
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Recommended
                  </span>
                </div>
                <ol className="list-decimal pl-4 text-[11px] text-stone-600 space-y-1.5">
                  <li>Go to <strong>Authentication → Providers → Google</strong> in your Supabase project.</li>
                  <li>Toggle <strong>Enable Google provider</strong> on.</li>
                  <li>Copy the <strong>Callback URL</strong> shown in Supabase (e.g. <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">https://&lt;id&gt;.supabase.co/auth/v1/callback</code>).</li>
                  <li>In Google Cloud Console, add that URL to <strong>Authorized redirect URIs</strong> in your OAuth Client.</li>
                  <li>Paste your Google <strong>Client ID</strong> and <strong>Client Secret</strong> back into Supabase.</li>
                </ol>
              </div>

              {/* Apple Guide */}
              <div className="p-4 rounded-xl border border-stone-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-2 text-xs">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 font-semibold flex items-center justify-center text-[10px]"></span>
                    Apple Provider Setup
                  </span>
                  <span className="text-[10px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                    For iOS PWA
                  </span>
                </div>
                <ol className="list-decimal pl-4 text-[11px] text-stone-600 space-y-1.5">
                  <li>Go to <strong>Authentication → Providers → Apple</strong> in your Supabase project.</li>
                  <li>Toggle <strong>Enable Apple provider</strong> on.</li>
                  <li>In your Apple Developer Account, configure Sign in with Apple with the Supabase Redirect URI.</li>
                  <li>Enter your Services ID, Secret Key, Key ID, and Team ID into Supabase.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.75} />
                  <span>Production Schema for SQL Editor</span>
                </span>
                <button
                  onClick={handleCopySQL}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 bg-stone-900 text-emerald-300 rounded-xl font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed border border-stone-800">
                  {SQL_SCHEMA}
                </pre>
              </div>

              <p className="text-[11px] text-stone-500">
                This schema creates the <code>profiles</code> table, <code>user_nomad_state</code> sync table, auto-creates profiles on OAuth sign-up, and activates Row Level Security so only logged-in owners can access their data.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            {isConfigured ? 'Ready to sign in with Supabase' : 'Offline / Local fallback active until keys are set'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-800 transition cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAuth();
              }}
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition cursor-pointer"
            >
              Open Sign In Dialog
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
