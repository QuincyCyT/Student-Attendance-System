import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Clock,
  MapPin,
  Search,
  X,
  UserCheck,
} from 'lucide-react';

export const RegistrarSections: React.FC = () => {
  const {
    sections,
    courses,
    instructors,
    addSection,
    updateSection,
    deleteSection,
    getStudentsBySection,
  } = useApp();

  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || '');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [capacity, setCapacity] = useState(30);

  const openCreateModal = () => {
    setEditingSection(null);
    setName('');
    setCourseId(courses[0]?.id || '');
    setInstructorId(instructors[0]?.id || '');
    setRoom('Room 201');
    setSchedule('MWF 10:00 AM - 11:30 AM');
    setCapacity(35);
    setIsModalOpen(true);
  };

  const openEditModal = (sec: Section) => {
    setEditingSection(sec);
    setName(sec.name);
    setCourseId(sec.courseId);
    setInstructorId(sec.instructorId);
    setRoom(sec.room);
    setSchedule(sec.schedule);
    setCapacity(sec.capacity);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !room.trim() || !schedule.trim()) return;

    if (editingSection) {
      // Update section information
      updateSection(editingSection.id, {
        name: name.trim(),
        courseId,
        instructorId,
        room: room.trim(),
        schedule: schedule.trim(),
        capacity: Number(capacity) || 30,
      });
    } else {
      // Create section
      addSection({
        name: name.trim(),
        courseId,
        instructorId,
        room: room.trim(),
        schedule: schedule.trim(),
        capacity: Number(capacity) || 30,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, _name: string) => {
    // Delete section
    deleteSection(id);
  };

  const filtered = sections.filter((sec) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const course = courses.find((c) => c.id === sec.courseId);
      const instructor = instructors.find((i) => i.id === sec.instructorId);
      return (
        sec.name.toLowerCase().includes(q) ||
        sec.room.toLowerCase().includes(q) ||
        (course && (course.code.toLowerCase().includes(q) || course.title.toLowerCase().includes(q))) ||
        (instructor && instructor.fullName.toLowerCase().includes(q))
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
            <span>Class Sections Master (Registrar)</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
              {sections.length} Sections
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign courses to faculty instructors, configure classrooms, and control class size limits.
          </p>
        </div>

        {/* Add Section Button */}
        <button
          id="btn-add-section"
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEDEEB] shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by section name, instructor, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#5B3568]"
          />
        </div>
      </div>

      {/* View Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sec) => {
          const course = courses.find((c) => c.id === sec.courseId);
          const instructor = instructors.find((i) => i.id === sec.instructorId);
          const enrolled = getStudentsBySection(sec.id);

          return (
            <div
              key={sec.id}
              className="bg-white rounded-2xl border border-[#EEDEEB] p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#FAF0F7] text-[#5B3568] border border-[#EEDEEB] font-mono">
                    {course?.code || 'COURSE'}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Cap: {sec.capacity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900">{sec.name}</h4>
                <div className="text-xs text-slate-500 line-clamp-1">{course?.title}</div>

                <div className="mt-4 space-y-2 pt-3 border-t border-[#F4EAF3] text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-3.5 h-3.5 text-[#5B3568] shrink-0" />
                    <span className="font-medium text-slate-900 truncate">
                      {instructor?.fullName || 'Unassigned Instructor'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sec.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{sec.room}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      <strong className="text-slate-900">{enrolled.length}</strong> enrolled students
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F4EAF3] flex items-center justify-end gap-2">
                {/* Edit section */}
                <button
                  type="button"
                  onClick={() => openEditModal(sec)}
                  className="p-1.5 text-slate-600 hover:text-[#5B3568] hover:bg-[#FAF0F7] rounded-lg transition-colors inline-flex items-center gap-1 text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                {/* Delete section */}
                <button
                  type="button"
                  onClick={() => handleDelete(sec.id, sec.name)}
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

      {/* Modal: Add/Edit Section */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-[#EEDEEB] overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">
                {editingSection ? 'Edit Section Assignment' : 'Create New Class Section'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Section Name / Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CS101-B or Section 3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Curriculum Course *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} — {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned Instructor / Faculty *
                </label>
                <select
                  value={instructorId}
                  onChange={(e) => setInstructorId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {instructors.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.fullName} ({i.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Room Assignment *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hall A - 101"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#5B3568]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Schedule (Days & Time) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MWF 10:00 AM - 11:30 AM"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
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
                  id="btn-save-section"
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#5B3568] hover:bg-[#482853] rounded-lg shadow-xs"
                >
                  {editingSection ? 'Save Changes' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
