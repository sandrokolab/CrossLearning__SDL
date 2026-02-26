'use client';

import confetti from 'canvas-confetti';
import { ChevronDown, ChevronRight, Copy, Download, FileJson, FileSpreadsheet, FileText, ShieldCheck, TriangleAlert } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { createClient } from '@/lib/supabase/client';
import { isStrategyComplete } from '@/lib/utils/strategy';
import type { LXDProject, Scene, Session } from '@/types';

interface SessionSummary {
  sessionId: string;
  name: string;
  modules: number;
  scenes: number;
  interactive: number;
  completion: number;
}

interface FlatSceneRow {
  session: string;
  module: string;
  unit: string;
  topic: string;
  scene: string;
  duration: number;
  abcMethod: string;
  mediaLevel: string;
  activity: string;
}

function asArray<T>(value: T[] | unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function completionColor(percent: number) {
  if (percent < 50) return 'bg-red-500';
  if (percent < 80) return 'bg-amber-500';
  return 'bg-emerald-500';
}

function calcSceneCompletion(scene: Scene) {
  return Boolean(
    scene.selectedActivityId &&
      scene.abcMethod &&
      scene.mediaLevel &&
      scene.mediaFormat &&
      scene.learningObjective &&
      scene.interactionMoment,
  );
}

function formatMarkdownBlueprint(blueprint: Record<string, unknown> | null) {
  if (!blueprint) {
    return '# Syllabus Blueprint\n\nNo disponible.';
  }

  return [
    '# Syllabus Blueprint',
    '',
    `## Context And Objective`,
    `${String(blueprint.contextAndObjective ?? '')}`,
    '',
    '## Necessary Skills',
    ...asArray<string>(blueprint.necessarySkills).map((item) => `- ${item}`),
    '',
    '## Learning Challenges',
    ...asArray<string>(blueprint.learningChallenges).map((item) => `- ${item}`),
    '',
    '## Achieved Competencies',
    ...asArray<string>(blueprint.achievedCompetencies).map((item) => `- ${item}`),
    '',
    '## Value Proposition',
    `${String(blueprint.valueProposition ?? '')}`,
    '',
    '## Didactic Design',
    `- Learning Types: ${asArray<string>((blueprint.didacticDesign as Record<string, unknown> | undefined)?.learningTypes).join(', ')}`,
    `- Interaction Moments: ${asArray<string>((blueprint.didacticDesign as Record<string, unknown> | undefined)?.interactionMoments).join(', ')}`,
    '',
    '## Resources G2RI',
    ...asArray<string>(blueprint.resourcesG2RI).map((item) => `- ${item}`),
    '',
    '## Assessment Strategy',
    `- Formative/Summative: ${String((blueprint.assessmentStrategy as Record<string, unknown> | undefined)?.formativeSummative ?? '')}`,
    `- Didactics Appropriation: ${String((blueprint.assessmentStrategy as Record<string, unknown> | undefined)?.didacticsAppropriation ?? '')}`,
    '',
    '## Final Narrative',
    `${String(blueprint.finalNarrative ?? '')}`,
    '',
  ].join('\n');
}

function downloadText(filename: string, content: string, mime = 'text/plain;charset=utf-8') {
  const bom = '\uFEFF';
  const blob = new Blob([bom, content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ProductionModule() {
  const { project } = useProjectContext();
  const [openSessions, setOpenSessions] = useState<Set<string>>(new Set());
  const [exporterName, setExporterName] = useState('unknown');

  const structure = useMemo(() => (Array.isArray(project.structure) ? (project.structure as Session[]) : []), [project.structure]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.email) {
          setExporterName(user.email);
        }
      } catch {
        // noop
      }
    };

    void loadUser();
  }, []);

  const summaries = useMemo<SessionSummary[]>(() => {
    return structure.map((session) => {
      let scenes = 0;
      let interactive = 0;
      let completed = 0;

      session.modules.forEach((module) => {
        module.units.forEach((unit) => {
          unit.topics.forEach((topic) => {
            topic.scenes.forEach((scene) => {
              scenes += 1;
              if (scene.selectedActivityId) interactive += 1;
              if (calcSceneCompletion(scene)) completed += 1;
            });
          });
        });
      });

      const completion = scenes === 0 ? 0 : Math.round((completed / scenes) * 100);

      return {
        sessionId: session.id,
        name: session.title,
        modules: session.modules.length,
        scenes,
        interactive,
        completion,
      };
    });
  }, [structure]);

  const flatRows = useMemo<FlatSceneRow[]>(() => {
    const rows: FlatSceneRow[] = [];

    structure.forEach((session) => {
      session.modules.forEach((module) => {
        module.units.forEach((unit) => {
          unit.topics.forEach((topic) => {
            topic.scenes.forEach((scene) => {
              rows.push({
                session: session.title,
                module: module.title,
                unit: unit.title,
                topic: topic.title,
                scene: scene.title,
                duration: scene.durationMinutes,
                abcMethod: scene.abcMethod ?? '',
                mediaLevel: scene.mediaLevel ?? '',
                activity: scene.selectedActivityId ?? '',
              });
            });
          });
        });
      });
    });

    return rows;
  }, [structure]);

  const totalSessions = structure.length;
  const totalScenes = flatRows.length;
  const interactiveObjects = flatRows.filter((row) => Boolean(row.activity)).length;
  const completedScenes = useMemo(() => {
    let count = 0;
    structure.forEach((s) =>
      s.modules.forEach((m) =>
        m.units.forEach((u) =>
          u.topics.forEach((t) =>
            t.scenes.forEach((scene) => {
              if (calcSceneCompletion(scene)) count += 1;
            }),
          ),
        ),
      ),
    );
    return count;
  }, [structure]);
  const completionRate = totalScenes === 0 ? 0 : Math.round((completedScenes / totalScenes) * 100);

  const qualityChecks = useMemo(() => {
    const strategyOk = isStrategyComplete(project.strategy);
    const hasSessionWithModules = structure.some((session) => session.modules.length > 0);
    const allLearningObjectives = totalScenes > 0 && structure.every((s) => s.modules.every((m) => m.units.every((u) => u.topics.every((t) => t.scenes.every((scene) => Boolean(scene.learningObjective?.trim()))))));
    const allAbcAssigned = totalScenes > 0 && structure.every((s) => s.modules.every((m) => m.units.every((u) => u.topics.every((t) => t.scenes.every((scene) => Boolean(scene.abcMethod))))));
    const completionAtLeast80 = completionRate >= 80;

    return [
      {
        label: 'Strategy completa (businessProblem, targetAudience, qualitativeObjective)',
        ok: strategyOk,
      },
      {
        label: 'Al menos una sesion con modulos',
        ok: hasSessionWithModules,
      },
      {
        label: 'Todas las escenas tienen learningObjective',
        ok: allLearningObjectives,
      },
      {
        label: 'Todas las escenas tienen ABCMethod asignado',
        ok: allAbcAssigned,
      },
      {
        label: 'Completitud >= 80%',
        ok: completionAtLeast80,
      },
    ];
  }, [completionRate, project.strategy, structure, totalScenes]);

  useEffect(() => {
    const key = `confetti_done_${project.id}`;

    if (completionRate === 100 && typeof window !== 'undefined' && !window.sessionStorage.getItem(key)) {
      confetti({
        particleCount: 220,
        spread: 90,
        origin: { y: 0.65 },
      });
      window.sessionStorage.setItem(key, '1');
      toast.success('Proyecto al 100%. Listo para exportar.');
    }
  }, [completionRate, project.id]);

  const exportMetadata = {
    exportedAt: new Date().toISOString(),
    version: 'ldx-v1',
    org_id: project.orgId,
    exporter: exporterName,
  };

  const exportJson = () => {
    const payload: { metadata: typeof exportMetadata; project: LXDProject } = {
      metadata: exportMetadata,
      project: {
        title: project.title,
        strategy: project.strategy as unknown as LXDProject['strategy'],
        structure,
        syllabusBlueprint: project.syllabusBlueprint as unknown as LXDProject['syllabusBlueprint'],
      },
    };

    downloadText(`${project.title.replace(/\s+/g, '_')}_LXD.json`, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
    toast.success('JSON exportado.');
  };

  const exportCsv = () => {
    const header = ['session', 'module', 'unit', 'topic', 'scene', 'duration_minutes', 'abc_method', 'media_level', 'activity'];

    const escape = (value: string | number) => {
      const text = String(value ?? '');
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`;
      }
      return text;
    };

    const metadataLines = [
      `# exported_at: ${exportMetadata.exportedAt}`,
      `# version: ${exportMetadata.version}`,
      `# org_id: ${exportMetadata.org_id}`,
      `# exporter: ${exportMetadata.exporter}`,
      '',
    ];

    const rows = flatRows.map((row) =>
      [row.session, row.module, row.unit, row.topic, row.scene, row.duration, row.abcMethod, row.mediaLevel, row.activity]
        .map(escape)
        .join(','),
    );

    const csv = [...metadataLines, header.join(','), ...rows].join('\n');
    downloadText(`${project.title.replace(/\s+/g, '_')}_scenes.csv`, csv, 'text/csv;charset=utf-8');
    toast.success('CSV exportado.');
  };

  const exportBlueprintMarkdown = () => {
    const md = [
      `<!-- exported_at: ${exportMetadata.exportedAt} -->`,
      `<!-- version: ${exportMetadata.version} -->`,
      `<!-- org_id: ${exportMetadata.org_id} -->`,
      `<!-- exporter: ${exportMetadata.exporter} -->`,
      '',
      formatMarkdownBlueprint(project.syllabusBlueprint),
    ].join('\n');

    downloadText(`${project.title.replace(/\s+/g, '_')}_blueprint.md`, md, 'text/markdown;charset=utf-8');
    toast.success('Blueprint Markdown exportado.');
  };

  const copyJson = async () => {
    const payload = {
      metadata: exportMetadata,
      project: {
        title: project.title,
        strategy: project.strategy,
        structure,
        syllabusBlueprint: project.syllabusBlueprint,
      },
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      toast.success('JSON copiado al portapapeles.');
    } catch {
      toast.error('No se pudo copiar al portapapeles.');
    }
  };

  return (
    <div className="space-y-4">
      {completionRate === 100 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
          <p className="font-medium">Proyecto completado al 100%</p>
          <p className="text-sm">La estructura y metadatos cumplen el umbral maximo de completitud.</p>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Seccion A — Dashboard de Metricas</CardTitle>
          <CardDescription>Estado general del blueprint listo para produccion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total Sesiones</p>
              <p className="text-2xl font-semibold text-slate-900">{totalSessions}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Total Escenas</p>
              <p className="text-2xl font-semibold text-slate-900">{totalScenes}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Objetos Interactivos</p>
              <p className="text-2xl font-semibold text-slate-900">{interactiveObjects}</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs text-slate-500">% Completitud</p>
              <p className="text-2xl font-semibold text-slate-900">{completionRate}%</p>
            </div>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-slate-200">
            <div className={`h-full transition-all ${completionColor(completionRate)}`} style={{ width: `${completionRate}%` }} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seccion B — Resumen por Sesion</CardTitle>
          <CardDescription>Desglose expandible de modulos, escenas y completitud por sesion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-3 py-2" />
                  <th className="px-3 py-2">Sesion</th>
                  <th className="px-3 py-2">Modulos</th>
                  <th className="px-3 py-2">Escenas</th>
                  <th className="px-3 py-2">Objetos</th>
                  <th className="px-3 py-2">% Completitud</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((summary) => {
                  const open = openSessions.has(summary.sessionId);
                  const session = structure.find((item) => item.id === summary.sessionId);

                  return (
                    <>
                      <tr key={summary.sessionId} className={`border-t ${summary.completion < 100 ? 'bg-amber-50/60' : 'bg-white'}`}>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenSessions((prev) => {
                                const next = new Set(prev);
                                if (next.has(summary.sessionId)) next.delete(summary.sessionId);
                                else next.add(summary.sessionId);
                                return next;
                              })
                            }
                          >
                            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                          </button>
                        </td>
                        <td className="px-3 py-2 font-medium text-slate-900">{summary.name}</td>
                        <td className="px-3 py-2">{summary.modules}</td>
                        <td className="px-3 py-2">{summary.scenes}</td>
                        <td className="px-3 py-2">{summary.interactive}</td>
                        <td className="px-3 py-2">{summary.completion}%</td>
                      </tr>
                      {open && session ? (
                        <tr className="border-t bg-white">
                          <td colSpan={6} className="px-3 py-3">
                            <div className="grid gap-2 md:grid-cols-2">
                              {session.modules.map((module) => (
                                <div key={module.id} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
                                  <p className="font-semibold text-slate-800">{module.title}</p>
                                  <p className="text-slate-600">Unidades: {module.units.length}</p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ) : null}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seccion C — Checklist de Calidad</CardTitle>
          <CardDescription>Verificaciones clave antes de exportar a produccion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {qualityChecks.map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                  item.ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                <span>{item.label}</span>
                <span>{item.ok ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seccion D — Opciones de Exportacion</CardTitle>
          <CardDescription>Genera entregables para produccion y stakeholders.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <Button type="button" variant="outline" className="justify-start gap-2" onClick={exportJson}>
              <FileJson className="h-4 w-4" /> Exportar JSON
            </Button>
            <Button type="button" variant="outline" className="justify-start gap-2" onClick={exportCsv}>
              <FileSpreadsheet className="h-4 w-4" /> Exportar CSV de Escenas
            </Button>
            <Button type="button" variant="outline" className="justify-start gap-2" onClick={exportBlueprintMarkdown}>
              <FileText className="h-4 w-4" /> Exportar Blueprint (Markdown)
            </Button>
            <Button type="button" variant="outline" className="justify-start gap-2" onClick={copyJson}>
              <Copy className="h-4 w-4" /> Copiar JSON al portapapeles
            </Button>
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
            <p className="mb-1 inline-flex items-center gap-1 font-medium text-slate-700">
              <ShieldCheck className="h-3.5 w-3.5" /> Metadata incluida en exportacion
            </p>
            <p>
              Fecha: {exportMetadata.exportedAt} | Version: {exportMetadata.version} | Org: {exportMetadata.org_id} | Exportador:{' '}
              {exportMetadata.exporter}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Button asChild variant="outline">
          <Link href={`/projects/${project.id}/journey`}>← Journey</Link>
        </Button>
        <div className="inline-flex items-center gap-2 text-sm text-slate-600">
          {completionRate < 80 ? <TriangleAlert className="h-4 w-4 text-amber-600" /> : <Download className="h-4 w-4 text-emerald-600" />}
          {completionRate < 80 ? 'Completa al menos 80% para una entrega robusta.' : 'Listo para exportar entregables de produccion.'}
        </div>
      </div>
    </div>
  );
}
