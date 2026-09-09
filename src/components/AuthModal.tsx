import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  AtSign, 
  Check, 
  X, 
  Shield, 
  ArrowRight, 
  Globe, 
  Database,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { NomadUser } from '../types';
import { 
  isSupabaseConfigured, 
  signInWithOAuth, 
  signInWithEmail, 
  signUpWithEmail 
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: NomadUser;
  onSignIn: (user: Partial<NomadUser>) => void;
  onOpenSupabaseGuide?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSignIn,
  onOpenSupabaseGuide,
}) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [name, setName] = useState(currentUser.name || 'Jawher');
  const [tag, setTag] = useState(currentUser.tag || '@canggu');
  const [email, setEmail] = useState('nomad@example.com');
  const [password, setPassword] = useState('••••••••');
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const supabaseReady = isSupabaseConfigured();

  if (!isOpen) return null;

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    if (!supabaseReady) {
      if (onOpenSupabaseGuide) {
        onOpenSupabaseGuide();
      } else {
        setStatusMsg({
          type: 'info',
          text: 'Supabase credentials are required in .env or Settings to connect Google/Apple sign-in.',
        });
      }
      return;
    }

    setIsLoading(true);
    setStatusMsg(null);
    try {
      await signInWithOAuth(provider);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OAuth sign-in failed.';
      setStatusMsg({ type: 'error', text: msg });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    // If Supabase is connected, authenticate via Supabase Auth
    if (supabaseReady) {
      try {
        if (isSignUp) {
          const res = await signUpWithEmail(email, password, { name, tag });
          if (res.user) {
            onSignIn({
              name: name || res.user.email?.split('@')[0] || 'Nomad',
              tag: tag.startsWith('@') ? tag : `@${tag}`,
            });
            setStatusMsg({
              type: 'success',
              text: 'Account created with Supabase! Check your email for confirmation.',
            });
          }
        } else {
          const res = await signInWithEmail(email, password);
          if (res.user) {
            onSignIn({
              name: res.user.user_metadata?.name || res.user.email?.split('@')[0] || 'Nomad',
              tag: res.user.user_metadata?.tag || `@${res.user.email?.split('@')[0] || 'user'}`,
            });
            setStatusMsg({
              type: 'success',
              text: 'Signed in with Supabase! Welcome back.',
            });
          }
        }
        setTimeout(() => {
          setIsLoading(false);
          onClose();
        }, 1200);
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Authentication failed';
        setStatusMsg({ type: 'error', text: msg });
        setIsLoading(false);
        return;
      }
    }

    // Local / Offline fallback mode
    setTimeout(() => {
      onSignIn({
        name: name || 'Jawher',
        tag: tag.startsWith('@') ? tag : `@${tag}`,
      });
      setStatusMsg({
        type: 'success',
        text: isSignUp ? 'Account created locally!' : 'Signed in! Welcome back.',
      });
      setIsLoading(false);
      setTimeout(() => {
        setStatusMsg(null);
        onClose();
      }, 1000);
    }, 400);
  };

  return (
    <div id="auth-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200/90 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-orange-500 text-white font-medium text-xs shadow-xs">
              <Globe className="w-4 h-4 text-white" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-semibold text-stone-900 tracking-tight">NomadOS Cloud Account</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1.5 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="text-center space-y-1">
            <h3 className="text-base font-semibold text-stone-900">
              {isSignUp ? 'Create your NomadOS account' : 'Welcome back, nomad!'}
            </h3>
            <p className="text-xs text-stone-500">
              {isSignUp 
                ? 'Sync your visa tracking, multi-stop itineraries, and tax presence across all devices.' 
                : 'Sign in to access your itinerary, cloud backup, and nomad radar.'}
            </p>
          </div>

          {/* Supabase Status Banner */}
          <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs bg-stone-50 border-stone-200/80">
            <div className="flex items-center gap-2">
              <Database className={`w-3.5 h-3.5 ${supabaseReady ? 'text-emerald-600' : 'text-stone-400'}`} strokeWidth={1.75} />
              <span className="text-[11px] font-medium text-stone-700">
                {supabaseReady ? 'Connected to Supabase' : 'Supabase: Ready to link project'}
              </span>
            </div>
            {onOpenSupabaseGuide && (
              <button
                type="button"
                onClick={onOpenSupabaseGuide}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Setup Guide / SQL
              </button>
            )}
          </div>

          {/* Social OAuth Providers (Google & Apple) */}
          <div className="space-y-2 pt-1">
            {/* Google Sign In Button */}
            <button
              type="button"
              id="google-signin-btn"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Apple Sign In Button */}
            <button
              type="button"
              id="apple-signin-btn"
              onClick={() => handleOAuthSignIn('apple')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.94-12.24-14.58-6.19-9.16-11.1-19.64-14.75-31.45-3.65-11.8-5.48-23.01-5.48-33.62 0-14.07 3.51-26.04 10.53-35.91 7.02-9.87 16.03-14.92 27.03-15.16 4.35 0 9.28 1.16 14.78 3.48 5.51 2.32 9.4 3.54 11.68 3.65 2.07 0 6.13-1.32 12.19-3.96 6.06-2.64 11.13-3.79 15.22-3.46 11.29.53 20.47 4.7 27.54 12.51-9.92 6-14.75 14.19-14.5 24.58.26 8.35 3.44 15.28 9.54 20.79 6.1 5.51 13.33 8.78 21.68 9.81-2.43 7.54-5.45 15.34-9.08 23.4zM119.22 31.85c0-6.73 2.45-13.08 7.35-19.05 4.9-5.97 10.99-9.78 18.27-11.43.34 2.87.27 5.74-.21 8.61-.48 2.87-1.57 5.75-3.26 8.64-2.14 3.65-4.98 6.78-8.52 9.38-3.54 2.6-7.14 4.25-10.8 4.95-.55-2.92-.83-6.62-.83-11.1z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase tracking-wider font-medium">Or email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Quick Tab Toggle */}
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                isSignUp ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                !isSignUp ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800 font-medium'
              }`}
            >
              Sign In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jawher"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">
                    Your @tag
                  </label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                    <input
                      type="text"
                      required
                      value={tag}
                      onChange={(e) => setTag(e.target.value)}
                      placeholder="@canggu"
                      className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nomad@example.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                />
              </div>
            </div>

            {statusMsg && (
              <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                  : statusMsg.type === 'error'
                  ? 'bg-rose-50 border border-rose-200 text-rose-700'
                  : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}>
                {statusMsg.type === 'success' ? (
                  <Check className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />
                )}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <Shield className="w-3.5 h-3.5 text-stone-400" strokeWidth={1.75} />
            <span>Encrypted PostgreSQL · RLS Security · Multi-device sync</span>
          </div>
        </div>
      </div>
    </div>
  );
};
