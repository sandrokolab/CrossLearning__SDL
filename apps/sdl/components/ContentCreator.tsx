import React, { useState } from 'react';
import { generateCourseContent } from '../services/geminiService';
import { Sparkles, Save, Book, Monitor, Globe, Download, Cloud } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export const ContentCreator: React.FC = () => {
  const [mode, setMode] = useState<'WEB' | 'DESKTOP'>('WEB');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    try {
      const result = await generateCourseContent(topic, level);
      setGeneratedContent(result);
    } catch (e) {
      alert("Failed to generate content. Please check your API Key configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <header className="flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">Content Studio</h2>
            <p className="text-slate-500">Create, edit, and publish educational material.</p>
         </div>
         <div className="bg-slate-100 p-1 rounded-lg flex space-x-1">
            <button 
                onClick={() => setMode('WEB')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${mode === 'WEB' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Globe className="w-4 h-4" /> Web Creator
            </button>
            <button 
                onClick={() => setMode('DESKTOP')}
                className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-all ${mode === 'DESKTOP' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
                <Monitor className="w-4 h-4" /> Desktop App
            </button>
         </div>
      </header>

      {mode === 'WEB' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Input Section */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
            <div className="flex items-center space-x-2 mb-6 text-blue-600">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-xl font-bold">AI Web Generator</h2>
            </div>

            <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Topic or Subject</label>
                <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. History of Modern Art"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Difficulty Level</label>
                <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
                <option>Expert</option>
                </select>
            </div>

            <button
                onClick={handleGenerate}
                disabled={isLoading || !topic}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 flex justify-center items-center"
            >
                {isLoading ? <span className="animate-spin mr-2">⏳</span> : "Generate Module"}
            </button>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-blue-800 space-y-2">
                <p className="font-bold flex items-center"><Cloud className="w-3 h-3 mr-1"/> Real-time Collaboration</p>
                <p>Changes are saved automatically to the cloud. Invite peers to edit this module simultaneously.</p>
            </div>
            </div>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-700">Content Preview</h3>
            {generatedContent && (
                <button className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium text-sm">
                <Save className="w-4 h-4" />
                <span>Save to Library</span>
                </button>
            )}
            </div>

            <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
            {generatedContent ? (
                <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{generatedContent.title}</h1>
                <div className="flex flex-wrap gap-2 mb-6">
                    {generatedContent.tags?.map((tag: string, i: number) => (
                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">#{tag}</span>
                    ))}
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {generatedContent.estimatedDuration || '2 hours'}
                    </span>
                </div>
                
                <div className="text-slate-700 leading-relaxed">
                    <ReactMarkdown>{generatedContent.body}</ReactMarkdown>
                </div>
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                <Sparkles className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg font-medium">Ready to create.</p>
                <p className="text-sm">Enter a topic to generate a learning module.</p>
                </div>
            )}
            </div>
        </div>
        </div>
      ) : (
        <div className="flex-1 bg-slate-900 text-white rounded-xl flex items-center justify-center p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 z-0"></div>
            <div className="relative z-10 text-center max-w-lg space-y-6">
                <Monitor className="w-24 h-24 mx-auto text-indigo-400 mb-4 opacity-80" />
                <h2 className="text-3xl font-bold">Switch to Desktop Power</h2>
                <p className="text-slate-300">
                    For advanced video editing, offline capabilities, and heavy multimedia processing, download the SLP Desktop Creator.
                </p>
                <div className="grid grid-cols-2 gap-4 text-left bg-white/10 p-6 rounded-lg backdrop-blur-sm">
                    <div className="space-y-1">
                        <h4 className="font-bold text-white">Offline Mode</h4>
                        <p className="text-xs text-slate-400">Work without internet and sync later.</p>
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-white">Advanced Tools</h4>
                        <p className="text-xs text-slate-400">Timeline editing, 4K export, and more.</p>
                    </div>
                </div>
                <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full flex items-center gap-2 mx-auto transition-colors">
                    <Download className="w-5 h-5" /> Download for Windows/Mac
                </button>
            </div>
        </div>
      )}
    </div>
  );
};
