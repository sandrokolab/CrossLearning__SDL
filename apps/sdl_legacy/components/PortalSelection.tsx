import React, { useState } from 'react';
import { Brand } from '../theme';
import { Site } from '../types';

interface PortalSelectionProps {
  onValidate: (site: Site) => void;
}

const SITES: Site[] = [
  { id: 'mty', name: 'Planta Monterrey - Ensamble A' },
  { id: 'cdmx', name: 'Planta CDMX - Fundición' },
  { id: 'gdl', name: 'Planta Guadalajara - Logística' },
];

export const PortalSelection: React.FC<PortalSelectionProps> = ({ onValidate }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');

  const handleValidate = () => {
    const site = SITES.find(s => s.id === selectedSiteId);
    if (site) {
      onValidate(site);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* 1. Hero Header */}
      <div className="relative h-[45vh] w-full overflow-hidden flex items-center justify-center">
        {/* Background Image from Theme */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 blur-[2px] scale-105"
          style={{ 
            backgroundImage: `url("${Brand.images.portal}")`,
          }}
        ></div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Branding from Theme */}
        <div className="relative z-20 flex flex-col items-center animate-fade-in-up">
            <Brand.Logo size="large" />
        </div>
      </div>

      {/* 2. Title Bar */}
      <div className="w-full bg-slate-800 py-4 shadow-md z-30 border-t border-slate-700">
          <h2 className="text-center text-white text-lg md:text-xl font-medium tracking-wide">
              Selección del sitio web
          </h2>
      </div>

      {/* 3. Main Content Area */}
      <div className="flex-1 bg-slate-200 flex flex-col items-center pt-16 px-4">
          
          <div className="w-full max-w-md space-y-8 animate-fade-in">
              {/* Dropdown Container */}
              <div className="relative">
                  <select 
                    className="w-full bg-white border border-slate-300 text-slate-700 py-4 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 appearance-none text-lg"
                    value={selectedSiteId}
                    onChange={(e) => setSelectedSiteId(e.target.value)}
                  >
                      <option value="" disabled>Ningún sitio web</option>
                      {SITES.map(site => (
                        <option key={site.id} value={site.id}>{site.name}</option>
                      ))}
                  </select>
                  {/* Custom Arrow for Dropdown */}
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                    <svg className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                  <button 
                    className="flex-1 bg-slate-400 hover:bg-slate-500 text-white font-bold py-3 px-6 rounded shadow transition-colors duration-200 uppercase tracking-wider text-sm"
                    onClick={() => setSelectedSiteId('')}
                  >
                      Cancelar
                  </button>
                  <button 
                    onClick={handleValidate}
                    disabled={!selectedSiteId}
                    className={`flex-1 font-bold py-3 px-6 rounded shadow transition-colors duration-200 uppercase tracking-wider text-sm ${
                      selectedSiteId 
                        ? 'bg-slate-800 hover:bg-slate-900 text-white' 
                        : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                      Validar
                  </button>
              </div>
          </div>

          <div className="mt-auto mb-6 text-slate-400 text-xs text-center">
              &copy; {new Date().getFullYear()} {Brand.name}. Todos los derechos reservados.
          </div>

      </div>
    </div>
  );
};