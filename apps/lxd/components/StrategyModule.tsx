import React, { useState } from 'react';
import { Strategy } from '../types';
import { generateStrategy } from '../services/geminiService';
import { Sparkles, Loader2, Target, CheckCircle, HelpCircle, X, ArrowRight } from 'lucide-react';

interface Props {
  strategy: Strategy;
  onUpdate: (s: Strategy) => void;
  onNext: () => void;
}

export const StrategyModule: React.FC<Props> = ({ strategy, onUpdate, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleGenerate = async () => {
    if (!strategy.businessProblem || !strategy.targetAudience) {
      alert("Por favor define el problema y la audiencia antes de generar.");
      return;
    }
    setLoading(true);
    try {
      const result = await generateStrategy(
        strategy.businessProblem,
        strategy.targetAudience,
        strategy.trainingNeed
      );
      onUpdate({ ...strategy, ...result });
      setIsGenerated(true);
    } catch (e) {
      console.error(e);
      alert("Error generating strategy. Please check API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="flex justify-between items-start mb-5">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Guía de Diligenciamiento LXD
              </h3>
              <button 
                onClick={() => setShowHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 text-sm text-slate-600">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1 text-xs uppercase tracking-wide">1. Problema de Negocio</span>
                <p>Describe el "dolor" organizacional o la métrica que se ve afectada. Evita confundir "falta de capacitación" con el problema real.</p>
                <div className="mt-2 flex flex-col gap-1 text-xs">
                  <span className="text-green-700 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 
                    <em>"Las devoluciones de producto aumentaron un 15% este Q3."</em>
                  </span>
                  <span className="text-red-500 flex items-center gap-1 opacity-70">
                    <X className="w-3 h-3" />
                    <em>"Los empleados no saben usar el software."</em>
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1 text-xs uppercase tracking-wide">2. Perfil del Estudiante</span>
                <p>Más allá del cargo, define sus motivaciones, barreras tecnológicas y contexto de consumo.</p>
                <p className="mt-1 text-xs text-slate-500 italic">Ej: "Vendedores de campo, usan solo móvil, poco tiempo disponible, motivados por comisiones."</p>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-800 block mb-1 text-xs uppercase tracking-wide">3. Necesidad de Formación</span>
                <p>Define la intervención educativa hipotética o el tema central.</p>
                <p className="mt-1 text-xs text-slate-500 italic">Ej: "Taller práctico de manejo de objeciones."</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          1. Learning Design Inputs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Problema de Negocio</label>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
              placeholder="Ej: Las ventas B2B han bajado un 15% por falta de cierre..."
              value={strategy.businessProblem}
              onChange={(e) => onUpdate({ ...strategy, businessProblem: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Perfil del Estudiante (Persona)</label>
            <textarea
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows={3}
              placeholder="Ej: Ejecutivos de cuenta junior, 25-30 años, nativos digitales..."
              value={strategy.targetAudience}
              onChange={(e) => onUpdate({ ...strategy, targetAudience: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Necesidad de Formación</label>
            <input
              type="text"
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Ej: Curso intensivo de técnicas de negociación avanzada"
              value={strategy.trainingNeed}
              onChange={(e) => onUpdate({ ...strategy, trainingNeed: e.target.value })}
            />
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
          >
            <HelpCircle className="w-4 h-4" />
            ¿Cómo llenar esto?
          </button>

          <div className="flex gap-3">
             <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-md"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {loading ? 'Analizando...' : isGenerated ? 'Regenerar Estrategia' : 'Generar Estrategia con IA'}
            </button>
            {isGenerated && (
                <button
                    onClick={onNext}
                    className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-md"
                >
                    Ver Diseño
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
          </div>
        </div>
      </div>
      
      {isGenerated && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-green-800 text-sm">
                Estrategia generada correctamente. Continúa al módulo de <strong>Diseño</strong> para ver y refinar los detalles.
            </p>
        </div>
      )}
    </div>
  );
};