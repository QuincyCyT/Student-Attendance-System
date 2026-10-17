import { supabase } from '../lib/supabase';
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

// Internal status check without noisy logging
export async function checkSupabaseStatus(): Promise<{
  connected: boolean;
  tablesReady: boolean;
}> {
  try {
    const { error } = await supabase.from(SUPABASE_TABLES.SECTIONS).select('id').limit(1);
    if (!error) {
      return { connected: true, tablesReady: true };
    }
    return { connected: false, tablesReady: false };
  } catch {
    return { connected: false, tablesReady: false };
  }
}

// Seed initial dataset if empty
export async function seedSupabaseIfEmpty(): Promise<boolean> {
  try {
    const { data: existing, error } = await supabase
      .from(SUPABASE_TABLES.SECTIONS)
      .select('id')
      .limit(1);

    if (error) {
      return false;
    }

    if (existing && existing.length > 0) {
      return true;
    }

    // Insert records quietly
    await Promise.allSettled([
      supabase.from(SUPABASE_TABLES.USERS).upsert(INITIAL_USERS),
      supabase.from(SUPABASE_TABLES.INSTRUCTORS).upsert(INITIAL_INSTRUCTORS),
      supabase.from(SUPABASE_TABLES.COURSES).upsert(INITIAL_COURSES),
      supabase.from(SUPABASE_TABLES.SECTIONS).upsert(INITIAL_SECTIONS),
      supabase.from(SUPABASE_TABLES.STUDENTS).upsert(INITIAL_STUDENTS),
      supabase.from(SUPABASE_TABLES.ATTENDANCE).upsert(INITIAL_ATTENDANCE),
    ]);

    return true;
  } catch {
    return false;
  }
}

// Real-time Subscriptions with unique channel IDs to avoid duplicate subscription warnings
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
    } catch {
      // Quiet failover
    }
  };

  fetchAll();

  try {
    // Unique channel identifier per subscription instance prevents "cannot add callbacks after subscribe" error
    const channelId = `sync_${tableName}_${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
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
  } catch {
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
  try {
    await supabase.from(SUPABASE_TABLES.USERS).upsert(user);
  } catch {
    // Quiet failover
  }
}

// Student CRUD
export async function addStudentToSupabase(student: Student): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.STUDENTS).insert(student);
  } catch {
    // Quiet failover
  }
}

export async function updateStudentInSupabase(id: string, updates: Partial<Student>): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.STUDENTS).update(updates).eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteStudentFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.STUDENTS).delete().eq('id', id);
  } catch {
    // Quiet failover
  }
}

// Instructor CRUD
export async function addInstructorToSupabase(instructor: Instructor): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).insert(instructor);
  } catch {
    // Quiet failover
  }
}

export async function updateInstructorInSupabase(id: string, updates: Partial<Instructor>): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).update(updates).eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteInstructorFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).delete().eq('id', id);
  } catch {
    // Quiet failover
  }
}

// Course CRUD
export async function addCourseToSupabase(course: Course): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.COURSES).insert(course);
  } catch {
    // Quiet failover
  }
}

export async function updateCourseInSupabase(id: string, updates: Partial<Course>): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.COURSES).update(updates).eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteCourseFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.COURSES).delete().eq('id', id);
  } catch {
    // Quiet failover
  }
}

// Section CRUD
export async function addSectionToSupabase(section: Section): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.SECTIONS).insert(section);
  } catch {
    // Quiet failover
  }
}

export async function updateSectionInSupabase(id: string, updates: Partial<Section>): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.SECTIONS).update(updates).eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteSectionFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.SECTIONS).delete().eq('id', id);
  } catch {
    // Quiet failover
  }
}

// Attendance CRUD
export async function saveAttendanceBatchToSupabase(records: AttendanceRecord[]): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).upsert(records);
  } catch {
    // Quiet failover
  }
}

export async function updateAttendanceRecordInSupabase(
  id: string,
  status: AttendanceStatus,
  remarks?: string
): Promise<void> {
  try {
    const updates: Partial<AttendanceRecord> = { status };
    if (remarks !== undefined) updates.remarks = remarks;
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).update(updates).eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteAttendanceRecordFromSupabase(id: string): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).delete().eq('id', id);
  } catch {
    // Quiet failover
  }
}

export async function deleteAttendanceSessionFromSupabase(date: string, sectionId: string): Promise<void> {
  try {
    await supabase
      .from(SUPABASE_TABLES.ATTENDANCE)
      .delete()
      .eq('date', date)
      .eq('sectionId', sectionId);
  } catch {
    // Quiet failover
  }
}

// Reset data helper
export async function resetSupabaseToSampleData(): Promise<void> {
  try {
    await supabase.from(SUPABASE_TABLES.ATTENDANCE).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.STUDENTS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.SECTIONS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.COURSES).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.INSTRUCTORS).delete().neq('id', '');
    await supabase.from(SUPABASE_TABLES.USERS).delete().neq('id', '');

    await Promise.allSettled([
      supabase.from(SUPABASE_TABLES.USERS).insert(INITIAL_USERS),
      supabase.from(SUPABASE_TABLES.INSTRUCTORS).insert(INITIAL_INSTRUCTORS),
      supabase.from(SUPABASE_TABLES.COURSES).insert(INITIAL_COURSES),
      supabase.from(SUPABASE_TABLES.SECTIONS).insert(INITIAL_SECTIONS),
      supabase.from(SUPABASE_TABLES.STUDENTS).insert(INITIAL_STUDENTS),
      supabase.from(SUPABASE_TABLES.ATTENDANCE).insert(INITIAL_ATTENDANCE),
    ]);
  } catch {
    // Quiet failover
  }
}
