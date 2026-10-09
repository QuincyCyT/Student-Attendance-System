import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RegistrarStudents } from './RegistrarStudents';
import { RegistrarInstructors } from './RegistrarInstructors';
import { RegistrarCourses } from './RegistrarCourses';
import { RegistrarSections } from './RegistrarSections';
import { RegistrarMasterAttendance } from './RegistrarMasterAttendance';
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  History,
  ShieldCheck,
  Building2,
  Sparkles,
  LogOut,
} from 'lucide-react';

export const RegistrarDashboard: React.FC = () => {
  const { currentUser, logout, students, instructors, courses, sections, attendanceRecords } = useApp();

  const [activeTab, setActiveTab] = useState<
    'students' | 'instructors' | 'courses' | 'sections' | 'attendance'
  >('students');

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
      {/* =========================================================================
          LEFT SIDEBAR: REGISTRAR PORTAL
      ========================================================================= */}
      <aside className="w-full lg:w-60 shrink-0 bg-white/90 border border-[#EEDEEB] rounded-2xl p-3 sm:p-4 shadow-xs shadow-purple-950/5 flex flex-col justify-between lg:min-h-[520px]">
        <div className="space-y-2 lg:space-y-4">
          <div className="px-2 pt-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8E6D96]">
              Registrar Portal
            </span>
            <span className="text-[10px] text-[#5B3568] font-bold lg:hidden capitalize">
              {activeTab === 'attendance' ? 'Master Attendance' : activeTab}
            </span>
          </div>

          <nav className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-1 gap-1.5">
            <button
              id="sidebar-reg-students"
              type="button"
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'students'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="truncate">Students</span>
            </button>

            <button
              id="sidebar-reg-instructors"
              type="button"
              onClick={() => setActiveTab('instructors')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'instructors'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span className="truncate">Instructors</span>
            </button>

            <button
              id="sidebar-reg-courses"
              type="button"
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'courses'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Courses</span>
            </button>

            <button
              id="sidebar-reg-sections"
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sections'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0" />
              <span className="truncate">Sections</span>
            </button>

            <button
              id="sidebar-reg-attendance"
              type="button"
              onClick={() => setActiveTab('attendance')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'attendance'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <History className="w-4 h-4 shrink-0" />
              <span className="truncate">Attendance</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Log Out Button (Desktop only, mobile has it in top header) */}
        <div className="pt-4 border-t border-[#F0E4ED] mt-auto hidden lg:block">
          <button
            id="sidebar-reg-logout"
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MAIN CONTENT AREA
      ========================================================================= */}
      <main className="flex-1 w-full min-w-0 space-y-6">
        {/* Top Banner */}
        <div className="bg-white border border-[#EEDEEB] rounded-2xl p-6 shadow-xs shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF0F7] text-[#5B3568] text-xs font-bold border border-[#EEDEEB]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Registrar Administration Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#27182C] tracking-tight">
              Welcome, {currentUser?.fullName || 'Registrar'}
            </h2>
            <p className="text-xs text-[#73567A] max-w-xl font-medium">
              Office of the University Registrar • Master authority for institutional student admissions, faculty appointments, curriculum courses, sections, and global attendance audits.
            </p>
          </div>

          {/* Global Numbers */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 flex-wrap">
            <div className="bg-[#FAF4F8] px-3.5 py-2.5 rounded-xl border border-[#EEDEEB] text-center min-w-18">
              <div className="text-lg font-extrabold text-[#27182C]">{students.length}</div>
              <div className="text-[10px] text-[#8E6D96] font-bold">Students</div>
            </div>
            <div className="bg-[#FAF4F8] px-3.5 py-2.5 rounded-xl border border-[#EEDEEB] text-center min-w-18">
              <div className="text-lg font-extrabold text-[#5B3568]">{instructors.length}</div>
              <div className="text-[10px] text-[#8E6D96] font-bold">Faculty</div>
            </div>
            <div className="bg-[#FAF4F8] px-3.5 py-2.5 rounded-xl border border-[#EEDEEB] text-center min-w-18">
              <div className="text-lg font-extrabold text-[#27182C]">{courses.length}</div>
              <div className="text-[10px] text-[#8E6D96] font-bold">Courses</div>
            </div>
            <div className="bg-[#FAF4F8] px-3.5 py-2.5 rounded-xl border border-[#EEDEEB] text-center min-w-18">
              <div className="text-lg font-extrabold text-[#5B3568]">{sections.length}</div>
              <div className="text-[10px] text-[#8E6D96] font-bold">Sections</div>
            </div>
          </div>
        </div>

        {/* Tab Panels */}
        <div>
          {activeTab === 'students' && <RegistrarStudents />}
          {activeTab === 'instructors' && <RegistrarInstructors />}
          {activeTab === 'courses' && <RegistrarCourses />}
          {activeTab === 'sections' && <RegistrarSections />}
          {activeTab === 'attendance' && <RegistrarMasterAttendance />}
        </div>
      </main>
    </div>
  );
};
