'use client';

import { ArrowRight, GaugeCircle, Goal, ListChecks, Sparkles, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { getStringArray, getStringValue, isStrategyComplete } from '@/lib/utils/strategy';

interface FieldErrors {
  businessProblem?: string;
  targetAudience?: string;
  qualitativeObjective?: string;
}

type PrincipleKey = 'principle1' | 'principle2' | 'principle3' | 'principle4' | 'principle5';

const principleKeys: PrincipleKey[] = ['principle1', 'principle2', 'principle3', 'principle4', 'principle5'];

function DynamicList({
  title,
  value,
  onChange,
  placeholder,
  maxItems,
}: {
  title: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  maxItems?: number;
}) {
  const addItem = () => {
    if (maxItems && value.length >= maxItems) {
      toast.error(`Maximo ${maxItems} items en ${title}.`);
      return;
    }

    onChange([...value, '']);
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateItem = (index: number, text: string) => {
    const next = [...value];
    next[index] = text;
    onChange(next);
  };

  return (
    <div className="space-y-3 rounded-lg border border-slate-200 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          Agregar
        </Button>
      </div>

      {value.length === 0 ? <p className="text-xs text-slate-500">Sin elementos aun.</p> : null}

      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={`${title}-${index}`} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder={placeholder}
            />
            <Button type="button" variant="ghost" size="sm" onClick={() => removeItem(index)}>
              Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StrategyModule() {
  const router = useRouter();
  const { project, updateProject } = useProjectContext();

  const strategy = useMemo(() => {
    const source = project.strategy;

    return {
      businessProblem: getStringValue(source.businessProblem),
      targetAudience: getStringValue(source.targetAudience),
      trainingNeed: getStringValue(source.trainingNeed),
      qualitativeObjective: getStringValue(source.qualitativeObjective),
      okrs: getStringArray(source.okrs),
      principle1: getStringArray(source.principle1),
      principle2: getStringArray(source.principle2),
      principle3: getStringArray(source.principle3),
      principle4: getStringArray(source.principle4),
      principle5: getStringArray(source.principle5),
      impactValidation: getStringValue(source.impactValidation),
    };
  }, [project.strategy]);

  const [errors, setErrors] = useState<FieldErrors>({});

  const patchStrategy = (partial: Record<string, unknown>) => {
    updateProject({
      strategy: {
        ...project.strategy,
        ...partial,
      },
    });
  };

  const handleRequiredChange = (field: keyof FieldErrors, value: string) => {
    if (errors[field] && value.trim()) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNext = () => {
    const nextErrors: FieldErrors = {};

    if (!strategy.businessProblem.trim()) {
      nextErrors.businessProblem = 'El problema de negocio es requerido.';
    }

    if (!strategy.targetAudience.trim()) {
      nextErrors.targetAudience = 'La audiencia objetivo es requerida.';
    }

    if (!strategy.qualitativeObjective.trim()) {
      nextErrors.qualitativeObjective = 'El objetivo cualitativo es requerido.';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Completa los campos requeridos para continuar.');
      return;
    }

    toast.success('Strategy completo. Continuemos con Design.');
    router.push(`/projects/${project.id}/design`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Seccion A: Problema de Negocio
          </CardTitle>
          <CardDescription>Define el problema raiz y la audiencia antes de cualquier decision pedagogica.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-problem">Problema de negocio</Label>
            <Textarea
              id="business-problem"
              value={strategy.businessProblem}
              onChange={(event) => {
                const value = event.target.value;
                patchStrategy({ businessProblem: value });
                handleRequiredChange('businessProblem', value);
              }}
              placeholder="Ejemplo: La fuerza comercial no logra convertir leads tecnicos en propuestas con valor de negocio."
            />
            <p className="text-xs text-slate-500">Ejemplo metodologico: formula el gap actual vs resultado de negocio esperado.</p>
            {errors.businessProblem ? <p className="text-xs text-red-600">{errors.businessProblem}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-audience">Audiencia objetivo / Persona</Label>
            <Textarea
              id="target-audience"
              value={strategy.targetAudience}
              onChange={(event) => {
                const value = event.target.value;
                patchStrategy({ targetAudience: value });
                handleRequiredChange('targetAudience', value);
              }}
              placeholder="Ejemplo: Consultores junior con 0-2 anos de experiencia que facilitan capacitaciones internas."
            />
            <p className="text-xs text-slate-500">Ejemplo metodologico: incluye rol, contexto operativo y limitaciones reales.</p>
            {errors.targetAudience ? <p className="text-xs text-red-600">{errors.targetAudience}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="training-need">Necesidad de formacion detectada</Label>
            <Textarea
              id="training-need"
              value={strategy.trainingNeed}
              onChange={(event) => patchStrategy({ trainingNeed: event.target.value })}
              placeholder="Ejemplo: fortalecer diseno de experiencias blended con evaluacion autentica por evidencia."
            />
            <p className="text-xs text-slate-500">Ejemplo metodologico: conecta la necesidad con competencias observables.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Goal className="h-4 w-4" />
            Seccion B: OKRs / KLRs
          </CardTitle>
          <CardDescription>Define el objetivo cualitativo y los resultados de aprendizaje medibles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qualitative-objective">Objetivo cualitativo (OKR)</Label>
            <Input
              id="qualitative-objective"
              value={strategy.qualitativeObjective}
              onChange={(event) => {
                const value = event.target.value;
                patchStrategy({ qualitativeObjective: value });
                handleRequiredChange('qualitativeObjective', value);
              }}
              placeholder="Ejemplo: Disenar experiencias formativas orientadas a desempeno en contexto real."
            />
            <p className="text-xs text-slate-500">Ejemplo metodologico: un objetivo inspirador, no una tarea operativa.</p>
            {errors.qualitativeObjective ? <p className="text-xs text-red-600">{errors.qualitativeObjective}</p> : null}
          </div>

          <DynamicList
            title="Key Learning Results"
            value={strategy.okrs}
            onChange={(next) => patchStrategy({ okrs: next.slice(0, 5) })}
            placeholder="Ejemplo KLR: 80% de participantes disena una secuencia ABC completa en simulacion."
            maxItems={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListChecks className="h-4 w-4" />
            Seccion C: Mapeo de Resultados (5 Principios)
          </CardTitle>
          <CardDescription>Relaciona decisiones didacticas con principios de aprendizaje transferible.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {principleKeys.map((key, index) => (
            <DynamicList
              key={key}
              title={`Principio ${index + 1}`}
              value={strategy[key]}
              onChange={(next) => patchStrategy({ [key]: next })}
              placeholder="Ejemplo: Evidencia observable de aplicacion en situacion real."
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GaugeCircle className="h-4 w-4" />
            Seccion D: Validacion de Impacto
          </CardTitle>
          <CardDescription>Define como se comprobara impacto en desempeno y negocio despues de la intervencion.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="impact-validation">¿Como se validara el impacto?</Label>
          <Textarea
            id="impact-validation"
            value={strategy.impactValidation}
            onChange={(event) => patchStrategy({ impactValidation: event.target.value })}
            placeholder="Ejemplo: comparativo pre/post en indicadores de conversion + rubrica de desempeno en simulacion."
          />
          <p className="text-xs text-slate-500">Ejemplo metodologico: combina indicadores de aprendizaje y de resultado de negocio.</p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="inline-flex items-center gap-2 text-sm text-slate-700">
          <Sparkles className="h-4 w-4" />
          {isStrategyComplete(project.strategy) ? 'Paso Strategy completado.' : 'Completa campos requeridos para marcar Strategy como completado.'}
        </div>

        <Button type="button" onClick={handleNext} className="gap-2">
          Siguiente → Design
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
