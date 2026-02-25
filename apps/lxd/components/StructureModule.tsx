
import React, { useState } from 'react';
import { Session, Strategy, SyllabusBlueprint } from '../types';
import { generateStructure } from '../services/geminiService';
import { FolderTree, Sparkles, Loader2, ChevronRight, ChevronDown, Layers, FileText, Settings, PenTool, Shield, Users, BookOpen, Video, X, CheckCircle2, Zap, MousePointerClick, GraduationCap, Image, Film, LayoutTemplate, BrainCircuit, Gamepad2, Target, Briefcase, AlertTriangle, Trophy, Lightbulb, Compass, FileCheck } from 'lucide-react';

interface Props {
  strategy: Strategy;
  structure: Session[];
  syllabusBlueprint?: SyllabusBlueprint;
  onUpdate: (s: Session[], b?: SyllabusBlueprint) => void;
  onNext: () => void;
}

export const StructureModule: React.FC<Props> = ({ strategy, structure, syllabusBlueprint, onUpdate, onNext }) => {
  const [loading, setLoading] = useState(false);
  const [activeScriptLevel, setActiveScriptLevel] = useState<number | null>(null);
  const [activeMediaLevel, setActiveMediaLevel] = useState<string | null>(null);
  const [showBlueprint, setShowBlueprint] = useState(true);
  
  // Simple expanded state management for the tree view
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // Expecting { blueprint, structure }
      const result = await generateStructure(strategy);
      onUpdate(result.structure, result.blueprint);
      // Auto expand first session
      if (result.structure.length > 0) toggle(result.structure[0].id);
      setShowBlueprint(true);
    } catch (e) {
      console.error(e);
      alert("Error generating structure. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderBlueprint = () => {
    if (!syllabusBlueprint) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm animate-in fade-in duration-300 mb-8">
            <div className="bg-indigo-900 p-4 text-white flex justify-between items-center cursor-pointer" onClick={() => setShowBlueprint(!showBlueprint)}>
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-300" />
                    <h3 className="font-bold text-lg">Syllabus Blueprint (Senior LXD)</h3>
                </div>
                {showBlueprint ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
            
            {showBlueprint && (
                <div className="p-6 space-y-6">
                    {/* Section 1 & 5: Context & Value Prop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="mt-1"><Target className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm uppercase">1. Contexto y Objetivo</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed">{syllabusBlueprint.contextAndObjective}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="mt-1"><Lightbulb className="w-5 h-5 text-amber-500" /></div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm uppercase">5. Propuesta de Valor</h4>
                                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{syllabusBlueprint.valueProposition}</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 9: Narrative */}
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                             <h4 className="font-bold text-slate-800 text-sm uppercase mb-3 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-slate-500" />
                                9. Resumen Ejecutivo (Narrativa)
                             </h4>
                             <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-indigo-400 pl-3">
                                "{syllabusBlueprint.finalNarrative}"
                             </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4"></div>

                    {/* Section 2, 3, 4: Inputs/Challenges/Outputs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                             <div className="flex items-center gap-2 mb-2 text-blue-800 font-bold text-xs uppercase">
                                <Briefcase className="w-4 h-4" /> 2. Habilidades (Inputs)
                             </div>
                             <ul className="list-disc list-inside text-xs text-blue-900 space-y-1">
                                {syllabusBlueprint.necessarySkills.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg">
                             <div className="flex items-center gap-2 mb-2 text-red-800 font-bold text-xs uppercase">
                                <AlertTriangle className="w-4 h-4" /> 3. Retos
                             </div>
                             <ul className="list-disc list-inside text-xs text-red-900 space-y-1">
                                {syllabusBlueprint.learningChallenges.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                             <div className="flex items-center gap-2 mb-2 text-green-800 font-bold text-xs uppercase">
                                <Trophy className="w-4 h-4" /> 4. Competencias (Outputs)
                             </div>
                             <ul className="list-disc list-inside text-xs text-green-900 space-y-1">
                                {syllabusBlueprint.achievedCompetencies.map((s, i) => <li key={i}>{s}</li>)}
                             </ul>
                        </div>
                    </div>

                     {/* Section 6, 7, 8: Didactics, Resources, Assessment */}
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                        <div>
                             <h4 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-purple-600" /> 6. Diseño Didáctico
                             </h4>
                             <div className="text-xs text-slate-600 space-y-2">
                                <div>
                                    <strong className="text-slate-800">Tipos:</strong> {syllabusBlueprint.didacticDesign.learningTypes.join(', ')}
                                </div>
                                <div>
                                    <strong className="text-slate-800">Interacción:</strong> {syllabusBlueprint.didacticDesign.interactionMoments.join(', ')}
                                </div>
                             </div>
                        </div>

                         <div>
                             <h4 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-indigo-600" /> 7. Recursos G2RI
                             </h4>
                             <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                {syllabusBlueprint.resourcesG2RI.map((r, i) => <li key={i}>{r}</li>)}
                             </ul>
                        </div>

                         <div>
                             <h4 className="font-bold text-slate-800 text-xs uppercase mb-2 flex items-center gap-2">
                                <FileCheck className="w-4 h-4 text-teal-600" /> 8. Evaluación (DME)
                             </h4>
                             <div className="text-xs text-slate-600 space-y-2">
                                <p><strong className="text-slate-800">Formativa/Sumativa:</strong> {syllabusBlueprint.assessmentStrategy.formativeSummative}</p>
                                <p><strong className="text-slate-800">Didáctica/Apropiación:</strong> {syllabusBlueprint.assessmentStrategy.didacticsAppropriation}</p>
                             </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
  };

  const renderTree = () => {
    if (structure.length === 0) return null;

    return (
      <div className="space-y-4">
        {structure.map(session => (
          <div key={session.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div 
              className="bg-slate-50 p-4 flex items-center cursor-pointer hover:bg-slate-100 transition-colors"
              onClick={() => toggle(session.id)}
            >
              {expanded[session.id] ? <ChevronDown className="w-5 h-5 text-slate-400 mr-2" /> : <ChevronRight className="w-5 h-5 text-slate-400 mr-2" />}
              <Layers className="w-5 h-5 text-indigo-600 mr-2" />
              <span className="font-bold text-slate-800">{session.title}</span>
              <span className="ml-auto text-xs text-slate-500 uppercase tracking-wider font-semibold">Sesión</span>
            </div>
            
            {expanded[session.id] && (
              <div className="p-4 pl-8 border-t border-slate-100 space-y-3 bg-white">
                {session.modules.map(mod => (
                  <div key={mod.id} className="border-l-2 border-indigo-100 pl-4">
                    <div 
                      className="flex items-center cursor-pointer py-1 hover:text-indigo-600"
                      onClick={() => toggle(mod.id)}
                    >
                      {expanded[mod.id] ? <ChevronDown className="w-4 h-4 mr-1 text-slate-400" /> : <ChevronRight className="w-4 h-4 mr-1 text-slate-400" />}
                      <span className="font-semibold text-slate-700">{mod.title}</span>
                      <span className="ml-auto text-[10px] text-slate-400 border border-slate-200 px-1 rounded">MÓDULO</span>
                    </div>

                    {expanded[mod.id] && (
                      <div className="pl-6 mt-2 space-y-3">
                        {mod.units.map(unit => (
                          <div key={unit.id}>
                            <div 
                              className="flex items-center cursor-pointer py-1"
                              onClick={() => toggle(unit.id)}
                            >
                               {expanded[unit.id] ? <ChevronDown className="w-3 h-3 mr-1 text-slate-400" /> : <ChevronRight className="w-3 h-3 mr-1 text-slate-400" />}
                              <span className="text-sm font-medium text-slate-600">{unit.title}</span>
                              <span className="ml-2 text-[10px] text-slate-400 bg-slate-50 px-1 rounded">UNIDAD</span>
                            </div>

                            {expanded[unit.id] && (
                                <div className="pl-5 mt-1 border-l border-slate-100">
                                    {unit.topics.map(topic => (
                                        <div key={topic.id} className="mb-2">
                                            <div className="text-sm text-slate-500 py-1 font-medium">{topic.title}</div>
                                            <div className="pl-4 space-y-1">
                                                {topic.scenes.map(scene => (
                                                    <div key={scene.id} className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
                                                        <FileText className="w-3 h-3 text-indigo-400" />
                                                        <span className="flex-1">{scene.title}</span>
                                                        <span className="text-[10px] bg-white px-1 border rounded">{scene.durationMinutes} min</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">

      {/* Script Level 1 Detail Modal */}
      {activeScriptLevel === 1 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded">Script Level 1</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Desarrollo de Test</h2>
              </div>
              <button 
                onClick={() => setActiveScriptLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  El desarrollo de test en el contexto educativo es una herramienta fundamental que permite evaluar el conocimiento y la comprensión de los estudiantes sobre un tema específico.
               </p>
               <p>
                  En el Nivel 1, el enfoque se centra en la creación de una secuencia de preguntas que, al ser respondidas por el estudiante, proporcionan un resultado global de su desempeño.
               </p>

               <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center gap-2">
                     <Settings className="w-5 h-5" /> Características del Nivel 1
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <strong className="text-indigo-800 block mb-1">Secuencia de Preguntas</strong>
                        <p className="text-sm">En este nivel, se elabora una serie de preguntas que pueden variar en formato, desde preguntas de opción múltiple hasta preguntas de verdadero o falso. La secuencia está diseñada para cubrir diferentes aspectos del tema en cuestión, asegurando una evaluación integral del conocimiento del estudiante.</p>
                     </div>
                     <div>
                        <strong className="text-indigo-800 block mb-1">Resultados Globales</strong>
                        <p className="text-sm">Una vez que el estudiante completa el test, se le entrega un resultado que resume su rendimiento. Este resultado puede incluir una puntuación total, un desglose por secciones o temas, y en algunos casos, retroalimentación sobre las respuestas incorrectas para fomentar el aprendizaje continuo.</p>
                     </div>
                     <div>
                        <strong className="text-indigo-800 block mb-1">Simplicidad en el Diseño</strong>
                        <p className="text-sm">A diferencia de niveles más avanzados, en el Nivel 1 no es necesario crear un escenario pedagógico complejo. Esto significa que el test se centra exclusivamente en las preguntas y respuestas, sin la necesidad de integrar elementos narrativos o contextuales que puedan distraer del objetivo principal de evaluación.</p>
                     </div>
                     <div>
                        <strong className="text-indigo-800 block mb-1">Ausencia de Producción Multimedia</strong>
                        <p className="text-sm">No se requiere la inclusión de elementos multimedia como videos, animaciones o gráficos interactivos. Esto simplifica el proceso de desarrollo del test, permitiendo a los educadores concentrarse en la calidad y relevancia de las preguntas.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-900 text-lg mb-4 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" /> Ventajas del Nivel 1
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Rapidez y Eficiencia</strong>
                           <p className="text-sm mt-1">La simplicidad del Nivel 1 permite una rápida implementación de los test, lo cual es ideal para evaluaciones frecuentes o para situaciones donde se necesita una retroalimentación inmediata.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Facilidad de Uso</strong>
                           <p className="text-sm mt-1">Tanto para los educadores como para los estudiantes, este nivel es fácil de usar y entender, ya que no requiere habilidades técnicas avanzadas ni equipamiento especial.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <Settings className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Flexibilidad</strong>
                           <p className="text-sm mt-1">Los test de Nivel 1 pueden ser adaptados fácilmente a diferentes temas y niveles de dificultad, lo que los hace versátiles para diversas áreas del conocimiento.</p>
                        </div>
                     </li>
                  </ul>
               </div>

               <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el Nivel 1: Desarrollo de Test es una herramienta eficaz para la evaluación educativa, proporcionando una manera sencilla y directa de medir el aprendizaje de los estudiantes sin la necesidad de recursos adicionales complejos."
               </div>
            </div>

            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveScriptLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Script Level 2 Detail Modal */}
      {activeScriptLevel === 2 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded">Script Level 2</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Guión e Interacción Básica</h2>
              </div>
              <button 
                onClick={() => setActiveScriptLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  En este nivel, se busca desarrollar un entendimiento más profundo de cómo los usuarios interactúan con las interfaces de pantalla a través de diversas actividades.
               </p>
               <p>
                  Estas actividades están diseñadas para mejorar la experiencia del usuario y asegurar que la interacción sea intuitiva y efectiva.
               </p>

               <div className="bg-orange-50 p-5 rounded-xl border border-orange-100">
                  <h3 className="font-bold text-orange-900 text-lg mb-4 flex items-center gap-2">
                     <MousePointerClick className="w-5 h-5" /> Actividades de Interacción Usuario-Pantalla
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <strong className="text-orange-800 block mb-1">Interacción Dinámica</strong>
                        <p className="text-sm">Se implementan ejercicios que permiten a los usuarios interactuar de manera dinámica con la aplicación. Esto puede incluir la navegación a través de menús, la selección de opciones, y la manipulación de elementos en pantalla.</p>
                     </div>
                     <div>
                        <strong className="text-orange-800 block mb-1">Validación de Ejercicios</strong>
                        <p className="text-sm">Cada actividad incluye mecanismos de validación que aseguran que el usuario ha comprendido y completado correctamente las tareas asignadas. Esto no solo ayuda a reforzar el aprendizaje, sino que también proporciona retroalimentación inmediata.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
                     <GraduationCap className="w-5 h-5" /> Escenario Pedagógico
                  </h3>
                  <p className="text-sm mb-4">El enfoque pedagógico combina diferentes fases de aprendizaje para maximizar la retención y la aplicación práctica:</p>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <div className="bg-blue-200 text-blue-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</div>
                        <div>
                           <strong className="text-blue-800">Transmisión de Conocimiento</strong>
                           <p className="text-sm mt-1">Se presenta la información necesaria de manera clara y estructurada. Puede incluir tutoriales, demostraciones en video, o lecturas guiadas.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-blue-200 text-blue-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</div>
                        <div>
                           <strong className="text-blue-800">Evaluación Formativa</strong>
                           <p className="text-sm mt-1">Evaluaciones formativas que permiten a los usuarios medir su comprensión y recibir retroalimentación continua. Identifica áreas que requieren más atención.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-blue-200 text-blue-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</div>
                        <div>
                           <strong className="text-blue-800">Evaluación Sumativa</strong>
                           <p className="text-sm mt-1">Al final del proceso, se lleva a cabo una evaluación sumativa para medir el nivel de competencia alcanzado (pruebas prácticas o teóricas).</p>
                        </div>
                     </li>
                  </ul>
               </div>

                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                     <Image className="w-5 h-5" /> Creación de Ilustraciones Simples
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded border border-slate-200">
                          <strong className="text-slate-800 block mb-1 text-sm">Visuales Estáticos</strong>
                          <p className="text-xs text-slate-600">Gráficos o diagramas que representan ideas clave de manera clara y concisa.</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-slate-200">
                          <strong className="text-slate-800 block mb-1 text-sm">Visuales con Sonido</strong>
                          <p className="text-xs text-slate-600">Ilustraciones que incorporan elementos de sonido (narraciones, efectos) para enriquecer la experiencia.</p>
                      </div>
                  </div>
               </div>

               <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el nivel 2 de guión e interacción básica se centra en crear un entorno de aprendizaje interactivo y efectivo, donde la combinación de actividades de usuario, validación de ejercicios, y el uso de ilustraciones simples, contribuyen a un proceso educativo integral y enriquecedor."
               </div>
            </div>

            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveScriptLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Script Level 3 Detail Modal */}
      {activeScriptLevel === 3 && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded">Script Level 3</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Guión Especializado con Historia</h2>
              </div>
              <button 
                onClick={() => setActiveScriptLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  El nivel 3 de guion especializado se centra en la creación de una narrativa que actúa como el eje central de la experiencia de aprendizaje del usuario.
               </p>
               <p>
                  Este enfoque no solo busca transmitir información, sino que también pretende involucrar emocionalmente al usuario a través de una historia bien estructurada.
               </p>

               <div className="bg-rose-50 p-5 rounded-xl border border-rose-100">
                  <h3 className="font-bold text-rose-900 text-lg mb-4 flex items-center gap-2">
                     <BookOpen className="w-5 h-5" /> Características del Guion Especializado
                  </h3>
                  <div className="space-y-4">
                     <div>
                        <strong className="text-rose-800 block mb-1">1. Historia como Mecanismo Conductor</strong>
                        <p className="text-sm">La historia se convierte en el hilo conductor que guía al usuario a través del contenido educativo. Esto significa que cada elemento de la narrativa está diseñado para facilitar la comprensión y retención del conocimiento. La historia no solo capta la atención del usuario, sino que también proporciona un contexto que hace que la información sea más relevante y memorable.</p>
                     </div>
                  </div>
               </div>

               <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center gap-2">
                     <GraduationCap className="w-5 h-5" /> 2. Escenario Pedagógico Integrado
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <div className="bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">A</div>
                        <div>
                           <strong className="text-indigo-800">Fases de Transmisión de Conocimiento</strong>
                           <p className="text-sm mt-1">Estas fases están diseñadas para presentar la información de manera clara y estructurada. Se utilizan técnicas narrativas para hacer que el contenido sea accesible y atractivo.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">B</div>
                        <div>
                           <strong className="text-indigo-800">Fases de Evaluación</strong>
                           <p className="text-sm mt-1">Después de la transmisión de conocimiento, se incorporan fases de evaluación que permiten al usuario aplicar lo aprendido. Estas evaluaciones están integradas en la narrativa, lo que las hace parecer una parte natural de la historia.</p>
                        </div>
                     </li>
                  </ul>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
                      <h3 className="font-bold text-amber-900 text-lg mb-3 flex items-center gap-2">
                        <Film className="w-5 h-5" /> 3. Escenarios Tipo Película
                      </h3>
                      <p className="text-sm">El proceso de comunicación se enriquece con escenarios que recuerdan a una película. Esto implica el uso de elementos visuales y auditivos que crean una experiencia inmersiva. Los usuarios se sienten como si estuvieran dentro de una película, lo que aumenta su compromiso y motivación.</p>
                  </div>
                   <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                      <h3 className="font-bold text-emerald-900 text-lg mb-3 flex items-center gap-2">
                        <LayoutTemplate className="w-5 h-5" /> 4. Diagramas Complejos
                      </h3>
                      <p className="text-sm">Se crean diagramas complejos en 2D o ilustraciones detalladas. Estos elementos visuales ayudan a explicar conceptos difíciles de manera más sencilla. Además, pueden incorporar videos que proporcionan explicaciones adicionales o ejemplos prácticos.</p>
                  </div>
               </div>

               <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el nivel 3 de guion especializado con historia es una estrategia educativa avanzada que utiliza la narrativa para mejorar la enseñanza y el aprendizaje. Al integrar elementos visuales y evaluativos en una historia coherente, se logra una experiencia educativa más efectiva y atractiva."
               </div>
            </div>

            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveScriptLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Level A Detail Modal (Rapid Learning) */}
      {activeMediaLevel === 'A' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded">Multimedia Level A</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Rapid Learning</h2>
              </div>
              <button 
                onClick={() => setActiveMediaLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  El concepto de Rapid Learning en el contexto de la educación y la formación se refiere a la capacidad de crear contenido educativo de manera rápida y eficiente, utilizando herramientas tecnológicas que facilitan el proceso de enseñanza y aprendizaje.
               </p>
               <p>
                  En este nivel, se destaca la transformación de presentaciones de PowerPoint en herramientas de aprendizaje más dinámicas y atractivas.
               </p>

               <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                   <h3 className="font-bold text-purple-900 text-lg mb-4 flex items-center gap-2">
                     <Video className="w-5 h-5" /> Conversión de Presentaciones a Video Interactivo
                  </h3>
                  <p className="text-sm text-purple-800">
                    Una de las características principales de este nivel es la posibilidad de convertir presentaciones en videos interactivos. Esto significa que los usuarios pueden tomar sus diapositivas estáticas y transformarlas en experiencias de aprendizaje más envolventes. Los videos interactivos permiten a los estudiantes interactuar con el contenido, lo que puede mejorar la retención de información y el compromiso con el material.
                  </p>
               </div>
               
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 block mb-2 text-sm flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-slate-500" /> Escenario Pedagógico
                        </strong>
                        <p className="text-xs">Aunque no es necesario contar con un escenario pedagógico formal, es importante tener en cuenta el objetivo educativo del material.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 block mb-2 text-sm flex items-center gap-2">
                            <PenTool className="w-4 h-4 text-slate-500" /> Ilustraciones Simples
                        </strong>
                        <p className="text-xs">Se requiere la creación de ilustraciones simples (gráficos, diagramas) para complementar el contenido visual.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <strong className="text-slate-800 block mb-2 text-sm flex items-center gap-2">
                            <Video className="w-4 h-4 text-slate-500" /> Incorporación de Sonido
                        </strong>
                        <p className="text-xs">Aunque no es obligatorio, narraciones o música de fondo pueden enriquecer la experiencia y mantener el interés.</p>
                    </div>
                </div>

               <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-900 text-lg mb-4 flex items-center gap-2">
                     <CheckCircle2 className="w-5 h-5" /> Beneficios del Rapid Learning
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Eficiencia</strong>
                           <p className="text-sm mt-1">Permite la creación rápida de contenido educativo, ideal para situaciones con tiempo limitado.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <Users className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Interactividad</strong>
                           <p className="text-sm mt-1">Los videos interactivos aumentan el compromiso al permitir participación activa.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <Settings className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                           <strong className="text-green-800">Flexibilidad</strong>
                           <p className="text-sm mt-1">Adaptación fácil del contenido para diferentes audiencias o contextos educativos.</p>
                        </div>
                     </li>
                  </ul>
               </div>

                <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el Nivel A de Rapid Learning ofrece una manera innovadora de transformar presentaciones tradicionales en herramientas de aprendizaje más efectivas y atractivas."
               </div>

            </div>
            
            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveMediaLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Level B Detail Modal (Gamificación) */}
      {activeMediaLevel === 'B' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Multimedia Level B</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Gamificación</h2>
              </div>
              <button 
                onClick={() => setActiveMediaLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  En este nivel, el enfoque educativo se transforma radicalmente al integrar elementos de gamificación en el proceso de aprendizaje.
               </p>
               <p>
                  Aquí, el usuario no es simplemente un receptor pasivo de información, sino que se convierte en el protagonista activo de una historia de aprendizaje cuidadosamente diseñada.
               </p>

               <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
                   <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2">
                     <Gamepad2 className="w-5 h-5" /> Escenario Basado en Gamificación
                  </h3>
                  <p className="text-sm text-emerald-800 mb-2">
                    El escenario de aprendizaje incorpora principios de gamificación para motivar al usuario.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <div className="bg-white p-3 rounded border border-emerald-200">
                          <strong className="text-emerald-800 block mb-1 text-sm">Historia de Aprendizaje</strong>
                          <p className="text-xs text-slate-600">Se presenta como un juego pedagógico o simulación interactiva donde cada decisión influye en la narrativa.</p>
                      </div>
                      <div className="bg-white p-3 rounded border border-emerald-200">
                          <strong className="text-emerald-800 block mb-1 text-sm">Elementos de Juego</strong>
                          <p className="text-xs text-slate-600">Integración estratégica de puntos, niveles, recompensas y retroalimentación inmediata para mejorar la retención.</p>
                      </div>
                  </div>
               </div>

                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                  <h3 className="font-bold text-blue-900 text-lg mb-4 flex items-center gap-2">
                     <Users className="w-5 h-5" /> Rol del Usuario
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <div className="bg-blue-200 text-blue-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</div>
                        <div>
                           <strong className="text-blue-800">Protagonista Activo</strong>
                           <p className="text-sm mt-1">El usuario asume un papel clave, enfrentándose a situaciones y desafíos que requieren decisiones críticas.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-blue-200 text-blue-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</div>
                        <div>
                           <strong className="text-blue-800">Consecuencias Reales</strong>
                           <p className="text-sm mt-1">Las elecciones afectan el desarrollo de la historia, permitiendo experimentar consecuencias en un entorno seguro (pensamiento crítico).</p>
                        </div>
                     </li>
                  </ul>
               </div>
               
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                     <Film className="w-5 h-5" /> Creación de Ilustraciones y Animaciones
                    </h3>
                    <p className="text-sm text-slate-700 mb-2">
                        Herramientas visuales avanzadas son fundamentales para explicar conceptos y enriquecer la experiencia.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm ml-2">
                        <li>Ilustraciones complejas y estéticas.</li>
                        <li>Animaciones que explican procesos difíciles de manera clara.</li>
                        <li>Secuencias simples de video para visualización dinámica.</li>
                    </ul>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el Nivel B de Gamificación representa un enfoque innovador en la educación, donde el aprendizaje se convierte en una experiencia inmersiva y personalizada. Al colocar al usuario en el centro de la narrativa y utilizar herramientas visuales avanzadas, se logra un aprendizaje más efectivo y significativo."
               </div>

            </div>
            
            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveMediaLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Level C Detail Modal */}
      {activeMediaLevel === 'C' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4 sticky top-0 bg-white z-10">
              <div>
                 <div className="flex items-center gap-2 mb-1">
                    <span className="bg-cyan-100 text-cyan-700 text-xs font-bold px-2 py-0.5 rounded">Multimedia Level C</span>
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800">Interacción y Multimedia Avanzada</h2>
              </div>
              <button 
                onClick={() => setActiveMediaLevel(null)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6 text-slate-600 leading-relaxed">
               <p className="text-lg font-medium text-slate-800">
                  En el contexto de la educación y la formación avanzada, el Nivel C se refiere a un enfoque sofisticado en la creación de guiones y la interacción educativa.
               </p>
               <p>
                  Este nivel se caracteriza por el uso de tecnologías avanzadas de producción de video que permiten integrar al instructor directamente en la interfaz de interacción con los estudiantes.
               </p>

               <div className="bg-cyan-50 p-5 rounded-xl border border-cyan-100">
                   <h3 className="font-bold text-cyan-900 text-lg mb-4 flex items-center gap-2">
                     <Video className="w-5 h-5" /> Producción de Video Avanzada
                  </h3>
                  <p className="text-sm text-cyan-800 mb-2">
                    La producción de video avanzada implica el uso de técnicas y herramientas de última generación para crear contenido educativo de alta calidad.
                  </p>
                   <ul className="list-disc list-inside space-y-1 text-cyan-800 text-sm ml-2">
                        <li>Cámaras de alta definición.</li>
                        <li>Software de edición de video profesional.</li>
                        <li>Tecnologías de realidad aumentada o virtual.</li>
                        <li><strong>Instructor en interfaz:</strong> Los estudiantes pueden ver y escuchar al instructor mientras interactúan con el contenido.</li>
                    </ul>
               </div>

                <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                  <h3 className="font-bold text-indigo-900 text-lg mb-4 flex items-center gap-2">
                     <GraduationCap className="w-5 h-5" /> Escenario Pedagógico
                  </h3>
                  <ul className="space-y-3">
                     <li className="flex gap-3 items-start">
                        <div className="bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">1</div>
                        <div>
                           <strong className="text-indigo-800">Fases de Transmisión de Conocimiento</strong>
                           <p className="text-sm mt-1">Presentación de nueva información de manera clara y efectiva. Videos y presentaciones interactivas permiten absorber contenido a ritmo propio.</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">2</div>
                        <div>
                           <strong className="text-indigo-800">Evaluación Formativa</strong>
                           <p className="text-sm mt-1">Evaluación continua (cuestionarios interactivos, ejercicios prácticos, retroalimentación inmediata).</p>
                        </div>
                     </li>
                     <li className="flex gap-3 items-start">
                        <div className="bg-indigo-200 text-indigo-800 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center mt-0.5">3</div>
                        <div>
                           <strong className="text-indigo-800">Evaluación Sumativa</strong>
                           <p className="text-sm mt-1">Evaluación final de conocimiento (exámenes, proyectos, presentaciones).</p>
                        </div>
                     </li>
                  </ul>
               </div>
               
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                     <LayoutTemplate className="w-5 h-5" /> Creación de Diagramas Complejos
                    </h3>
                    <p className="text-sm text-slate-700 mb-2">
                        La creación de diagramas complejos en 2D o ilustraciones es una parte integral de este nivel.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        <div className="bg-white p-3 rounded border border-slate-200">
                             <strong className="text-slate-800 block mb-1 text-sm">Explicación Visual</strong>
                             <p className="text-xs text-slate-600">Utilizados para explicar conceptos difíciles de manera visual y facilitar la comprensión.</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-slate-200">
                             <strong className="text-slate-800 block mb-1 text-sm">Integración de Video</strong>
                             <p className="text-xs text-slate-600">Posibilidad de incorporar videos en estos diagramas para una explicación más dinámica.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-100 p-4 rounded-lg text-slate-700 text-sm italic text-center">
                  "En resumen, el Nivel C de Interacción y Multimedia Avanzada representa un enfoque integral y tecnológico para la educación, que busca maximizar el aprendizaje a través de la integración de medios avanzados y métodos pedagógicos efectivos."
               </div>

            </div>
            
            <div className="mt-8 flex justify-end pt-4 border-t border-slate-100">
              <button 
                onClick={() => setActiveMediaLevel(null)}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Methodology Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
         <div className="flex items-start justify-between mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-2">
                    <FolderTree className="w-5 h-5 text-indigo-600" />
                    3. Content Strategy & e2c Framework
                </h2>
                <p className="text-slate-600 text-sm max-w-4xl">
                    Nuestra plataforma permite el desarrollo de autonomía y empoderamiento en la creación de contenido digital interactivo propio.
                    El modelo <strong>e2c (Engagement to Content)</strong> acelera retornos sobre la inversión y asegura mayores niveles de apropiación.
                </p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-bold text-indigo-900 text-xs uppercase">e2c Classification</h4>
                </div>
                <p className="text-xs text-indigo-800 leading-relaxed">
                   Clasificación de interactividad por Niveles de Complejidad que aclara el alcance, esfuerzos y recursos de producción.
                </p>
            </div>
             <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                    <PenTool className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-purple-900 text-xs uppercase">Authoring Tools</h4>
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                   Kit de herramientas integradas y entrenamiento experto en Diseño Instruccional para asegurar capacidad de producción propia.
                </p>
            </div>
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <h4 className="font-bold text-blue-900 text-xs uppercase">Content Manager</h4>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                   Gestor web para administrar, dar permisos y asegurar la información de equipos de formadores y materiales.
                </p>
            </div>
             <div className="bg-teal-50 p-4 rounded-lg border border-teal-100">
                <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-teal-600" />
                    <h4 className="font-bold text-teal-900 text-xs uppercase">Collaboration</h4>
                </div>
                <p className="text-xs text-teal-800 leading-relaxed">
                   Solución completa de gestión colaborativa de producción y actualización con integración transparente a LMS.
                </p>
            </div>
         </div>

         <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                Niveles de Complejidad (e2c)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Script Levels Card */}
                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 transition-all hover:shadow-md">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        Desarrollo del Guión (Niveles 1-3)
                    </h4>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setActiveScriptLevel(1)}
                            className="w-full text-left p-3 bg-white border border-indigo-200 rounded-lg shadow-sm hover:border-indigo-400 hover:ring-1 hover:ring-indigo-200 transition-all flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-indigo-900">Nivel 1: Desarrollo de Test</span>
                            <ChevronRight className="w-4 h-4 text-indigo-300 group-hover:text-indigo-600" />
                        </button>
                        
                        <button 
                            onClick={() => setActiveScriptLevel(2)}
                            className="w-full text-left p-3 bg-white border border-orange-200 rounded-lg shadow-sm hover:border-orange-400 hover:ring-1 hover:ring-orange-200 transition-all flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-orange-900">Nivel 2: Guión e Interacción Básica</span>
                            <ChevronRight className="w-4 h-4 text-orange-300 group-hover:text-orange-600" />
                        </button>

                         <button 
                            onClick={() => setActiveScriptLevel(3)}
                            className="w-full text-left p-3 bg-white border border-rose-200 rounded-lg shadow-sm hover:border-rose-400 hover:ring-1 hover:ring-rose-200 transition-all flex items-center justify-between group"
                        >
                            <span className="text-sm font-medium text-rose-900">Nivel 3: Guión Especializado con Historia</span>
                            <ChevronRight className="w-4 h-4 text-rose-300 group-hover:text-rose-600" />
                        </button>
                    </div>
                </div>

                 {/* Multimedia Levels Card */}
                <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 transition-all hover:shadow-md">
                    <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Video className="w-4 h-4 text-purple-500" />
                        Producción Multimedia (Niveles A-C)
                    </h4>
                    <div className="space-y-2">
                        <button 
                            onClick={() => setActiveMediaLevel('A')}
                            className="w-full text-left p-3 bg-white border border-purple-200 rounded-lg shadow-sm hover:border-purple-400 hover:ring-1 hover:ring-purple-200 transition-all flex items-center justify-between group"
                        >
                             <span className="text-sm font-medium text-purple-900">Nivel A: Rapid Learning</span>
                             <ChevronRight className="w-4 h-4 text-purple-300 group-hover:text-purple-600" />
                        </button>

                         <button 
                            onClick={() => setActiveMediaLevel('B')}
                            className="w-full text-left p-3 bg-white border border-emerald-200 rounded-lg shadow-sm hover:border-emerald-400 hover:ring-1 hover:ring-emerald-200 transition-all flex items-center justify-between group"
                        >
                             <span className="text-sm font-medium text-emerald-900">Nivel B: Gamificación</span>
                             <ChevronRight className="w-4 h-4 text-emerald-300 group-hover:text-emerald-600" />
                        </button>

                        <button 
                            onClick={() => setActiveMediaLevel('C')}
                            className="w-full text-left p-3 bg-white border border-cyan-200 rounded-lg shadow-sm hover:border-cyan-400 hover:ring-1 hover:ring-cyan-200 transition-all flex items-center justify-between group"
                        >
                             <span className="text-sm font-medium text-cyan-900">Nivel C: Interacción y Multimedia Avanzada</span>
                             <ChevronRight className="w-4 h-4 text-cyan-300 group-hover:text-cyan-600" />
                        </button>
                    </div>
                </div>
            </div>
         </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-600" />
          Syllabus Generator
        </h2>
        <p className="text-slate-600 text-sm mb-6">
          Genera el Syllabus Blueprint y la jerarquía del curso (Sesión {'>'} Módulo {'>'} Unidad {'>'} Tema {'>'} Escena) basada en tus objetivos.
        </p>

        {structure.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 mb-4">No hay estructura ni syllabus definido aún.</p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? 'Diseñando Syllabus (Consultor LXD)...' : 'Generar Syllabus Completo'}
            </button>
          </div>
        ) : (
           <>
            <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-500">Syllabus y Estructura generados.</span>
                <button 
                    onClick={handleGenerate}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                    <Sparkles className="w-3 h-3" /> Regenerar
                </button>
            </div>
            
            {renderBlueprint()}
            {renderTree()}
            
            <div className="mt-6 flex justify-end">
                <button
                onClick={onNext}
                className="px-8 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl"
                >
                Continuar a Journey & Media
                </button>
            </div>
           </>
        )}
      </div>
    </div>
  );
};
