const fs = require('fs');
let content = fs.readFileSync('src/components/modals/AuthModal.tsx', 'utf8');

// The submit handler logic is what needs replacing
const submitHandlerStr = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    // Simulated network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isSignUp) {
      if (!name || !email || !password || !tag) {
        setStatusMsg({ type: 'error', text: 'All fields are required.' });
        setIsLoading(false);
        return;
      }
      
      const newUserId = 'usr-' + Math.random().toString(36).substring(2, 9);
      
      onSignIn({
        id: newUserId,
        name,
        email,
        tag,
        isPro: false,
        avatarUrl: \`https://ui-avatars.com/api/?name=\${encodeURIComponent(name)}&background=f97316&color=fff\`
      });
      setStatusMsg({ type: 'success', text: 'Account created! Signing in...' });
    } else {
      if (!email || !password) {
        setStatusMsg({ type: 'error', text: 'Email and password required.' });
        setIsLoading(false);
        return;
      }

      onSignIn({
        id: currentUser?.id || 'usr-demo123',
        name: currentUser?.name || 'Jawher',
        email: email,
        tag: currentUser?.tag || '@jawher',
        isPro: currentUser?.isPro || false,
        avatarUrl: currentUser?.avatarUrl || 'https://ui-avatars.com/api/?name=Jawher&background=f97316&color=fff'
      });
      setStatusMsg({ type: 'success', text: 'Signing in...' });
    }
  };

  const handleOAuthSignIn = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setStatusMsg(null);
    await new Promise(resolve => setTimeout(resolve, 600));
    setStatusMsg({ type: 'info', text: \`Redirecting to \${provider}...\` });
    
    // Simulate OAuth return
    setTimeout(() => {
      onSignIn({
        id: currentUser?.id || 'usr-oauth123',
        name: 'Jawher',
        email: 'nomad@example.com',
        tag: '@jawher',
        isPro: true,
        avatarUrl: 'https://ui-avatars.com/api/?name=Jawher&background=f97316&color=fff'
      });
    }, 1500);
  };`;

const realAuthSubmitStr = `const handleSubmit = async (e: React.FormEvent) => {
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
              tag: tag,
            }
          }
        });
        
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Account created! Please check your email.' });
        
        // Let App.tsx know, but wait for onAuthStateChange to actually trigger the full sync
        // if user is returned (sometimes implicit sign in happens)
        if (data.session) {
           onSignIn({
             id: data.user!.id,
             name,
             email,
             tag,
             isPro: false,
             avatarUrl: \`https://ui-avatars.com/api/?name=\${encodeURIComponent(name)}&background=f97316&color=fff\`
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
           avatarUrl: \`https://ui-avatars.com/api/?name=\${encodeURIComponent(data.user.user_metadata.first_name || 'U')}&background=f97316&color=fff\`
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
  };`;

content = content.replace(submitHandlerStr, realAuthSubmitStr);

// add import
if (!content.includes('import { supabase } from')) {
  content = content.replace(
    "import { X, Mail, Lock, User, AtSign, Loader2, ArrowRight, Shield, Check, AlertCircle } from 'lucide-react';",
    "import { X, Mail, Lock, User, AtSign, Loader2, ArrowRight, Shield, Check, AlertCircle } from 'lucide-react';\nimport { supabase } from '../../lib/supabase';"
  );
}

fs.writeFileSync('src/components/modals/AuthModal.tsx', content, 'utf8');
