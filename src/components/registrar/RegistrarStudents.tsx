import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  GraduationCap,
  Mail,
  X,
  CheckCircle2,
} from 'lucide-react';

export const RegistrarStudents: React.FC = () => {
  const { students, courses, sections, addStudent, updateStudent, deleteStudent } = useApp();

  const [search, setSearch] = useState('');
  const [filterSection, setFilterSection] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [sectionId, setSectionId] = useState(sections[0]?.id || '');
  const [yearLevel, setYearLevel] = useState('1st Year');
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const openCreateModal = () => {
    setEditingStudent(null);
    setStudentId(`2024-${Math.floor(10000 + Math.random() * 90000)}`);
    setFullName('');
    setEmail('');
    setCourseId(courses[0]?.id || '');
    setSectionId(sections[0]?.id || '');
    setYearLevel('1st Year');
    setStatus('Active');
    setIsModalOpen(true);
  };

  const openEditModal = (stud: Student) => {
    setEditingStudent(stud);
    setStudentId(stud.studentId);
    setFullName(stud.fullName);
    setEmail(stud.email);
    setCourseId(stud.courseId);
    setSectionId(stud.sectionId);
    setYearLevel(stud.yearLevel);
    setStatus(stud.status);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !fullName.trim() || !email.trim()) return;

    if (editingStudent) {
      // Update student information
      updateStudent(editingStudent.id, {
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        courseId,
        sectionId,
        yearLevel,
        status,
      });
    } else {
      // Create student
      addStudent({
        studentId: studentId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        courseId,
        sectionId,
        yearLevel,
        status,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, _name: string) => {
    // Delete student
    deleteStudent(id);
  };

  // Filtered students
  const filtered = students.filter((stud) => {
    if (filterSection !== 'all' && stud.sectionId !== filterSection) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        stud.fullName.toLowerCase().includes(q) ||
        stud.studentId.toLowerCase().includes(q) ||
        stud.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#EEDEEB] shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Student Directory (Registrar)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {students.length} Total
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add new admissions, assign course sections, update student records, and manage academic enrollment.
          </p>
        </div>

        {/* Add Student Button */}
        <button
          id="btn-add-student"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEDEEB] shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name, ID number, or email..."
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
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No student records found matching current query.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[680px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EEDEEB] text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Course & Section</th>
                  <th className="py-3 px-4">Year Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((stud) => {
                  const course = courses.find((c) => c.id === stud.courseId);
                  const sec = sections.find((s) => s.id === stud.sectionId);

                  return (
                    <tr key={stud.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {stud.studentId}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {stud.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {stud.email}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-[#5B3568]">{course?.code || 'Course'}</span>
                        <span className="text-slate-400 mx-1">•</span>
                        <span className="text-slate-700">{sec?.name || 'Section'}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {stud.yearLevel}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            stud.status === 'Active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {stud.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {/* Edit student */}
                        <button
                          type="button"
                          onClick={() => openEditModal(stud)}
                          className="p-1.5 text-slate-600 hover:text-[#5B3568] hover:bg-[#FAF0F7] rounded-lg transition-colors inline-flex items-center"
                          title="Edit Student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete student */}
                        <button
                          type="button"
                          onClick={() => handleDelete(stud.id, stud.fullName)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                          title="Delete Student"
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

      {/* Modal: Add/Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#EEDEEB] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingStudent ? 'Edit Student Information' : 'Add New Student Record'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="2024-1002"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Year Level
                  </label>
                  <select
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Reed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.r@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Course *
                  </label>
                  <select
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Section Assignment *
                  </label>
                  <select
                    value={sectionId}
                    onChange={(e) => setSectionId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {sections.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enrollment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-3 border-t border-[#EEDEEB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-student"
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-lg shadow-xs"
                >
                  {editingStudent ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
