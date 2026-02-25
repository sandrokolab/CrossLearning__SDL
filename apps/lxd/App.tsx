
import React, { useState } from 'react';
import { LXDProject, Step, Strategy, Session, SyllabusBlueprint } from './types';
import { StrategyModule } from './components/StrategyModule';
import { DesignModule } from './components/DesignModule';
import { StructureModule } from './components/StructureModule';
import { JourneyMediaModule } from './components/JourneyMediaModule';
import { ProductionModule } from './components/ProductionModule';
import { ChatConsultant } from './components/ChatConsultant';
import { BrainCircuit, MessageSquare, ChevronRight, PenTool } from 'lucide-react';

const INITIAL_PROJECT: LXDProject = {
  title: "Nuevo Proyecto Educativo",
  strategy: {
    businessProblem: "",
    targetAudience: "",
    trainingNeed: "",
    valueProposition: "",
    jobs: [],
    pains: [],
    gains: [],
    qualitativeObjective: "",
    okrs: [],
    impactValidation: "",
    generalObjectives: [],
    // Interaction Design Arrays
    onsite: [],
    video: [],
    assisted: [],
    independent: [],
    collaborative: [],
    asynchronous: [],
    // Assessment Arrays
    formativeAssessment: [],
    summativeAssessment: [],
    didacticsEvaluation: [],
    impactEvaluation: [],
    // Feedback Arrays
    frequency: [],
    followUp: [],
    progressMonitoring: [],
    coachingMentoring: [],
    // Outcome Mapping Arrays
    principle1: [],
    principle2: [],
    principle3: [],
    principle4: [],
    principle5: [],
  },
  structure: []
};

const App: React.FC = () => {
  const [project, setProject] = useState<LXDProject>(INITIAL_PROJECT);
  const [currentStep, setCurrentStep] = useState<Step>('strategy');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const updateStrategy = (newStrategy: Strategy) => {
    setProject(prev => ({ ...prev, strategy: newStrategy }));
  };

  const updateStructure = (newStructure: Session[], newBlueprint?: SyllabusBlueprint) => {
    setProject(prev => ({ 
        ...prev, 
        structure: newStructure,
        syllabusBlueprint: newBlueprint || prev.syllabusBlueprint 
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'strategy':
        return <StrategyModule 
          strategy={project.strategy} 
          onUpdate={updateStrategy} 
          onNext={() => setCurrentStep('design')} 
        />;
      case 'design':
        return <DesignModule
            strategy={project.strategy}
            onUpdate={updateStrategy}
            onNext={() => setCurrentStep('content')}
        />;
      case 'content':
        return <StructureModule 
          strategy={project.strategy} 
          structure={project.structure} 
          syllabusBlueprint={project.syllabusBlueprint}
          onUpdate={updateStructure} 
          onNext={() => setCurrentStep('journey')} 
        />;
      case 'journey':
        return <JourneyMediaModule 
          strategy={project.strategy}
          structure={project.structure}
          onUpdateStructure={(s) => updateStructure(s)}
        />;
      case 'production':
        return <ProductionModule project={project} />;
      default:
        return null;
    }
  };

  const steps: { id: Step; label: string }[] = [
    { id: 'strategy', label: '1. Strategy' },
    { id: 'design', label: '2. Design' },
    { id: 'content', label: '3. Content' },
    { id: 'journey', label: '4. Journey' },
    { id: 'production', label: '5. Production' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">LXD4DL <span className="text-indigo-600">Architect</span></h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center text-sm text-slate-500">
                <span className="font-medium text-slate-900">{project.title}</span>
                <PenTool className="w-3 h-3 ml-2 cursor-pointer hover:text-indigo-600" onClick={() => {
                    const newTitle = prompt("Project Title:", project.title);
                    if(newTitle) setProject(p => ({...p, title: newTitle}));
                }}/>
             </div>
             <button 
               onClick={() => setIsChatOpen(!isChatOpen)}
               className={`p-2 rounded-full transition-colors ${isChatOpen ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
             >
               <MessageSquare className="w-5 h-5" />
             </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8 relative">
        {/* Sidebar Nav */}
        <nav className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-1">
                {steps.map((step) => {
                    const isActive = currentStep === step.id;
                    return (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(step.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                                isActive 
                                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' 
                                : 'text-slate-600 hover:bg-white hover:text-slate-900'
                            }`}
                        >
                            <span>{step.label}</span>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </button>
                    )
                })}
            </div>
            
            <div className="sticky top-80 mt-8 p-4 bg-indigo-900 rounded-xl text-white">
                <h4 className="font-bold mb-2 text-indigo-200 text-xs uppercase tracking-wider">Metodología</h4>
                <p className="text-xs leading-relaxed text-indigo-100">
                    Recuerda aplicar <strong>Backwards Design</strong>: empieza siempre por el resultado esperado antes de definir el contenido.
                </p>
            </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
           {renderStep()}
        </main>
      </div>

      {/* Floating Chat Panel */}
      <ChatConsultant 
        project={project} 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
};

export default App;
