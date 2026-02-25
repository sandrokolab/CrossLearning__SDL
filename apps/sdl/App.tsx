import React, { useState } from 'react';
import { ViewState, UserRole, Academy } from './types';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { CoursePortal } from './components/CoursePortal';
import { LiveSession } from './components/LiveSession';
import { ContentCreator } from './components/ContentCreator';
import { Analytics } from './components/Analytics';
import { MobileApps } from './components/MobileApps';
import { SocialLearning } from './components/SocialLearning';
import { AdminPanel } from './components/AdminPanel';
import { RoleSelection } from './components/RoleSelection';
import { AcademySelection } from './components/AcademySelection';
import { PortalSelection } from './components/PortalSelection'; // Import the new component
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  // State for onboarding flow
  // We start at PORTAL_SELECTION now
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.PORTAL_SELECTION);
  
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Handlers for Onboarding ---
  
  const handlePortalValidate = () => {
    // After validating portal, move to Role Selection
    setCurrentView(ViewState.ONBOARDING_ROLE);
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.STUDENT) {
      // Students go to Academy Selection (handled by conditional render logic below view switch)
      // But we can set the view state to reflect intent if we want, 
      // though the original logic relied on userRole && !academy checks.
      // Let's keep consistent with existing logic:
      setCurrentView(ViewState.ONBOARDING_ACADEMY);
    } else {
      // Educators/Creators/Admins go straight to dashboard
      setCurrentView(role === UserRole.ADMIN ? ViewState.ADMIN_PANEL : ViewState.DASHBOARD);
    }
  };

  const handleAcademySelect = (academy: Academy) => {
    setSelectedAcademy(academy);
    setCurrentView(ViewState.DASHBOARD);
  };

  const handleSignOut = () => {
    setUserRole(null);
    setSelectedAcademy(null);
    setCurrentView(ViewState.PORTAL_SELECTION); // Go back to very start
  };

  // --- Conditional Rendering based on Flow ---

  // 1. Portal Selection (First Screen)
  if (currentView === ViewState.PORTAL_SELECTION) {
      return <PortalSelection onValidate={handlePortalValidate} />;
  }

  // 2. Role Selection
  // If we are in role selection state OR (we don't have a role but we passed portal)
  if (currentView === ViewState.ONBOARDING_ROLE || (!userRole && currentView !== ViewState.PORTAL_SELECTION)) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  // 3. Academy Selection (Student only)
  if (userRole === UserRole.STUDENT && !selectedAcademy) {
    return <AcademySelection onSelectAcademy={handleAcademySelect} />;
  }

  // --- Main App Rendering (Logged In) ---

  const renderView = () => {
    switch (currentView) {
      case ViewState.DASHBOARD: return <Dashboard userRole={userRole} academy={selectedAcademy} />;
      case ViewState.COURSES: return <CoursePortal />;
      case ViewState.LIVE_TUTOR: return <LiveSession />;
      case ViewState.CREATOR: return <ContentCreator />;
      case ViewState.ANALYTICS: return <Analytics />;
      case ViewState.MOBILE_APPS: return <MobileApps />;
      case ViewState.SOCIAL: return <SocialLearning />;
      case ViewState.ADMIN_PANEL: return <AdminPanel />;
      default: return <Dashboard userRole={userRole} academy={selectedAcademy} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Navigation (Desktop) */}
      <Navigation 
        currentView={currentView} 
        userRole={userRole} 
        onNavigate={setCurrentView} 
        onSignOut={handleSignOut}
      />

      {/* Mobile Navigation Header */}
      <div className="md:hidden fixed top-0 w-full bg-slate-900 z-50 p-4 flex justify-between items-center text-white">
          <span className="font-bold text-lg">SteelCore</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
             {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 w-full bg-slate-800 z-40 border-b border-slate-700 shadow-xl">
             {[
               { id: ViewState.DASHBOARD, label: 'Dashboard' },
               { id: ViewState.COURSES, label: 'Portal' },
               { id: ViewState.LIVE_TUTOR, label: 'Live' },
               { id: ViewState.SOCIAL, label: 'Social Learning' },
               { id: ViewState.CREATOR, label: 'Studio' },
               { id: ViewState.ANALYTICS, label: 'Analytics' },
               { id: ViewState.MOBILE_APPS, label: 'Mobile Apps' },
               ...(userRole === UserRole.ADMIN ? [{ id: ViewState.ADMIN_PANEL, label: 'Admin Panel' }] : [])
             ].map(item => (
                <button
                    key={item.id}
                    className="block w-full text-left px-6 py-4 text-white hover:bg-slate-700 border-b border-slate-700/50"
                    onClick={() => {
                        setCurrentView(item.id as ViewState);
                        setIsMobileMenuOpen(false);
                    }}
                >
                    {item.label}
                </button>
             ))}
             <button 
                onClick={handleSignOut}
                className="block w-full text-left px-6 py-4 text-red-400 hover:bg-slate-700"
             >
                Switch Profile
             </button>
          </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto h-full">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;