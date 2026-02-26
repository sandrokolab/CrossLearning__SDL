'use client';

import { CheckCircle2, Filter, Layers, Search, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { ACTIVITY_CATALOG, INTERACTION_MOMENTS } from '@/data/catalog';
import { ABCMethod, MediaLevel, type Scene, type Session } from '@/types';

interface SceneRow {
  sessionId: string;
  sessionTitle: string;
  moduleId: string;
  moduleTitle: string;
  unitId: string;
  unitTitle: string;
  topicId: string;
  topicTitle: string;
  scene: Scene;
}

interface GroupedRows {
  key: string;
  sessionTitle: string;
  moduleTitle: string;
  rows: SceneRow[];
}

const mediaLevelDescriptions: Record<MediaLevel, string> = {
  [MediaLevel.Level1]: 'Nivel basico, consumo pasivo.',
  [MediaLevel.Level2]: 'Interaccion limitada con checkpoints.',
  [MediaLevel.Level3]: 'Interaccion compleja y toma de decisiones.',
  [MediaLevel.Level4]: 'Experiencia inmersiva o gamificada.',
};

function abcBadgeClass(abc?: ABCMethod) {
  if (!abc) return 'bg-slate-100 text-slate-600 border-slate-200';

  if (abc === ABCMethod.Adquisition) return 'bg-blue-50 text-blue-700 border-blue-200';
  if (abc === ABCMethod.Inquiry) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  if (abc === ABCMethod.Discussion) return 'bg-violet-50 text-violet-700 border-violet-200';
  if (abc === ABCMethod.Practice) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (abc === ABCMethod.Collaboration) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
}

function mediaBadgeClass(level?: MediaLevel) {
  if (!level) return 'bg-slate-100 text-slate-600 border-slate-200';

  if (level === MediaLevel.Level1) return 'bg-slate-100 text-slate-700 border-slate-200';
  if (level === MediaLevel.Level2) return 'bg-sky-50 text-sky-700 border-sky-200';
  if (level === MediaLevel.Level3) return 'bg-orange-50 text-orange-700 border-orange-200';
  return 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200';
}

function flattenScenes(structure: Session[]): SceneRow[] {
  const rows: SceneRow[] = [];

  structure.forEach((session) => {
    session.modules.forEach((module) => {
      module.units.forEach((unit) => {
        unit.topics.forEach((topic) => {
          topic.scenes.forEach((scene) => {
            rows.push({
              sessionId: session.id,
              sessionTitle: session.title,
              moduleId: module.id,
              moduleTitle: module.title,
              unitId: unit.id,
              unitTitle: unit.title,
              topicId: topic.id,
              topicTitle: topic.title,
              scene,
            });
          });
        });
      });
    });
  });

  return rows;
}

function groupBySessionModule(rows: SceneRow[]): GroupedRows[] {
  const map = new Map<string, GroupedRows>();

  rows.forEach((row) => {
    const key = `${row.sessionId}:${row.moduleId}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        sessionTitle: row.sessionTitle,
        moduleTitle: row.moduleTitle,
        rows: [],
      });
    }

    map.get(key)!.rows.push(row);
  });

  return Array.from(map.values());
}

export function JourneyMediaModule() {
  const { project, updateProject } = useProjectContext();

  const structure = useMemo(() => (Array.isArray(project.structure) ? project.structure : []) as Session[], [project.structure]);
  const [search, setSearch] = useState('');
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);
  const [activitySceneId, setActivitySceneId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAbc, setFilterAbc] = useState<string>('all');
  const [filterTool, setFilterTool] = useState<'all' | 'Standard' | 'Adobe Captivate'>('all');

  const allRows = useMemo(() => flattenScenes(structure), [structure]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();

    return allRows.filter((row) => {
      if (!term) return true;
      const byTitle = row.scene.title.toLowerCase().includes(term);
      const byAbc = (row.scene.abcMethod ?? '').toLowerCase().includes(term);
      return byTitle || byAbc;
    });
  }, [allRows, search]);

  const grouped = useMemo(() => groupBySessionModule(filteredRows), [filteredRows]);

  const totalScenes = allRows.length;
  const assignedScenes = allRows.filter((row) => Boolean(row.scene.selectedActivityId)).length;
  const completion = totalScenes === 0 ? 0 : Math.round((assignedScenes / totalScenes) * 100);

  const categories = useMemo(
    () => Array.from(new Set(ACTIVITY_CATALOG.map((activity) => activity.category))).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const abcTypes = useMemo(
    () => Array.from(new Set(ACTIVITY_CATALOG.flatMap((activity) => activity.abcTypes))).sort((a, b) => a.localeCompare(b)),
    [],
  );

  const selectedSceneRow = allRows.find((row) => row.scene.id === activitySceneId) ?? null;

  const filteredCatalog = useMemo(() => {
    return ACTIVITY_CATALOG.filter((activity) => {
      const byCategory = filterCategory === 'all' ? true : activity.category === filterCategory;
      const byTool = filterTool === 'all' ? true : activity.tool === filterTool;
      const byAbc = filterAbc === 'all' ? true : activity.abcTypes.includes(filterAbc);
      return byCategory && byTool && byAbc;
    });
  }, [filterAbc, filterCategory, filterTool]);

  const updateScene = useCallback((sceneId: string, partial: Partial<Scene>) => {
    updateProject({
      structure: structure.map((session) => ({
        ...session,
        modules: session.modules.map((module) => ({
          ...module,
          units: module.units.map((unit) => ({
            ...unit,
            topics: unit.topics.map((topic) => ({
              ...topic,
              scenes: topic.scenes.map((scene) => (scene.id === sceneId ? { ...scene, ...partial } : scene)),
            })),
          })),
        })),
      })),
    });
  }, [structure, updateProject]);

  const assignActivity = useCallback((sceneId: string, activityId: string) => {
    updateScene(sceneId, { selectedActivityId: activityId });
    setActivitySceneId(null);
    toast.success('Actividad asignada a la escena.');
  }, [updateScene]);

  const resolveActivityName = useCallback((scene: Scene) => {
    const activity = ACTIVITY_CATALOG.find((item) => item.id === scene.selectedActivityId);
    return activity?.name;
  }, []);

  const groupedSections = useMemo(
    () =>
      grouped.map((group) => (
        <section key={group.key} className="space-y-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <h3 className="text-sm font-semibold text-slate-900">
              {group.sessionTitle} <span className="text-slate-500">&gt;</span> {group.moduleTitle}
            </h3>
          </div>

          <div className="overflow-auto rounded-lg border border-slate-200">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-2">Escena</th>
                  <th className="px-3 py-2">Duracion</th>
                  <th className="px-3 py-2">ABC</th>
                  <th className="px-3 py-2">Media</th>
                  <th className="px-3 py-2">Interaction</th>
                  <th className="px-3 py-2">Actividad</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => {
                  const scene = row.scene;
                  const isEditing = editingSceneId === scene.id;
                  const activityName = resolveActivityName(scene);

                  return (
                    <tr key={scene.id} className="border-t border-slate-100 align-top">
                      <td className="px-3 py-2" onClick={() => setEditingSceneId(scene.id)}>
                        {isEditing ? (
                          <div className="space-y-1">
                            <Input value={scene.title} onChange={(event) => updateScene(scene.id, { title: event.target.value })} />
                            <p className="text-xs text-slate-500">
                              {row.unitTitle} &gt; {row.topicTitle}
                            </p>
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium text-slate-900">{scene.title}</p>
                            <p className="text-xs text-slate-500">
                              {row.unitTitle} &gt; {row.topicTitle}
                            </p>
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-2" onClick={() => setEditingSceneId(scene.id)}>
                        {isEditing ? (
                          <Input type="number" min={1} value={scene.durationMinutes} onChange={(event) => updateScene(scene.id, { durationMinutes: Number(event.target.value || 0) })} />
                        ) : (
                          <span>{scene.durationMinutes} min</span>
                        )}
                      </td>

                      <td className="px-3 py-2" onClick={() => setEditingSceneId(scene.id)}>
                        {isEditing ? (
                          <select
                            aria-label="Seleccionar ABC Method"
                            className="h-10 w-full rounded-md border border-slate-300 px-2"
                            value={scene.abcMethod ?? ''}
                            onChange={(event) =>
                              updateScene(scene.id, {
                                abcMethod: (event.target.value || undefined) as ABCMethod | undefined,
                              })
                            }
                          >
                            <option value="">Sin definir</option>
                            {Object.values(ABCMethod).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${abcBadgeClass(scene.abcMethod)}`}>{scene.abcMethod ?? 'Sin definir'}</span>
                        )}
                      </td>

                      <td className="px-3 py-2" onClick={() => setEditingSceneId(scene.id)}>
                        {isEditing ? (
                          <select
                            aria-label="Seleccionar Media Level"
                            className="h-10 w-full rounded-md border border-slate-300 px-2"
                            value={scene.mediaLevel ?? ''}
                            onChange={(event) =>
                              updateScene(scene.id, {
                                mediaLevel: (event.target.value || undefined) as MediaLevel | undefined,
                              })
                            }
                          >
                            <option value="">Sin definir</option>
                            {Object.values(MediaLevel).map((value) => (
                              <option key={value} value={value}>
                                {value}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <div>
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${mediaBadgeClass(scene.mediaLevel)}`}>{scene.mediaLevel ?? 'Sin definir'}</span>
                            {scene.mediaLevel ? <p className="mt-1 text-xs text-slate-500">{mediaLevelDescriptions[scene.mediaLevel]}</p> : null}
                          </div>
                        )}
                      </td>

                      <td className="px-3 py-2" onClick={() => setEditingSceneId(scene.id)}>
                        {isEditing ? (
                          <select
                            aria-label="Seleccionar momento de interaccion"
                            className="h-10 w-full rounded-md border border-slate-300 px-2"
                            value={scene.interactionMoment ?? ''}
                            onChange={(event) =>
                              updateScene(scene.id, {
                                interactionMoment: event.target.value || undefined,
                              })
                            }
                          >
                            <option value="">Sin definir</option>
                            {INTERACTION_MOMENTS.map((moment) => (
                              <option key={moment} value={moment}>
                                {moment}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-700">{scene.interactionMoment ?? 'Sin definir'}</span>
                        )}
                      </td>

                      <td className="px-3 py-2">
                        <button type="button" onClick={() => setActivitySceneId(scene.id)} className="rounded-md border border-slate-300 px-2 py-1 text-left text-xs hover:bg-slate-50">
                          {activityName ? <span className="text-emerald-700">{activityName}</span> : <span className="text-red-600">Sin asignar</span>}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )),
    [editingSceneId, grouped, resolveActivityName, setActivitySceneId, updateScene],
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Journey & Media
              </CardTitle>
              <CardDescription>Enriquece cada escena con metodologia ABC, media level y actividad del catalogo.</CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              {assignedScenes} de {totalScenes} escenas con actividad
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total escenas</p>
              <p className="text-xl font-semibold text-slate-900">{totalScenes}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Escenas con actividad</p>
              <p className="text-xl font-semibold text-slate-900">{assignedScenes}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">% completitud</p>
              <p className="text-xl font-semibold text-slate-900">{completion}%</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${completion}%` }} />
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar escenas por titulo o ABCMethod..."
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {grouped.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-sm text-slate-600">
                No hay escenas que coincidan con el filtro.
              </div>
            ) : (
              groupedSections
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/content`}>← Content</Link>
        </Button>
        <Button asChild>
          <Link href={`/projects/${project.id}/production`}>Siguiente → Production</Link>
        </Button>
      </div>

      <Dialog open={Boolean(activitySceneId)} onOpenChange={(open) => !open && setActivitySceneId(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Catalogo de Actividades</DialogTitle>
            <DialogDescription>
              Selecciona actividad para: <span className="font-medium text-slate-900">{selectedSceneRow?.scene.title ?? 'Escena'}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-1">
              <label className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                <Filter className="h-3.5 w-3.5" /> Categoria
              </label>
              <select
                aria-label="Filtrar por categoria"
                className="h-10 w-full rounded-md border border-slate-300 px-2 text-sm"
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
              >
                <option value="all">Todas</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                <Filter className="h-3.5 w-3.5" /> ABC Type
              </label>
              <select
                aria-label="Filtrar por tipo ABC"
                className="h-10 w-full rounded-md border border-slate-300 px-2 text-sm"
                value={filterAbc}
                onChange={(event) => setFilterAbc(event.target.value)}
              >
                <option value="all">Todos</option>
                {abcTypes.map((abc) => (
                  <option key={abc} value={abc}>
                    {abc}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="inline-flex items-center gap-1 text-xs font-medium text-slate-600">
                <Wrench className="h-3.5 w-3.5" /> Tool
              </label>
              <select
                aria-label="Filtrar por herramienta"
                className="h-10 w-full rounded-md border border-slate-300 px-2 text-sm"
                value={filterTool}
                onChange={(event) => setFilterTool(event.target.value as 'all' | 'Standard' | 'Adobe Captivate')}
              >
                <option value="all">Todos</option>
                <option value="Standard">Standard</option>
                <option value="Adobe Captivate">Adobe Captivate</option>
              </select>
            </div>
          </div>

          <div className="max-h-[50vh] overflow-auto pr-1">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredCatalog.map((activity) => (
                <article key={activity.id} className="rounded-lg border border-slate-200 bg-white p-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{activity.name}</h4>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] ${
                        activity.tool === 'Adobe Captivate'
                          ? 'border-violet-200 bg-violet-50 text-violet-700'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {activity.tool}
                    </span>
                  </div>

                  <p className="mb-2 line-clamp-3 text-xs text-slate-600">{activity.description}</p>

                  <div className="mb-2 flex flex-wrap gap-1">
                    {activity.abcTypes.map((tag) => (
                      <span key={tag} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] text-blue-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mb-3 flex flex-wrap gap-1">
                    {activity.cognitiveOutputs.map((tag) => (
                      <span key={tag} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Button type="button" size="sm" className="w-full" onClick={() => activitySceneId && assignActivity(activitySceneId, activity.id)}>
                    Asignar actividad
                  </Button>
                </article>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setActivitySceneId(null)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
