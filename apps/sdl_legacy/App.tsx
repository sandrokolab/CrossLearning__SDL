import React, { useState } from 'react';
import { ViewState, UserRole, Academy, Site } from './types';
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
import { PortalSelection } from './components/PortalSelection';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.PORTAL_SELECTION);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [selectedAcademy, setSelectedAcademy] = useState<Academy | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Handlers for Onboarding ---

  const handlePortalValidate = (site: Site) => {
    setSelectedSite(site);
    setCurrentView(ViewState.ONBOARDING_ROLE);
  };

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === UserRole.STUDENT) {
      setCurrentView(ViewState.ONBOARDING_ACADEMY);
    } else {
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
    setSelectedSite(null);
    setCurrentView(ViewState.PORTAL_SELECTION);
  };

  // --- Conditional Rendering based on Flow ---

  if (currentView === ViewState.PORTAL_SELECTION) {
    return <PortalSelection onValidate={handlePortalValidate} />;
  }

  if (currentView === ViewState.ONBOARDING_ROLE || (!userRole && currentView !== ViewState.PORTAL_SELECTION)) {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

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
      <Navigation
        currentView={currentView}
        userRole={userRole}
        onNavigate={setCurrentView}
        onSignOut={handleSignOut}
      />

      <div className="md:hidden fixed top-0 w-full bg-slate-900 z-50 p-4 flex justify-between items-center text-white">
        <span className="font-bold text-lg">SteelCore</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

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

      <main className="flex-1 p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto h-screen">
        <div className="max-w-7xl mx-auto h-full">
          {/* Header with Site Info */}
          <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">SDL Smart Learning</h1>
              <p className="text-slate-500 text-sm">📍 {selectedSite?.name || 'Sitio Global'}</p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-mono tracking-tighter uppercase">
                {userRole}
              </span>
            </div>
          </div>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;