import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AppNotification } from '../../types';
import {
  Bell,
  AlertTriangle,
  Clock,
  Users,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Check,
  CheckCheck,
  X,
  ShieldAlert,
} from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const {
    currentUser,
    sections,
    students,
    instructors,
    users,
    attendanceRecords,
    getStudentsBySection,
    getAttendanceSummaryForSection,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Storage key for user-specific read notification IDs
  const storageKey = `sas_read_notifs_${currentUser?.id || 'guest'}`;

  const [readIds, setReadIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(readIds));
    } catch {
      // Ignore storage errors
    }
  }, [readIds, storageKey]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Compute live notifications based on current role and database state
  const notifications: AppNotification[] = useMemo(() => {
    if (!currentUser) return [];

    const notifs: AppNotification[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // ==========================================
    // 1. INSTRUCTOR TRIGGERS
    // ==========================================
    if (currentUser.role === 'instructor' || currentUser.role === 'super_admin') {
      const currentInstructor = instructors.find(
        (i) =>
          i.email.toLowerCase() === currentUser.email.toLowerCase() ||
          i.fullName.toLowerCase() === currentUser.fullName.toLowerCase()
      );
      const instructorId = currentInstructor?.id || 'inst-1';
      const mySections = sections.filter(
        (s) => s.instructorId === instructorId || currentUser.role === 'super_admin'
      );

      // Trigger A: Absence Risk / Dropout Warnings (3+ absences or <80% attendance)
      mySections.forEach((sec) => {
        const summaries = getAttendanceSummaryForSection(sec.id);
        summaries.forEach((summary) => {
          if (summary.absentCount >= 2 || (summary.totalSessions >= 2 && summary.percentage < 80)) {
            notifs.push({
              id: `notif-risk-${sec.id}-${summary.studentId}`,
              type: 'risk',
              title: `Absence Risk Alert · ${summary.studentName}`,
              message: `${summary.studentName} has accumulated ${summary.absentCount} absence(s) (${summary.percentage}% attendance rate) in ${sec.name} — Dean alert threshold reached.`,
              timestamp: 'Critical Warning',
              priority: 'high',
              isRead: readIds.includes(`notif-risk-${sec.id}-${summary.studentId}`),
              metadata: {
                studentId: summary.studentId,
                sectionId: sec.id,
              },
            });
          }
        });

        // Trigger B: Roll Call Pending Reminders (if schedule exists but no attendance recorded for today)
        const hasAttendanceToday = attendanceRecords.some(
          (rec) => rec.sectionId === sec.id && rec.date === todayStr
        );

        if (!hasAttendanceToday) {
          notifs.push({
            id: `notif-reminder-${sec.id}-${todayStr}`,
            type: 'reminder',
            title: `Roll Call Pending · ${sec.name}`,
            message: `Attendance has not yet been recorded today for ${sec.name} (${sec.schedule}) in ${sec.room}.`,
            timestamp: 'Action Needed',
            priority: 'medium',
            isRead: readIds.includes(`notif-reminder-${sec.id}-${todayStr}`),
            metadata: {
              sectionId: sec.id,
            },
          });
        }

        // Trigger C: Roster Updates (Section enrollment headcount status)
        const secStudents = getStudentsBySection(sec.id);
        if (secStudents.length > 0) {
          notifs.push({
            id: `notif-roster-${sec.id}`,
            type: 'roster',
            title: `Roster Active · ${sec.name}`,
            message: `${secStudents.length} active students enrolled in ${sec.name} (${sec.room}). Verified by registrar.`,
            timestamp: 'Section Sync',
            priority: 'info',
            isRead: readIds.includes(`notif-roster-${sec.id}`),
            metadata: {
              sectionId: sec.id,
            },
          });
        }
      });
    }

    // ==========================================
    // 2. REGISTRAR & SUPER ADMIN TRIGGERS
    // ==========================================
    if (currentUser.role === 'registrar' || currentUser.role === 'super_admin') {
      // Trigger A: New Faculty Account Approvals / Roster Notifications
      const instructorUsers = users.filter((u) => u.role === 'instructor');
      instructorUsers.forEach((instUser) => {
        notifs.push({
          id: `notif-faculty-${instUser.id}`,
          type: 'approval',
          title: `Faculty Account Active · ${instUser.fullName}`,
          message: `${instUser.fullName} (${instUser.department || 'Computer Science'}) account registered and assigned in faculty roster.`,
          timestamp: 'Faculty Directory',
          priority: 'info',
          isRead: readIds.includes(`notif-faculty-${instUser.id}`),
        });
      });

      // Trigger B: Section Capacity Limit Warnings (>= 85% or 90%+ capacity)
      sections.forEach((sec) => {
        const enrolledCount = students.filter((s) => s.sectionId === sec.id).length;
        const capacityRatio = sec.capacity > 0 ? enrolledCount / sec.capacity : 0;

        if (capacityRatio >= 0.85) {
          const percentage = Math.round(capacityRatio * 100);
          notifs.push({
            id: `notif-capacity-${sec.id}`,
            type: 'capacity',
            title: `Capacity Warning · ${sec.name}`,
            message: `${sec.name} is near maximum capacity with ${enrolledCount}/${sec.capacity} students enrolled (${percentage}%). Consider opening a parallel section.`,
            timestamp: `${percentage}% Enrolled`,
            priority: percentage >= 95 ? 'high' : 'medium',
            isRead: readIds.includes(`notif-capacity-${sec.id}`),
            metadata: {
              sectionId: sec.id,
            },
          });
        }
      });

      // Trigger C: Daily At-Risk Audit Summary (University-Wide attendance audit)
      let universityAtRiskCount = 0;
      sections.forEach((sec) => {
        const summaries = getAttendanceSummaryForSection(sec.id);
        summaries.forEach((s) => {
          if (s.absentCount >= 2 || (s.totalSessions >= 2 && s.percentage < 80)) {
            universityAtRiskCount++;
          }
        });
      });

      notifs.push({
        id: `notif-audit-${todayStr}`,
        type: 'audit',
        title: 'Daily At-Risk Attendance Audit',
        message: `${universityAtRiskCount} student(s) across College of Computing Studies have breached absence alert policies requiring dean review.`,
        timestamp: 'Daily Digest',
        priority: universityAtRiskCount > 0 ? 'high' : 'info',
        isRead: readIds.includes(`notif-audit-${todayStr}`),
      });
    }

    return notifs;
  }, [
    currentUser,
    sections,
    students,
    instructors,
    users,
    attendanceRecords,
    getStudentsBySection,
    getAttendanceSummaryForSection,
    readIds,
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((n) =>
    filter === 'unread' ? !n.isRead : true
  );

  const markAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      setReadIds((prev) => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadIds(Array.from(new Set([...readIds, ...allIds])));
  };

  const getNotificationIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case 'reminder':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'roster':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'approval':
        return <UserCheck className="w-4 h-4 text-emerald-600" />;
      case 'capacity':
        return <Building2 className="w-4 h-4 text-amber-600" />;
      case 'audit':
        return <FileSpreadsheet className="w-4 h-4 text-[#5B3765]" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#5B3765]" />;
    }
  };

  const getPriorityBadge = (priority: AppNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-purple-50 text-[#5B3765] border-purple-200';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        id="btn-notification-bell"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-[#86688D] hover:text-[#5B3765] hover:bg-[#FAF0F7] rounded-xl transition-colors relative cursor-pointer"
        title="Notifications & Academic Alerts"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 bg-rose-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-xs animate-in zoom-in-50">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div
          id="notification-popover"
          className="absolute right-0 mt-2 w-[340px] sm:w-[410px] bg-white rounded-2xl border border-[#EEDEEB] shadow-2xl shadow-purple-950/15 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* Header */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-[#FAF2F8] to-white border-b border-[#EEDEEB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#5B3765] text-white flex items-center justify-center font-bold shadow-xs">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[#27182C]">Academic Alerts</h3>
                <p className="text-[10px] text-[#86688D]">
                  {currentUser?.role === 'instructor'
                    ? 'Faculty Roll Call & Absence Risk Monitor'
                    : 'Registrar & College Governance Monitor'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Subheader / Tabs & Quick Action */}
          <div className="px-3 py-2 bg-white border-b border-[#F5EAF3] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 bg-[#FAF2F8] p-0.5 rounded-lg border border-purple-100">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all ${
                  filter === 'all'
                    ? 'bg-[#5B3765] text-white shadow-xs'
                    : 'text-[#5B3765] hover:bg-white/80'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-2 py-0.5 rounded-md font-semibold text-[11px] transition-all ${
                  filter === 'unread'
                    ? 'bg-[#5B3765] text-white shadow-xs'
                    : 'text-[#5B3765] hover:bg-white/80'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#5B3765] hover:text-[#3B1F45] transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-[#FAF0F7]">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center mb-2 border border-emerald-200">
                  <Check className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">All Caught Up!</div>
                <div className="text-[11px] text-slate-500 mt-0.5 max-w-[240px] mx-auto">
                  {filter === 'unread'
                    ? 'No unread notifications at this time.'
                    : 'No active attendance alerts or risk warnings for your profile.'}
                </div>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`p-3 sm:p-3.5 transition-colors cursor-pointer flex items-start gap-2.5 sm:gap-3 ${
                    notif.isRead
                      ? 'bg-white hover:bg-[#FAF4F8]'
                      : 'bg-[#FAF0F7]/60 hover:bg-[#FAF0F7]'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
                      notif.type === 'risk'
                        ? 'bg-rose-50 border-rose-200'
                        : notif.type === 'reminder'
                        ? 'bg-purple-50 border-purple-200'
                        : notif.type === 'capacity'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-indigo-50 border-indigo-200'
                    }`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs font-bold truncate ${
                          notif.isRead ? 'text-slate-800' : 'text-[#5B3765]'
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span
                        className={`shrink-0 text-[9.5px] font-bold px-1.5 py-0.5 rounded-full border ${getPriorityBadge(
                          notif.priority
                        )}`}
                      >
                        {notif.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug break-words">
                      {notif.message}
                    </p>
                  </div>

                  {/* Unread Indicator Dot */}
                  {!notif.isRead && (
                    <span className="w-2 h-2 rounded-full bg-[#5B3765] shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-[#FAF2F8] border-t border-[#EEDEEB] text-center text-[10.5px] text-[#86688D]">
            College of Computing Studies • PantherCheck System
          </div>
        </div>
      )}
    </div>
  );
};
