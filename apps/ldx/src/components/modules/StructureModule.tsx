'use client';

import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
  Layers,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { memo, useMemo, useState } from 'react';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { getStringArray, getStringValue, isStrategyComplete } from '@/lib/utils/strategy';
import { ABCMethod, MediaLevel, type Scene, type Session, type SyllabusBlueprint } from '@/types';
import { INTERACTION_MOMENTS } from '@/data/catalog';

type NodeType = 'session' | 'module' | 'unit' | 'topic' | 'scene';

interface SelectedNode {
  type: NodeType;
  ids: string[];
}

interface SortData {
  type: NodeType;
  parentIds: string[];
}

function uid() {
  return crypto.randomUUID();
}

function createEmptyScene(): Scene {
  return {
    id: uid(),
    title: 'Nueva Escena',
    durationMinutes: 15,
  };
}

function normalizeGeneratedStructure(payload: Record<string, unknown>): Session[] {
  const rawSessions = Array.isArray(payload.sessions) ? payload.sessions : [];

  return rawSessions.map((sessionRaw, sIdx) => {
    const sessionObj = (sessionRaw ?? {}) as Record<string, unknown>;
    const rawModules = Array.isArray(sessionObj.modules) ? sessionObj.modules : [];

    return {
      id: uid(),
      title: getStringValue(sessionObj.title) || `Sesion ${sIdx + 1}`,
      modules: rawModules.map((moduleRaw, mIdx) => {
        const moduleObj = (moduleRaw ?? {}) as Record<string, unknown>;
        const rawUnits = Array.isArray(moduleObj.units) ? moduleObj.units : [];

        return {
          id: uid(),
          title: getStringValue(moduleObj.title) || `Modulo ${mIdx + 1}`,
          units: rawUnits.map((unitRaw, uIdx) => {
            const unitObj = (unitRaw ?? {}) as Record<string, unknown>;
            const rawTopics = Array.isArray(unitObj.topics) ? unitObj.topics : [];

            return {
              id: uid(),
              title: getStringValue(unitObj.title) || `Unidad ${uIdx + 1}`,
              topics: rawTopics.map((topicRaw, tIdx) => {
                const topicObj = (topicRaw ?? {}) as Record<string, unknown>;
                const rawScenes = Array.isArray(topicObj.scenes) ? topicObj.scenes : [];

                return {
                  id: uid(),
                  title: getStringValue(topicObj.title) || `Tema ${tIdx + 1}`,
                  scenes:
                    rawScenes.length > 0
                      ? rawScenes.map((sceneRaw, cIdx) => {
                          const sceneObj = (sceneRaw ?? {}) as Record<string, unknown>;
                          return {
                            id: uid(),
                            title: getStringValue(sceneObj.title) || `Escena ${cIdx + 1}`,
                            durationMinutes: Number(sceneObj.durationMinutes ?? 10),
                          } as Scene;
                        })
                      : [createEmptyScene()],
                };
              }),
            };
          }),
        };
      }),
    } as Session;
  });
}

const SortableRow = memo(function SortableRow({
  id,
  children,
  data,
}: {
  id: string;
  children: React.ReactNode;
  data: SortData;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id, data });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="group flex items-start gap-1">
      <button type="button" {...attributes} {...listeners} className="mt-1 rounded p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
});

