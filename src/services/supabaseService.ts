import { supabase, SUPABASE_URL } from '../lib/supabase';
import {
  User,
  Student,
  Instructor,
  Course,
  Section,
  AttendanceRecord,
  AttendanceStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_INSTRUCTORS,
  INITIAL_COURSES,
  INITIAL_SECTIONS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
} from '../data/seedData';

export const SUPABASE_TABLES = {
  USERS: 'users',
  STUDENTS: 'students',
  INSTRUCTORS: 'instructors',
  COURSES: 'courses',
  SECTIONS: 'sections',
  ATTENDANCE: 'attendance_records',
};

// SQL Schema for Supabase SQL Editor
export const SUPABASE_SETUP_SQL = `-- PantherCheck Student Attendance System - Supabase Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/cjghzrwmyasithmlekoc/sql/new

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('instructor', 'registrar')),
  "fullName" TEXT NOT NULL,
  department TEXT NOT NULL,
  "employeeId" TEXT NOT NULL,
  password TEXT,
  "createdAt" TEXT NOT NULL
);

-- 2. Instructors Table
CREATE TABLE IF NOT EXISTS public.instructors (
  id TEXT PRIMARY KEY,
  "employeeId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  department TEXT NOT NULL,
  title TEXT NOT NULL
);

-- 3. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  credits INTEGER NOT NULL DEFAULT 3,
  department TEXT NOT NULL
);

-- 4. Sections Table
CREATE TABLE IF NOT EXISTS public.sections (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "instructorId" TEXT NOT NULL,
  room TEXT NOT NULL,
  schedule TEXT NOT NULL,
  capacity INTEGER NOT NULL DEFAULT 30
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  "studentId" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  email TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "sectionId" TEXT NOT NULL,
  "yearLevel" TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active'
);

-- 6. Attendance Records Table
CREATE TABLE IF NOT EXISTS public.attendance_records (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  "sectionId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Late', 'Absent', 'Excused')),
  remarks TEXT DEFAULT '',
  "markedByUserId" TEXT,
  "createdAt" TEXT NOT NULL
);

-- Row Level Security (RLS) & Public access policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on users') THEN
    CREATE POLICY "Allow public access on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on instructors') THEN
    CREATE POLICY "Allow public access on instructors" ON public.instructors FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on courses') THEN
    CREATE POLICY "Allow public access on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on sections') THEN
    CREATE POLICY "Allow public access on sections" ON public.sections FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on students') THEN
    CREATE POLICY "Allow public access on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public access on attendance_records') THEN
    CREATE POLICY "Allow public access on attendance_records" ON public.attendance_records FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Enable Realtime Broadcast for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.instructors;
ALTER PUBLICATION supabase_realtime ADD TABLE public.courses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sections;
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance_records;
`;

// Helper: Check connection and table status
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  tablesReady: boolean;
  error?: string;
}> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.SECTIONS).select('id').limit(1);
    if (!error) {
      return { connected: true, tablesReady: true };
    }
    // PGRST205 indicates table doesn't exist in schema cache
    if (error.code === 'PGRST205' || error.message.includes('Could not find the table')) {
      return { connected: true, tablesReady: false, error: 'Tables not yet created in Supabase.' };
    }
    return { connected: false, tablesReady: false, error: error.message };
  } catch (err: any) {
    return { connected: false, tablesReady: false, error: err?.message || 'Connection failed' };
  }
}

// Seed initial dataset into Supabase if empty
export async function seedSupabaseIfEmpty(): Promise<boolean> {
  try {
    const { data: existing, error } = await supabase
      .from(SUPABASE_TABLES.SECTIONS)
      .select('id')
      .limit(1);

    if (error) {
      console.warn('Supabase check error during seed:', error.message);
      return false;
    }

    if (existing && existing.length > 0) {
      console.log('Supabase already has data populated.');
      return true;
    }

    console.log('Populating initial university dataset to Supabase...');
    // Insert Users
    await supabase.from(SUPABASE_TABLES.USERS).upsert(INITIAL_USERS);
    // Insert Instructors
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).upsert(INITIAL_INSTRUCTORS);
    // Insert Courses
    await supabase.from(SUPABASE_TABLES.COURSES).upsert(INITIAL_COURSES);
    // Insert Sections
    await supabase.from(SUPABASE_TABLES.SECTIONS).upsert(INITIAL_SECTIONS);
    // Insert Students
    await supabase.from(SUPABASE_TABLES.STUDENTS).upsert(INITIAL_STUDENTS);
    // Insert Attendance
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).upsert(INITIAL_ATTENDANCE);

    console.log('Supabase seed successfully completed!');
    return true;
  } catch (err) {
    console.error('Failed to seed Supabase database:', err);
    return false;
  }
}

// Real-time Subscriptions
export function subscribeToSupabaseTable<T>(
  tableName: string,
  onUpdate: (data: T[]) => void
) {
  // Initial fetch
  const fetchAll = async () => {
    try {
      const { data, error } = await supabase.from(tableName).select('*');
      if (!error && data) {
        onUpdate(data as T[]);
      }
    } catch (err) {
      console.warn(`Supabase fetch warning for ${tableName}:`, err);
    }
  };

  fetchAll();

  try {
    // Listen to realtime postgres changes
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: tableName },
        () => {
          fetchAll();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch {
        // Safe ignore
      }
    };
  } catch (err) {
    console.warn(`Supabase realtime subscription warning for ${tableName}:`, err);
    return () => {};
  }
}

