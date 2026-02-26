'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import { BrainCircuit, Loader2, Send, Trash2, UserRound } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useProjectContext } from '@/lib/context/ProjectContext';
import { createClient } from '@/lib/supabase/client';

export function ChatConsultant() {
  const { project } = useProjectContext();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  const projectContext = useMemo(
    () => ({
      title: project.title,
      strategy: project.strategy,
      structure: project.structure,
      syllabusBlueprint: project.syllabusBlueprint,
    }),
    [project.syllabusBlueprint, project.strategy, project.structure, project.title],
  );

  const { messages, sendMessage, setMessages, status } = useChat({
    id: `project-chat-${project.id}`,
    transport: new DefaultChatTransport({
      api: '/api/ai/chat',
    }),
  });

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadHistory = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('chat_messages')
          .select('id, role, content, created_at')
          .eq('project_id', project.id)
          .order('created_at', { ascending: true });

        if (error) throw error;

        const mapped = (data ?? []).map((item) => ({
          id: item.id,
          role: item.role as 'user' | 'assistant',
          parts: [{ type: 'text' as const, text: item.content }],
        })) satisfies UIMessage[];

        setMessages(mapped);
      } catch {
        toast.error('No se pudo cargar el historial de chat.');
      }
    };

    void loadHistory();
  }, [open, project.id, setMessages]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSendMessage = async () => {
    const content = draft.trim();
    if (!content || isLoading) return;

    setDraft('');

    try {
      await sendMessage(
        { text: content },
        {
          body: {
            projectId: project.id,
            projectContext,
          },
        },
      );
    } catch {
      toast.error('No se pudo enviar el mensaje.');
    }
  };

  const clearHistory = async () => {
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Sesion no valida para limpiar historial.');
        return;
      }

      const { error } = await supabase.from('chat_messages').delete().eq('project_id', project.id).eq('user_id', user.id);
      if (error) throw error;

      setMessages([]);
      toast.success('Historial limpiado.');
    } catch {
      toast.error('No se pudo limpiar el historial.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" className="fixed bottom-6 right-6 z-40 h-12 rounded-full px-4 shadow-lg">
          <BrainCircuit className="mr-2 h-4 w-4" />
          Chat Consultant
        </Button>
      </SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" /> LXD Chat Consultant
          </SheetTitle>
          <SheetDescription>Asistencia contextual en ABC y Backwards Design para este proyecto.</SheetDescription>
        </SheetHeader>

        <div className="mt-4 flex min-h-0 flex-1 flex-col">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Proyecto: {project.title}</span>
            <Button type="button" variant="ghost" size="sm" onClick={clearHistory}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Limpiar historial
            </Button>
          </div>

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">Haz una pregunta para comenzar.</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 rounded-lg border px-3 py-2 ${
                    message.role === 'user' ? 'border-slate-300 bg-white' : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="mt-0.5">
                    {message.role === 'user' ? <UserRound className="h-4 w-4 text-slate-600" /> : <BrainCircuit className="h-4 w-4 text-blue-700" />}
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-800">
                    {message.parts
                      .map((part) => (part.type === 'text' ? part.text : ''))
                      .join('\n')
                      .trim()}
                  </p>
                </div>
              ))
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-3 space-y-2">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Escribe tu pregunta sobre estrategia, estructura o actividades..."
              className="min-h-24"
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">Enter para enviar, Shift+Enter para salto de linea.</p>
              <Button type="button" onClick={() => void handleSendMessage()} disabled={isLoading || !draft.trim()}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
