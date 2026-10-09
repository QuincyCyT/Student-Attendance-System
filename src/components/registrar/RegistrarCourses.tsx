import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Course } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Search,
  X,
  Layers,
} from 'lucide-react';

export const RegistrarCourses: React.FC = () => {
  const { courses, sections, addCourse, updateCourse, deleteCourse } = useApp();

  const [search, setSearch] = useState('');

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [credits, setCredits] = useState(3);
  const [department, setDepartment] = useState('Computer Science');

  const openCreateModal = () => {
    setEditingCourse(null);
    setCode('');
    setTitle('');
    setCredits(3);
    setDepartment('Computer Science');
    setIsModalOpen(true);
  };

  const openEditModal = (c: Course) => {
    setEditingCourse(c);
    setCode(c.code);
    setTitle(c.title);
    setCredits(c.credits);
    setDepartment(c.department);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !department.trim()) return;

    if (editingCourse) {
      // Update course information
      updateCourse(editingCourse.id, {
        code: code.trim().toUpperCase(),
        title: title.trim(),
        credits: Number(credits) || 3,
        department: department.trim(),
      });
    } else {
      // Create course
      addCourse({
        code: code.trim().toUpperCase(),
        title: title.trim(),
        credits: Number(credits) || 3,
        department: department.trim(),
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, _code: string) => {
    // Delete course
    deleteCourse(id);
  };

  const filtered = courses.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.code.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q)
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
            <span>Course Catalog (Registrar)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {courses.length} Courses
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add academic subjects, define curriculum credit units, and manage academic departments.
          </p>
        </div>

        {/* Add Course Button */}
        <button
          id="btn-add-course"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEDEEB] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by course code, title, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B3568]"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((course) => {
          const courseSections = sections.filter((s) => s.courseId === course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-[#EEDEEB] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#FAF0F7] text-[#5B3568] border border-[#EEDEEB]">
                    {course.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {course.credits} Units
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-1">{course.title}</h4>
                <div className="text-xs text-slate-500 mt-0.5">{course.department}</div>

                <div className="mt-4 pt-3 border-t border-[#F4EAF3] flex items-center gap-1.5 text-xs text-slate-600">
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    <strong className="text-slate-900">{courseSections.length}</strong> Active Section(s)
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4EAF3] flex items-center justify-end gap-2">
                {/* Edit course */}
                <button
                  type="button"
                  onClick={() => openEditModal(course)}
                  className="p-1.5 text-slate-600 hover:text-[#5B3568] hover:bg-[#FAF0F7] rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {/* Delete course */}
                <button
                  type="button"
                  onClick={() => handleDelete(course.id, course.code)}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add/Edit Course */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#EEDEEB] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingCourse ? 'Edit Course Subject' : 'Add New Course Subject'}
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
                    Course Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="CS305"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568] uppercase font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Credit Units *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={credits}
                    onChange={(e) => setCredits(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Database Systems Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Department *
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
                  id="btn-save-course"
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-lg shadow-xs"
                >
                  {editingCourse ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
