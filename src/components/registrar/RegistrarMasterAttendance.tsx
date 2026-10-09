import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttendanceRecord, AttendanceStatus } from '../../types';
import {
  History,
  Search,
  Filter,
  Trash2,
  Edit2,
  Download,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  X,
  Building,
} from 'lucide-react';

export const RegistrarMasterAttendance: React.FC = () => {
  const {
    attendanceRecords,
    sections,
    students,
    courses,
    instructors,
    updateAttendanceRecord,
    deleteAttendanceRecord,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterSection, setFilterSection] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Edit record state
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [editStatus, setEditStatus] = useState<AttendanceStatus>('Present');
  const [editRemarks, setEditRemarks] = useState('');

  // Metrics
  const totalLogs = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((r) => r.status === 'Present').length;
  const lateCount = attendanceRecords.filter((r) => r.status === 'Late').length;
  const absentCount = attendanceRecords.filter((r) => r.status === 'Absent').length;
  const excusedCount = attendanceRecords.filter((r) => r.status === 'Excused').length;

  const institutionRate =
    totalLogs > 0 ? Math.round(((presentCount + lateCount * 0.75 + excusedCount) / totalLogs) * 100) : 100;

  // Filtered records
  const filtered = attendanceRecords.filter((rec) => {
    if (filterSection !== 'all' && rec.sectionId !== filterSection) return false;
    if (filterStatus !== 'all' && rec.status !== filterStatus) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const student = students.find((s) => s.id === rec.studentId);
      const sec = sections.find((s) => s.id === rec.sectionId);
      return (
        rec.date.includes(q) ||
        (student &&
          (student.fullName.toLowerCase().includes(q) ||
            student.studentId.toLowerCase().includes(q))) ||
        (sec && sec.name.toLowerCase().includes(q)) ||
        (rec.remarks && rec.remarks.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const openEditModal = (rec: AttendanceRecord) => {
    setEditingRecord(rec);
    setEditStatus(rec.status);
    setEditRemarks(rec.remarks || '');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    updateAttendanceRecord(editingRecord.id, editStatus, editRemarks);
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this attendance record from master university archives?')) {
      deleteAttendanceRecord(id);
    }
  };

  const handleExportCSV = () => {
    if (attendanceRecords.length === 0) return;

    const headers = [
      'Record ID',
      'Date',
      'Section',
      'Course',
      'Student ID',
      'Student Name',
      'Status',
      'Remarks',
      'Timestamp',
    ];

    const rows = filtered.map((rec) => {
      const sec = sections.find((s) => s.id === rec.sectionId);
      const course = courses.find((c) => c.id === sec?.courseId);
      const student = students.find((s) => s.id === rec.studentId);

      return [
        rec.id,
        rec.date,
        `"${sec?.name || ''}"`,
        `"${course?.code || ''}"`,
        student?.studentId || '',
        `"${student?.fullName || ''}"`,
        rec.status,
        `"${rec.remarks || ''}"`,
        rec.createdAt,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Master_University_Attendance_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#EEDEEB] shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Master Institutional Attendance Records</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {attendanceRecords.length} Total Logs
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-department audit log, administrative record overrides, and institutional compliance reporting.
          </p>
        </div>

        <button
          id="btn-export-master-csv"
          type="button"
          onClick={handleExportCSV}
          disabled={attendanceRecords.length === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-[#EEDEEB] rounded-xl transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Master CSV</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-[#EEDEEB] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Institution Attendance Rate</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{institutionRate}%</div>
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">Campus Baseline</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EEDEEB] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Total Present Marks</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{presentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">{totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 0}% of all logs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EEDEEB] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Unexcused Absences</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{absentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Requires audit</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#EEDEEB] shadow-2xs">
          <div className="text-[11px] font-medium text-slate-500">Late & Excused Records</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{lateCount + excusedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Approved exceptions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEDEEB] shadow-2xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, ID, class, or date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B3568]"
          />
        </div>

        <div>
          <select
            value={filterSection}
            onChange={(e) => setFilterSection(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Class Sections</option>
            {sections.map((sec) => (
              <option key={sec.id} value={sec.id}>
                {sec.name}
              </option>
            ))}
          </select>
        </div>

        <div>
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
      </div>

      {/* Attendance & Reports Master Table */}
      <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No attendance records matched your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[660px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EEDEEB] text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Class Section</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Remarks</th>
                  <th className="py-3 px-4 text-right">Registrar Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((rec) => {
                  const sec = sections.find((s) => s.id === rec.sectionId);
                  const student = students.find((s) => s.id === rec.studentId);

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
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {rec.date}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {sec?.name || 'Class'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {student?.fullName || 'Student'}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {student?.studentId || ''}
                        </div>
                      </td>
                      <td className="py-3 px-4">{statusBadge}</td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                        {rec.remarks || '—'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {/* Edit attendance record */}
                        <button
                          type="button"
                          onClick={() => openEditModal(rec)}
                          className="p-1.5 text-slate-600 hover:text-[#5B3568] hover:bg-[#FAF0F7] rounded-lg transition-colors inline-flex items-center"
                          title="Administrative Record Override"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete attendance record */}
                        <button
                          type="button"
                          onClick={() => handleDelete(rec.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                          title="Purge Record"
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

      {/* Modal: Edit Master Attendance Record */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full border border-[#EEDEEB] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                Registrar Record Override
              </h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-5 space-y-4 text-xs">
              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-[#EEDEEB]">
                <div>
                  <span className="text-slate-500">Date:</span>{' '}
                  <strong className="text-slate-900">{editingRecord.date}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Record ID:</span>{' '}
                  <span className="font-mono text-[11px] text-slate-700">{editingRecord.id}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Update Official Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Present', 'Late', 'Absent', 'Excused'] as AttendanceStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setEditStatus(st)}
                      className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                        editStatus === st
                          ? 'bg-[#5B3568] text-white border-indigo-600 shadow-xs'
                          : 'border-[#EEDEEB] text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registrar Resolution Remarks
                </label>
                <input
                  type="text"
                  placeholder="e.g. Approved medical certification on file"
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EEDEEB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-lg shadow-xs"
                >
                  Save Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
