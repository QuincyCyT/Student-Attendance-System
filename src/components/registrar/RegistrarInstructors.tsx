import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Instructor } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  UserCheck,
  Building,
  Mail,
  X,
  BookOpen,
} from 'lucide-react';

export const RegistrarInstructors: React.FC = () => {
  const { instructors, sections, addInstructor, updateInstructor, deleteInstructor } = useApp();

  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [title, setTitle] = useState('Assistant Professor');

  const departments = Array.from(new Set(instructors.map((i) => i.department)));

  const openCreateModal = () => {
    setEditingInstructor(null);
    setEmployeeId(`INS-${Math.floor(100 + Math.random() * 900)}`);
    setFullName('');
    setEmail('');
    setDepartment('Computer Science');
    setTitle('Assistant Professor');
    setIsModalOpen(true);
  };

  const openEditModal = (inst: Instructor) => {
    setEditingInstructor(inst);
    setEmployeeId(inst.employeeId);
    setFullName(inst.fullName);
    setEmail(inst.email);
    setDepartment(inst.department);
    setTitle(inst.title);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim() || !fullName.trim() || !email.trim()) return;

    if (editingInstructor) {
      // Update instructor information
      updateInstructor(editingInstructor.id, {
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        title: title.trim(),
      });
    } else {
      // Create instructor
      addInstructor({
        employeeId: employeeId.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        department: department.trim(),
        title: title.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, _name: string) => {
    // Delete instructor
    deleteInstructor(id);
  };

  const filtered = instructors.filter((inst) => {
    if (filterDept !== 'all' && inst.department !== filterDept) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inst.fullName.toLowerCase().includes(q) ||
        inst.employeeId.toLowerCase().includes(q) ||
        inst.email.toLowerCase().includes(q) ||
        inst.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#EEDEEB] shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Faculty & Instructors Directory</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {instructors.length} Instructors
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage academic personnel, credentials, department affiliations, and teaching assignments.
          </p>
        </div>

        {/* Add Instructor Button */}
        <button
          id="btn-add-instructor"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Instructor
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEDEEB] shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by instructor name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B3568]"
          />
        </div>

        <div>
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Instructors Table */}
      <div className="bg-white rounded-2xl border border-[#EEDEEB] shadow-2xs overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No instructors found.
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2 sm:mx-0">
            <table className="w-full min-w-[650px] text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#EEDEEB] text-slate-500 font-semibold uppercase tracking-wider text-[11px] bg-slate-50/50">
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Faculty Name</th>
                  <th className="py-3 px-4">Title / Rank</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Assigned Classes</th>
                  <th className="py-3 px-4 text-right">Actions (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((inst) => {
                  const assignedClasses = sections.filter((s) => s.instructorId === inst.id);

                  return (
                    <tr key={inst.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {inst.employeeId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{inst.fullName}</div>
                        <div className="text-[11px] text-slate-500">{inst.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {inst.title}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-[#EEDEEB]">
                          {inst.department}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{assignedClasses.length}</span>
                        <span className="text-slate-500 ml-1">Classes</span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5">
                        {/* Edit instructor */}
                        <button
                          type="button"
                          onClick={() => openEditModal(inst)}
                          className="p-1.5 text-slate-600 hover:text-[#5B3568] hover:bg-[#FAF0F7] rounded-lg transition-colors inline-flex items-center"
                          title="Edit Instructor"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete instructor */}
                        <button
                          type="button"
                          onClick={() => handleDelete(inst.id, inst.fullName)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                          title="Delete Instructor"
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

      {/* Modal: Add/Edit Instructor */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#EEDEEB] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingInstructor ? 'Edit Instructor Information' : 'Add New Faculty Member'}
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
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="INS-104"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Academic Rank / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Associate Professor"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jennifer Lawrence"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="j.lawrence@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Academic Department *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                />
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
                  id="btn-save-instructor"
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-lg shadow-xs"
                >
                  {editingInstructor ? 'Save Changes' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
