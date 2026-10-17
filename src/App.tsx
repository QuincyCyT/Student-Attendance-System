import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { RegistrarDashboard } from './components/registrar/RegistrarDashboard';

/**
 * ProtectedRoute Guard:
 * Strictly enforces that protected pages and dashboards cannot be viewed
 * without an active, authenticated session. If an unauthenticated user
 * attempts to view or link to a protected route, it immediately resets
 * navigation and renders the LoginScreen.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, setActiveView } = useApp();

  useEffect(() => {
    if (!currentUser) {
      setActiveView('login');
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [currentUser, setActiveView]);

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <LoginScreen />
      </main>
    );
  }

  return <>{children}</>;
};

const MainLayout: React.FC = () => {
  const { currentUser, activeView, setActiveView } = useApp();

  // Authentication & URL hash synchronization with automatic redirection
  useEffect(() => {
    const syncRouteWithHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();

      if (hash === '#signup') {
        setActiveView('signup');
      } else if (hash === '#login' || hash === '') {
        if (!currentUser) {
          setActiveView('login');
        }
      } else if (hash === '#dashboard' || hash === '#home') {
        if (!currentUser) {
          // Prevent direct access to homepage without authentication -> redirect to login
          setActiveView('login');
          window.history.replaceState(null, '', window.location.pathname);
        } else {
          setActiveView('dashboard');
        }
      }
    };

    // Initial check on mount
    syncRouteWithHash();

    window.addEventListener('hashchange', syncRouteWithHash);
    return () => window.removeEventListener('hashchange', syncRouteWithHash);
  }, [currentUser, setActiveView]);

  // Enforce redirection to login if currentUser is cleared or not authenticated
  useEffect(() => {
    if (!currentUser && activeView === 'dashboard') {
      setActiveView('login');
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [currentUser, activeView, setActiveView]);

  // 1. Sign Up View (Publicly accessible form)
  if (activeView === 'signup') {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <SignUpScreen />
      </main>
    );
  }

  // 2. Unauthenticated: Login Page is the Default Landing Page
  // All visitors without a valid session see the login page first.
  if (!currentUser || activeView === 'login') {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <LoginScreen />
      </main>
    );
  }

  // 3. Authenticated: Protected Homepage & Dashboard
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAF4F8] flex flex-col font-sans text-[#27182C] selection:bg-[#5B3765] selection:text-white">
        <Header />
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          {currentUser.role === 'instructor' ? (
            <InstructorDashboard />
          ) : (
            <RegistrarDashboard />
          )}
        </main>

        {/* System footer */}
        <footer className="border-t border-[#EEDEEB] bg-white/80 py-4 mt-auto">
          <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#86688D]">
            <div>
              Students Attendance System • College of Computing Studies • PantherCheck
            </div>
            <div className="flex items-center gap-3">
              <span>Official Academic Attendance & Classroom Governance</span>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
