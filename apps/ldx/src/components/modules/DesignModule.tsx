'use client';

import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Brain,
  Briefcase,
  ClipboardCheck,
  Gauge,
  Handshake,
  HeartHandshake,
  MonitorPlay,
  Plus,
  Sparkles,
  Users,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { getStringArray, getStringValue } from '@/lib/utils/strategy';

type AISuggestionSection = 'value-canvas' | 'interaction-design' | 'assessment' | 'feedback';

type InteractionKey = 'onsite' | 'video' | 'assisted' | 'independent' | 'collaborative' | 'asynchronous';
type AssessmentKey = 'formativeAssessment' | 'summativeAssessment' | 'didacticsEvaluation' | 'impactEvaluation';
type FeedbackKey = 'frequency' | 'followUp' | 'progressMonitoring' | 'coachingMentoring';

type DesignState = {
  valueProposition: string;
  jobs: string[];
  pains: string[];
  gains: string[];
  onsite: string[];
  video: string[];
  assisted: string[];
  independent: string[];
  collaborative: string[];
  asynchronous: string[];
  formativeAssessment: string[];
  summativeAssessment: string[];
  didacticsEvaluation: string[];
  impactEvaluation: string[];
  frequency: string[];
  followUp: string[];
  progressMonitoring: string[];
  coachingMentoring: string[];
};

function sanitizeStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
}

function SectionLoader() {
  return (
    <div className="space-y-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="h-3 w-40 animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
    </div>
  );
}

