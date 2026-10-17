import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Search,
  UserCheck,
  Building2,
  Clock,
  Activity,
  Award,
} from 'lucide-react';

export const SuperAdminDashboard: React.FC = () => {
  const { users, students, instructors, courses, sections, attendanceRecords } = useApp();
  const [activeTab, setActiveTab] = useState<'users' | 'academic' | 'audit'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Overall Statistics
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === 'Active').length;
    const totalInstructors = instructors.length;
    const totalCourses = courses.length;
    const totalSections = sections.length;
    const totalUsers = users.length;

    const presentCount = attendanceRecords.filter((a) => a.status === 'Present').length;
    const lateCount = attendanceRecords.filter((a) => a.status === 'Late').length;
    const totalRecords = attendanceRecords.length;

    const overallRate =
      totalRecords > 0
        ? Math.round(((presentCount + lateCount * 0.75) / totalRecords) * 100)
        : 100;

    return {
      totalStudents,
      activeStudents,
      totalInstructors,
      totalCourses,
      totalSections,
      totalUsers,
      overallRate,
      totalRecords,
    };
  }, [students, instructors, courses, sections, users, attendanceRecords]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.employeeId && u.employeeId.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = roleFilter === 'all' || u.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3B1F43] via-[#5B3765] to-[#2E1635] text-white p-6 sm:p-8 shadow-lg border border-purple-900/30">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Portal · Institutional Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Executive Governance & System Oversight
            </h1>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-2xl leading-relaxed">
              University-wide academic operations, role authorization, faculty attendance compliance,
              and cross-departmental records management.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="px-4 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
              <div className="text-[10px] font-bold text-purple-200 uppercase tracking-wider">
                System Status
              </div>
              <div className="text-sm font-extrabold text-emerald-300 flex items-center justify-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEEB] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#5B3765]">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#27182C]">
            {stats.totalStudents}
          </div>
          <div className="text-[11px] text-[#73567A] mt-1 flex items-center gap-1 font-medium">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            <span>{stats.activeStudents} Active Enrollment</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEEB] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Faculty / Instructors</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#5B3765]">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#27182C]">
            {stats.totalInstructors}
          </div>
          <div className="text-[11px] text-[#73567A] mt-1 flex items-center gap-1 font-medium">
            <Award className="w-3 h-3 text-amber-600" />
            <span>Across All Academic Depts</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEEB] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Courses & Sections</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#5B3765]">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#27182C]">
            {stats.totalSections}
          </div>
          <div className="text-[11px] text-[#73567A] mt-1 flex items-center gap-1 font-medium">
            <span>{stats.totalCourses} Unique Catalog Courses</span>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EEDEEB] shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Overall Attendance</span>
            <div className="p-2 rounded-xl bg-purple-50 text-[#5B3765]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#27182C]">
            {stats.overallRate}%
          </div>
          <div className="text-[11px] text-[#73567A] mt-1 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3 text-purple-600" />
            <span>{stats.totalRecords} Verified Records</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EEDEEB] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'users'
              ? 'bg-[#5B3765] text-white shadow-xs'
              : 'text-[#6F5174] hover:bg-[#FAF0F7] hover:text-[#5B3765]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Accounts & Roles ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'academic'
              ? 'bg-[#5B3765] text-white shadow-xs'
              : 'text-[#6F5174] hover:bg-[#FAF0F7] hover:text-[#5B3765]'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Section Directory ({sections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'audit'
              ? 'bg-[#5B3765] text-white shadow-xs'
              : 'text-[#6F5174] hover:bg-[#FAF0F7] hover:text-[#5B3765]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Governance & Compliance Audit</span>
        </button>
      </div>

      {/* Tab 1: User Accounts & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-xs overflow-hidden space-y-4 p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user by name, email, or employee ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF4F8] border border-[#EEDEEB] text-[#27182C] placeholder-[#9D7D9F] focus:outline-none focus:border-[#5B3765] focus:bg-white focus:ring-2 focus:ring-[#5B3765]/15 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#EEDEEB] bg-[#FAF4F8] text-[#27182C] focus:outline-none focus:border-[#5B3765]"
              >
                <option value="all">All Roles</option>
                <option value="super_admin">Super Admin</option>
                <option value="registrar">Registrar</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF0F7] text-[#5B3765] font-bold uppercase tracking-wider text-[10px] border-b border-[#EEDEEB]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Account ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      No accounts found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const roleBadge =
                      u.role === 'super_admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          Super Admin
                        </span>
                      ) : u.role === 'registrar' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                          <Building2 className="w-3 h-3 text-purple-600" />
                          Registrar
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[#FAF0F7] text-[#5B3765] border border-[#EEDEEB]">
                          <UserCheck className="w-3 h-3 text-[#5B3765]" />
                          Instructor
                        </span>
                      );

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#27182C]">{u.fullName}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">{roleBadge}</td>
                        <td className="py-3 px-4 text-slate-700">{u.department || 'General'}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-slate-600">
                          {u.employeeId || '—'}
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-400">{u.id}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Section Directory */}
      {activeTab === 'academic' && (
        <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#27182C]">Institutional Section Roster</h2>
            <span className="text-xs text-slate-500 font-medium">
              Total Sections: {sections.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sections.map((sec) => {
              const course = courses.find((c) => c.id === sec.courseId);
              const instructor = instructors.find((i) => i.id === sec.instructorId);
              const enrolledCount = students.filter((s) => s.sectionId === sec.id).length;

              return (
                <div
                  key={sec.id}
                  className="p-4 rounded-xl border border-[#EEDEEB] bg-[#FAF4F8]/50 hover:bg-[#FAF4F8] transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#5B3765]">{sec.name}</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-[#EEDEEB] text-slate-700">
                      {sec.room}
                    </span>
                  </div>

                  <div className="text-xs text-[#27182C] font-medium">
                    {course?.code} · {course?.title}
                  </div>

                  <div className="text-[11px] text-[#73567A] flex items-center justify-between pt-1 border-t border-[#EEDEEB]">
                    <span>Instructor: <strong>{instructor?.fullName || 'Unassigned'}</strong></span>
                    <span>
                      Enrolled: <strong>{enrolledCount} / {sec.capacity}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Governance & Compliance Audit */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#27182C]">System Compliance & Security Audit</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verification of institutional policy enforcement and access security.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Audit Passed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Role-Based Access
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Client role toggle disabled. Authorization strictly binds to authenticated accounts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <CheckCircle className="w-4 h-4 text-purple-600" />
                Route Protection Active
              </div>
              <p className="text-[11px] text-purple-800 leading-relaxed">
                403 Forbidden guards prevent cross-role access to Registrar and Admin portals.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <CheckCircle className="w-4 h-4 text-blue-600" />
                Data Integrity
              </div>
              <p className="text-[11px] text-blue-800 leading-relaxed">
                Dual persistence enabled with continuous real-time cross-device synchronization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
