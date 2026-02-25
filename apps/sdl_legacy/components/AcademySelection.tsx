import React from 'react';
import { Academy } from '../types';
import { ArrowRight } from 'lucide-react';
import { Brand } from '../theme';

interface AcademySelectionProps {
  onSelectAcademy: (academy: Academy) => void;
}

export const AcademySelection: React.FC<AcademySelectionProps> = ({ onSelectAcademy }) => {
  const academies: Academy[] = [
    { id: 'tech', name: 'Technology & Code', description: 'Software, AI, and Engineering.', icon: '💻' },
    { id: 'arts', name: 'Creative Arts', description: 'Design, Music, and Media.', icon: '🎨' },
    { id: 'biz', name: 'Business & Leadership', description: 'Management, Finance, and Strategy.', icon: '💼' },
    { id: 'sci', name: 'Science & Research', description: 'Biology, Physics, and Chemistry.', icon: '🔬' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 font-sans">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url("${Brand.images.academy}")` }}
      ></div>
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-slate-900/90 z-10"></div>

      <div className="relative z-20 w-full max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <Brand.Logo size="small" className="mx-auto mb-6 justify-center" />
          <h2 className="text-3xl font-bold text-white mb-2">Academy Selection</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Choose your specialized learning path to access relevant content and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {academies.map((academy, idx) => (
            <button
              key={academy.id}
              onClick={() => onSelectAcademy(academy)}
              className={`${Brand.colors.cardGlassDark} p-6 rounded-xl hover:bg-slate-800 transition-all duration-300 text-center group animate-fade-in-up hover:border-blue-500/50`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{academy.icon}</div>
              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{academy.name}</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed">{academy.description}</p>
              
              <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                  <ArrowRight size={20} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};