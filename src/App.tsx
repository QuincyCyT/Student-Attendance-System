import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { InstructorDashboard } from './components/instructor/InstructorDashboard';
import { RegistrarDashboard } from './components/registrar/RegistrarDashboard';

const MainLayout: React.FC = () => {
  const { currentUser, activeView } = useApp();

  if (activeView === 'signup') {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <SignUpScreen />
      </main>
    );
  }

  if (!currentUser || activeView === 'login') {
    return (
      <main className="min-h-screen bg-[#FFF7FB] font-sans text-slate-900 selection:bg-[#5B3765] selection:text-[#FFF7FB]">
        <LoginScreen />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF4F8] flex flex-col font-sans text-[#27182C] selection:bg-[#5B3765] selection:text-white">
      <Header />
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-2.5 sm:px-6 lg:px-8 py-3.5 sm:py-5">
        {currentUser.role === 'instructor' ? (
          <InstructorDashboard />
        ) : (
          <RegistrarDashboard />
        )}
      </main>

      {/* Footer referencing the system layout */}
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
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
