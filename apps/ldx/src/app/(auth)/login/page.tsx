'use client';

import { BrainCircuit } from 'lucide-react';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      const supabase = createClient();
      const callbackUrl = new URL('/auth/callback', window.location.origin);
      callbackUrl.searchParams.set('next', '/projects');

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl.toString(),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Google OAuth failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
            <BrainCircuit className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">LXD4DL Architect</h1>
          <p className="text-sm text-slate-600">Inicia sesion para continuar con tus proyectos LXD.</p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Redirigiendo...' : 'Continuar con Google'}
        </button>
      </section>
    </main>
  );
}
