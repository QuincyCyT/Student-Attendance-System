import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  AlertTriangle,
  CheckCircle,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';

export const InstructorReports: React.FC = () => {
  const {
    currentUser,
    sections,
    instructors,
    courses,
    getStudentsBySection,
    getAttendanceSummaryForSection,
  } = useApp();

  const currentInstructor = instructors.find(
    (i) =>
      i.email.toLowerCase() === currentUser?.email.toLowerCase() ||
      i.fullName.toLowerCase() === currentUser?.fullName.toLowerCase()
  );
  const instructorId = currentInstructor?.id || 'inst-1';
  const mySections = sections.filter((s) => s.instructorId === instructorId);

  const [selectedSectionId, setSelectedSectionId] = useState(mySections[0]?.id || '');

  const activeSection = sections.find((s) => s.id === selectedSectionId);
  const activeCourse = courses.find((c) => c.id === activeSection?.courseId);

  const summaries = selectedSectionId ? getAttendanceSummaryForSection(selectedSectionId) : [];

  const atRiskStudents = summaries.filter((s) => s.percentage < 75);
  const totalStudents = summaries.length;
  const overallAverage =
    totalStudents > 0
      ? Math.round(summaries.reduce((acc, curr) => acc + curr.percentage, 0) / totalStudents)
      : 94;

  // Export CSV handler
  const handleExportCSV = () => {
    if (summaries.length === 0) return;

    const headers = [
      'Student ID',
      'Student Name',
      'Total Sessions',
      'Present',
      'Late',
      'Absent',
      'Excused',
      'Attendance Percentage',
      'Status Flag',
    ];

    const rows = summaries.map((s) => [
      s.studentCode,
      `"${s.studentName}"`,
      s.totalSessions,
      s.presentCount,
      s.lateCount,
      s.absentCount,
      s.excusedCount,
      `${s.percentage}%`,
      s.percentage < 75 ? 'AT RISK' : 'NORMAL',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Attendance_Report_${activeSection?.name || 'Class'}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5">
        <div>
          <h3 className="text-base font-bold text-[#27182C]">
            Attendance Reports & Analytics
          </h3>
          <p className="text-xs text-[#73567A] mt-0.5">
            Evaluate student engagement, identify at-risk absences, and export official reports.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-52">
            <select
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] font-semibold focus:outline-none focus:border-[#5B3568]"
            >
              {mySections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Export to CSV */}
          <button
            id="btn-export-attendance-csv"
            type="button"
            onClick={handleExportCSV}
            disabled={summaries.length === 0}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">Average Class Attendance</div>
            <div className="text-3xl font-extrabold text-[#27182C] mt-1">{overallAverage}%</div>
            <div className="text-[11px] text-[#5B3568] font-bold mt-1">
              Course: {activeCourse?.code || 'CC 101'}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0F7] text-[#5B3568] flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">Enrolled Students</div>
            <div className="text-3xl font-extrabold text-[#27182C] mt-1">{totalStudents > 0 ? totalStudents : 38}</div>
            <div className="text-[11px] text-[#73567A] mt-1 font-medium">Active Class Roster</div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF0F7] text-[#5B3568] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold text-[#8E6D96] uppercase tracking-wider">At-Risk Students (&lt;75%)</div>
            <div
              className={`text-3xl font-extrabold mt-1 ${
                atRiskStudents.length > 0 ? 'text-rose-600' : 'text-[#27182C]'
              }`}
            >
              {atRiskStudents.length}
            </div>
            <div className="text-[11px] text-[#73567A] mt-1 font-medium">Requires Academic Follow-up</div>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              atRiskStudents.length > 0
                ? 'bg-rose-50 text-rose-600'
                : 'bg-[#FAF0F7] text-[#8E6D96]'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* At-Risk Warning Callout (if any) */}
      {atRiskStudents.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs text-rose-900">
            <div className="font-bold">Academic Attendance Warning</div>
            <div className="mt-0.5">
              {atRiskStudents.length} student(s) have attendance rates below the mandatory 75% threshold:{' '}
              {atRiskStudents.map((s) => `${s.studentName} (${s.percentage}%)`).join(', ')}.
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Breakdown Table */}
      <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-xs shadow-purple-950/5 p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8E6D96]">
          Student Attendance Breakdown — {activeSection?.name || 'Class Roster'}
        </h4>

        {summaries.length === 0 ? (
          <div className="text-center py-10 text-[#8E6D96] text-xs">
            No students found in this class section.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[620px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F4EAF3] text-[#5B3568] font-bold uppercase tracking-wider text-[11px] bg-[#FAF0F7]">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3 text-center">Sessions</th>
                  <th className="py-3 px-3 text-center text-emerald-700">Present</th>
                  <th className="py-3 px-3 text-center text-amber-700">Late</th>
                  <th className="py-3 px-3 text-center text-rose-700">Absent</th>
                  <th className="py-3 px-3 text-center text-[#8E6D96]">Excused</th>
                  <th className="py-3 px-3">Attendance Rate</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4EAF3]">
                {summaries.map((s) => {
                  const isAtRisk = s.percentage < 75;

                  return (
                    <tr key={s.studentId} className="hover:bg-[#FAF4F8]">
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#27182C]">{s.studentName}</div>
                        <div className="text-[11px] text-[#86688D] font-mono">{s.studentCode}</div>
                      </td>
                      <td className="py-3 px-3 text-center font-medium text-[#27182C]">
                        {s.totalSessions}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-700">
                        {s.presentCount}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-amber-700">
                        {s.lateCount}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-rose-700">
                        {s.absentCount}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#8E6D96]">
                        {s.excusedCount}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-[#FAF0F7] rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                s.percentage >= 85
                                  ? 'bg-[#5B3568]'
                                  : s.percentage >= 75
                                  ? 'bg-amber-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${s.percentage}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#27182C]">{s.percentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isAtRisk ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            At Risk
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3 h-3" />
                            Good
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
