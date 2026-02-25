
import React, { useState } from 'react';
import { Strategy } from '../types';
import { LayoutGrid, Target, Network, ClipboardCheck, ThumbsUp, GitMerge, ArrowRight, HelpCircle, X, Plus, Trash2, UserRound, AlertTriangle, TrendingUp, CheckCircle2, MapPin, Video, LifeBuoy, User, Users, Clock, FileEdit, GraduationCap, BookOpen, BarChart3, Repeat, ListChecks, Activity, UserCheck, Sparkles, Loader2 } from 'lucide-react';
import { generateDesignCard } from '../services/geminiService';

interface Props {
  strategy: Strategy;
  onUpdate: (s: Strategy) => void;
  onNext: () => void;
}

// Extended to include 'okrs' (KLRs), Interaction types, Assessment types, Feedback types, and Principles
type ListEditorType = 
  | 'jobs' | 'pains' | 'gains' 
  | 'okrs' 
  | 'onsite' | 'video' | 'assisted' | 'independent' | 'collaborative' | 'asynchronous'
  | 'formative' | 'summative' | 'didactics' | 'impact'
  | 'frequency' | 'followUp' | 'progressMonitoring' | 'coachingMentoring'
  | 'principle1' | 'principle2' | 'principle3' | 'principle4' | 'principle5'
  | null;

type SectionType = 'value_proposition' | 'oklr' | 'interaction' | 'assessment' | 'feedback' | 'outcome';

