import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';
import { checkAndLogRateLimit } from '@/lib/supabase/rate-limit';

interface ProjectContextPayload {
  title?: string;
  strategy?: {
    businessProblem?: string;
    targetAudience?: string;
    okrs?: string[];
  };
}

interface ChatBody {
  projectId?: string;
  messages?: UIMessage[];
  projectContext?: ProjectContextPayload;
}

function messageToText(message: UIMessage) {
  return message.parts
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join('\n')
    .trim();
}

function todayUtcStartIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatBody;
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const projectId = body.projectId;

    if (!projectId || messages.length === 0) {
      return NextResponse.json({ error: 'projectId y messages son requeridos.' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Sesion no valida.' }, { status: 401 });
    }

    const { data: project, error: projectError } = await supabase.from('lxd_projects').select('id').eq('id', projectId).single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'No tienes acceso a este proyecto.' }, { status: 403 });
    }

    const { data: orgMember } = await supabase.from('org_members').select('org_id').eq('user_id', user.id).limit(1).single();

    const { count: dailyCount, error: countError } = await supabase
      .from('chat_messages')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', projectId)
      .gte('created_at', todayUtcStartIso());

    if (countError) {
      return NextResponse.json({ error: 'No se pudo validar el limite diario de chat.' }, { status: 500 });
    }

    if ((dailyCount ?? 0) >= 50) {
      return NextResponse.json({ error: 'Limite diario alcanzado: 50 mensajes por proyecto.' }, { status: 429 });
    }

    const rl = await checkAndLogRateLimit({
      userId: user.id,
      route: '/api/ai/chat',
      projectId,
      orgId: orgMember?.org_id,
      limit: 50,
    });

    if (!rl.allowed) {
      return NextResponse.json({ error: rl.error }, { status: 429 });
    }

    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');

    if (lastUserMessage) {
      const content = messageToText(lastUserMessage);
      if (content) {
        await supabase.from('chat_messages').insert({
          project_id: projectId,
          user_id: user.id,
          role: 'user',
          content,
        });
      }
    }

    const title = body.projectContext?.title ?? 'Proyecto LXD';
    const businessProblem = body.projectContext?.strategy?.businessProblem ?? 'No definido';
    const targetAudience = body.projectContext?.strategy?.targetAudience ?? 'No definida';
    const okrs = Array.isArray(body.projectContext?.strategy?.okrs) ? body.projectContext?.strategy?.okrs : [];

    const system = `Eres un consultor experto en Learning Experience Design (LXD) especializado en metodologia ABC y Backwards Design. Estas ayudando a disenar el programa: ${title}. Problema de negocio: ${businessProblem}. Audiencia: ${targetAudience}. OKRs: ${okrs.join('; ') || 'No definidos'}. Responde siempre en espanol, de forma concisa y accionable.`;

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
      onFinish: async ({ text }) => {
        if (!text?.trim()) return;

        await supabase.from('chat_messages').insert({
          project_id: projectId,
          user_id: user.id,
          role: 'assistant',
          content: text,
        });
      },
    });

    return result.toUIMessageStreamResponse();
  } catch {
    return NextResponse.json({ error: 'No se pudo procesar el chat con IA.' }, { status: 500 });
  }
}
