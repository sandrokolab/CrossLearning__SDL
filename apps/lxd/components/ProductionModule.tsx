
import React from 'react';
import { LXDProject } from '../types';
import { Download, FileJson, FileText, CheckCircle, Package, Layers, MousePointerClick } from 'lucide-react';

interface Props {
  project: LXDProject;
}

export const ProductionModule: React.FC<Props> = ({ project }) => {
  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${project.title.replace(/\s+/g, '_')}_LXD.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Calculate stats
  const totalScenes = project.structure.reduce((acc, sess) => 
    acc + sess.modules.reduce((mAcc, mod) => 
      mAcc + mod.units.reduce((uAcc, unit) => 
        uAcc + unit.topics.reduce((tAcc, topic) => 
          tAcc + topic.scenes.length, 0), 0), 0), 0);

  const scenesWithActivity = project.structure.reduce((acc, sess) => 
    acc + sess.modules.reduce((mAcc, mod) => 
      mAcc + mod.units.reduce((uAcc, unit) => 
        uAcc + unit.topics.reduce((tAcc, topic) => 
          tAcc + topic.scenes.filter(s => !!s.selectedActivityId).length, 0), 0), 0), 0);

  const completionRate = totalScenes > 0 ? Math.round((scenesWithActivity / totalScenes) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
           <div className="bg-emerald-100 p-2 rounded-lg">
             <Package className="w-6 h-6 text-emerald-600" />
           </div>
           <div>
             <h2 className="text-xl font-bold text-slate-800">5. Production & Export</h2>
             <p className="text-sm text-slate-600">Review your project statistics and export the full blueprint.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Total Scenes</div>
                <div className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    {totalScenes}
                    <Layers className="w-5 h-5 text-indigo-400" />
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Interactive Objects</div>
                <div className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    {scenesWithActivity}
                    <MousePointerClick className="w-5 h-5 text-orange-400" />
                </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-slate-500 text-xs font-bold uppercase mb-1">Completion</div>
                <div className="text-3xl font-bold text-slate-800 flex items-center gap-2">
                    {completionRate}%
                    <CheckCircle className={`w-5 h-5 ${completionRate === 100 ? 'text-green-500' : 'text-slate-300'}`} />
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                    <div className="bg-green-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${completionRate}%` }}></div>
                </div>
            </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
                onClick={downloadJSON}
                className="flex items-center justify-center gap-3 p-6 border-2 border-slate-200 rounded-xl hover:border-indigo-600 hover:bg-indigo-50 transition-all group"
            >
                <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <FileJson className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-slate-800">Export LXD JSON</span>
                    <span className="text-xs text-slate-500">Full project structure and metadata</span>
                </div>
                <Download className="w-5 h-5 text-slate-300 ml-auto group-hover:text-indigo-600" />
            </button>

            <button 
                disabled
                className="flex items-center justify-center gap-3 p-6 border-2 border-slate-100 rounded-xl opacity-60 cursor-not-allowed"
            >
                <div className="bg-slate-100 p-3 rounded-full shadow-sm">
                    <FileText className="w-6 h-6 text-slate-400" />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-slate-400">Export PDF Blueprint</span>
                    <span className="text-xs text-slate-400">Coming soon in v2.0</span>
                </div>
            </button>
        </div>
      </div>
    </div>
  );
};
