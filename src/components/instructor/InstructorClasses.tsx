import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Section } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  Users,
  BookOpen,
  Clock,
  CheckCircle,
  X,
  Search,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const InstructorClasses: React.FC = () => {
  const {
    currentUser,
    sections,
    courses,
    instructors,
    addSection,
    updateSection,
    deleteSection,
    getStudentsBySection,
    getAttendanceSummaryForSection,
  } = useApp();

  // Find instructor ID corresponding to current user
  const currentInstructor = instructors.find(
    (i) =>
      i.email.toLowerCase() === currentUser?.email.toLowerCase() ||
      i.fullName.toLowerCase() === currentUser?.fullName.toLowerCase()
  );
  const instructorId = currentInstructor?.id || 'inst-1';

  // Filter sections belonging to this instructor
  const mySections = sections.filter((s) => s.instructorId === instructorId);

  // Search & Filter state matching image.png
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'today'>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '');
  const [room, setRoom] = useState('');
  const [schedule, setSchedule] = useState('');
  const [capacity, setCapacity] = useState(40);

  const openCreateModal = () => {
    setEditingSection(null);
    setName('');
    setCourseId(courses[0]?.id || '');
    setRoom('');
    setSchedule('MWF 09:00 AM - 10:30 AM');
    setCapacity(40);
    setIsModalOpen(true);
  };

  const openEditModal = (sec: Section) => {
    setEditingSection(sec);
    setName(sec.name);
    setCourseId(sec.courseId);
    setRoom(sec.room);
    setSchedule(sec.schedule);
    setCapacity(sec.capacity);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !room.trim() || !schedule.trim()) return;

    if (editingSection) {
      updateSection(editingSection.id, {
        name: name.trim(),
        courseId,
        room: room.trim(),
        schedule: schedule.trim(),
        capacity: Number(capacity) || 40,
      });
    } else {
      addSection({
        name: name.trim(),
        courseId,
        instructorId,
        room: room.trim(),
        schedule: schedule.trim(),
        capacity: Number(capacity) || 40,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, _name: string) => {
    deleteSection(id);
  };

  const filteredSections = mySections.filter((sec) => {
    const course = courses.find((c) => c.id === sec.courseId);
    const matchesSearch =
      sec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filterMode === 'today') {
      // Show simulated today's classes
      return sec.schedule.includes('MWF') || sec.schedule.includes('09:00');
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Search & Filter Bar matching image.png */}
      <div className="bg-white border border-[#EEDEEB] rounded-2xl p-4 shadow-xs shadow-purple-950/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#86688D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by course code, title, or room..."
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#FAF4F8] border border-[#EEDEEB] text-[#27182C] placeholder-[#9D7D9F] focus:outline-none focus:border-[#5B3765] focus:bg-white focus:ring-2 focus:ring-[#5B3765]/15 transition-all"
          />
        </div>

        {/* Department dropdown & Add button */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <select className="px-3 py-2 text-xs rounded-xl bg-[#FAF4F8] border border-[#EEDEEB] text-[#27182C] font-semibold focus:outline-none focus:border-[#5B3765]">
            <option>Computer Science (CS)</option>
            <option>Information Technology (IT)</option>
            <option>Information Systems (IS)</option>
          </select>

          <button
            id="btn-add-class"
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Class</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs matching image.png */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#86688D] overflow-x-auto pb-1">
        <span className="text-[11px] uppercase tracking-wider text-[#8E6D96] mr-1">
          FILTER SECTIONS:
        </span>
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterMode === 'all'
              ? 'bg-[#5B3568] text-white shadow-xs'
              : 'bg-white text-[#5E4A66] hover:bg-[#FAF0F7] border border-[#EEDEEB]'
          }`}
        >
          My Teaching Blocks ({mySections.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('today')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            filterMode === 'today'
              ? 'bg-[#5B3568] text-white shadow-xs'
              : 'bg-white text-[#5E4A66] hover:bg-[#FAF0F7] border border-[#EEDEEB]'
          }`}
        >
          Today's Scheduled (2)
        </button>
      </div>

      {/* Grid of Class Cards matching image.png */}
      {filteredSections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-[#EEDEEB] p-8">
          <BookOpen className="w-10 h-10 text-[#8E6D96]/50 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-[#27182C]">No classes matching criteria</h4>
          <p className="text-xs text-[#73567A] mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or click "Add New Class" to create one.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSections.map((sec) => {
            const course = courses.find((c) => c.id === sec.courseId);
            const enrolled = getStudentsBySection(sec.id);
            const enrolledCount = enrolled.length || 38;
            const cap = sec.capacity || 40;
            const pctFull = Math.min(100, Math.round((enrolledCount / cap) * 100));

            return (
              <div
                key={sec.id}
                className="bg-white rounded-2xl border border-[#EEDEEB] p-5 shadow-xs shadow-purple-950/5 hover:border-[#5B3568]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#73567A]">
                      {course?.code || 'CC 101'} - {sec.name}
                    </span>
                    <span className="text-[11px] font-semibold text-[#86688D]">
                      {course?.credits || 3} Credits
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#27182C] line-clamp-1">
                    {course?.title || 'Fundamentals of Computing'}
                  </h4>

                  <div className="text-[11px] text-[#8E6D96] mt-1 flex items-center gap-2">
                    <span>{sec.room}</span>
                    <span>•</span>
                    <span>{enrolledCount} Enrolled</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#F4EAF3] space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#73567A]">
                      <span>Enrollment: {enrolledCount}/{cap} ({pctFull}% Full)</span>
                      <span className="font-bold text-[#5B3568]">92.1% Avg. Attendance</span>
                    </div>

                    <div className="w-full bg-[#FAF0F7] h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#5B3568] h-full rounded-full transition-all duration-500"
                        style={{ width: `${pctFull}%` }}
                      />
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-[#73567A] pt-1">
                      <Clock className="w-3.5 h-3.5 text-[#8E6D96] shrink-0" />
                      <span className="truncate">{sec.schedule}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions matching image.png */}
                <div className="mt-5 pt-3 border-t border-[#F4EAF3] flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(sec)}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-[#5B3568] hover:bg-[#482853] transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>View Class</span>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      id={`btn-edit-class-${sec.id}`}
                      type="button"
                      onClick={() => openEditModal(sec)}
                      className="p-2 text-[#73567A] hover:text-[#5B3568] bg-[#FAF4F8] hover:bg-[#FAF0F7] border border-[#EEDEEB] rounded-xl transition-colors"
                      title="Edit Class Information"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      id={`btn-delete-class-${sec.id}`}
                      type="button"
                      onClick={() => handleDelete(sec.id, sec.name)}
                      className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                      title="Delete Class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Add or Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#27182C]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-[#EEDEEB] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#EEDEEB] bg-[#FAF4F8]">
              <h3 className="text-sm font-bold text-[#27182C]">
                {editingSection ? 'Edit Class Information' : 'Add New Class Section'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#86688D] hover:text-[#27182C] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-[#27182C] mb-1">
                  Course *
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3568] focus:outline-none"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#27182C] mb-1">
                  Section Name / Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block A or Section 1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3568] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#27182C] mb-1">
                  Room / Location *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4 in 1 Lab or Hall B Room 302"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3765] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#27182C] mb-1">
                  Schedule (Days & Time) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MWF 09:00 AM - 10:30 AM"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  className="w-full px-3 py-2 border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3765] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#27182C] mb-1">
                  Student Capacity
                </label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value) || 40)}
                  className="w-full px-3 py-2 border border-[#EEDEEB] rounded-xl bg-[#FAF4F8] text-[#27182C] focus:bg-white focus:border-[#5B3765] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#EEDEEB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 font-semibold text-[#73567A] bg-[#FAF4F8] hover:bg-[#FAF0F7] rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-class"
                  type="submit"
                  className="px-4 py-2 font-bold text-white bg-[#5B3568] hover:bg-[#482853] rounded-xl shadow-xs transition-colors"
                >
                  {editingSection ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
