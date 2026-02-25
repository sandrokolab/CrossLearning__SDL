import React from 'react';
import { ViewState, UserRole } from '../types';
import { 
  Home, 
  BookOpen, 
  Video, 
  PenTool, 
  BarChart2, 
  LogOut,
  Smartphone,
  Users,
  Settings,
  Shield
} from 'lucide-react';

interface NavigationProps {
  currentView: ViewState;
  userRole: UserRole | null;
  onNavigate: (view: ViewState) => void;
  onSignOut: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, userRole, onNavigate, onSignOut }) => {
  // Define menu items based on role
  const getNavItems = () => {
    const common = [
      { id: ViewState.DASHBOARD, label: 'Dashboard', icon: Home },
    ];

    const social = [
      { id: ViewState.SOCIAL, label: 'Social Learning', icon: Users },
    ];

    const mobileApps = [
      { id: ViewState.MOBILE_APPS, label: 'Mobile Apps', icon: Smartphone },
    ];

    if (userRole === UserRole.ADMIN) {
      return [
        ...common,
        { id: ViewState.ADMIN_PANEL, label: 'Admin Panel', icon: Shield },
        ...social,
        { id: ViewState.ANALYTICS, label: 'Global Reports', icon: BarChart2 },
        ...mobileApps
      ];
    }

    if (userRole === UserRole.CREATOR) {
      return [
        ...common,
        { id: ViewState.CREATOR, label: 'Content Studio', icon: PenTool },
        { id: ViewState.COURSES, label: 'Resource Library', icon: BookOpen },
        ...social,
        { id: ViewState.ANALYTICS, label: 'Usage Stats', icon: BarChart2 },
        ...mobileApps
      ];
    }

    if (userRole === UserRole.EDUCATOR) {
      return [
        ...common,
        { id: ViewState.COURSES, label: 'Manage Courses', icon: BookOpen },
        { id: ViewState.LIVE_TUTOR, label: 'Live Sessions', icon: Video },
        ...social,
        { id: ViewState.ANALYTICS, label: 'Student Performance', icon: BarChart2 },
        ...mobileApps
      ];
    }

    // Default: Student
    return [
      ...common,
      { id: ViewState.COURSES, label: 'Course Portal', icon: BookOpen },
      { id: ViewState.LIVE_TUTOR, label: 'Live Tutor & Peers', icon: Video },
      ...social,
      { id: ViewState.ANALYTICS, label: 'My Progress', icon: BarChart2 },
      ...mobileApps
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen sticky top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          SLP Platform
        </h1>
        <p className="text-xs text-slate-400 mt-1">Smart Learning Platform</p>
        {userRole && (
          <div className="mt-4 px-3 py-1 bg-slate-800 rounded-full text-xs font-semibold inline-block text-blue-200 border border-slate-700">
            {userRole}
          </div>
        )}
      </div>

      <div className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button 
          onClick={onSignOut}
          className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white transition-colors"
        >
          <LogOut size={20} />
          <span>Switch Profile</span>
        </button>
      </div>
    </nav>
  );
};