export function StructureModule() {
  const router = useRouter();
  const { project, updateProject } = useProjectContext();

  const structure = useMemo(() => (Array.isArray(project.structure) ? project.structure : []) as Session[], [project.structure]);
  const strategy = project.strategy;

  const [selected, setSelected] = useState<SelectedNode | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [aiPreview, setAIPreview] = useState<Session[] | null>(null);
  const [isGeneratingStructure, setIsGeneratingStructure] = useState(false);
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);
  const [blueprintModalOpen, setBlueprintModalOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  const selectedScene = useMemo(() => {
    if (!selected || selected.type !== 'scene') {
      return null;
    }

    const [sessionId, moduleId, unitId, topicId, sceneId] = selected.ids;
    const session = structure.find((item) => item.id === sessionId);
    const courseModule = session?.modules.find((item) => item.id === moduleId);
    const unit = courseModule?.units.find((item) => item.id === unitId);
    const topic = unit?.topics.find((item) => item.id === topicId);
    const scene = topic?.scenes.find((item) => item.id === sceneId);

    return { sessionId, moduleId, unitId, topicId, scene };
  }, [selected, structure]);

  const toggleExpanded = (key: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const patchStructure = (next: Session[]) => {
    updateProject({ structure: next });
  };

  const updateScene = (sceneId: string, updater: (current: Scene) => Scene) => {
    const next = structure.map((session) => ({
      ...session,
      modules: session.modules.map((module) => ({
        ...module,
        units: module.units.map((unit) => ({
          ...unit,
          topics: unit.topics.map((topic) => ({
            ...topic,
            scenes: topic.scenes.map((scene) => (scene.id === sceneId ? updater(scene) : scene)),
          })),
        })),
      })),
    }));

    patchStructure(next);
  };

  const addSession = () => {
    const nextSession: Session = {
      id: uid(),
      title: `Sesion ${structure.length + 1}`,
      modules: [],
    };

    patchStructure([...structure, nextSession]);
    setSelected({ type: 'session', ids: [nextSession.id] });
    toast.success('Sesion creada.');
  };

  const renameNode = (type: NodeType, ids: string[]) => {
    const currentTitle =
      type === 'session'
        ? structure.find((s) => s.id === ids[0])?.title
        : type === 'module'
          ? structure.find((s) => s.id === ids[0])?.modules.find((m) => m.id === ids[1])?.title
          : type === 'unit'
            ? structure
                .find((s) => s.id === ids[0])
                ?.modules.find((m) => m.id === ids[1])
                ?.units.find((u) => u.id === ids[2])?.title
            : type === 'topic'
              ? structure
                  .find((s) => s.id === ids[0])
                  ?.modules.find((m) => m.id === ids[1])
                  ?.units.find((u) => u.id === ids[2])
                  ?.topics.find((t) => t.id === ids[3])?.title
              : structure
                  .find((s) => s.id === ids[0])
                  ?.modules.find((m) => m.id === ids[1])
                  ?.units.find((u) => u.id === ids[2])
                  ?.topics.find((t) => t.id === ids[3])
                  ?.scenes.find((c) => c.id === ids[4])?.title;

    const nextTitle = window.prompt('Nuevo titulo', currentTitle ?? '');

    if (!nextTitle || !nextTitle.trim()) {
      return;
    }

    const next = structure.map((session) => {
      if (type === 'session' && session.id === ids[0]) {
        return { ...session, title: nextTitle.trim() };
      }

      return {
        ...session,
        modules: session.modules.map((module) => {
          if (type === 'module' && session.id === ids[0] && module.id === ids[1]) {
            return { ...module, title: nextTitle.trim() };
          }

          return {
            ...module,
            units: module.units.map((unit) => {
              if (type === 'unit' && session.id === ids[0] && module.id === ids[1] && unit.id === ids[2]) {
                return { ...unit, title: nextTitle.trim() };
              }

              return {
                ...unit,
                topics: unit.topics.map((topic) => {
                  if (type === 'topic' && session.id === ids[0] && module.id === ids[1] && unit.id === ids[2] && topic.id === ids[3]) {
                    return { ...topic, title: nextTitle.trim() };
                  }

                  return {
                    ...topic,
                    scenes: topic.scenes.map((scene) => {
                      if (
                        type === 'scene' &&
                        session.id === ids[0] &&
                        module.id === ids[1] &&
                        unit.id === ids[2] &&
                        topic.id === ids[3] &&
                        scene.id === ids[4]
                      ) {
                        return { ...scene, title: nextTitle.trim() };
                      }

                      return scene;
                    }),
                  };
                }),
              };
            }),
          };
        }),
      };
    });

    patchStructure(next);
  };

  const deleteNode = (type: NodeType, ids: string[]) => {
    const next =
      type === 'session'
        ? structure.filter((session) => session.id !== ids[0])
        : structure.map((session) => ({
            ...session,
            modules:
              type === 'module' && session.id === ids[0]
                ? session.modules.filter((module) => module.id !== ids[1])
                : session.modules.map((module) => ({
                    ...module,
                    units:
                      type === 'unit' && session.id === ids[0] && module.id === ids[1]
                        ? module.units.filter((unit) => unit.id !== ids[2])
                        : module.units.map((unit) => ({
                            ...unit,
                            topics:
                              type === 'topic' && session.id === ids[0] && module.id === ids[1] && unit.id === ids[2]
                                ? unit.topics.filter((topic) => topic.id !== ids[3])
                                : unit.topics.map((topic) => ({
                                    ...topic,
                                    scenes:
                                      type === 'scene' &&
                                      session.id === ids[0] &&
                                      module.id === ids[1] &&
                                      unit.id === ids[2] &&
                                      topic.id === ids[3]
                                        ? topic.scenes.filter((scene) => scene.id !== ids[4])
                                        : topic.scenes,
                                  })),
                          })),
                  })),
          }));

    patchStructure(next);
    if (selected && JSON.stringify(selected.ids) === JSON.stringify(ids)) {
      setSelected(null);
    }
  };

  const addChild = (type: NodeType, ids: string[]) => {
    const next = structure.map((session) => {
      if (type === 'module' && session.id === ids[0]) {
        return {
          ...session,
          modules: [...session.modules, { id: uid(), title: `Modulo ${session.modules.length + 1}`, units: [] }],
        };
      }

      return {
        ...session,
        modules: session.modules.map((module) => {
          if (type === 'unit' && session.id === ids[0] && module.id === ids[1]) {
            return {
              ...module,
              units: [...module.units, { id: uid(), title: `Unidad ${module.units.length + 1}`, topics: [] }],
            };
          }

          return {
            ...module,
            units: module.units.map((unit) => {
              if (type === 'topic' && session.id === ids[0] && module.id === ids[1] && unit.id === ids[2]) {
                return {
                  ...unit,
                  topics: [...unit.topics, { id: uid(), title: `Tema ${unit.topics.length + 1}`, scenes: [] }],
                };
              }

              return {
                ...unit,
                topics: unit.topics.map((topic) => {
                  if (type === 'scene' && session.id === ids[0] && module.id === ids[1] && unit.id === ids[2] && topic.id === ids[3]) {
                    return {
                      ...topic,
                      scenes: [...topic.scenes, createEmptyScene()],
                    };
                  }

                  return topic;
                }),
              };
            }),
          };
        }),
      };
    });

    patchStructure(next);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeData = active.data.current as SortData | undefined;
    const overData = over.data.current as SortData | undefined;

    if (!activeData || !overData) {
      return;
    }

    if (activeData.type !== overData.type || JSON.stringify(activeData.parentIds) !== JSON.stringify(overData.parentIds)) {
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    const reorderInList = <T extends { id: string }>(list: T[]): T[] => {
      const oldIndex = list.findIndex((item) => item.id === activeId);
      const newIndex = list.findIndex((item) => item.id === overId);
      if (oldIndex < 0 || newIndex < 0) {
        return list;
      }
      return arrayMove(list, oldIndex, newIndex);
    };

    const next = structure.map((session) => {
      if (activeData.type === 'session') {
        return session;
      }

      return {
        ...session,
        modules: session.modules.map((module) => {
          if (activeData.type === 'module' && session.id === activeData.parentIds[0]) {
            return module;
          }

          return {
            ...module,
            units: module.units.map((unit) => ({
              ...unit,
              topics: unit.topics,
            })),
          };
        }),
      };
    });

    if (activeData.type === 'session') {
      patchStructure(reorderInList(structure));
      return;
    }

    if (activeData.type === 'module') {
      patchStructure(
        structure.map((session) =>
          session.id === activeData.parentIds[0] ? { ...session, modules: reorderInList(session.modules) } : session,
        ),
      );
      return;
    }

    if (activeData.type === 'unit') {
      patchStructure(
        structure.map((session) => ({
          ...session,
          modules: session.modules.map((module) =>
            session.id === activeData.parentIds[0] && module.id === activeData.parentIds[1]
              ? { ...module, units: reorderInList(module.units) }
              : module,
          ),
        })),
      );
      return;
    }

    if (activeData.type === 'topic') {
      patchStructure(
        structure.map((session) => ({
          ...session,
          modules: session.modules.map((module) => ({
            ...module,
            units: module.units.map((unit) =>
              session.id === activeData.parentIds[0] && module.id === activeData.parentIds[1] && unit.id === activeData.parentIds[2]
                ? { ...unit, topics: reorderInList(unit.topics) }
                : unit,
            ),
          })),
        })),
      );
      return;
    }

    void next;
  };

  const generateStructureWithAI = async () => {
    if (!isStrategyComplete(strategy)) {
      toast.error('Completa Strategy antes de generar estructura con IA.');
      return;
    }

    try {
      setIsGeneratingStructure(true);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'structure',
          context: {
            strategy: {
              businessProblem: getStringValue(strategy.businessProblem),
              targetAudience: getStringValue(strategy.targetAudience),
              okrs: getStringArray(strategy.okrs),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo generar estructura.');
      }
      const payload = (await response.json()) as { data?: unknown; error?: string };
      const normalized = normalizeGeneratedStructure({ sessions: Array.isArray(payload.data) ? payload.data : [] });

      if (normalized.length === 0) {
        throw new Error(payload.error ?? 'IA no devolvio una estructura utilizable.');
      }

      setAIPreview(normalized);
      toast.success('Estructura generada. Revisa el preview y confirma.');
    } catch (error) {
      console.error(error);
      toast.error('No fue posible generar estructura con IA.');
    } finally {
      setIsGeneratingStructure(false);
    }
  };

  const confirmAIStructure = () => {
    if (!aiPreview) {
      return;
    }
    patchStructure(aiPreview);
    setAIPreview(null);
    toast.success('Estructura IA insertada en el proyecto.');
  };

  const generateBlueprint = async () => {
    if (!isStrategyComplete(strategy)) {
      toast.error('Completa Strategy antes de generar el blueprint.');
      return;
    }

    try {
      setIsGeneratingBlueprint(true);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'blueprint',
          context: {
            strategy: {
              businessProblem: getStringValue(strategy.businessProblem),
              targetAudience: getStringValue(strategy.targetAudience),
              okrs: getStringArray(strategy.okrs),
              valueProposition: getStringValue(strategy.valueProposition),
            },
          },
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo generar blueprint.');
      }
      const payload = (await response.json()) as { data?: unknown; error?: string };
      if (!payload.data) {
        throw new Error(payload.error ?? 'No se pudo generar blueprint.');
      }
      const parsed = payload.data as SyllabusBlueprint;

      updateProject({ syllabusBlueprint: parsed as unknown as Record<string, unknown> });
      setBlueprintModalOpen(true);
      toast.success('Blueprint generado con IA.');
    } catch (error) {
      console.error(error);
      toast.error('No fue posible generar el blueprint.');
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const exportBlueprint = () => {
    if (!project.syllabusBlueprint) {
      toast.error('No hay blueprint para exportar.');
      return;
    }

    const content = JSON.stringify(project.syllabusBlueprint, null, 2);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_Syllabus_Blueprint.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const blueprintText = project.syllabusBlueprint ? JSON.stringify(project.syllabusBlueprint, null, 2) : 'Aun no generado.';

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Estructura Curricular
              </CardTitle>
              <CardDescription>Construye Session → Module → Unit → Topic → Scene con arbol expandible y reordenamiento.</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" onClick={generateStructureWithAI} disabled={isGeneratingStructure}>
                <Sparkles className="mr-2 h-4 w-4" />
                {isGeneratingStructure ? 'Generando...' : 'Generar Estructura con IA'}
              </Button>
              <Button type="button" variant="outline" onClick={generateBlueprint} disabled={isGeneratingBlueprint}>
                <Bot className="mr-2 h-4 w-4" />
                {isGeneratingBlueprint ? 'Generando...' : 'Generar Blueprint (9 secciones)'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {aiPreview ? (
            <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
              <p className="text-sm font-medium text-indigo-900">Preview IA</p>
              <p className="text-xs text-indigo-700">
                {aiPreview.length} sesiones sugeridas. Confirma para reemplazar la estructura actual.
              </p>
              <div className="mt-3 flex gap-2">
                <Button type="button" onClick={confirmAIStructure}>Confirmar insercion</Button>
                <Button type="button" variant="outline" onClick={() => setAIPreview(null)}>
                  Descartar
                </Button>
              </div>
            </div>
          ) : null}

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 lg:col-span-1">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-800">Arbol</p>
                  <Button type="button" size="sm" variant="outline" onClick={addSession}>
                    <Plus className="mr-1 h-3.5 w-3.5" /> Nueva Sesion
                  </Button>
                </div>

                <SortableContext items={structure.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-1">
                    {structure.map((session) => {
                      const sessionKey = `session-${session.id}`;
                      const sessionOpen = expanded.has(sessionKey);

                      return (
                        <SortableRow key={session.id} id={session.id} data={{ type: 'session', parentIds: [] }}>
                          <div className="rounded-md border border-slate-200 bg-white p-2">
                            <div className="flex items-center justify-between gap-2">
                              <button
                                type="button"
                                className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                onClick={() => {
                                  setSelected({ type: 'session', ids: [session.id] });
                                  toggleExpanded(sessionKey);
                                }}
                              >
                                {session.modules.length > 0 ?
                                  sessionOpen ? (
                                    <ChevronDown className="h-4 w-4 text-slate-500" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-slate-500" />
                                  ) : (
                                    <span className="h-4 w-4" />
                                  )}
                                <span className="truncate text-sm font-medium">{session.title}</span>
                              </button>
                              <div className="flex items-center gap-1">
                                <Button type="button" size="icon" variant="ghost" onClick={() => addChild('module', [session.id])}>
                                  <Plus className="h-3.5 w-3.5" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" onClick={() => renameNode('session', [session.id])}>
                                  <FileText className="h-3.5 w-3.5" />
                                </Button>
                                <Button type="button" size="icon" variant="ghost" onClick={() => deleteNode('session', [session.id])}>
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            {sessionOpen ? (
                              <div className="ml-4 mt-2 space-y-1">
                                <SortableContext items={session.modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
                                  {session.modules.map((module) => {
                                    const moduleKey = `module-${module.id}`;
                                    const moduleOpen = expanded.has(moduleKey);

                                    return (
                                      <SortableRow
                                        key={module.id}
                                        id={module.id}
                                        data={{ type: 'module', parentIds: [session.id] }}
                                      >
                                        <div className="rounded border border-slate-200 bg-slate-50 p-2">
                                          <div className="flex items-center justify-between gap-2">
                                            <button
                                              type="button"
                                              className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                              onClick={() => {
                                                setSelected({ type: 'module', ids: [session.id, module.id] });
                                                toggleExpanded(moduleKey);
                                              }}
                                            >
                                              {module.units.length > 0 ?
                                                moduleOpen ? (
                                                  <ChevronDown className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                  <ChevronRight className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                  <span className="h-4 w-4" />
                                                )}
                                              <span className="truncate text-sm">{module.title}</span>
                                            </button>
                                            <div className="flex items-center gap-1">
                                              <Button type="button" size="icon" variant="ghost" onClick={() => addChild('unit', [session.id, module.id])}>
                                                <Plus className="h-3.5 w-3.5" />
                                              </Button>
                                              <Button type="button" size="icon" variant="ghost" onClick={() => renameNode('module', [session.id, module.id])}>
                                                <FileText className="h-3.5 w-3.5" />
                                              </Button>
                                              <Button type="button" size="icon" variant="ghost" onClick={() => deleteNode('module', [session.id, module.id])}>
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                            </div>
                                          </div>

                                          {moduleOpen ? (
                                            <div className="ml-4 mt-2 space-y-1">
                                              <SortableContext items={module.units.map((u) => u.id)} strategy={verticalListSortingStrategy}>
                                                {module.units.map((unit) => {
                                                  const unitKey = `unit-${unit.id}`;
                                                  const unitOpen = expanded.has(unitKey);

                                                  return (
                                                    <SortableRow
                                                      key={unit.id}
                                                      id={unit.id}
                                                      data={{ type: 'unit', parentIds: [session.id, module.id] }}
                                                    >
                                                      <div className="rounded border border-slate-200 bg-white p-2">
                                                        <div className="flex items-center justify-between gap-2">
                                                          <button
                                                            type="button"
                                                            className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                                            onClick={() => {
                                                              setSelected({ type: 'unit', ids: [session.id, module.id, unit.id] });
                                                              toggleExpanded(unitKey);
                                                            }}
                                                          >
                                                            {unit.topics.length > 0 ?
                                                              unitOpen ? (
                                                                <ChevronDown className="h-4 w-4 text-slate-500" />
                                                              ) : (
                                                                <ChevronRight className="h-4 w-4 text-slate-500" />
                                                              ) : (
                                                                <span className="h-4 w-4" />
                                                              )}
                                                            <span className="truncate text-sm">{unit.title}</span>
                                                          </button>
                                                          <div className="flex items-center gap-1">
                                                            <Button
                                                              type="button"
                                                              size="icon"
                                                              variant="ghost"
                                                              onClick={() => addChild('topic', [session.id, module.id, unit.id])}
                                                            >
                                                              <Plus className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button type="button" size="icon" variant="ghost" onClick={() => renameNode('unit', [session.id, module.id, unit.id])}>
                                                              <FileText className="h-3.5 w-3.5" />
                                                            </Button>
                                                            <Button type="button" size="icon" variant="ghost" onClick={() => deleteNode('unit', [session.id, module.id, unit.id])}>
                                                              <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                          </div>
                                                        </div>

                                                        {unitOpen ? (
                                                          <div className="ml-4 mt-2 space-y-1">
                                                            <SortableContext items={unit.topics.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                                                              {unit.topics.map((topic) => {
                                                                const topicKey = `topic-${topic.id}`;
                                                                const topicOpen = expanded.has(topicKey);

                                                                return (
                                                                  <SortableRow
                                                                    key={topic.id}
                                                                    id={topic.id}
                                                                    data={{ type: 'topic', parentIds: [session.id, module.id, unit.id] }}
                                                                  >
                                                                    <div className="rounded border border-slate-200 bg-slate-50 p-2">
                                                                      <div className="flex items-center justify-between gap-2">
                                                                        <button
                                                                          type="button"
                                                                          className="flex min-w-0 flex-1 items-center gap-2 text-left"
                                                                          onClick={() => {
                                                                            setSelected({ type: 'topic', ids: [session.id, module.id, unit.id, topic.id] });
                                                                            toggleExpanded(topicKey);
                                                                          }}
                                                                        >
                                                                          {topic.scenes.length > 0 ?
                                                                            topicOpen ? (
                                                                              <ChevronDown className="h-4 w-4 text-slate-500" />
                                                                            ) : (
                                                                              <ChevronRight className="h-4 w-4 text-slate-500" />
                                                                            ) : (
                                                                              <span className="h-4 w-4" />
                                                                            )}
                                                                          <span className="truncate text-sm">{topic.title}</span>
                                                                        </button>
                                                                        <div className="flex items-center gap-1">
                                                                          <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => addChild('scene', [session.id, module.id, unit.id, topic.id])}
                                                                          >
                                                                            <Plus className="h-3.5 w-3.5" />
                                                                          </Button>
                                                                          <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => renameNode('topic', [session.id, module.id, unit.id, topic.id])}
                                                                          >
                                                                            <FileText className="h-3.5 w-3.5" />
                                                                          </Button>
                                                                          <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            onClick={() => deleteNode('topic', [session.id, module.id, unit.id, topic.id])}
                                                                          >
                                                                            <Trash2 className="h-3.5 w-3.5" />
                                                                          </Button>
                                                                        </div>
                                                                      </div>

                                                                      {topicOpen ? (
                                                                        <div className="ml-4 mt-2 space-y-1">
                                                                          {topic.scenes.map((scene) => (
                                                                            <div key={scene.id} className="flex items-center justify-between rounded border border-slate-200 bg-white px-2 py-1">
                                                                              <button
                                                                                type="button"
                                                                                className="truncate text-left text-xs text-slate-800"
                                                                                onClick={() => setSelected({ type: 'scene', ids: [session.id, module.id, unit.id, topic.id, scene.id] })}
                                                                              >
                                                                                {scene.title}
                                                                              </button>
                                                                              <div className="flex items-center gap-1">
                                                                                <Button
                                                                                  type="button"
                                                                                  size="icon"
                                                                                  variant="ghost"
                                                                                  onClick={() => renameNode('scene', [session.id, module.id, unit.id, topic.id, scene.id])}
                                                                                >
                                                                                  <FileText className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                                <Button
                                                                                  type="button"
                                                                                  size="icon"
                                                                                  variant="ghost"
                                                                                  onClick={() => deleteNode('scene', [session.id, module.id, unit.id, topic.id, scene.id])}
                                                                                >
                                                                                  <Trash2 className="h-3.5 w-3.5" />
                                                                                </Button>
                                                                              </div>
                                                                            </div>
                                                                          ))}
                                                                        </div>
                                                                      ) : null}
                                                                    </div>
                                                                  </SortableRow>
                                                                );
                                                              })}
                                                            </SortableContext>
                                                          </div>
                                                        ) : null}
                                                      </div>
                                                    </SortableRow>
                                                  );
                                                })}
                                              </SortableContext>
                                            </div>
                                          ) : null}
                                        </div>
                                      </SortableRow>
                                    );
                                  })}
                                </SortableContext>
                              </div>
                            ) : null}
                          </div>
                        </SortableRow>
                      );
                    })}
                  </div>
                </SortableContext>
              </div>

              <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
                {!selectedScene?.scene ? (
                  <div className="flex h-full min-h-80 items-center justify-center rounded border border-dashed border-slate-300 bg-slate-50">
                    <p className="text-sm text-slate-600">Selecciona una escena del arbol para editar sus campos.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold text-slate-900">Editor de Escena</h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="scene-title">Titulo</Label>
                        <Input
                          id="scene-title"
                          value={selectedScene.scene.title}
                          onChange={(event) => updateScene(selectedScene.scene!.id, (current) => ({ ...current, title: event.target.value }))}
                          placeholder="Ejemplo: Simulacion de reunion con stakeholder"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scene-duration">Duracion (minutos)</Label>
                        <Input
                          id="scene-duration"
                          type="number"
                          min={1}
                          value={selectedScene.scene.durationMinutes}
                          onChange={(event) =>
                            updateScene(selectedScene.scene!.id, (current) => ({
                              ...current,
                              durationMinutes: Number(event.target.value || 0),
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scene-media-format">Formato multimedia</Label>
                        <Input
                          id="scene-media-format"
                          value={selectedScene.scene.mediaFormat ?? ''}
                          onChange={(event) => updateScene(selectedScene.scene!.id, (current) => ({ ...current, mediaFormat: event.target.value }))}
                          placeholder="Video 360, Podcast, PDF..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scene-abc">Metodo ABC</Label>
                        <select
                          id="scene-abc"
                          aria-label="Metodo ABC de la escena"
                          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                          value={selectedScene.scene.abcMethod ?? ''}
                          onChange={(event) =>
                            updateScene(selectedScene.scene!.id, (current) => ({
                              ...current,
                              abcMethod: (event.target.value || undefined) as ABCMethod | undefined,
                            }))
                          }
                        >
                          <option value="">Seleccionar...</option>
                          {Object.values(ABCMethod).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="scene-media-level">Nivel multimedia</Label>
                        <select
                          id="scene-media-level"
                          aria-label="Nivel multimedia de la escena"
                          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                          value={selectedScene.scene.mediaLevel ?? ''}
                          onChange={(event) =>
                            updateScene(selectedScene.scene!.id, (current) => ({
                              ...current,
                              mediaLevel: (event.target.value || undefined) as MediaLevel | undefined,
                            }))
                          }
                        >
                          <option value="">Seleccionar...</option>
                          {Object.values(MediaLevel).map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="scene-learning-objective">Objetivo de aprendizaje</Label>
                        <Textarea
                          id="scene-learning-objective"
                          value={selectedScene.scene.learningObjective ?? ''}
                          onChange={(event) => updateScene(selectedScene.scene!.id, (current) => ({ ...current, learningObjective: event.target.value }))}
                          placeholder="Al finalizar esta escena, el participante sera capaz de..."
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="scene-interaction">Momento de interaccion</Label>
                        <select
                          id="scene-interaction"
                          aria-label="Momento de interaccion de la escena"
                          className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                          value={selectedScene.scene.interactionMoment ?? ''}
                          onChange={(event) =>
                            updateScene(selectedScene.scene!.id, (current) => ({
                              ...current,
                              interactionMoment: event.target.value || undefined,
                            }))
                          }
                        >
                          <option value="">Seleccionar...</option>
                          {INTERACTION_MOMENTS.map((moment) => (
                            <option key={moment} value={moment}>
                              {moment}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DndContext>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/design`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Design
          </Link>
        </Button>
        <Button type="button" onClick={() => router.push(`/projects/${project.id}/journey`)}>
          Siguiente → Journey <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <Dialog open={blueprintModalOpen} onOpenChange={setBlueprintModalOpen}>
        <DialogTrigger asChild>
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Syllabus Blueprint (9 secciones)</DialogTitle>
            <DialogDescription>Revisa el blueprint generado por IA y exportalo como texto.</DialogDescription>
          </DialogHeader>

          <div className="max-h-[55vh] overflow-auto rounded-md border border-slate-200 bg-slate-50 p-3">
            <pre className="whitespace-pre-wrap text-xs text-slate-700">{blueprintText}</pre>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={exportBlueprint}>
              Exportar como texto
            </Button>
            <Button type="button" onClick={() => setBlueprintModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
