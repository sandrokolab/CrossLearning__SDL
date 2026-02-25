import React from 'react';
import { UserRole } from '../types';
import { BookOpen, Users, PenTool, ArrowRight, ShieldCheck } from 'lucide-react';
import { Brand } from '../theme';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole }) => {
  const roles = [
    {
      id: UserRole.STUDENT,
      title: 'Student',
      description: 'Access modules, track progress, and join academies.',
      icon: BookOpen,
      color: 'bg-blue-600',
    },
    {
      id: UserRole.EDUCATOR,
      title: 'Educator',
      description: 'Manage courses, evaluate performance, and mentor.',
      icon: Users,
      color: 'bg-green-600',
    },
    {
      id: UserRole.CREATOR,
      title: 'Content Creator',
      description: 'Design educational materials and simulations.',
      icon: PenTool,
      color: 'bg-purple-600',
    },
    {
      id: UserRole.ADMIN,
      title: 'Administrator',
      description: 'Platform management and global analytics.',
      icon: ShieldCheck,
      color: 'bg-slate-700',
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url("${Brand.images.role}")` }}
      ></div>
      {/* Overlay */}
      <div className={`absolute inset-0 ${Brand.colors.overlay} z-10`}></div>

      <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col h-full">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <Brand.Logo size="large" className="mb-6" />
          <h2 className="text-2xl text-white font-light tracking-wide">
            Select Your Profile
          </h2>
          <div className="h-1 w-20 bg-blue-500 mt-4 rounded-full"></div>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {roles.map((role, idx) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`group relative ${Brand.colors.cardGlass} p-6 rounded-xl shadow-2xl transition-all duration-300 text-left flex flex-col hover:scale-[1.02] hover:bg-white animate-fade-in-up`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`w-12 h-12 ${role.color} rounded-lg flex items-center justify-center text-white mb-4 shadow-lg group-hover:shadow-xl transition-all`}>
                <role.icon size={24} />
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-2">{role.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1 opacity-90">{role.description}</p>
              
              <div className="flex items-center text-blue-800 font-bold group-hover:translate-x-2 transition-transform text-xs uppercase tracking-wider">
                <span>Access</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-slate-400 text-xs">
          Secure Access • {Brand.name} System
        </div>
      </div>
    </div>
  );
};