import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstructorClasses } from './InstructorClasses';
import { InstructorAttendance } from './InstructorAttendance';
import { InstructorReports } from './InstructorReports';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BarChart3,
  LogOut,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Download,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Mail,
  Send,
  Sparkles,
  Search,
} from 'lucide-react';

export const InstructorDashboard: React.FC = () => {
  const {
    currentUser,
    logout,
    sections,
    instructors,
    courses,
    attendanceRecords,
    getStudentsBySection,
    getAttendanceSummaryForSection,
  } = useApp();

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'classes' | 'take-attendance' | 'reports'
  >('dashboard');

  const currentInstructor = instructors.find(
    (i) =>
      i.email.toLowerCase() === currentUser?.email.toLowerCase() ||
      i.fullName.toLowerCase() === currentUser?.fullName.toLowerCase()
  );
  const instructorId = currentInstructor?.id || 'inst-1';
  const mySections = sections.filter((s) => s.instructorId === instructorId);

  // Stats computation
  const totalStudents = mySections.reduce(
    (sum, sec) => sum + getStudentsBySection(sec.id).length,
    0
  );
  const mySectionIds = mySections.map((s) => s.id);
  const myRecords = attendanceRecords.filter((r) => mySectionIds.includes(r.sectionId));
  const totalPresent = myRecords.filter((r) => r.status === 'Present').length;
  const avgAttendance =
    myRecords.length > 0 ? ((totalPresent / myRecords.length) * 100).toFixed(1) : '94.2';

  // Advisory warning toast/modal state
  const [advisorySent, setAdvisorySent] = useState(false);
  const [noticeSentMsg, setNoticeSentMsg] = useState('');

  const handleInitiateAdvisory = () => {
    setAdvisorySent(true);
    setTimeout(() => setAdvisorySent(false), 4000);
  };

  const handleSendNotice = (studentName: string) => {
    setNoticeSentMsg(`Official attendance warning notification dispatched to ${studentName}.`);
    setTimeout(() => setNoticeSentMsg(''), 4000);
  };

  return (
    <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
      {/* =========================================================================
          LEFT SIDEBAR: INSTRUCTOR PORTAL (Matching image.png)
      ========================================================================= */}
      <aside className="w-full lg:w-60 shrink-0 bg-white/90 border border-[#EEDEEB] rounded-2xl p-3 sm:p-4 shadow-xs shadow-purple-950/5 flex flex-col justify-between lg:min-h-[520px]">
        <div className="space-y-2 lg:space-y-4">
          {/* Section Header */}
          <div className="px-2 pt-1 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#8E6D96]">
              Instructor Portal
            </span>
            <span className="text-[10px] text-[#5B3568] font-bold lg:hidden">
              {activeTab === 'dashboard' && 'Dashboard'}
              {activeTab === 'classes' && 'Manage Classes'}
              {activeTab === 'take-attendance' && 'Take Attendance'}
              {activeTab === 'reports' && 'Attendance Report'}
            </span>
          </div>

          {/* Navigation Items - Grid on mobile/tablet, Stacked on desktop */}
          <nav className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1.5">
            <button
              id="sidebar-nav-dashboard"
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="truncate">Dashboard</span>
            </button>

            <button
              id="sidebar-nav-classes"
              type="button"
              onClick={() => setActiveTab('classes')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'classes'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span className="truncate">Classes</span>
            </button>

            <button
              id="sidebar-nav-take-attendance"
              type="button"
              onClick={() => setActiveTab('take-attendance')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'take-attendance'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <ClipboardCheck className="w-4 h-4 shrink-0" />
              <span className="truncate">Attendance</span>
            </button>

            <button
              id="sidebar-nav-reports"
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`w-full flex items-center justify-center lg:justify-start gap-2 lg:gap-3 px-3 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-[#5B3568] text-white shadow-xs'
                  : 'text-[#5E4A66] hover:bg-[#FAF0F7] hover:text-[#5B3568]'
              }`}
            >
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span className="truncate">Reports</span>
            </button>
          </nav>
        </div>

        {/* Bottom: Log Out Button matching image.png (desktop only, mobile has it in header) */}
        <div className="pt-4 border-t border-[#F0E4ED] mt-auto hidden lg:block">
          <button
            id="sidebar-logout"
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
      <main className="flex-1 w-full min-w-0">
        {/* =====================================================================
            VIEW 1: INSTRUCTOR DASHBOARD (Matching image.png first panel)
        ===================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Advisory confirmation toast if initiated */}
            {advisorySent && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dean's Advisory Warning has been officially transmitted for students below 75% attendance threshold.
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">Audit Log Recorded</span>
              </div>
            )}

            {/* Top Welcome Header Banner */}
            <div className="bg-white border border-[#EEDEEB] rounded-2xl p-6 shadow-xs shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider flex items-center gap-2">
                  <span>• INSTRUCTOR PORTAL</span>
                  <span>• First Semester 2026</span>
                  <span>• Saturday, September 12</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#27182C] tracking-tight mt-1">
                  Welcome back, {currentUser?.fullName || 'Dr. Jisoon Tetoom'}
                </h2>
                <p className="text-xs text-[#73567A] font-medium mt-0.5">
                  Bachelor of Science in Computer Science • College of Computing Studies
                </p>
              </div>

              {/* Action Buttons on Right */}
              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  id="btn-take-today-attendance"
                  type="button"
                  onClick={() => setActiveTab('take-attendance')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] shadow-xs transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Take Today's Attendance</span>
                </button>

                <button
                  id="btn-export-attendance"
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-[#5B3568] bg-white hover:bg-[#FAF0F7] border border-[#EEDEEB] transition-all shadow-2xs"
                >
                  <Download className="w-4 h-4 text-[#5B3568]" />
                  <span>Export Attendance</span>
                </button>
              </div>
            </div>

            {/* KPI Stat Cards (4 Cards matching image.png) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Active Classes */}
              <div className="bg-white border border-[#EEDEEB] rounded-2xl p-5 shadow-xs shadow-purple-950/5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">
                    ACTIVE CLASSES
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF0F7] flex items-center justify-center text-[#5B3568]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-[#27182C]">
                    {mySections.length > 0 ? mySections.length : 4}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#73567A] font-medium mt-2 pt-2 border-t border-[#F4EAF3]">
                    <span>{totalStudents > 0 ? totalStudents : 162} Students Enrolled</span>
                    <span className="font-bold text-[#5B3568]">Full Cap 91%</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Today's Presence */}
              <div className="bg-white border border-[#EEDEEB] rounded-2xl p-5 shadow-xs shadow-purple-950/5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">
                    TODAY'S PRESENCE
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-[#27182C]">{avgAttendance}%</span>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      +1.8%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#73567A] font-medium mt-2 pt-2 border-t border-[#F4EAF3]">
                    <span>Prev Week: 92.4%</span>
                    <span className="font-bold text-emerald-700">On Target</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Total Enrolled */}
              <div className="bg-white border border-[#EEDEEB] rounded-2xl p-5 shadow-xs shadow-purple-950/5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">
                    TOTAL ENROLLED
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#FAF0F7] flex items-center justify-center text-[#5B3568]">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-[#27182C]">
                    {totalStudents > 0 ? totalStudents : 58}
                  </div>
                  <div className="w-full bg-[#FAF0F7] h-1.5 rounded-full mt-3 overflow-hidden">
                    <div className="bg-[#5B3568] h-full rounded-full w-full" />
                  </div>
                  <div className="text-[10px] text-right font-bold text-[#8E6D96] mt-1">100%</div>
                </div>
              </div>

              {/* Card 4: Attendance Flags */}
              <div className="bg-white border border-[#EEDEEB] rounded-2xl p-5 shadow-xs shadow-purple-950/5 flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">
                    ATTENDANCE FLAGS
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-700">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-rose-700">
                    2 <span className="text-xs font-bold text-[#73567A]">sections &lt; 90%</span>
                  </div>
                  <div className="text-[11px] text-[#73567A] font-medium mt-2 pt-2 border-t border-[#F4EAF3] flex items-center gap-1 text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Requires registrar review</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Lecture Schedule & Quick Attendance matching image.png */}
            <div className="bg-white border border-[#EEDEEB] rounded-2xl p-6 shadow-xs shadow-purple-950/5">
              <div className="flex items-center justify-between pb-4 border-b border-[#F4EAF3] mb-5">
                <h3 className="text-sm font-bold text-[#27182C] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#5B3568]" />
                  <span>Today's Lecture Schedule & Quick Attendance</span>
                </h3>
                <span className="text-xs font-semibold text-[#8E6D96]">
                  2 Classes Scheduled Today
                </span>
              </div>

              {/* 3 Schedule Cards Row matching image.png */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Class 1: Completed */}
                <div className="rounded-xl border border-[#EEDEEB] p-4 bg-[#FAF4F8] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        • Completed • 09:00 AM - 10:30 AM
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#73567A] mt-1">
                      CC 101 - Block B
                    </div>
                    <h4 className="text-sm font-extrabold text-[#27182C] mt-0.5">
                      Fundamentals of Computing
                    </h4>
                    <p className="text-[11px] text-[#8E6D96] mt-1">
                      4 in 1 Lab • 38 Enrolled
                    </p>

                    <div className="mt-3 pt-2 border-t border-[#EEDEEB] text-[11px] text-[#5B3568] font-semibold">
                      Final Attendance: 35 Present Status: (92.1%)
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('take-attendance')}
                    className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold text-[#5B3568] bg-white border border-[#EEDEEB] hover:bg-[#FAF0F7] transition-all"
                  >
                    View & Edit Attendance
                  </button>
                </div>

                {/* Class 2: Scheduled - Active (Android App Dev) */}
                <div className="rounded-xl border-2 border-[#5B3568] p-4 bg-white shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                        Scheduled • Starts in 45m • 02:00 PM - 03:30 PM
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#73567A] mt-1">
                      CS ProfElect 1B - SECTION B
                    </div>
                    <h4 className="text-sm font-extrabold text-[#27182C] mt-0.5">
                      Android Application Development
                    </h4>
                    <p className="text-[11px] text-[#8E6D96] mt-1">
                      Lab 1 • 23 Enrolled
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('take-attendance')}
                    className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Take Attendance Now</span>
                  </button>
                </div>

                {/* Class 3: Upcoming (Machine Learning) */}
                <div className="rounded-xl border border-[#EEDEEB] p-4 bg-white flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0F7] text-[#5B3568] border border-[#EEDEEB]">
                        Upcoming • 04:00 PM - 05:30 PM
                      </span>
                    </div>
                    <div className="text-[11px] font-bold text-[#73567A] mt-1">
                      CS 102 - SECTION C
                    </div>
                    <h4 className="text-sm font-extrabold text-[#27182C] mt-0.5">
                      Machine Learning
                    </h4>
                    <p className="text-[11px] text-[#8E6D96] mt-1">
                      LAB 1 • 21 Enrolled
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('take-attendance')}
                    className="mt-4 w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>Take Attendance</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Warning for Drop out matching image.png */}
            <div className="bg-white border border-[#EEDEEB] rounded-2xl p-6 shadow-xs shadow-purple-950/5">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4EAF3] mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block animate-pulse" />
                    <h3 className="text-sm font-bold text-[#27182C]">
                      Warning for Drop out
                    </h3>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                      2 Flagged
                    </span>
                  </div>
                  <p className="text-xs text-[#73567A] mt-1">
                    Students under mandatory 75% department curricular threshold.
                  </p>
                </div>
              </div>

              {/* Notice Confirmation Toast */}
              {noticeSentMsg && (
                <div className="mb-4 p-3 rounded-xl bg-purple-50 border border-purple-200 text-[#5B3568] text-xs font-medium flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#5B3568] shrink-0" />
                  <span>{noticeSentMsg}</span>
                </div>
              )}

              {/* Student Rows */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-[#F4EAF3] bg-[#FAF4F8] gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-rose-200 mt-0.5 sm:mt-0">
                      FL
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#27182C] flex flex-wrap items-center gap-2">
                        <span>Fritz Khizel G. Ladiao</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          68.2%
                        </span>
                      </div>
                      <div className="text-[11px] text-[#73567A] mt-0.5">
                        • 4 Unexcused Absences • CC 101 - Fundamentals of Computing
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E4ED]">
                    <button
                      type="button"
                      onClick={() => handleSendNotice('Fritz Khizel G. Ladiao')}
                      className="p-1.5 rounded-lg border border-[#EEDEEB] bg-white text-[#5B3568] hover:bg-[#FAF0F7] flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-2"
                      title="Send warning notice"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="sm:hidden text-[11px]">Send Warning</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-[#F4EAF3] bg-[#FAF4F8] gap-3">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-rose-200 mt-0.5 sm:mt-0">
                      NP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#27182C] flex flex-wrap items-center gap-2">
                        <span>Nikkor B. Per</span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          64.0%
                        </span>
                      </div>
                      <div className="text-[11px] text-[#73567A] mt-0.5">
                        • 4 Unexcused Absences • CS ProfElect 1B - Android Application Dev
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F0E4ED]">
                    <button
                      type="button"
                      onClick={() => handleSendNotice('Nikkor B. Per')}
                      className="p-1.5 rounded-lg border border-[#EEDEEB] bg-white text-[#5B3568] hover:bg-[#FAF0F7] flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-2"
                      title="Send warning notice"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span className="sm:hidden text-[11px]">Send Warning</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#F4EAF3] text-right">
                <button
                  type="button"
                  onClick={handleInitiateAdvisory}
                  className="py-2 px-4 rounded-xl text-xs font-bold text-[#5B3568] bg-white hover:bg-[#FAF0F7] border border-[#EEDEEB] transition-all"
                >
                  Initiate Dean's Advisory Warning
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            VIEW 2: MANAGE CLASSES (Matching image.png middle panel)
        ===================================================================== */}
        {activeTab === 'classes' && <InstructorClasses />}

        {/* =====================================================================
            VIEW 3: TAKE ATTENDANCE (Matching image.png third panel)
        ===================================================================== */}
        {activeTab === 'take-attendance' && <InstructorAttendance />}

        {/* =====================================================================
            VIEW 4: ATTENDANCE REPORT
        ===================================================================== */}
        {activeTab === 'reports' && <InstructorReports />}
      </main>
    </div>
  );
};