export const DesignModule: React.FC<Props> = ({ strategy, onUpdate, onNext }) => {
  const [showValuePropHelp, setShowValuePropHelp] = useState(false);
  const [showOklrHelp, setShowOklrHelp] = useState(false);
  const [showInteractionHelp, setShowInteractionHelp] = useState(false);
  const [showAssessmentHelp, setShowAssessmentHelp] = useState(false);
  const [showFeedbackHelp, setShowFeedbackHelp] = useState(false);
  const [showOutcomeHelp, setShowOutcomeHelp] = useState(false);
  
  const [activeListEditor, setActiveListEditor] = useState<ListEditorType>(null);
  const [showItemHelp, setShowItemHelp] = useState(false);
  const [newItemText, setNewItemText] = useState("");
  
  const [generatingSection, setGeneratingSection] = useState<SectionType | null>(null);

  const handleChange = (field: keyof Strategy, value: any) => {
    onUpdate({ ...strategy, [field]: value });
  };

  const handleGenerateSection = async (section: SectionType) => {
    if (!strategy.businessProblem) {
        alert("Please define the Business Problem in Strategy Module first.");
        return;
    }
    setGeneratingSection(section);
    try {
        const result = await generateDesignCard(section, strategy);
        onUpdate({ ...strategy, ...result });
    } catch (e) {
        console.error(e);
        alert("Error generating content for this section.");
    } finally {
        setGeneratingSection(null);
    }
  };

  const handleAddItemToList = () => {
    if (!activeListEditor || !newItemText.trim()) return;
    
    // Map list editor types to strategy keys
    let key: keyof Strategy = activeListEditor as keyof Strategy;
    
    // Manual mapping for special cases
    if (activeListEditor === 'formative') key = 'formativeAssessment';
    if (activeListEditor === 'summative') key = 'summativeAssessment';
    if (activeListEditor === 'didactics') key = 'didacticsEvaluation';
    if (activeListEditor === 'impact') key = 'impactEvaluation';
    
    if (activeListEditor === 'frequency') key = 'frequency';
    if (activeListEditor === 'followUp') key = 'followUp';
    if (activeListEditor === 'progressMonitoring') key = 'progressMonitoring';
    if (activeListEditor === 'coachingMentoring') key = 'coachingMentoring';

    if (activeListEditor === 'principle1') key = 'principle1';
    if (activeListEditor === 'principle2') key = 'principle2';
    if (activeListEditor === 'principle3') key = 'principle3';
    if (activeListEditor === 'principle4') key = 'principle4';
    if (activeListEditor === 'principle5') key = 'principle5';


    const currentList = (strategy[key] as string[]) || [];
    onUpdate({ ...strategy, [key]: [...currentList, newItemText] });
    setNewItemText("");
  };

  const handleRemoveItemFromList = (index: number) => {
    if (!activeListEditor) return;
    
    let key: keyof Strategy = activeListEditor as keyof Strategy;
    
    // Manual mapping
    if (activeListEditor === 'formative') key = 'formativeAssessment';
    if (activeListEditor === 'summative') key = 'summativeAssessment';
    if (activeListEditor === 'didactics') key = 'didacticsEvaluation';
    if (activeListEditor === 'impact') key = 'impactEvaluation';
    if (activeListEditor === 'frequency') key = 'frequency';
    if (activeListEditor === 'followUp') key = 'followUp';
    if (activeListEditor === 'progressMonitoring') key = 'progressMonitoring';
    if (activeListEditor === 'coachingMentoring') key = 'coachingMentoring';
    if (activeListEditor === 'principle1') key = 'principle1';
    if (activeListEditor === 'principle2') key = 'principle2';
    if (activeListEditor === 'principle3') key = 'principle3';
    if (activeListEditor === 'principle4') key = 'principle4';
    if (activeListEditor === 'principle5') key = 'principle5';

    const currentList = [...((strategy[key] as string[]) || [])];
    currentList.splice(index, 1);
    onUpdate({ ...strategy, [key]: currentList });
  };

  const getActiveListItems = () => {
      if (!activeListEditor) return [];
      
      let key: keyof Strategy = activeListEditor as keyof Strategy;
      
      if (activeListEditor === 'formative') key = 'formativeAssessment';
      if (activeListEditor === 'summative') key = 'summativeAssessment';
      if (activeListEditor === 'didactics') key = 'didacticsEvaluation';
      if (activeListEditor === 'impact') key = 'impactEvaluation';
      if (activeListEditor === 'frequency') key = 'frequency';
      if (activeListEditor === 'followUp') key = 'followUp';
      if (activeListEditor === 'progressMonitoring') key = 'progressMonitoring';
      if (activeListEditor === 'coachingMentoring') key = 'coachingMentoring';
      if (activeListEditor === 'principle1') key = 'principle1';
      if (activeListEditor === 'principle2') key = 'principle2';
      if (activeListEditor === 'principle3') key = 'principle3';
      if (activeListEditor === 'principle4') key = 'principle4';
      if (activeListEditor === 'principle5') key = 'principle5';

      return (strategy[key] as string[]) || [];
  };

  const closeListEditor = () => {
    setActiveListEditor(null);
    setShowItemHelp(false);
  }

  const getListIcon = (type: ListEditorType) => {
      switch(type) {
          case 'jobs': return <UserRound className="w-5 h-5 text-blue-600" />;
          case 'pains': return <AlertTriangle className="w-5 h-5 text-red-600" />;
          case 'gains': return <TrendingUp className="w-5 h-5 text-green-600" />;
          case 'okrs': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
          case 'onsite': return <MapPin className="w-5 h-5 text-orange-600" />;
          case 'video': return <Video className="w-5 h-5 text-orange-600" />;
          case 'assisted': return <LifeBuoy className="w-5 h-5 text-orange-600" />;
          case 'independent': return <User className="w-5 h-5 text-orange-600" />;
          case 'collaborative': return <Users className="w-5 h-5 text-orange-600" />;
          case 'asynchronous': return <Clock className="w-5 h-5 text-orange-600" />;
          case 'formative': return <FileEdit className="w-5 h-5 text-teal-600" />;
          case 'summative': return <GraduationCap className="w-5 h-5 text-teal-600" />;
          case 'didactics': return <BookOpen className="w-5 h-5 text-teal-600" />;
          case 'impact': return <BarChart3 className="w-5 h-5 text-teal-600" />;
          case 'frequency': return <Repeat className="w-5 h-5 text-lime-600" />;
          case 'followUp': return <ListChecks className="w-5 h-5 text-lime-600" />;
          case 'progressMonitoring': return <Activity className="w-5 h-5 text-lime-600" />;
          case 'coachingMentoring': return <UserCheck className="w-5 h-5 text-lime-600" />;
          case 'principle1': return <ThumbsUp className="w-5 h-5 text-sky-600" />; // Reaction
          case 'principle2': return <BookOpen className="w-5 h-5 text-sky-600" />; // Learning
          case 'principle3': return <Activity className="w-5 h-5 text-sky-600" />; // Behavior
          case 'principle4': return <Target className="w-5 h-5 text-sky-600" />; // Results
          case 'principle5': return <TrendingUp className="w-5 h-5 text-sky-600" />; // ROI
          default: return null;
      }
  };

  const getListTitle = (type: ListEditorType) => {
      if (!type) return "";
      if (type === 'okrs') return "Key Learning Results (KLR)";
      if (type === 'onsite') return "Onsite Training";
      if (type === 'video') return "Video Training";
      if (type === 'assisted') return "Assisted Learning";
      if (type === 'independent') return "Independent Work";
      if (type === 'collaborative') return "Collaborative Learning";
      if (type === 'asynchronous') return "Asynchronous Learning";
      if (type === 'formative') return "Formative Assessment";
      if (type === 'summative') return "Summative Assessment";
      if (type === 'didactics') return "Didactics Evaluation";
      if (type === 'impact') return "Impact Evaluation";
      if (type === 'frequency') return "Frequency";
      if (type === 'followUp') return "Follow-up";
      if (type === 'progressMonitoring') return "Progress Monitoring";
      if (type === 'coachingMentoring') return "Coaching & Mentoring";
      if (type === 'principle1') return "Principle 1";
      if (type === 'principle2') return "Principle 2";
      if (type === 'principle3') return "Principle 3";
      if (type === 'principle4') return "Principle 4";
      if (type === 'principle5') return "Principle 5";
      return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getListPreview = (type: ListEditorType) => {
      if(!type) return [];
      
      let key: keyof Strategy = type as keyof Strategy;

      if (type === 'formative') key = 'formativeAssessment';
      if (type === 'summative') key = 'summativeAssessment';
      if (type === 'didactics') key = 'didacticsEvaluation';
      if (type === 'impact') key = 'impactEvaluation';
      if (type === 'frequency') key = 'frequency';
      if (type === 'followUp') key = 'followUp';
      if (type === 'progressMonitoring') key = 'progressMonitoring';
      if (type === 'coachingMentoring') key = 'coachingMentoring';
      if (type === 'principle1') key = 'principle1';
      if (type === 'principle2') key = 'principle2';
      if (type === 'principle3') key = 'principle3';
      if (type === 'principle4') key = 'principle4';
      if (type === 'principle5') key = 'principle5';

      return (strategy[key] as string[]) || [];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      
      {/* Help Modals for Cards ... (Same as before, abbreviated here for clarity but fully preserved in output) */}
      {/* Value Proposition Help Modal */}
      {showValuePropHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-blue-600" />
                Instructions: Training Value Proposition (TVP)
              </h3>
              <button 
                onClick={() => setShowValuePropHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
              <p>
                Training Value Proposition Design (TVP) is the first component of the LXD_K2L methodology and is inspired by Strategyzer's Value Proposition Design principles. For our methods, we will focus on three critical aspects:
              </p>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <strong className="block text-blue-900 mb-1">Jobs</strong>
                    <p className="mb-2">It describes what the organization and its employees want to achieve in their work and personal development. JOBs help identify which actions are relevant to the training program value chain.</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                        <li>A Job may be a process they want to be improved, compliance issues they are trying to solve or upgrade, and transformation needs they want to drive.</li>
                        <li>Jobs, as training actions, depending on the specific context of performance, so the proximity environment of the participant must illuminate the design beyond the content per se.</li>
                    </ul>
                </div>

                <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <strong className="block text-red-900 mb-1">Pains</strong>
                    <p className="mb-2">Describes the adverse effects, risks, and obstacles related to inadequate performance. In other words, they are the effects of inadequate or insufficient training.</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                        <li>Pains describe anything that disturbs the organization or its employees before, during, and after trying to achieve their objectives; or prevents them from getting a job well done.</li>
                        <li>Pains also describe the risks, or possible undesirable outcomes, associated with getting a job done poorly or not at all.</li>
                    </ul>
                </div>

                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <strong className="block text-green-900 mb-1">Gains</strong>
                    <p className="mb-2">Describe the verifiable changes and achievements that the organization and its employees wish to achieve or the concrete benefits they are looking for; always associating the training with a chain of contributions.</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 ml-2">
                        <li>Gains or benefits describe the results and benefits that the organization can achieve and the trainee can acquire.</li>
                        <li>Some benefits are required, expected, or desired by the organization and the training participants, and some will surprise them.</li>
                    </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowValuePropHelp(false)}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OKLR Help Modal */}
      {showOklrHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Instructions: Training OKLR
              </h3>
              <button 
                onClick={() => setShowOklrHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                    The Design of <strong>Objectives and Key Learning Results (OKLR)</strong> is a perspective to ensure performance monitoring, focusing on the results of achievement in short cycles where the training process is validated in the transfer to the participant's daily practice. This action framework focuses on the previously defined intentionality and connects with the curricular design that continues in our methodological model of interactive learning experience & content construction.
                </p>
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <h4 className="font-bold text-slate-900 mb-2">Objective (Qualitative Learning Outcome)</h4>
                    <p className="mb-2">The central objective is a qualitative statement of an aspirational nature aimed at mobilizing action. The primary goal should be to achieve a strategic change, preferably verifiable in 3-month cycles. In summary, the qualitative learning outcome to where I want to direct the development of skills and the capacity for transfer to the workspace.</p>
                    <p>An objective formulated as a qualitative learning outcome is a concise statement that frames a strategic goal to push the learner in a specific direction. The purpose arises from asking, "what is the learner able to" - LAT. A well-formulated goal should inspire and capture the imagination and desire of the learners.</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <h4 className="font-bold text-green-900 mb-2">Key Learning Results</h4>
                    <p className="mb-2">Key results are quantitative targets or verifiable indicators that can be established as contribution threads associated with the training process. Key Learning Results (KLR) must be specific in time and units of measurement or validation.</p>
                    <p>A key result is a quantitative statement that allows us to measure the achievement of a specific objective. If the goals ask what we want to be learned, the KLRs ask, "how will we know if we are achieving our objective"?</p>
                </div>
            </div>
             <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowOklrHelp(false)}
                className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interaction Design Help Modal */}
      {showInteractionHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Network className="w-5 h-5 text-orange-600" />
                Instructions: Interaction Design
              </h3>
              <button 
                onClick={() => setShowInteractionHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                    The Design of the Interaction Model (DMI) module of the teaching-learning process involves recognizing the set of flows, relationships, and encounters generated by the participants of the training program supported by digital platforms in such a way as to ensure their proactive appropriation.
                </p>
                <p>
                    If Digital Platforms ought to support the training program participants, so a proactive appropriation is to be guaranteed. After you describe your preferences for each learning interaction or the ones of your preference, the organize them in sequence.
                </p>
            </div>
             <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowInteractionHelp(false)}
                className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment Help Modal */}
      {showAssessmentHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-teal-600" />
                Instructions: Assessment Model (DME)
              </h3>
              <button 
                onClick={() => setShowAssessmentHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                    The Design of the Evaluation Model (DME) considers two axes and two components per axis: The evaluation axis within the didactic process, composed of Formative and Summative Evaluation.  The axis of the assessment of the teaching-learning process consists of the review of Didactics and the level of Appropriation.
                </p>
            </div>
             <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowAssessmentHelp(false)}
                className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Feedback Help Modal */}
      {showFeedbackHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-lime-600" />
                Instructions: Feedback Strategy
              </h3>
              <button 
                onClick={() => setShowFeedbackHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                    The Feedback, Assistance, and Mentoring module believes that for training practice to be effective, trainees must be able to say how they are doing. This is particularly important for skill development because practicing something incorrectly can be worse than not practicing. The incorrect skill can become ingrained, and then correcting that skill later will require the deconstruction of habits that have become automatic.
                </p>
            </div>
             <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowFeedbackHelp(false)}
                className="px-4 py-2 bg-lime-600 text-white font-medium rounded-lg hover:bg-lime-700 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outcome Mapping Help Modal */}
      {showOutcomeHelp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-start mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <GitMerge className="w-5 h-5 text-sky-600" />
                Instructions: Outcome Mapping
              </h3>
              <button 
                onClick={() => setShowOutcomeHelp(false)} 
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-sm text-slate-600 space-y-4 leading-relaxed">
                <p>
                    As stage 1 points out, we complete the circle with stage 9; the learning experience design cycle starts with the outcome, and therefore we end up evaluating how to validate the achievement of those outcomes. For Training Impact Measurement (TIM), we will leverage the four principles of the Kirkpatrick model
                </p>
            </div>
             <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowOutcomeHelp(false)}
                className="px-4 py-2 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List Editor Modal */}
      {activeListEditor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-200 flex flex-col max-h-[85vh]">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2 flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        {getListIcon(activeListEditor)}
                        Edit {getListTitle(activeListEditor)}
                    </h3>
                    <button onClick={closeListEditor} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                {/* Input Row */}
                <div className="flex gap-2 mb-4 flex-shrink-0">
                    <input 
                        type="text" 
                        className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        placeholder={`Add new item...`}
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItemToList()}
                        autoFocus
                    />
                    <button 
                        onClick={handleAddItemToList}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Help Content Area (Same as before) ... */}
                {showItemHelp && (
                    <div className="mb-4 flex-shrink-0 overflow-y-auto max-h-60 p-3 bg-indigo-50 text-indigo-900 text-xs rounded-lg border border-indigo-100 leading-relaxed animate-in fade-in zoom-in-95 duration-200">
                        <div className="space-y-4">
                            {/* Help content preserved from previous steps */}
                             {activeListEditor === 'jobs' && (
                                <>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Training Action for Functional Activities</strong>
                                        <p>This includes activities directly linked to a specific role for which the participant requires reconfiguration or updating of skills. Think as an expert in this topic: What contributions will the course make to the participant depending on his role? What experiences and contributions will it give to the participant, in which they will be able to improve their capacities, results, and work? There will be as many training actions as different roles can be impacted by the training.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Cross-cutting Support Training Actions</strong>
                                        <p>Refers to activities within a workflow in which the participant contributes to a value chain beyond the functional role and for which they need to recognize and define their scope and contribution.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Behavioral Dimension Training Activities</strong>
                                        <p>Refers to the set of activities developed to link the participant's sense of motivation, urgency, and personal commitment to the topics considered in training.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Training Actions with Social Linkage</strong>
                                        <p>In some processes more connected to higher purposes and mission components of the organization, the activities to be considered may incorporate aspects of contribution, values, and actions that commit the participant to the other and, thus, re-signify the importance of their role and contributions in terms of generating shared value.</p>
                                    </div>
                                </>
                            )}
                             {activeListEditor === 'pains' && (
                                <>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Obstacles to be faced with training</strong>
                                        <p>It refers to the identified needs or implies overcoming a limitation that affects the participant's performance but can be overcome with training. In other words, there is control and governance of the situation, which allows modifying or intervening in performance areas.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Restricciones a Superar con Formación</strong>
                                        <p>This refers to the needs associated with conditions of compliance with standards and regulations that condition the participant's performance framework. They are not adaptable to the extent that they prepare for the role or performance. Still, it is essential to create a sense of co-responsibility, motivation, or urgency with their assurance, given the possible implications in the business or with control entities.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Results to be Mobilized from Training</strong>
                                        <p>Refers to training needs resulting from performance evaluation. Changes in results resulting from incorporating new strategies or technologies can also be considered. Derived from the above, the training proposal is an opportunity to improve outcomes due to capacity upgrading, re-skilling, and up-skilling.</p>
                                    </div>
                                </>
                            )}
                            {activeListEditor === 'gains' && (
                                <>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Minimum Required Training Gains</strong>
                                        <p>These are the fundamental minimum contributions that training should achieve. Generally, these gains are associated with compliance with standards, regulations, and policies.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Significant Gains from Training</strong>
                                        <p>These positive impacts mobilize the participant and the organization toward established development and performance goals. They are generally the result of positively impacting the participant's learning and performance.</p>
                                    </div>
                                    <div>
                                        <strong className="block text-indigo-950 font-bold mb-1">Exceptional gains from training</strong>
                                        <p>These are all those contributions that, beyond the training, configure verifiable positive contribution chains beyond the results designed for the training and are observable in the increase of high-performance cases. The achievement of performance levels in training demonstrates a mastery level of appropriation by the participant.</p>
                                    </div>
                                </>
                            )}
                            {activeListEditor === 'okrs' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Key Learning Results (KLR)</strong>
                                    <p>List the verifiable outcomes that demonstrate the achievement of the qualitative objective. These should be concrete evidence of learning.</p>
                                </div>
                            )}
                            {activeListEditor === 'onsite' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Onsite Training</strong>
                                    <p>On-Site training is one of the face-to-face training modalities. Since it has been the dominant model of interaction in formal education - that of the face-to-face meeting where the teacher-instructor is the central interface of access to knowledge - this trend has been transferred to corporate training. In the LXD methodology, the live face-to-face meeting does not disappear but becomes an experience augmented by digital resources and thus is reduced in extension but not in depth.</p>
                                </div>
                            )}
                            {activeListEditor === 'video' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Video Training</strong>
                                    <p>Synchronous transmission via video conferencing is the second form of face-to-face training. Many of the characteristics of On-Site Training are replicated in this interaction model since the transmission is usually unidirectional. The methodology proposes the design of Active Synchronicity in which the interaction alternates from one to many with autonomous or collaborative production space in real-time, adding to interactive multimedia units on the platform.</p>
                                </div>
                            )}
                            {activeListEditor === 'assisted' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Assisted Learning</strong>
                                    <p>Assisted learning has three modalities: a synchronous one, when the tutor and learner share life, either in-situ or by video conference; the second modality is non-synchronous assistance, which implies being able to follow the student's progress on the platform and give feedback; and the third is peer-to-peer assistance, characteristic of learning on communities of practice.</p>
                                </div>
                            )}
                            {activeListEditor === 'independent' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Independent Work</strong>
                                    <p>Independent work in the LXD methodology should not be confused with autonomous learning because although both modes of interaction share the self-directed modality, in this case, guides and orientations are followed that are more connected with phases of inquiry and production outside the platform. Thus, independent work is generally individual and deepens beyond the interactive didactic units on the forum.</p>
                                </div>
                            )}
                            {activeListEditor === 'collaborative' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Collaborative Learning</strong>
                                    <p>Collaborative learning is a fundamental part of maintaining the socio-emotional interaction of practitioners in a training process. Collaborative practices activate zones of proximal knowledge that an individual would otherwise not be able to reach in time and qualities other than in the presence of peers. Collaborative environments provide personalized learning opportunities and enable trainees to achieve a higher rate of thinking and a more robust ownership capacity thanks to the positive reinforcement of their peers.</p>
                                </div>
                            )}
                            {activeListEditor === 'asynchronous' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Asynchronous Learning</strong>
                                    <p>Self-determination theory (SDT - Ryan, R. M., & Deci, E. L.) represents a broad framework for studying human motivation that, in this case, we apply to learn. The experience of autonomous learning is a relational competence as it manifests itself to the extent that the interaction design stimulates the learner's high-quality forms of motivation and engagement for learning activities, including increased performance, persistence, and creativity.</p>
                                </div>
                            )}
                            {activeListEditor === 'formative' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Formative Assessment</strong>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Formative evaluation occurs throughout the process and may or may not have weight in assessing the final result. It should incorporate progressive and systematic activities that gather information on the learning process in each cycle of the student's progress.</li>
                                        <li>Each moment of formative evaluation or process of generating feedback regarding their level of a performance, staged knowledge, and resources complement the training. Formative evaluation can be assisted synchronously or automatically asynchronously. The former is more time-consuming, and the latter requires more care in the intentional design of the learning path.</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'summative' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Summative Assessment</strong>
                                    <p className="mb-2">The summative evaluation focuses on the final or cumulative result of the learner's performance. This requires three dimensions of performance to be assessed:</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Familiarity</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">Minimal information and knowledge that the learner must ensure familiarity with and manage: for this type of scenario, test-type units can typically be used with selection, association, and construction of answers to closed-ended questions.</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Comprehension</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">Ensuring ownership and understanding: This assessment touches the deepest layers of learning and can only be addressed with open-ended questions and case studies with different levels of complexity.</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Transference</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">Validate if the critical knowledge is identified to be applied in its context. This moment of the summative evaluation seeks to validate the level of potential transfer to the learner's performance context. Any of the techniques of the previous two points can be used.</p>
                                </div>
                            )}
                            {activeListEditor === 'didactics' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Didactics Evaluation</strong>
                                    <p>The Subject Matter Expert must include an evaluation by the course participants that considers the available knowledge, the visual and didactic resources to consume them, and the pertinence and relevance of the activities that stimulated the teaching-learning process.</p>
                                </div>
                            )}
                            {activeListEditor === 'impact' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Impact Evaluation</strong>
                                    <p className="mb-2">It refers to monitoring the effectiveness of the learning process seen sometime after the end of the training and placed in the participants' practice contexts. The designer can design micro-learning units that validate one of the dimensions of Bloom's taxonomy of learning (revised 2001):</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-2 font-medium">
                                        <li>Create</li>
                                        <li>Evaluate</li>
                                        <li>Analyze</li>
                                        <li>Apply</li>
                                        <li>Comprehend</li>
                                        <li>Remember</li>
                                    </ol>
                                </div>
                            )}
                            {activeListEditor === 'frequency' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Frequency</strong>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Deciding how often to provide feedback to your learners is a fundamental condition for maintaining engagement and rapport despite the distance inherent in digital learning.</li>
                                        <li>There are three ways to think about feedback: integrated and automated along the learning path, linked to collaborative spaces, and done in learning communities.</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'followUp' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Follow-up</strong>
                                    <p className="mb-2">The assistance model can be synchronous or asynchronous, the former having greater complexities due to the need for time alignment among the participants. Among the possibilities of non-synchronous attendance, there are three primary modalities:</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Micro-Learning Feedback Units</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">The production of micro-learning units that solve recurring student questions and pitfalls for asynchronous and on-demand consumption.</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Learning Communities</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">The animation of learning communities is articulated around a specific learning objective, where the tutor contributes to generating questions or adjustments to the trajectory when there are problems of conception.</p>
                                    
                                    <strong className="block text-indigo-950 font-semibold mb-1">Collaborative Content Curation</strong>
                                    <p className="mb-2 pl-2 border-l-2 border-indigo-200">The development of collaborative content curation (context-pedia) through social bookmarking tools allows the building of digital collections open to everyone's participation and consultation.</p>
                                </div>
                            )}
                            {activeListEditor === 'progressMonitoring' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Progress Monitoring</strong>
                                    <p className="mb-2">To monitor the participant's progress, the platform offers multiple tracking possibilities:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-2 font-medium mb-2">
                                        <li>Progress of units and courses per participant</li>
                                        <li>Performance and progress in each class and even in each unit.</li>
                                        <li>Consumption, recurrence, and participation data for each group of participants.</li>
                                        <li>Consumption reports filtered by periods, types of users, and specific courses or training sessions.</li>
                                    </ol>
                                    <p>It is essential to mention that it is up to the program developer to decide what they want to monitor and with what periodicity for automation on the platform.</p>
                                </div>
                            )}
                            {activeListEditor === 'coachingMentoring' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Coaching & Mentoring</strong>
                                    <p className="mb-2">The coaching component requires familiarity and proximity, the most accurate term is Authenticity; here are some elements to achieve it:</p>
                                    <ol className="list-decimal list-inside space-y-1 pl-2 font-medium mb-2">
                                        <li>Coaching and mentoring should promote knowledge integration;</li>
                                        <li>Leverage performance and interaction data to deliver informed alternatives;</li>
                                        <li>Promote divergent thinking and creativity;</li>
                                        <li>Address the practical and transfer issues presented by the learner.</li>
                                        <li>Explore options around How and Why, not just What.</li>
                                    </ol>
                                </div>
                            )}
                            {activeListEditor === 'principle1' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-1">Principle 1</strong>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>Trainers should start with the desired outcomes (Level 4) and then determine what behavior (Level 3) is needed to achieve them. Next, trainers must determine the attitudes, knowledge, and skills (Level 2) necessary to achieve the desired behavior(s). The final challenge is to present the training program in a way that allows participants to learn what they need to know and react favorably to the program (Level 1).</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'principle2' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Principle 2</strong>
                                    <p className="mb-2">Return on Expectations (ROE) is the ultimate indicator of value creation for the learner.</p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>"What would demonstrate the success of the program?" The answer to this question may require a series of questions to arrive at the final indicators of program success. Agreement on leading indicators at the beginning of a training project eliminates the need to attempt to demonstrate the value of the course subsequently. It is understood from the outset that if the critical objectives connected to outcome indicators are met, the initiative will be considered a success.</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'principle3' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Principle 3</strong>
                                    <p className="mb-2">The active participation of all the actors involved in the training process generates positive effects on the ROE.</p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>To maximize program results, the subject matter expert must match their proposal to supervisors and managers who expect to prepare participants for their business adequately. Even more critical is the role of the supervisor or manager after the training. They are the key people who reinforce newly learned knowledge and skills through support and accountability. The degree to which this reinforcement and coaching occur corresponds directly to improved performance and positive outcomes.</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'principle4' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Principle 4</strong>
                                    <p className="mb-2">Value has to be created to be demonstrated.</p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>The reinforcement that occurs after the training event produces the highest level of learning effectiveness. It is essential to design resources for the participant to reinforce newly learned knowledge and skills. The degree to which this reinforcement and coaching occur corresponds directly to improved performance and positive outcomes.</li>
                                    </ul>
                                </div>
                            )}
                            {activeListEditor === 'principle5' && (
                                <div>
                                    <strong className="block text-indigo-950 font-bold mb-2">Principle 5</strong>
                                    <p className="mb-2">A convincing chain of evidence is the foundation of value generation.</p>
                                    <ul className="list-disc list-inside space-y-2">
                                        <li>The verifiable contributions unify the learning and business functions and avoid isolating or separating training. When developing a chain of training contribution indicators, keep in mind that the levels are not causal or in a linear sequence, nor are they of equal importance. In making your case, focus on what is most important to the public and stakeholders. Generally, data from levels 3 and 4 are of the most interest.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
                    {getActiveListItems().length === 0 && !showItemHelp && (
                        <p className="text-slate-400 text-center text-sm py-4 italic">No items yet.</p>
                    )}
                    {getActiveListItems().map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start bg-slate-50 p-2 rounded border border-slate-100 group">
                            <span className="text-sm text-slate-700 break-words flex-1 mr-2">{item}</span>
                            <button 
                                onClick={() => handleRemoveItemFromList(idx)}
                                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex justify-between items-center pt-2 border-t border-slate-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowItemHelp(!showItemHelp)}
                            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg text-sm font-medium transition-colors"
                        >
                            <HelpCircle className="w-4 h-4" />
                            {showItemHelp ? 'Hide Instructions' : 'Need help?'}
                        </button>
                    </div>

                    <button onClick={closeListEditor} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Done
                    </button>
                </div>
             </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            Learning Design
        </h2>
        <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
        >
            Continuar a Content
            <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Value Proposition */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <LayoutGrid className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Value Proposition</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('value_proposition')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'value_proposition' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'value_proposition' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowValuePropHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Ver instrucciones (TVP)"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <textarea
                className="w-full p-3 bg-slate-50 border-0 rounded-lg text-slate-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm mb-4"
                rows={3}
                value={strategy.valueProposition}
                onChange={(e) => handleChange('valueProposition', e.target.value)}
                placeholder="Resumen de la propuesta de valor..."
            />

            <div className="grid grid-cols-1 gap-3">
                {/* Jobs Button & Preview */}
                <div className="border border-slate-100 rounded-lg p-2">
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
                            <UserRound className="w-3 h-3" /> Jobs
                         </h4>
                         <button 
                            onClick={() => setActiveListEditor('jobs')}
                            className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 font-medium border border-blue-100"
                         >
                            + Input Jobs
                         </button>
                     </div>
                     <div className="flex flex-wrap gap-1">
                        {getListPreview('jobs').length === 0 && <span className="text-slate-300 text-[10px] italic">No jobs defined</span>}
                        {getListPreview('jobs').slice(0, 3).map((job, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                                {job}
                            </span>
                        ))}
                        {(strategy.jobs?.length || 0) > 3 && <span className="text-[10px] text-slate-400">+{strategy.jobs!.length - 3} more</span>}
                     </div>
                </div>

                {/* Pains Button & Preview */}
                <div className="border border-slate-100 rounded-lg p-2">
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Pains
                         </h4>
                         <button 
                            onClick={() => setActiveListEditor('pains')}
                            className="text-[10px] bg-red-50 text-red-600 px-2 py-1 rounded hover:bg-red-100 font-medium border border-red-100"
                         >
                            + Input Pains
                         </button>
                     </div>
                     <div className="flex flex-wrap gap-1">
                        {getListPreview('pains').length === 0 && <span className="text-slate-300 text-[10px] italic">No pains defined</span>}
                        {getListPreview('pains').slice(0, 3).map((pain, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                                {pain}
                            </span>
                        ))}
                        {(strategy.pains?.length || 0) > 3 && <span className="text-[10px] text-slate-400">+{strategy.pains!.length - 3} more</span>}
                     </div>
                </div>

                {/* Gains Button & Preview */}
                <div className="border border-slate-100 rounded-lg p-2">
                     <div className="flex justify-between items-center mb-2">
                         <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Gains
                         </h4>
                         <button 
                            onClick={() => setActiveListEditor('gains')}
                            className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 font-medium border border-green-100"
                         >
                            + Input Gains
                         </button>
                     </div>
                     <div className="flex flex-wrap gap-1">
                        {getListPreview('gains').length === 0 && <span className="text-slate-300 text-[10px] italic">No gains defined</span>}
                        {getListPreview('gains').slice(0, 3).map((gain, i) => (
                            <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                                {gain}
                            </span>
                        ))}
                        {(strategy.gains?.length || 0) > 3 && <span className="text-[10px] text-slate-400">+{strategy.gains!.length - 3} more</span>}
                     </div>
                </div>
            </div>
        </div>

        {/* Training OKLR */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                        <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Training OKLR</h3>
                </div>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('oklr')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'oklr' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'oklr' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowOklrHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        title="Ver instrucciones (OKLR)"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            <div className="mb-4">
                 <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Qualitative Objective</label>
                 <textarea
                    className="w-full p-3 bg-slate-50 border-0 rounded-lg text-slate-700 focus:ring-2 focus:ring-green-500 focus:bg-white transition-all text-sm"
                    rows={3}
                    value={strategy.qualitativeObjective || ''}
                    onChange={(e) => handleChange('qualitativeObjective', e.target.value)}
                    placeholder="Describe el objetivo cualitativo del entrenamiento..."
                />
            </div>

            <div className="border border-slate-100 rounded-lg p-2">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-xs font-bold text-green-900 uppercase tracking-wide flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Key Learning Results
                    </h4>
                    <button 
                        onClick={() => setActiveListEditor('okrs')}
                        className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded hover:bg-green-100 font-medium border border-green-100"
                    >
                        + Input KLRs
                    </button>
                </div>
                <div className="flex flex-wrap gap-1">
                    {getListPreview('okrs').length === 0 && <span className="text-slate-300 text-[10px] italic">No KLRs defined</span>}
                    {getListPreview('okrs').slice(0, 3).map((klr, i) => (
                        <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 truncate max-w-[150px]">
                            {klr}
                        </span>
                    ))}
                    {(strategy.okrs?.length || 0) > 3 && <span className="text-[10px] text-slate-400">+{strategy.okrs!.length - 3} more</span>}
                </div>
            </div>
        </div>

        {/* Interaction Design - UPDATED */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                        <Network className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Interaction Design</h3>
                </div>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('interaction')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'interaction' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'interaction' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowInteractionHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                        title="Ver instrucciones"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* 6 Input Buttons Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                {[
                    { type: 'onsite', label: 'Onsite Training' },
                    { type: 'video', label: 'Video Training' },
                    { type: 'assisted', label: 'Assisted Learning' },
                    { type: 'independent', label: 'Independent Work' },
                    { type: 'collaborative', label: 'Collaborative Learning' },
                    { type: 'asynchronous', label: 'Asynchronous Learning' }
                ].map((item) => (
                    <button
                        key={item.type}
                        onClick={() => setActiveListEditor(item.type as ListEditorType)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition-all group"
                    >
                        <div className="mb-2 text-slate-400 group-hover:text-orange-500 transition-colors">
                            {getListIcon(item.type as ListEditorType)}
                        </div>
                        <span className="text-xs font-semibold text-center leading-tight mb-1">{item.label}</span>
                        {getListPreview(item.type as ListEditorType).length > 0 && (
                            <span className="text-[10px] bg-white border border-slate-200 px-2 rounded-full font-medium">
                                {getListPreview(item.type as ListEditorType).length} items
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <textarea
                className="w-full p-3 bg-slate-50 border-0 rounded-lg text-slate-700 focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all text-sm"
                rows={3}
                value={strategy.interactionDesign || ''}
                onChange={(e) => handleChange('interactionDesign', e.target.value)}
                placeholder="Interaction Sequence / Flow description..."
            />
        </div>

        {/* Assessment - UPDATED */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-lg">
                        <ClipboardCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Assessment</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('assessment')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'assessment' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'assessment' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowAssessmentHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                        title="Ver instrucciones"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* 4 Input Buttons Grid for Assessment */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                 {[
                    { type: 'formative', label: 'Formative Assessment' },
                    { type: 'summative', label: 'Summative Assessment' },
                    { type: 'didactics', label: 'Didactics Evaluation' },
                    { type: 'impact', label: 'Impact Evaluation' }
                ].map((item) => (
                    <button
                        key={item.type}
                        onClick={() => setActiveListEditor(item.type as ListEditorType)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700 transition-all group"
                    >
                        <div className="mb-2 text-slate-400 group-hover:text-teal-500 transition-colors">
                            {getListIcon(item.type as ListEditorType)}
                        </div>
                        <span className="text-xs font-semibold text-center leading-tight mb-1">{item.label}</span>
                         {getListPreview(item.type as ListEditorType).length > 0 && (
                            <span className="text-[10px] bg-white border border-slate-200 px-2 rounded-full font-medium">
                                {getListPreview(item.type as ListEditorType).length} items
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <textarea
                className="w-full p-3 bg-slate-50 border-0 rounded-lg text-slate-700 focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all text-sm"
                rows={2}
                value={strategy.assessmentMethod || ''}
                onChange={(e) => handleChange('assessmentMethod', e.target.value)}
                placeholder="General Assessment Strategy Summary..."
            />
        </div>

        {/* Feedback - UPDATED */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-lime-100 p-2 rounded-lg">
                        <ThumbsUp className="w-5 h-5 text-lime-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Feedback</h3>
                </div>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('feedback')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'feedback' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'feedback' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowFeedbackHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-lime-600 hover:bg-lime-50 rounded-full transition-colors"
                        title="Ver instrucciones"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
             {/* 4 Input Buttons Grid for Feedback */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                 {[
                    { type: 'frequency', label: 'Frequency' },
                    { type: 'followUp', label: 'Follow-up' },
                    { type: 'progressMonitoring', label: 'Progress Monitoring' },
                    { type: 'coachingMentoring', label: 'Coaching & Mentoring' }
                ].map((item) => (
                    <button
                        key={item.type}
                        onClick={() => setActiveListEditor(item.type as ListEditorType)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-lime-50 hover:border-lime-200 hover:text-lime-700 transition-all group"
                    >
                        <div className="mb-2 text-slate-400 group-hover:text-lime-500 transition-colors">
                            {getListIcon(item.type as ListEditorType)}
                        </div>
                        <span className="text-xs font-semibold text-center leading-tight mb-1">{item.label}</span>
                         {getListPreview(item.type as ListEditorType).length > 0 && (
                            <span className="text-[10px] bg-white border border-slate-200 px-2 rounded-full font-medium">
                                {getListPreview(item.type as ListEditorType).length} items
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <textarea
                className="w-full p-3 bg-slate-50 border-0 rounded-lg text-slate-700 focus:ring-2 focus:ring-lime-500 focus:bg-white transition-all text-sm"
                rows={4}
                value={strategy.feedbackStrategy || ''}
                onChange={(e) => handleChange('feedbackStrategy', e.target.value)}
                placeholder="Estrategia general de retroalimentación..."
            />
        </div>

        {/* Outcome Mapping - UPDATED */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-sky-100 p-2 rounded-lg">
                        <GitMerge className="w-5 h-5 text-sky-600" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">Outcome Mapping</h3>
                </div>
                 <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleGenerateSection('outcome')}
                        disabled={!!generatingSection}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                        title="AI Assist"
                    >
                         {generatingSection === 'outcome' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                         {generatingSection === 'outcome' ? 'Generating...' : 'AI Assist'}
                    </button>
                    <button 
                        onClick={() => setShowOutcomeHelp(true)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
                        title="Ver instrucciones"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
             {/* 5 Input Buttons Grid for Outcome Mapping */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                 {[
                    { type: 'principle1', label: 'Principle 1' },
                    { type: 'principle2', label: 'Principle 2' },
                    { type: 'principle3', label: 'Principle 3' },
                    { type: 'principle4', label: 'Principle 4' },
                    { type: 'principle5', label: 'Principle 5' }
                ].map((item) => (
                    <button
                        key={item.type}
                        onClick={() => setActiveListEditor(item.type as ListEditorType)}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-all group"
                    >
                        <div className="mb-2 text-slate-400 group-hover:text-sky-500 transition-colors">
                            {getListIcon(item.type as ListEditorType)}
                        </div>
                        <span className="text-xs font-semibold text-center leading-tight mb-1">{item.label}</span>
                         {getListPreview(item.type as ListEditorType).length > 0 && (
                            <span className="text-[10px] bg-white border border-slate-200 px-2 rounded-full font-medium">
                                {getListPreview(item.type as ListEditorType).length} items
                            </span>
                        )}
                    </button>
                ))}
            </div>
             
             {/* Retaining legacy fields but potentially could be removed later if fully replaced by principles */}
             <div className="space-y-2 mb-3">
                 <label className="text-xs font-semibold text-slate-400 uppercase">Impact Validation Summary</label>
                 <textarea 
                    className="w-full p-2 bg-slate-50 border-0 rounded-md text-slate-700 text-sm"
                    rows={2}
                    value={strategy.impactValidation}
                    onChange={(e) => handleChange('impactValidation', e.target.value)}
                 />
             </div>
        </div>

      </div>
    </div>
  );
};
