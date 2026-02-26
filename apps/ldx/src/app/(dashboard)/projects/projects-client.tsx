'use client';

import { Copy, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import {
  createProject,
  deleteProject,
  duplicateProject,
  renameProject,
  type DashboardProject,
} from '@/app/(dashboard)/projects/actions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PROJECT_TEMPLATES, type ProjectTemplateKey } from '@/data/templates';

interface ProjectsClientProps {
  projects: DashboardProject[];
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function ProjectsClient({ projects }: ProjectsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  const runCreate = (templateKey?: ProjectTemplateKey) => {
    startTransition(async () => {
      const result = await createProject(templateKey);

      if (!result.id) {
        toast.error(result.error ?? 'No se pudo crear el proyecto.');
        return;
      }

      toast.success('Proyecto creado');
      setTemplateDialogOpen(false);
      router.push(`/projects/${result.id}/strategy`);
      router.refresh();
    });
  };

  const handleCreate = () => {
    if (projects.length === 0) {
      setTemplateDialogOpen(true);
      return;
    }

    runCreate();
  };

  const handleRename = (project: DashboardProject) => {
    const nextTitle = window.prompt('Nuevo titulo del proyecto', project.title);

    if (!nextTitle || nextTitle.trim() === project.title) {
      return;
    }

    startTransition(async () => {
      const result = await renameProject(project.id, nextTitle);

      if (!result.success) {
        toast.error(result.error ?? 'No se pudo renombrar el proyecto.');
        return;
      }

      toast.success('Proyecto renombrado');
      router.refresh();
    });
  };

  const handleDuplicate = (project: DashboardProject) => {
    startTransition(async () => {
      const result = await duplicateProject(project.id);

      if (!result.id) {
        toast.error(result.error ?? 'No se pudo duplicar el proyecto.');
        return;
      }

      toast.success('Proyecto duplicado');
      router.refresh();
    });
  };

  const handleDelete = (project: DashboardProject) => {
    const confirmed = window.confirm(`Eliminar \"${project.title}\"? Esta accion no se puede deshacer.`);

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const result = await deleteProject(project.id);

      if (!result.success) {
        toast.error(result.error ?? 'No se pudo eliminar el proyecto.');
        return;
      }

      toast.success('Proyecto eliminado');
      router.refresh();
    });
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Proyectos LXD</h1>
            <p className="text-sm text-slate-600">Gestiona multiples blueprints educativos de tu organizacion.</p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Crear nuevo proyecto"
          >
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-slate-700">Aun no tienes proyectos. Crea el primero para comenzar.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="line-clamp-2 text-base font-semibold text-slate-900">{project.title}</h2>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(project.created_at)}</p>
                  </div>

                  <details className="relative">
                    <summary className="list-none rounded-md border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50">
                      <MoreVertical className="h-4 w-4" />
                    </summary>
                    <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={() => handleRename(project)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Pencil className="h-4 w-4" />
                        Renombrar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicate(project)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                      >
                        <Copy className="h-4 w-4" />
                        Duplicar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </button>
                    </div>
                  </details>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                      <span>Completitud</span>
                      <span>{project.completion_rate}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${project.completion_rate}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Escenas: {project.total_scenes}</span>
                    <span>Objetos: {project.interactive_objects}</span>
                  </div>

                  <Link
                    href={`/projects/${project.id}/strategy`}
                    className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                  >
                    Continuar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecciona plantilla inicial</DialogTitle>
            <DialogDescription>Para tu primer proyecto puedes arrancar con una estructura predefinida.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-3">
            {PROJECT_TEMPLATES.map((template) => (
              <button
                key={template.key}
                type="button"
                onClick={() => runCreate(template.key)}
                className="rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
                aria-label={`Crear proyecto con plantilla ${template.title}`}
              >
                <p className="font-medium text-slate-900">{template.title}</p>
                <p className="text-sm text-slate-600">{template.description}</p>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => runCreate()}>
              Proyecto en blanco
            </Button>
            <Button type="button" variant="ghost" onClick={() => setTemplateDialogOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