function DynamicItems({
  title,
  items,
  onChange,
  placeholder,
  tone = 'slate',
  enterToAdd = false,
}: {
  title: string;
  items: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  tone?: 'green' | 'red' | 'blue' | 'slate';
  enterToAdd?: boolean;
}) {
  const toneClass: Record<typeof tone, string> = {
    green: 'border-emerald-200 bg-emerald-50/50',
    red: 'border-rose-200 bg-rose-50/50',
    blue: 'border-blue-200 bg-blue-50/50',
    slate: 'border-slate-200 bg-white',
  };

  const addItem = () => {
    onChange([...items, '']);
  };

  const updateItem = (index: number, value: string) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className={`space-y-3 rounded-lg border p-4 ${toneClass[tone]}`}>
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="gap-1">
          <Plus className="h-3.5 w-3.5" />
          Agregar
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? <p className="text-xs text-slate-500">Sin items todavia.</p> : null}

        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              onKeyDown={(event) => {
                if (enterToAdd && event.key === 'Enter') {
                  event.preventDefault();
                  addItem();
                }
              }}
              placeholder={placeholder}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesignModule() {
  const router = useRouter();
  const { project, updateProject } = useProjectContext();
  const [loadingSection, setLoadingSection] = useState<AISuggestionSection | null>(null);

  const state = useMemo<DesignState>(() => {
    const source = project.strategy;

    return {
      valueProposition: getStringValue(source.valueProposition),
      jobs: getStringArray(source.jobs),
      pains: getStringArray(source.pains),
      gains: getStringArray(source.gains),
      onsite: getStringArray(source.onsite),
      video: getStringArray(source.video),
      assisted: getStringArray(source.assisted),
      independent: getStringArray(source.independent),
      collaborative: getStringArray(source.collaborative),
      asynchronous: getStringArray(source.asynchronous),
      formativeAssessment: getStringArray(source.formativeAssessment),
      summativeAssessment: getStringArray(source.summativeAssessment),
      didacticsEvaluation: getStringArray(source.didacticsEvaluation),
      impactEvaluation: getStringArray(source.impactEvaluation),
      frequency: getStringArray(source.frequency),
      followUp: getStringArray(source.followUp),
      progressMonitoring: getStringArray(source.progressMonitoring),
      coachingMentoring: getStringArray(source.coachingMentoring),
    };
  }, [project.strategy]);

  const patchStrategy = (partial: Record<string, unknown>) => {
    updateProject({
      strategy: {
        ...project.strategy,
        ...partial,
      },
    });
  };

  const requestAISuggestion = async (section: AISuggestionSection) => {
    try {
      setLoadingSection(section);

      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'section',
          context: {
            section,
            strategy: {
              businessProblem: getStringValue(project.strategy.businessProblem),
              targetAudience: getStringValue(project.strategy.targetAudience),
              okrs: getStringArray(project.strategy.okrs),
            },
            current: project.strategy,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo obtener sugerencias de IA.');
      }
      const payload = (await response.json()) as { data?: Record<string, unknown>; error?: string };
      if (!payload.data) {
        throw new Error(payload.error ?? 'No se pudo obtener sugerencias de IA.');
      }
      const parsed = payload.data;

      if (section === 'value-canvas') {
        patchStrategy({
          valueProposition: getStringValue(parsed.valueProposition),
          jobs: sanitizeStringArray(parsed.jobs),
          pains: sanitizeStringArray(parsed.pains),
          gains: sanitizeStringArray(parsed.gains),
        });
      }

      if (section === 'interaction-design') {
        patchStrategy({
          onsite: sanitizeStringArray(parsed.onsite),
          video: sanitizeStringArray(parsed.video),
          assisted: sanitizeStringArray(parsed.assisted),
          independent: sanitizeStringArray(parsed.independent),
          collaborative: sanitizeStringArray(parsed.collaborative),
          asynchronous: sanitizeStringArray(parsed.asynchronous),
        });
      }

      if (section === 'assessment') {
        patchStrategy({
          formativeAssessment: sanitizeStringArray(parsed.formativeAssessment),
          summativeAssessment: sanitizeStringArray(parsed.summativeAssessment),
          didacticsEvaluation: sanitizeStringArray(parsed.didacticsEvaluation),
          impactEvaluation: sanitizeStringArray(parsed.impactEvaluation),
        });
      }

      if (section === 'feedback') {
        patchStrategy({
          frequency: sanitizeStringArray(parsed.frequency),
          followUp: sanitizeStringArray(parsed.followUp),
          progressMonitoring: sanitizeStringArray(parsed.progressMonitoring),
          coachingMentoring: sanitizeStringArray(parsed.coachingMentoring),
        });
      }

      toast.success('Sugerencias IA aplicadas.');
    } catch (error) {
      console.error(error);
      toast.error('No fue posible generar sugerencias de IA para esta seccion.');
    } finally {
      setLoadingSection(null);
    }
  };

  const interactionCards: Array<{ key: InteractionKey; label: string; helper: string; icon: React.ElementType; color: string }> = [
    { key: 'onsite', label: 'Presencial / In-Situ', helper: 'Actividades en entorno real o simulacion de campo.', icon: Briefcase, color: 'border-emerald-200 bg-emerald-50/50' },
    { key: 'video', label: 'Asincronico grabado', helper: 'Microlearning en video o demostraciones guiadas.', icon: Video, color: 'border-indigo-200 bg-indigo-50/50' },
    { key: 'assisted', label: 'Con tutor / facilitador', helper: 'Intervencion experta para destrabar y retroalimentar.', icon: Users, color: 'border-amber-200 bg-amber-50/50' },
    { key: 'independent', label: 'Autoguiado', helper: 'Practica individual con rutas y recursos de apoyo.', icon: Brain, color: 'border-sky-200 bg-sky-50/50' },
    { key: 'collaborative', label: 'Grupal colaborativo', helper: 'Resolucion de retos en equipo con co-creacion.', icon: Handshake, color: 'border-violet-200 bg-violet-50/50' },
    { key: 'asynchronous', label: 'Plataforma LMS', helper: 'Foros, tareas y seguimiento asincronico en plataforma.', icon: MonitorPlay, color: 'border-rose-200 bg-rose-50/50' },
  ];

  const assessmentCards: Array<{ key: AssessmentKey; label: string; helper: string }> = [
    { key: 'formativeAssessment', label: 'Evaluacion formativa', helper: 'Chequeos frecuentes para ajustar el aprendizaje durante el proceso.' },
    { key: 'summativeAssessment', label: 'Evaluacion sumativa', helper: 'Evidencia final del logro esperado al cierre del programa.' },
    { key: 'didacticsEvaluation', label: 'Evaluacion de didacticas', helper: 'Mide la efectividad de metodos, actividades y recursos.' },
    { key: 'impactEvaluation', label: 'Evaluacion de impacto (KPIs)', helper: 'Relaciona aprendizaje con indicadores de negocio y desempeno.' },
  ];

  const feedbackCards: Array<{ key: FeedbackKey; label: string; helper: string }> = [
    { key: 'frequency', label: 'Frecuencia de feedback', helper: 'Define periodicidad por etapa o sprint formativo.' },
    { key: 'followUp', label: 'Seguimiento post-formacion', helper: 'Acciones de refuerzo tras finalizar el programa.' },
    { key: 'progressMonitoring', label: 'Monitoreo de avance', helper: 'Senales observables para detectar progreso o riesgo de abandono.' },
    { key: 'coachingMentoring', label: 'Coaching / mentoria', helper: 'Acompanamiento personalizado para transferir al puesto.' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Seccion A: Value Proposition Canvas
              </CardTitle>
              <CardDescription>Disena la propuesta de valor educativa y el mapa jobs-pains-gains.</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={() => requestAISuggestion('value-canvas')} disabled={loadingSection !== null}>
              <Bot className="h-4 w-4" />
              Sugerir con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSection === 'value-canvas' ? <SectionLoader /> : null}
          <div className="space-y-2">
            <Label htmlFor="value-proposition">Propuesta de valor del programa</Label>
            <Textarea
              id="value-proposition"
              value={state.valueProposition}
              onChange={(event) => patchStrategy({ valueProposition: event.target.value })}
              placeholder="Ejemplo: habilitar a lideres de proyecto para disenar experiencias formativas que mejoren KPIs operativos."
            />
            <p className="text-xs text-slate-500">Ejemplo metodologico: conecta promesa pedagogica con resultado observable de negocio.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <DynamicItems
              title="Jobs to be done"
              items={state.jobs}
              onChange={(next) => patchStrategy({ jobs: next })}
              placeholder="Ejemplo: estructurar un modulo con objetivos medibles."
              tone="green"
              enterToAdd
            />
            <DynamicItems
              title="Pains / Fricciones"
              items={state.pains}
              onChange={(next) => patchStrategy({ pains: next })}
              placeholder="Ejemplo: baja transferencia al puesto despues del curso."
              tone="red"
              enterToAdd
            />
            <DynamicItems
              title="Gains / Beneficios"
              items={state.gains}
              onChange={(next) => patchStrategy({ gains: next })}
              placeholder="Ejemplo: mayor velocidad para crear blueprints consistentes."
              tone="blue"
              enterToAdd
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Seccion B: Diseno de Interaccion (6 momentos)
              </CardTitle>
              <CardDescription>Define como se distribuye la experiencia de aprendizaje entre canales y momentos.</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={() => requestAISuggestion('interaction-design')} disabled={loadingSection !== null}>
              <Bot className="h-4 w-4" />
              Sugerir con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSection === 'interaction-design' ? <SectionLoader /> : null}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {interactionCards.map((channel) => {
              const Icon = channel.icon;

              return (
                <div key={channel.key} className={`space-y-3 rounded-lg border p-4 ${channel.color}`}>
                  <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 h-4 w-4 text-slate-700" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">{channel.label}</h4>
                      <p className="text-xs text-slate-600">{channel.helper}</p>
                    </div>
                  </div>

                  <DynamicItems
                    title="Items"
                    items={state[channel.key]}
                    onChange={(next) => patchStrategy({ [channel.key]: next })}
                    placeholder="Ejemplo: simulacion guiada con checklist de desempeno."
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4" />
                Seccion C: Evaluacion (4 tipos)
              </CardTitle>
              <CardDescription>Especifica la estrategia de evaluacion para aprendizaje, didactica e impacto.</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={() => requestAISuggestion('assessment')} disabled={loadingSection !== null}>
              <Bot className="h-4 w-4" />
              Sugerir con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSection === 'assessment' ? <SectionLoader /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {assessmentCards.map((assessment) => (
              <div key={assessment.key} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="text-sm font-semibold text-slate-800">{assessment.label}</h4>
                <p className="text-xs text-slate-600">{assessment.helper}</p>
                <DynamicItems
                  title="Items"
                  items={state[assessment.key]}
                  onChange={(next) => patchStrategy({ [assessment.key]: next })}
                  placeholder="Ejemplo: rubrica por nivel con evidencia de aplicacion."
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-4 w-4" />
                Seccion D: Retroalimentacion (4 dimensiones)
              </CardTitle>
              <CardDescription>Disena como se entregara feedback y acompanamiento durante y despues del programa.</CardDescription>
            </div>
            <Button type="button" variant="outline" className="gap-2" onClick={() => requestAISuggestion('feedback')} disabled={loadingSection !== null}>
              <Bot className="h-4 w-4" />
              Sugerir con IA
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSection === 'feedback' ? <SectionLoader /> : null}
          <div className="grid gap-4 md:grid-cols-2">
            {feedbackCards.map((feedback) => (
              <div key={feedback.key} className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <h4 className="text-sm font-semibold text-slate-800">{feedback.label}</h4>
                <p className="text-xs text-slate-600">{feedback.helper}</p>
                <DynamicItems
                  title="Items"
                  items={state[feedback.key]}
                  onChange={(next) => patchStrategy({ [feedback.key]: next })}
                  placeholder="Ejemplo: revision quincenal con plan de mejora individual."
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <Button asChild variant="outline" className="gap-2">
          <Link href={`/projects/${project.id}/strategy`}>
            <ArrowLeft className="h-4 w-4" />
            Strategy
          </Link>
        </Button>

        <div className="inline-flex items-center gap-2 text-sm text-slate-700">
          <Gauge className="h-4 w-4" />
          Define interaccion, evaluacion y feedback para fortalecer la transferencia.
        </div>

        <Button type="button" className="gap-2" onClick={() => router.push(`/projects/${project.id}/content`)}>
          Siguiente → Content
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
