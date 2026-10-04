import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import PassportGenerator from './pages/PassportGenerator';
import PassportCard from './components/PassportCard';
import RegistrationForm from './pages/RegistrationForm';
import SuccessPage from './pages/SuccessPage';
import CampusLeague from './pages/CampusLeague';
import CampusCaptain from './pages/CampusCaptain';
import GrowthDashboard from './pages/GrowthDashboard';
import ExperimentLab from './pages/ExperimentLab';
import DecisionLog from './pages/DecisionLog';
import GrowthDecisionCenter from './pages/GrowthDecisionCenter';
import CampaignCopilot from './pages/CampaignCopilot';
import GrowthSimulator from './pages/GrowthSimulator';
import AdminPanel from './pages/AdminPanel';
import ReferralDashboard from './pages/ReferralDashboard';
import RewardsPage from './pages/RewardsPage';

type Page =
  | 'home'
  | 'passport'
  | 'register'
  | 'success'
  | 'referrals'
  | 'rewards'
  | 'campus'
  | 'captain'
  | 'dashboard'
  | 'experiments'
  | 'decisions'
  | 'copilot'
  | 'simulator'
  | 'admin';

import ReviewerDemoModal, { REVIEWER_STEPS } from './components/ReviewerDemoModal';

// Map navigation menu IDs to page IDs
type NavPage = 'home' | 'register' | 'success' | 'referrals' | 'rewards' | 'campus' | 'captain' | 'dashboard' | 'experiments' | 'decisions' | 'copilot' | 'simulator' | 'admin';

function getInitialPage(): Page {
  const params = new URLSearchParams(window.location.search);
  const v = params.get('view') as Page | null;
  return v || 'home';
}

function AppContent() {
  const { state } = useApp();
  const [page, setPage] = useState<Page>(getInitialPage);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [reviewerTourOpen, setReviewerTourOpen] = useState(false);
  const [tourStep, setTourStep] = useState(1);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Parse URL ref/campus/src/view params for attribution and direct navigation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view') as Page | null;
    const ref = params.get('ref');
    const campus = params.get('campus');
    const src = params.get('src');

    if (viewParam) {
      setPage(viewParam);
    } else if (ref || campus || src) {
      setPage('home');
    }
  }, []);

  function navigateTo(navPage: NavPage) {
    if (navPage === 'register') setPage('register');
    else if (navPage === 'success') setPage('success');
    else setPage(navPage as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleSelectTourStep(stepNum: number) {
    setTourStep(stepNum);
    const stepObj = REVIEWER_STEPS[stepNum - 1];
    if (stepObj) {
      navigateTo(stepObj.page as NavPage);
    }
  }

  function handleStartReviewerTour() {
    setTourStep(1);
    setReviewerTourOpen(true);
    navigateTo('home');
  }

  const currentNavPage: NavPage =
    page === 'passport' ? 'home' :
    page === 'success' ? 'success' :
    page as NavPage;

  const { Sidebar, TopBar } = Navigation({
    currentPage: currentNavPage,
    onNavigate: navigateTo,
    onStartReviewerDemo: handleStartReviewerTour,
  });

  function renderPage() {
    switch (page) {
      case 'home':
        return (
          <HomePage
            onNavigate={(p) => navigateTo(p as NavPage)}
            onPassportGenerated={() => setPage('passport')}
            onRegister={() => setPage('register')}
          />
        );
      case 'passport':
        if (!state.currentPassport) { setPage('home'); return null; }
        return (
          <PassportCard
            passport={state.currentPassport}
            onRegister={() => setPage('register')}
            referralCode={new URLSearchParams(window.location.search).get('ref') || undefined}
          />
        );
      case 'register':
        return <RegistrationForm onSuccess={() => setPage('success')} />;
      case 'success':
        return <SuccessPage onExplore={() => setPage('dashboard')} />;
      case 'referrals':
        return <ReferralDashboard onNavigateToRegister={() => setPage('register')} />;
      case 'rewards':
        return <RewardsPage />;
      case 'campus':
        return <CampusLeague />;
      case 'captain':
        return <CampusCaptain />;
      case 'dashboard':
        return <GrowthDashboard />;
      case 'experiments':
        return <ExperimentLab />;
      case 'decisions':
        return <GrowthDecisionCenter />;
      case 'copilot':
        return <CampaignCopilot />;
      case 'simulator':
        return <GrowthSimulator />;
      case 'admin':
        return <AdminPanel />;
      default:
        return null;
    }
  }

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-surface-0)' }}>
        <TopBar />
        <main>
          {renderPage()}
        </main>
        {reviewerTourOpen && (
          <ReviewerDemoModal
            currentStep={tourStep}
            onSelectStep={handleSelectTourStep}
            onClose={() => setReviewerTourOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-surface-0)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto', minHeight: '100vh' }}>
        {renderPage()}
      </main>
      {reviewerTourOpen && (
        <ReviewerDemoModal
          currentStep={tourStep}
          onSelectStep={handleSelectTourStep}
          onClose={() => setReviewerTourOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
