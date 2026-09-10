import React, { useState } from 'react';
import { X, Mail, Lock, User, AtSign, Loader2, ArrowRight, Shield, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { NomadUser } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: NomadUser | null;
  onSignIn: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, currentUser, onSignIn }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [tag, setTag] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'error' | 'success' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
      if (isSignUp) {
        if (!name || !email || !password || !tag) {
          throw new Error('All fields are required.');
        }
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: name,
              tag: tag.startsWith('@') ? tag : `@${tag}`,
            }
          }
        });
        
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Account created! Please check your email if required.' });
        
        if (data.session) {
           onSignIn({
             id: data.user!.id,
             name,
             email,
             tag: tag.startsWith('@') ? tag : `@${tag}`,
             isPro: false,
             avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff`
           });
        }
      } else {
        if (!email || !password) {
          throw new Error('Email and password required.');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        setStatusMsg({ type: 'success', text: 'Signing in...' });
        onSignIn({
           id: data.user.id,
           name: data.user.user_metadata.first_name || 'User',
           email: data.user.email,
           tag: data.user.user_metadata.tag || '@nomad',
           isPro: false,
           avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.user_metadata.first_name || 'U')}&background=f97316&color=fff`
        });
      }
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setStatusMsg(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider === 'google' ? 'google' : 'apple'
      });
      if (error) throw error;
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              {isSignUp ? 'Create your identity' : 'Welcome back'}
            </h2>
            <p className="text-[13px] text-stone-500 mt-0.5">
              {isSignUp ? 'Join the global network.' : 'Sign in to access your data.'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 bg-white">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 rounded-xl text-xs font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-stone-400 uppercase tracking-wider font-medium">Or email</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button type="button" onClick={() => setIsSignUp(true)} className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${isSignUp ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800 font-medium'}`}>Create Account</button>
            <button type="button" onClick={() => setIsSignUp(false)} className={`flex-1 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${!isSignUp ? 'bg-white text-stone-900 shadow-xs font-semibold' : 'text-stone-500 hover:text-stone-800 font-medium'}`}>Sign In</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Jawher" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">Your @tag</label>
                  <div className="relative">
                    <AtSign className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                    <input type="text" required value={tag} onChange={(e) => setTag(e.target.value)} placeholder="@canggu" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white" />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nomad@example.com" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-stone-700 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" strokeWidth={1.75} />
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl text-xs font-normal text-stone-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white" />
              </div>
            </div>
            
            {statusMsg && (
              <div className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${statusMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : statusMsg.type === 'error' ? 'bg-rose-50 border border-rose-200 text-rose-700' : 'bg-amber-50 border border-amber-200 text-amber-700'}`}>
                {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" strokeWidth={1.75} /> : <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.75} />}
                <span>{statusMsg.text}</span>
              </div>
            )}
            
            <button type="submit" disabled={isLoading} className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl shadow-xs flex items-center justify-center gap-2 text-xs transition-all cursor-pointer disabled:opacity-50">
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>{isSignUp ? 'Create Account' : 'Sign In'}</span><ArrowRight className="w-4 h-4" strokeWidth={1.75} /></>}
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
