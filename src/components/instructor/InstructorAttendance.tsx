import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceStatus, AttendanceRecord } from '../../types';
import {
  Calendar,
  Check,
  Clock,
  XCircle,
  AlertCircle,
  Save,
  Filter,
  Trash2,
  Edit3,
  Search,
  CheckCheck,
  PlusCircle,
  History,
  X,
} from 'lucide-react';

export const InstructorAttendance: React.FC = () => {
  const {
    currentUser,
    sections,
    instructors,
    courses,
    attendanceRecords,
    getStudentsBySection,
    saveAttendanceBatch,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    deleteAttendanceSession,
  } = useApp();

  // Find instructor
  const currentInstructor = instructors.find(
    (i) =>
      i.email.toLowerCase() === currentUser?.email.toLowerCase() ||
      i.fullName.toLowerCase() === currentUser?.fullName.toLowerCase()
  );
  const instructorId = currentInstructor?.id || 'inst-1';
  const mySections = sections.filter((s) => s.instructorId === instructorId);

  // Sub-mode: 'take' (Create) vs 'view' (Read/Update/Delete)
  const [activeTab, setActiveTab] = useState<'take' | 'logs'>('take');

  // Attendance Form State (Add Attendance)
  const [selectedSectionId, setSelectedSectionId] = useState(mySections[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Current session student statuses
  const currentRoster = useMemo(() => {
    return getStudentsBySection(selectedSectionId);
  }, [selectedSectionId, getStudentsBySection]);

  // Track draft state for the date/section
  const [attendanceDraft, setAttendanceDraft] = useState<
    Record<string, { status: AttendanceStatus; remarks: string }>
  >({});

  // When class or date changes, populate with existing records if already marked
  React.useEffect(() => {
    if (!selectedSectionId || !selectedDate) return;
    const existing = attendanceRecords.filter(
      (r) => r.sectionId === selectedSectionId && r.date === selectedDate
    );

    const initialDraft: Record<string, { status: AttendanceStatus; remarks: string }> = {};
    currentRoster.forEach((stud) => {
      const match = existing.find((r) => r.studentId === stud.id);
      if (match) {
        initialDraft[stud.id] = { status: match.status, remarks: match.remarks || '' };
      } else {
        // Default to Present for convenience
        initialDraft[stud.id] = { status: 'Present', remarks: '' };
      }
    });
    setAttendanceDraft(initialDraft);
  }, [selectedSectionId, selectedDate, currentRoster, attendanceRecords]);

  // Mark all helper
  const handleMarkAll = (status: AttendanceStatus) => {
    const updated = { ...attendanceDraft };
    currentRoster.forEach((stud) => {
      updated[stud.id] = { ...updated[stud.id], status };
    });
    setAttendanceDraft(updated);
  };

  const handleStudentStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { remarks: '' }),
        status,
      },
    }));
  };

  const handleStudentRemarksChange = (studentId: string, remarks: string) => {
    setAttendanceDraft((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || { status: 'Present' }),
        remarks,
      },
    }));
  };

  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Save attendance batch
  const handleSaveAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSectionId || !selectedDate || currentRoster.length === 0) return;

    const entries = currentRoster.map((stud) => {
      const draft = attendanceDraft[stud.id] || { status: 'Present', remarks: '' };
      return {
        studentId: stud.id,
        status: draft.status,
        remarks: draft.remarks,
      };
    });

    saveAttendanceBatch(selectedDate, selectedSectionId, entries);
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  // Logs / View Filters
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Editing single record state
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editRemarks, setEditRemarks] = useState('');

  const mySectionIds = mySections.map((s) => s.id);
  const myRecords = attendanceRecords.filter((r) => mySectionIds.includes(r.sectionId));

  // Filtered Logs
  const filteredRecords = myRecords.filter((rec) => {
    if (filterSection !== 'all' && rec.sectionId !== filterSection) return false;
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const sec = sections.find((s) => s.id === rec.sectionId);
      return (
        rec.date.includes(q) ||
        sec?.name.toLowerCase().includes(q) ||
        (rec.remarks && rec.remarks.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Edit attendance record
  const openEditModal = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setEditStatus(rec.status);
    setEditRemarks(rec.remarks || '');
  };

  const handleUpdateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateAttendanceRecord(editingRecord.id, editStatus, editRemarks);
    setEditingRecord(null);
  };

  // Delete attendance record
  const handleDeleteRecord = (id: string) => {
    deleteAttendanceRecord(id);
  };

  const handleDeleteSession = (date: string, secId: string) => {
    deleteAttendanceSession(date, secId);
  };

  return (
    <div className="space-y-6">
      {/* Top Toggle: Take Attendance vs Logs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5">
        <div>
          <h3 className="text-base font-bold text-[#27182C]">
            Attendance Management
          </h3>
          <p className="text-xs text-[#73567A] mt-0.5">
            Record daily student attendance, review class logs, edit discrepancies, and manage sessions.
          </p>
        </div>

        <div className="flex items-center bg-[#FAF0F7] p-1 rounded-xl border border-[#EEDEEB] text-xs">
          <button
            id="tab-take-attendance"
            type="button"
            onClick={() => setActiveTab('take')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'take'
                ? 'bg-[#5B3568] text-white shadow-xs'
                : 'text-[#6F5174] hover:text-[#5B3568]'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Add Attendance (Session)
          </button>
          <button
            id="tab-view-attendance"
            type="button"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeTab === 'logs'
                ? 'bg-[#5B3568] text-white shadow-xs'
                : 'text-[#6F5174] hover:text-[#5B3568]'
            }`}
          >
            <History className="w-4 h-4" />
            View Attendance Records
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: ADD ATTENDANCE */}
      {activeTab === 'take' && (
        <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5 p-5 space-y-6">
          {/* Controls: Class Selector and Date Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-[#F4EAF3]">
            <div>
              <label className="block text-xs font-semibold text-[#27182C] mb-1">
                Select Class / Section *
              </label>
              <select
                id="select-attendance-class"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3568] focus:outline-none"
              >
                {mySections.map((sec) => {
                  const course = courses.find((c) => c.id === sec.courseId);
                  return (
                    <option key={sec.id} value={sec.id}>
                      {sec.name} ({course?.code})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#27182C] mb-1">
                Session Date *
              </label>
              <input
                id="input-attendance-date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3568] focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkAll('Present')}
                  className="flex-1 py-2 px-2 text-[11px] font-bold text-[#5B3568] bg-[#FAF0F7] hover:bg-[#F2E5EF] border border-[#EEDEEB] rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll('Absent')}
                  className="flex-1 py-2 px-2 text-[11px] font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Success Banner */}
          {saveSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Attendance records successfully saved and synchronized!</span>
            </div>
          )}

          {/* Student Roster List */}
          {currentRoster.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              No students enrolled in this section yet. Registrars can assign students in the Registrar Portal.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[560px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                    <th className="py-3 px-3">Student ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Attendance Status</th>
                    <th className="py-3 px-3">Remarks / Excuse</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRoster.map((student) => {
                    const draft = attendanceDraft[student.id] || {
                      status: 'Present',
                      remarks: '',
                    };

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-mono font-medium text-slate-700">
                          {student.studentId}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">{student.fullName}</div>
                          <div className="text-[11px] text-slate-500">{student.email}</div>
                        </td>
                        <td className="py-3 px-3">
                          {/* Status Options */}
                          <div className="inline-flex rounded-xl border border-[#EEDEEB] p-0.5 bg-[#FAF4F8]">
                            {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map(
                              (st) => {
                                const isSelected = draft.status === st;
                                let activeStyles = '';
                                if (st === 'Present')
                                  activeStyles = 'bg-[#5B3568] text-white font-bold shadow-xs';
                                if (st === 'Late')
                                  activeStyles = 'bg-amber-500 text-white font-bold shadow-xs';
                                if (st === 'Absent')
                                  activeStyles = 'bg-rose-600 text-white font-bold shadow-xs';
                                if (st === 'Excused')
                                  activeStyles = 'bg-[#8E6D96] text-white font-bold shadow-xs';

                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => handleStudentStatusChange(student.id, st)}
                                    className={`px-2.5 py-1 text-[11px] rounded-lg transition-all ${
                                      isSelected
                                        ? activeStyles
                                        : 'text-[#6F5174] hover:text-[#5B3568]'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="text"
                            placeholder="Optional note (e.g. sick leave, late 10m)..."
                            value={draft.remarks}
                            onChange={(e) =>
                              handleStudentRemarksChange(student.id, e.target.value)
                            }
                            className="w-full max-w-xs px-2.5 py-1 text-xs border border-[#EEDEEB] rounded-xl focus:outline-none focus:border-[#5B3568] bg-[#FAF4F8] text-[#27182C]"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Submit Attendance */}
          <div className="pt-4 border-t border-[#F4EAF3] flex items-center justify-between">
            <div className="text-xs text-[#73567A]">
              Session for{' '}
              <span className="font-bold text-[#27182C]">{currentRoster.length} students</span>{' '}
              on <span className="font-bold text-[#27182C]">{selectedDate}</span>
            </div>
            <button
              id="btn-save-attendance-session"
              type="button"
              onClick={handleSaveAttendance}
              disabled={currentRoster.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Attendance Record
            </button>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: VIEW ATTENDANCE */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Filter by Class
              </label>
              <select
                value={filterSection}
                onChange={(e) => setFilterSection(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">All My Classes</option>
                {mySections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
                <option value="Excused">Excused</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Search (Date, Remarks, Class)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. 2025-02 or traffic or CS101..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Records Table */}
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No attendance records found matching filters.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full min-w-[620px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Student</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Remarks</th>
                    <th className="py-3 px-3 text-right">Actions (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((rec) => {
                    const sec = sections.find((s) => s.id === rec.sectionId);
                    const allStudents = mySections.flatMap((s) => getStudentsBySection(s.id));
                    const student = allStudents.find((st) => st.id === rec.studentId);

                    let statusBadge = (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Present
                      </span>
                    );
                    if (rec.status === 'Late') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                          Late
                        </span>
                      );
                    } else if (rec.status === 'Absent') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                          Absent
                        </span>
                      );
                    } else if (rec.status === 'Excused') {
                      statusBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                          Excused
                        </span>
                      );
                    }

                    return (
                      <tr key={rec.id} className="hover:bg-slate-50/60">
                        <td className="py-3 px-3 font-mono font-medium text-slate-700">
                          {rec.date}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {sec?.name || 'Class'}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-slate-900">
                            {student?.fullName || 'Student'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {student?.studentId || ''}
                          </div>
                        </td>
                        <td className="py-3 px-3">{statusBadge}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                          {rec.remarks || '—'}
                        </td>
                        <td className="py-3 px-3 text-right space-x-1.5">
                          {/* Edit attendance */}
                          <button
                            type="button"
                            onClick={() => openEditModal(rec)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-flex items-center"
                            title="Edit Attendance"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete attendance */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRecord(rec.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                            title="Delete Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Edit Attendance */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Edit Attendance Record</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRecord} className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-slate-500">Date:</span>{' '}
                <strong className="text-slate-800">{editingRecord.date}</strong>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Attendance Status *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        editStatus === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Remarks / Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Excused with medical clearance"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