// Subscriptions
export const subscribeToSupabaseUsers = (cb: (users: User[]) => void) =>
  subscribeToSupabaseTable<User>(SUPABASE_TABLES.USERS, cb);

export const subscribeToSupabaseStudents = (cb: (students: Student[]) => void) =>
  subscribeToSupabaseTable<Student>(SUPABASE_TABLES.STUDENTS, cb);

export const subscribeToSupabaseInstructors = (cb: (inst: Instructor[]) => void) =>
  subscribeToSupabaseTable<Instructor>(SUPABASE_TABLES.INSTRUCTORS, cb);

export const subscribeToSupabaseCourses = (cb: (courses: Course[]) => void) =>
  subscribeToSupabaseTable<Course>(SUPABASE_TABLES.COURSES, cb);

export const subscribeToSupabaseSections = (cb: (sec: Section[]) => void) =>
  subscribeToSupabaseTable<Section>(SUPABASE_TABLES.SECTIONS, cb);

export const subscribeToSupabaseAttendance = (cb: (rec: AttendanceRecord[]) => void) =>
  subscribeToSupabaseTable<AttendanceRecord>(SUPABASE_TABLES.ATTENDANCE, cb);

// User CRUD
export async function saveUserToSupabase(user: User): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.USERS).upsert(user);
  if (error) console.error('Supabase saveUser error:', error);
}

// Student CRUD
export async function addStudentToSupabase(student: Student): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.STUDENTS).insert(student);
  if (error) console.error('Supabase addStudent error:', error);
}

export async function updateStudentInSupabase(id: string, updates: Partial<Student>): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.STUDENTS).update(updates).eq('id', id);
  if (error) console.error('Supabase updateStudent error:', error);
}

export async function deleteStudentFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.STUDENTS).delete().eq('id', id);
  if (error) console.error('Supabase deleteStudent error:', error);
}

// Instructor CRUD
export async function addInstructorToSupabase(instructor: Instructor): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.INSTRUCTORS).insert(instructor);
  if (error) console.error('Supabase addInstructor error:', error);
}

export async function updateInstructorInSupabase(id: string, updates: Partial<Instructor>): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.INSTRUCTORS).update(updates).eq('id', id);
  if (error) console.error('Supabase updateInstructor error:', error);
}

export async function deleteInstructorFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.INSTRUCTORS).delete().eq('id', id);
  if (error) console.error('Supabase deleteInstructor error:', error);
}

// Course CRUD
export async function addCourseToSupabase(course: Course): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.COURSES).insert(course);
  if (error) console.error('Supabase addCourse error:', error);
}

export async function updateCourseInSupabase(id: string, updates: Partial<Course>): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.COURSES).update(updates).eq('id', id);
  if (error) console.error('Supabase updateCourse error:', error);
}

export async function deleteCourseFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.COURSES).delete().eq('id', id);
  if (error) console.error('Supabase deleteCourse error:', error);
}

// Section CRUD
export async function addSectionToSupabase(section: Section): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.SECTIONS).insert(section);
  if (error) console.error('Supabase addSection error:', error);
}

export async function updateSectionInSupabase(id: string, updates: Partial<Section>): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.SECTIONS).update(updates).eq('id', id);
  if (error) console.error('Supabase updateSection error:', error);
}

export async function deleteSectionFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.SECTIONS).delete().eq('id', id);
  if (error) console.error('Supabase deleteSection error:', error);
}

// Attendance CRUD
export async function saveAttendanceBatchToSupabase(records: AttendanceRecord[]): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.ATTENDANCE).upsert(records);
  if (error) console.error('Supabase saveAttendanceBatch error:', error);
}

export async function updateAttendanceRecordInSupabase(
  id: string,
  status: AttendanceStatus,
  remarks?: string
): Promise<void> {
  const updates: Partial<AttendanceRecord> = { status };
  if (remarks !== undefined) updates.remarks = remarks;
  const { error } = await supabase.from(SUPABASE_TABLES.ATTENDANCE).update(updates).eq('id', id);
  if (error) console.error('Supabase updateAttendanceRecord error:', error);
}

export async function deleteAttendanceRecordFromSupabase(id: string): Promise<void> {
  const { error } = await supabase.from(SUPABASE_TABLES.ATTENDANCE).delete().eq('id', id);
  if (error) console.error('Supabase deleteAttendanceRecord error:', error);
}

export async function deleteAttendanceSessionFromSupabase(date: string, sectionId: string): Promise<void> {
  const { error } = await supabase
    .from(SUPABASE_TABLES.ATTENDANCE)
    .delete()
    .eq('date', date)
    .eq('sectionId', sectionId);
  if (error) console.error('Supabase deleteAttendanceSession error:', error);
}

// Reset Supabase to Sample Data
export async function resetSupabaseToSampleData(): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.STUDENTS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.SECTIONS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.COURSES).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.USERS).delete().neq('id', '');

    await supabase.from(SUPABASE_TABLES.USERS).insert(INITIAL_USERS);
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).insert(INITIAL_INSTRUCTORS);
    await supabase.from(SUPABASE_TABLES.COURSES).insert(INITIAL_COURSES);
    await supabase.from(SUPABASE_TABLES.SECTIONS).insert(INITIAL_SECTIONS);
    await supabase.from(SUPABASE_TABLES.STUDENTS).insert(INITIAL_STUDENTS);
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).insert(INITIAL_ATTENDANCE);
    console.log('Supabase database reset to fresh sample university dataset.');
  } catch (err) {
    console.error('Failed to reset Supabase database:', err);
  }
}
