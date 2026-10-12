'use client';

import React, { useState, memo } from 'react';
import { AtSignIcon, ArrowLeftIcon, BookOpen } from 'lucide-react';

// ─── Icons ───────────────────────────────────────────────────────────────────

const GoogleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GithubIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const AppleIcon = (props: React.ComponentProps<'svg'>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// ─── Dot Grid Background ──────────────────────────────────────────────────────

const DotGrid = memo(function DotGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `radial-gradient(circle, #3a3a3a 1px, transparent 1px)`,
        backgroundSize: '28px 28px',
      }}
    />
  );
});

// ─── Auth Page ───────────────────────────────────────────────────────────────

interface AuthPageProps {
  onNavigateHome?: () => void;
  onLoginSuccess?: (user: { name: string; email: string }) => void;
}

type AuthMode = 'signin' | 'signup';

export function AuthPage({ onNavigateHome, onLoginSuccess }: AuthPageProps = {}) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess({ name: email.split('@')[0], email });
      } else if (onNavigateHome) {
        onNavigateHome();
      }
    }, 900);
  };

  const handleSocialLogin = (provider: string) => {
    setLoadingProvider(provider);
    setTimeout(() => {
      setLoadingProvider(null);
      if (onLoginSuccess) {
        onLoginSuccess({ name: 'Aishanya Tripathi', email: 'aishanya.tripathi@example.com' });
      } else if (onNavigateHome) {
        onNavigateHome();
      }
    }, 700);
  };

  const isSignIn = mode === 'signin';

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden p-4">
      {/* Dot grid */}
      <DotGrid />

      {/* Radial vignette to fade dots at edges */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 70% at 50% 50%, transparent 40%, #0a0a0a 100%)',
        }}
      />

      {/* Back to Home */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-200 transition"
      >
        <ArrowLeftIcon className="size-3.5" />
        Home
      </button>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[420px]">
        <div className="rounded-2xl border border-[#2a2a2a] bg-[#161616]/95 backdrop-blur-sm px-8 py-9 shadow-2xl shadow-black/60">

          {/* Logo badge */}
          <div className="flex flex-col items-center mb-7">
            <div className="w-12 h-12 rounded-full border-2 border-[#3a3a3a] bg-[#1f1f1f] flex items-center justify-center mb-5 shadow-lg">
              <span className="text-sm font-bold text-white tracking-wider">AT</span>
            </div>
            <h1 className="text-xl font-bold text-white text-center">
              {isSignIn ? 'Sign in to Account' : 'Create an Account'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1 text-center">
              {isSignIn ? 'Sign in to your Account.' : 'Create your free account today.'}
            </p>
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 mb-4">
            <input
              type="email"
              placeholder="name@work-email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-11 rounded-lg border border-[#2e2e2e] bg-[#0f0f0f] px-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#555] focus:ring-1 focus:ring-[#555] transition"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg bg-white hover:bg-zinc-100 disabled:opacity-70 text-black text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Please wait...
                </>
              ) : 'Continue with Email'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#2a2a2a]" />
            <span className="text-[11px] text-zinc-600 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-[#2a2a2a]" />
          </div>

          {/* Social buttons */}
          <div className="space-y-2.5">
            {[
              { provider: 'Google', icon: <GoogleIcon className="size-4" /> },
              { provider: 'GitHub', icon: <GithubIcon className="size-4 text-white" /> },
              { provider: 'Apple', icon: <AppleIcon className="size-4 text-white" /> },
            ].map(({ provider, icon }) => (
              <button
                key={provider}
                type="button"
                onClick={() => handleSocialLogin(provider)}
                disabled={loadingProvider !== null}
                className="w-full h-11 rounded-lg border border-[#2e2e2e] bg-[#1a1a1a] hover:bg-[#222] disabled:opacity-60 text-white text-sm font-medium transition flex items-center justify-center gap-3"
              >
                {loadingProvider === provider ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : icon}
                Continue with {provider}
              </button>
            ))}
          </div>

          {/* Toggle sign in / sign up */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            {isSignIn ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(isSignIn ? 'signup' : 'signin')}
              className="text-white font-semibold hover:text-zinc-300 transition"
            >
              {isSignIn ? 'Sign Up' : 'Sign In'}
            </button>
          </p>

          {/* Legal */}
          <p className="text-center text-[11px] text-zinc-600 mt-4 leading-relaxed">
            By proceeding, you agree to creating an account subject to our{' '}
            <a href="#" className="text-zinc-400 hover:text-white underline underline-offset-2 transition">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-zinc-400 hover:text-white underline underline-offset-2 transition">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}