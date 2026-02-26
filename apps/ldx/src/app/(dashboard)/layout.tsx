import Link from 'next/link';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { BrainCircuit, FolderKanban, LogOut, UserCircle2 } from 'lucide-react';

import { getAuthOrgContext } from '@/lib/supabase/auth-org';
import { createClient } from '@/lib/supabase/server';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workspace',
  description: 'Workspace de proyectos LXD',
  openGraph: {
    title: 'LXD4DL Workspace',
    description: 'Gestion de proyectos de Learning Experience Design',
    images: ['/icon.svg'],
  },
};

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  const context = await getAuthOrgContext();

  if (!context) {
    redirect('/login');
  }

  async function logoutAction() {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-900 p-2 text-white">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">LXD4DL Architect</p>
              <p className="text-xs text-slate-500">Workspace de diseno instruccional</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6">
          <Link
            href="/projects"
            className="inline-flex w-full items-center gap-3 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white"
          >
            <FolderKanban className="h-4 w-4" />
            Proyectos
          </Link>
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            <UserCircle2 className="h-8 w-8 text-slate-500" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{context.user.email}</p>
              <p className="text-xs text-slate-500">{context.organization.name}</p>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesion
            </button>
          </form>
        </div>
      </aside>

      <div className="pl-72">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-8 py-4 backdrop-blur">
          <p className="text-sm text-slate-500">Organizacion activa</p>
          <h1 className="text-lg font-semibold text-slate-900">{context.organization.name}</h1>
        </header>

        <main className="px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
