import React, { useState, useRef, useEffect } from 'react';
import { consultantChat } from '../services/geminiService';
import { LXDProject } from '../types';
import { Bot, Send, User, X } from 'lucide-react';

interface Props {
  project: LXDProject;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatConsultant: React.FC<Props> = ({ project, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hola. Soy tu arquitecto LXD. ¿En qué puedo ayudarte con tu diseño hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Build context summary
    const context = `
      Proyecto: ${project.title}
      Problema: ${project.strategy.businessProblem}
      Audiencia: ${project.strategy.targetAudience}
      Objetivos: ${project.strategy.generalObjectives.join(', ')}
      Estructura definida: ${project.structure.length > 0 ? 'Sí' : 'No'}
    `;

    try {
      const response = await consultantChat(context, userMsg);
      if (response) {
        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Lo siento, tuve un problema de conexión." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transform transition-transform animate-in slide-in-from-right">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-indigo-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-bold">LXD Consultant</h3>
        </div>
        <button onClick={onClose} className="hover:bg-indigo-700 p-1 rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-br-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none shadow-sm'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-lg rounded-bl-none border border-slate-200 shadow-sm">
                <div className="flex gap-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="Pregunta sobre pedagogía, estructura..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
