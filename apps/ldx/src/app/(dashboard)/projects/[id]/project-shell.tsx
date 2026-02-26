'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

import type { DashboardProject } from '@/app/(dashboard)/projects/actions';
import { ChatConsultant } from '@/components/shared/ChatConsultant';
import { ProjectProvider, useProjectContext } from '@/lib/context/ProjectContext';
import { isStrategyComplete } from '@/lib/utils/strategy';
import { getStepProgress } from '@/lib/utils/project-metrics';

interface ProjectShellProps {
  children: React.ReactNode;
  project: DashboardProject;
}

const steps = [
  { key: 'strategy', label: 'Strategy' },
  { key: 'design', label: 'Design' },
  { key: 'content', label: 'Content' },
  { key: 'journey', label: 'Journey' },
  { key: 'production', label: 'Production' },
] as const;

function SaveStateBadge() {
  const { saveState } = useProjectContext();

  if (saveState === 'saving') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Guardando...
      </span>
    );
  }

  if (saveState === 'saved') {
    return <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">Guardado</span>;
  }

  if (saveState === 'error') {
    return <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs text-red-700">Error al guardar</span>;
  }

  return null;
}

function ProjectShellContent({ children }: Pick<ProjectShellProps, 'children'>) {
  const pathname = usePathname();
  const { project: activeProject } = useProjectContext();
  const stepProgress = getStepProgress(activeProject.completionRate);
  const strategyComplete = isStrategyComplete(activeProject.strategy);

  return (
    <div className="grid min-h-[calc(100vh-9rem)] grid-cols-[260px_1fr] gap-6">
      <aside className="rounded-xl border border-slate-200 bg-white p-4">
        <nav className="space-y-2">
          {steps.map((step) => {
            const href = `/projects/${activeProject.id}/${step.key}`;
            const isActive = pathname === href;
            const progress = step.key === 'strategy' ? (strategyComplete ? 100 : 0) : stepProgress[step.key] ?? 0;
            const isComplete = progress === 100;

            return (
              <Link
                key={step.key}
                href={href}
                className={`block rounded-lg border px-3 py-2 text-sm transition ${
                  isActive ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-medium">{step.label}</span>
                  {isComplete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${isActive ? 'bg-white' : 'bg-emerald-500'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
        <header className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Proyectos</p>
            <h2 className="text-lg font-semibold text-slate-900">Proyectos &gt; {activeProject.title}</h2>
          </div>
          <SaveStateBadge />
        </header>
        {children}
      </section>
      <ChatConsultant />
    </div>
  );
}

export function ProjectShell({ children, project }: ProjectShellProps) {
  return (
    <ProjectProvider initialProject={project}>
      <ProjectShellContent>{children}</ProjectShellContent>
    </ProjectProvider>
  );
}
