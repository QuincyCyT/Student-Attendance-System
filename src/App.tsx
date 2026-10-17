import React, { useEffect, useState, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { RegistrarDashboard } from './components/registrar/RegistrarDashboard';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard';
import { Forbidden403 } from './components/Forbidden403';

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
  const [unauthorizedAttempt, setUnauthorizedAttempt] = useState<string | null>(null);
  const currentUserRef = useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Authentication & URL hash synchronization with automatic redirection and route guards
  useEffect(() => {
    const syncRouteWithHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash.toLowerCase();

      // Ensure fresh user check to prevent stale closure on immediate login
      let user = currentUserRef.current;
      if (!user) {
        try {
          const sess = sessionStorage.getItem('sas_current_user') || localStorage.getItem('sas_current_user');
          if (sess) user = JSON.parse(sess);
        } catch {
          // Ignore
        }
      }

      if (hash === '#signup') {
        setActiveView('signup');
        setUnauthorizedAttempt(null);
        return;
      }

      if (hash === '#login' || hash === '') {
        if (!user) {
          setActiveView('login');
          setUnauthorizedAttempt(null);
        }
        return;
      }

      // Check if unauthenticated user is trying to access protected areas
      if (!user) {
        setActiveView('login');
        setUnauthorizedAttempt(null);
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }

      // Route Guards: Check role authorization when user types role-specific URL hashes
      if (hash === '#admin' || hash === '#super-admin') {
        if (user.role !== 'super_admin') {
          setUnauthorizedAttempt('Super Admin');
          return;
        }
      } else if (hash === '#registrar') {
        if (user.role !== 'registrar' && user.role !== 'super_admin') {
          setUnauthorizedAttempt('Registrar');
          return;
        }
      } else if (hash === '#instructor') {
        if (user.role !== 'instructor' && user.role !== 'super_admin') {
          setUnauthorizedAttempt('Instructor');
          return;
        }
      }

      // Clear any unauthorized block if on an authorized path
      setUnauthorizedAttempt(null);
      setActiveView('dashboard');
    };

    // Initial check on mount
    syncRouteWithHash();

    window.addEventListener('hashchange', syncRouteWithHash);
    return () => window.removeEventListener('hashchange', syncRouteWithHash);
  }, [setActiveView]);

  // Enforce redirection to login if currentUser is cleared
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
  if (!currentUser || activeView === 'login') {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <LoginScreen />
      </main>
    );
  }

  // 3. 403 Forbidden Access Guard: User attempted to type an unauthorized portal URL
  if (unauthorizedAttempt) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#FAF4F8] flex flex-col font-sans text-[#27182C]">
          <Header />
          <main className="flex-1 w-full max-w-[1700px] mx-auto px-2.5 sm:px-6 lg:px-8 py-6">
            <Forbidden403
              attemptedRole={unauthorizedAttempt}
              onReturn={() => {
                setUnauthorizedAttempt(null);
                if (typeof window !== 'undefined') {
                  window.location.hash = '#dashboard';
                }
              }}
            />
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  // 4. Authenticated: Protected Homepage & Role-Specific Dashboard
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FAF4F8] flex flex-col font-sans text-[#27182C] selection:bg-[#5B3765] selection:text-white">
        <Header />
        <main className="flex-1 w-full max-w-[1700px] mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-5">
          {currentUser.role === 'super_admin' ? (
            <SuperAdminDashboard />
          ) : currentUser.role === 'registrar' ? (
            <RegistrarDashboard />
          ) : (
            <InstructorDashboard />
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
