import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { checkAndLogRateLimit } from '@/lib/supabase/rate-limit';

type GenerateType = 'structure' | 'section' | 'blueprint';

interface GenerateBody {
  type?: GenerateType;
  context?: Record<string, unknown>;
}

function parseJsonStrict(text: string): Record<string, unknown> {
  const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(clean) as Record<string, unknown>;
  } catch {
    const first = clean.indexOf('{');
    const last = clean.lastIndexOf('}');

    if (first >= 0 && last > first) {
      return JSON.parse(clean.slice(first, last + 1)) as Record<string, unknown>;
    }

    throw new Error('JSON no parseable');
  }
}

function sectionPrompt(context: Record<string, unknown>) {
  const section = String(context.section ?? 'value-canvas');
  const strategy = (context.strategy ?? {}) as Record<string, unknown>;
  const current = (context.current ?? {}) as Record<string, unknown>;

  const prompts: Record<string, string> = {
    'value-canvas': `Genera propuesta de valor y listas jobs/pains/gains. Responde JSON exacto {"valueProposition":"string","jobs":["string"],"pains":["string"],"gains":["string"]}.`,
    'interaction-design': `Genera diseno de interaccion. Responde JSON exacto {"onsite":["string"],"video":["string"],"assisted":["string"],"independent":["string"],"collaborative":["string"],"asynchronous":["string"]}.`,
    assessment: `Genera estrategia de evaluacion. Responde JSON exacto {"formativeAssessment":["string"],"summativeAssessment":["string"],"didacticsEvaluation":["string"],"impactEvaluation":["string"]}.`,
    feedback: `Genera estrategia de retroalimentacion. Responde JSON exacto {"frequency":["string"],"followUp":["string"],"progressMonitoring":["string"],"coachingMentoring":["string"]}.`,
  };

  return `Contexto:\n- Problema: ${String(strategy.businessProblem ?? 'No definido')}\n- Audiencia: ${String(strategy.targetAudience ?? 'No definida')}\n- Datos actuales: ${JSON.stringify(current)}\n\n${prompts[section] ?? prompts['value-canvas']}\nResponde solo JSON valido, sin markdown.`;
}

function structurePrompt(context: Record<string, unknown>) {
  const strategy = (context.strategy ?? {}) as Record<string, unknown>;

  return `Contexto:\n- Problema: ${String(strategy.businessProblem ?? 'No definido')}\n- Audiencia: ${String(strategy.targetAudience ?? 'No definida')}\n- OKRs: ${JSON.stringify(strategy.okrs ?? [])}\n\nGenera una estructura curricular completa para LXD. Responde JSON exacto: {"sessions":[{"title":"string","modules":[{"title":"string","units":[{"title":"string","topics":[{"title":"string","scenes":[{"title":"string","durationMinutes":10}]}]}]}]}]}. Usa 2-4 sesiones. Responde solo JSON valido.`;
}

function blueprintPrompt(context: Record<string, unknown>) {
  const strategy = (context.strategy ?? {}) as Record<string, unknown>;

  return `Contexto:\n- Problema: ${String(strategy.businessProblem ?? 'No definido')}\n- Audiencia: ${String(strategy.targetAudience ?? 'No definida')}\n- OKRs: ${JSON.stringify(strategy.okrs ?? [])}\n\nGenera SyllabusBlueprint completo. Responde JSON exacto: {"contextAndObjective":"string","necessarySkills":["string"],"learningChallenges":["string"],"achievedCompetencies":["string"],"valueProposition":"string","didacticDesign":{"learningTypes":["string"],"interactionMoments":["string"]},"resourcesG2RI":["string"],"assessmentStrategy":{"formativeSummative":"string","didacticsAppropriation":"string"},"finalNarrative":"string"}. Responde solo JSON valido.`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateBody;

    if (!body.type || !body.context) {
      return NextResponse.json({ error: 'type y context son requeridos.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Sesion no valida.' }, { status: 401 });
    }

    const { data: orgMember } = await supabase.from('org_members').select('org_id').eq('user_id', user.id).limit(1).single();

    const rl = await checkAndLogRateLimit({
      userId: user.id,
      route: '/api/ai/generate',
      orgId: orgMember?.org_id,
      limit: 80,
    });

    if (!rl.allowed) {
      return NextResponse.json({ error: rl.error }, { status: 429 });
    }

    const prompt =
      body.type === 'structure'
        ? structurePrompt(body.context)
        : body.type === 'blueprint'
          ? blueprintPrompt(body.context)
          : sectionPrompt(body.context);

    const { text } = await generateText({
      model: google('gemini-2.0-flash'),
      prompt,
      temperature: 0.4,
    });

    const parsed = parseJsonStrict(text);

    if (body.type === 'structure') {
      if (!Array.isArray(parsed.sessions)) {
        return NextResponse.json({ error: 'La IA no devolvio una estructura valida.' }, { status: 422 });
      }
      return NextResponse.json({ data: parsed.sessions });
    }

    return NextResponse.json({ data: parsed });
  } catch {
    return NextResponse.json(
      {
        error: 'No se pudo generar contenido con IA en este momento. Intenta nuevamente.',
      },
      { status: 500 },
    );
  }
}
