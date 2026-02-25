
import React, { useState, useMemo } from 'react';
import { Session, Scene, ABCMethod, MediaLevel, Strategy, CatalogActivity } from '../types';
import { suggestPedagogyAndMedia } from '../services/geminiService';
import { ACTIVITY_CATALOG, INTERACTION_MOMENTS } from '../data/catalog';
import { Sparkles, Loader2, Workflow, Zap, MousePointerClick, Search, Filter, BookOpen, Clock, Target, Layers, LayoutGrid, Check, FileBox, ExternalLink, ChevronRight, Box, Component, Puzzle, MessageSquare, MousePointer2 } from 'lucide-react';

interface Props {
  strategy: Strategy;
  structure: Session[];
  onUpdateStructure: (s: Session[]) => void;
}

export const JourneyMediaModule: React.FC<Props> = ({ strategy, structure, onUpdateStructure }) => {
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Catalog Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
  const [activeToolFilter, setActiveToolFilter] = useState<'Standard' | 'Adobe Captivate'>('Standard');
  const [activeCategoryGroup, setActiveCategoryGroup] = useState<string>('ALL');
  const [filterABC, setFilterABC] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to find and update a specific scene in the deep nested structure
  const updateSceneInStructure = (sceneId: string, updates: Partial<Scene>) => {
    const newStructure = [...structure];
    const traverse = (items: any[]) => {
      for (const item of items) {
        if (item.scenes) { // Topic has scenes
            const sceneIndex = item.scenes.findIndex((s: Scene) => s.id === sceneId);
            if (sceneIndex > -1) {
                item.scenes[sceneIndex] = { ...item.scenes[sceneIndex], ...updates };
                return true;
            }
        }
        if (item.modules) traverse(item.modules);
        if (item.units) traverse(item.units);
        if (item.topics) traverse(item.topics);
      }
    };
    traverse(newStructure);
    onUpdateStructure(newStructure);
  };

  const handleAISuggestion = async (scene: Scene) => {
    setProcessingId(scene.id);
    try {
        const suggestion = await suggestPedagogyAndMedia(
            scene.title, 
            scene.learningObjective || "Comprender el concepto",
            strategy.targetAudience
        );
        updateSceneInStructure(scene.id, {
            abcMethod: suggestion.abcMethod as ABCMethod,
            mediaLevel: suggestion.mediaLevel as MediaLevel,
            mediaFormat: suggestion.mediaFormat,
        });
    } catch (e) {
        console.error("Failed to suggest", e);
    } finally {
        setProcessingId(null);
    }
  };

  const openCatalog = (scene: Scene) => {
      setActiveSceneId(scene.id);
      setFilterABC(scene.abcMethod || 'ALL'); 
      setSearchQuery('');
      setActiveCategoryGroup('ALL');
      setIsModalOpen(true);
  };

  const selectActivity = (activity: CatalogActivity) => {
      if (activeSceneId) {
          updateSceneInStructure(activeSceneId, {
              selectedActivityId: activity.id,
              mediaFormat: activity.name, 
              mediaLevel: activity.type === 'Tipo 3' ? MediaLevel.Level3 : activity.type === 'Tipo 2' ? MediaLevel.Level2 : MediaLevel.Level1 
          });
          setIsModalOpen(false);
          setActiveSceneId(null);
      }
  };

  // --- DERIVED DATA FOR MENU ---
  
  // 1. Filter activities by Tool (Standard/Captivate)
  const activitiesByTool = useMemo(() => {
    return ACTIVITY_CATALOG.filter(a => a.tool === activeToolFilter);
  }, [activeToolFilter]);

  // 2. Extract unique Groups/Categories for the Sidebar
  const categoryGroups = useMemo(() => {
    const groups = new Set<string>();
    activitiesByTool.forEach(a => {
        // For Captivate: "Bloques > Multimedia" -> "Bloques"
        // For Standard: "Uso de Textos" -> "Uso de Textos"
        const group = activeToolFilter === 'Adobe Captivate' 
            ? a.category.split(' > ')[0].split(',')[0].trim()
            : a.category.split(',')[0].trim();
        groups.add(group);
    });
    return Array.from(groups).sort();
  }, [activitiesByTool, activeToolFilter]);

  // 3. Filter Final List based on all criteria
  const filteredActivities = useMemo(() => {
      return activitiesByTool.filter(act => {
          const actGroup = activeToolFilter === 'Adobe Captivate' 
            ? act.category.split(' > ')[0].split(',')[0].trim()
            : act.category.split(',')[0].trim();

          const matchesGroup = activeCategoryGroup === 'ALL' || actGroup === activeCategoryGroup;
          
          const matchesSearch = act.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                act.category.toLowerCase().includes(searchQuery.toLowerCase());
          
          const matchesABC = filterABC === 'ALL' || (act.abcTypes && act.abcTypes.some(t => t.toLowerCase() === filterABC.toLowerCase()));
          
          return matchesGroup && matchesSearch && matchesABC;
      });
  }, [activitiesByTool, activeToolFilter, activeCategoryGroup, searchQuery, filterABC]);


  // Helper Icon for Captivate Groups
  const getGroupIcon = (group: string) => {
      switch(group) {
          case 'Bloques': return <Box className="w-4 h-4" />;
          case 'Componentes': return <Component className="w-4 h-4" />;
          case 'Widgets': return <Puzzle className="w-4 h-4" />;
          case 'Pruebas': return <Check className="w-4 h-4" />;
          case 'Interacciones': return <MousePointer2 className="w-4 h-4" />;
          case 'Uso de Textos': return <BookOpen className="w-4 h-4" />;
          case 'Responder Pregunta': return <MessageSquare className="w-4 h-4" />;
          default: return <LayoutGrid className="w-4 h-4" />;
      }
  };

  const renderCatalogModal = () => {
      if (!isModalOpen) return null;

      return (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
                  
                  {/* HEADER */}
                  <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 flex-shrink-0">
                      <div>
                          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                              <LayoutGrid className="w-5 h-5 text-indigo-600" />
                              Interactive Object Catalog
                          </h3>
                          <p className="text-xs text-slate-500">Select an object to embed in your learning sequence.</p>
                      </div>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-200 rounded-full transition-colors">
                          <Check className="w-5 h-5" />
                      </button>
                  </div>

                  {/* TOOL TABS */}
                  <div className="flex border-b border-slate-200 bg-white px-6 pt-4 gap-6 flex-shrink-0">
                      <button 
                        onClick={() => { setActiveToolFilter('Standard'); setActiveCategoryGroup('ALL'); }}
                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeToolFilter === 'Standard' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <BookOpen className="w-4 h-4" />
                          Pedagogical Activities (Conceptual)
                      </button>
                      <button 
                        onClick={() => { setActiveToolFilter('Adobe Captivate'); setActiveCategoryGroup('ALL'); }}
                        className={`pb-3 px-2 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeToolFilter === 'Adobe Captivate' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                      >
                          <FileBox className="w-4 h-4" />
                          Adobe Captivate Objects (Authoring)
                      </button>
                  </div>

                  {/* MAIN CONTENT AREA */}
                  <div className="flex flex-1 overflow-hidden">
                      
                      {/* SIDEBAR MENU (Categories) */}
                      <div className="w-64 bg-slate-50 border-r border-slate-200 overflow-y-auto p-4 flex-shrink-0">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-2">
                              {activeToolFilter === 'Adobe Captivate' ? 'Object Types' : 'Categories'}
                          </h4>
                          <div className="space-y-1">
                              <button
                                  onClick={() => setActiveCategoryGroup('ALL')}
                                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between group transition-colors ${activeCategoryGroup === 'ALL' ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
                              >
                                  <span className="flex items-center gap-2">
                                      <LayoutGrid className="w-4 h-4 text-slate-400" />
                                      All Objects
                                  </span>
                                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px] group-hover:bg-slate-200">{activitiesByTool.length}</span>
                              </button>
                              
                              {categoryGroups.map(group => {
                                  // Count items in this group
                                  const count = activitiesByTool.filter(a => {
                                      const g = activeToolFilter === 'Adobe Captivate' ? a.category.split(' > ')[0].split(',')[0].trim() : a.category.split(',')[0].trim();
                                      return g === group;
                                  }).length;

                                  return (
                                    <button
                                        key={group}
                                        onClick={() => setActiveCategoryGroup(group)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between group transition-colors ${activeCategoryGroup === group ? 'bg-white shadow-sm text-slate-900 ring-1 ring-slate-200' : 'text-slate-600 hover:bg-slate-100'}`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {getGroupIcon(group)}
                                            {group}
                                        </span>
                                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeCategoryGroup === group ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}`}>
                                            {count}
                                        </span>
                                    </button>
                                  );
                              })}
                          </div>
                      </div>

                      {/* RIGHT PANE: Search + Filters + Grid */}
                      <div className="flex-1 flex flex-col bg-white overflow-hidden">
                          
                          {/* Search & ABC Filter Bar */}
                          <div className="p-4 border-b border-slate-100 flex gap-4 bg-white z-10">
                              <div className="relative flex-1">
                                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                                  <input 
                                      type="text" 
                                      placeholder={`Search in ${activeToolFilter}...`} 
                                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                      value={searchQuery}
                                      onChange={(e) => setSearchQuery(e.target.value)}
                                  />
                              </div>
                              {/* ABC Filter (Only if Standard or if useful) */}
                              <div className="flex items-center gap-2 overflow-x-auto max-w-md">
                                    <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                                    <select 
                                        className="text-xs p-2 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                        value={filterABC}
                                        onChange={(e) => setFilterABC(e.target.value)}
                                    >
                                        <option value="ALL">All Learning Types</option>
                                        {Object.values(ABCMethod).map(m => (
                                            <option key={m} value={m}>{m}</option>
                                        ))}
                                    </select>
                              </div>
                          </div>

                          {/* GRID RESULTS */}
                          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                                <h4 className="text-xs font-bold text-slate-500 mb-4 flex items-center gap-2">
                                    {activeCategoryGroup === 'ALL' ? 'All Categories' : activeCategoryGroup} 
                                    <ChevronRight className="w-3 h-3" /> 
                                    {filteredActivities.length} Results
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredActivities.map(activity => (
                                        <div 
                                            key={activity.id} 
                                            onClick={() => selectActivity(activity)}
                                            className={`bg-white border rounded-xl p-0 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col h-full overflow-hidden ${
                                                activity.tool === 'Adobe Captivate' ? 'border-orange-100 hover:border-orange-300' : 'border-indigo-50 hover:border-indigo-300'
                                            }`}
                                        >
                                            {/* Top Strip */}
                                            <div className={`h-1.5 w-full ${activity.tool === 'Adobe Captivate' ? 'bg-orange-500' : 'bg-indigo-500'}`}></div>
                                            
                                            <div className="p-4 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${activity.tool === 'Adobe Captivate' ? 'text-orange-600' : 'text-indigo-600'}`}>
                                                        {activity.category.split('>').pop()?.trim()}
                                                    </span>
                                                    {activity.url && <ExternalLink className="w-3 h-3 text-slate-300" />}
                                                </div>
                                                
                                                <h4 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-700 leading-tight">
                                                    {activity.name}
                                                </h4>
                                                
                                                <p className="text-xs text-slate-500 line-clamp-3 mb-3 flex-1 leading-relaxed">
                                                    {activity.description}
                                                </p>
                                                
                                                {/* Tags */}
                                                <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-slate-50">
                                                     {activity.abcTypes?.slice(0, 2).map((t, i) => (
                                                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                                            {t}
                                                        </span>
                                                    ))}
                                                    {(activity.abcTypes?.length || 0) > 2 && (
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                                                            +{(activity.abcTypes?.length || 0) - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {filteredActivities.length === 0 && (
                                        <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                                            <Search className="w-10 h-10 mb-3 opacity-20" />
                                            <p className="text-sm font-medium">No results found for your filters.</p>
                                            <button onClick={() => { setSearchQuery(''); setFilterABC('ALL'); setActiveCategoryGroup('ALL'); }} className="mt-2 text-indigo-500 hover:underline text-xs">
                                                Clear all filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  };

  const renderScenes = () => {
    const allScenes: { path: string, scene: Scene }[] = [];
    structure.forEach(session => {
        session.modules.forEach(mod => {
            mod.units.forEach(unit => {
                unit.topics.forEach(topic => {
                    topic.scenes.forEach(scene => {
                        allScenes.push({
                            path: `${session.title} > ${mod.title} > ${unit.title} > ${topic.title}`,
                            scene
                        });
                    });
                });
            });
        });
    });

    if (allScenes.length === 0) return (
        <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No content structure defined yet.</p>
            <p className="text-xs text-slate-400">Go back to the 'Content' tab to generate your syllabus.</p>
        </div>
    );

    return (
        <div className="space-y-4">
            {allScenes.map(({ path, scene }) => {
                const selectedActivity = ACTIVITY_CATALOG.find(a => a.id === scene.selectedActivityId);
                
                return (
                    <div key={scene.id} className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                         {/* Card Header with Path */}
                        <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                             <div className="flex items-center gap-2 text-xs text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap max-w-[70%]">
                                <Layers className="w-3 h-3 flex-shrink-0" />
                                <span className="font-medium text-slate-500">{path}</span>
                             </div>
                             <div className="text-[10px] font-mono font-bold text-slate-300 bg-white px-2 py-0.5 rounded border border-slate-100">ID: {scene.id.slice(0,4)}</div>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-lg flex items-center gap-3">
                                        {scene.title}
                                    </h4>
                                    <div className="flex items-center gap-4 mt-2">
                                        {scene.durationMinutes && (
                                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center gap-1.5">
                                                <Clock className="w-3.5 h-3.5"/> {scene.durationMinutes} min
                                            </span>
                                        )}
                                        <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                                            <Target className="w-3.5 h-3.5" />
                                            <span className="truncate max-w-md">{scene.learningObjective || "Define objective..."}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAISuggestion(scene)}
                                    disabled={!!processingId}
                                    className="text-xs bg-white text-indigo-600 px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-50 transition-colors border border-indigo-200 shadow-sm font-medium"
                                >
                                    {processingId === scene.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                    AI Assist
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-5 border-t border-slate-100">
                                
                                {/* 1. Interaction Moment (Span 3) */}
                                <div className="lg:col-span-3">
                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-2">
                                        <Clock className="w-3.5 h-3.5" /> Interaction Moment
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full text-xs p-2.5 pl-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer font-medium text-slate-700"
                                            value={scene.interactionMoment || ''}
                                            onChange={(e) => updateSceneInStructure(scene.id, { interactionMoment: e.target.value })}
                                        >
                                            <option value="">Select Moment...</option>
                                            {INTERACTION_MOMENTS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronRight className="w-3 h-3 text-slate-400 absolute right-3 top-3 rotate-90 pointer-events-none" />
                                    </div>
                                </div>

                                {/* 2. Methodology (ABC) (Span 3) */}
                                <div className="lg:col-span-3">
                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-2">
                                        <BookOpen className="w-3.5 h-3.5" /> Learning Type (ABC)
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full text-xs p-2.5 pl-3 border border-slate-200 rounded-lg bg-slate-50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none transition-all cursor-pointer font-medium text-slate-700"
                                            value={scene.abcMethod || ''}
                                            onChange={(e) => updateSceneInStructure(scene.id, { abcMethod: e.target.value as ABCMethod })}
                                        >
                                            <option value="">Select Type...</option>
                                            {Object.values(ABCMethod).map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                        <ChevronRight className="w-3 h-3 text-slate-400 absolute right-3 top-3 rotate-90 pointer-events-none" />
                                    </div>
                                </div>

                                {/* 3. Interactive Object (Span 6) */}
                                <div className="lg:col-span-6">
                                    <label className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase mb-2">
                                        <MousePointerClick className="w-3.5 h-3.5" /> Interactive Object
                                    </label>
                                    
                                    {!selectedActivity ? (
                                        <button 
                                            onClick={() => openCatalog(scene)}
                                            className="w-full text-left text-xs p-3 border border-dashed border-slate-300 rounded-lg flex items-center justify-between group hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-slate-400 hover:text-indigo-600"
                                        >
                                            <span className="font-medium">Select object from catalog...</span>
                                            <LayoutGrid className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <div 
                                            onClick={() => openCatalog(scene)}
                                            className={`w-full rounded-lg border p-3 cursor-pointer transition-all hover:shadow-md group relative ${selectedActivity.tool === 'Adobe Captivate' ? 'bg-orange-50/30 border-orange-200 hover:border-orange-300' : 'bg-indigo-50/30 border-indigo-200 hover:border-indigo-300'}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon Box */}
                                                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm ${selectedActivity.tool === 'Adobe Captivate' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                                    {selectedActivity.tool === 'Adobe Captivate' ? <FileBox className="w-5 h-5"/> : <BookOpen className="w-5 h-5"/>}
                                                </div>
                                                
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <p className={`text-sm font-bold truncate ${selectedActivity.tool === 'Adobe Captivate' ? 'text-orange-900' : 'text-indigo-900'}`}>
                                                            {selectedActivity.name}
                                                        </p>
                                                        <span className="text-[10px] text-slate-400 bg-white px-1.5 rounded border border-slate-100 group-hover:border-slate-200">
                                                            Change
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${selectedActivity.tool === 'Adobe Captivate' ? 'bg-orange-100 text-orange-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                                            {selectedActivity.tool === 'Adobe Captivate' ? 'Captivate' : 'Pedagogy'}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500 truncate">
                                                            {selectedActivity.category.split(' > ')[0]}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20 relative">
      {renderCatalogModal()}
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-indigo-600" />
                4. Journey Sequencing & Multimedia
                </h2>
                <p className="text-slate-600 text-sm mt-1 max-w-3xl">
                Define the rhythm and sequence of your learning experience. Select Interaction Moments, Learning Types (ABC), and precise Interactive Objects from the catalog (Pedagogical or Captivate Widgets).
                </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-2 rounded-lg border border-slate-200">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-medium">Pro Tip:</span> Use "AI Assist" to auto-suggest methodology.
            </div>
        </div>

        {renderScenes()}
      </div>
    </div>
  );
};
