import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { NomadState, NomadUser } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// Validate configuration
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance && supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
};

/**
 * Sign in using Supabase OAuth (Google or Apple)
 */
export const signInWithOAuth = async (provider: 'google' | 'apple') => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet. Add your Supabase URL & Anon Key in Settings.');
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email: string, password: string) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign up with email, password, and metadata
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  metadata?: { name?: string; tag?: string }
) => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    throw new Error('Supabase is not configured yet.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata,
    },
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign out current user
 */
export const signOutSupabase = async () => {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  await supabase.auth.signOut();
};

/**
 * Subscribe to Auth State changes
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
) => {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  // Check current session
  supabase.auth.getSession().then(({ data: { session } }) => {
    callback(session?.user ?? null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => {
    subscription.unsubscribe();
  };
};

/**
 * Sync NomadOS state to Supabase
 */
export const syncNomadStateToSupabase = async (state: NomadState): Promise<boolean> => {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return false;

    const userId = session.user.id;

    // 1. Upsert Profile
    await supabase.from('profiles').upsert({
      id: userId,
      name: state.user.name,
      tag: state.user.tag,
      email: session.user.email,
      avatar_url: state.user.avatarUrl,
      nationality: state.user.nationality,
      nationality_code: state.user.nationalityCode,
      current_city: state.currentCity,
      current_country: state.currentCountry,
      current_country_code: state.currentCountryCode,
      updated_at: new Date().toISOString(),
    });

    // 2. Upsert State Snapshot into user_nomad_state
    await supabase.from('user_nomad_state').upsert({
      user_id: userId,
      state_payload: state,
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error('Supabase sync error:', err);
    return false;
  }
};

/**
 * Fetch NomadOS state from Supabase
 */
export const fetchNomadStateFromSupabase = async (): Promise<Partial<NomadState> | null> => {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const { data, error } = await supabase
      .from('user_nomad_state')
      .select('state_payload')
      .eq('user_id', session.user.id)
      .single();

    if (error || !data) return null;
    return data.state_payload as Partial<NomadState>;
  } catch (err) {
    console.error('Fetch Supabase state error:', err);
    return null;
  }
};
