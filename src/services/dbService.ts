import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import * as SupabaseSync from './supabaseService';
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

export const COLLECTIONS = {
  USERS: 'users',
  STUDENTS: 'students',
  INSTRUCTORS: 'instructors',
  COURSES: 'courses',
  SECTIONS: 'sections',
  ATTENDANCE: 'attendanceRecords',
};

// Seed initial database records if empty
export async function seedInitialDatabaseIfEmpty() {
  try {
    const sectionsSnap = await getDocs(collection(db, COLLECTIONS.SECTIONS));
    if (!sectionsSnap.empty) {
      console.log('Database already initialized with records.');
      return;
    }

    console.log('Seeding initial university data into Firestore...');
    const batch = writeBatch(db);

    // Initial users
    INITIAL_USERS.forEach((u) => {
      const ref = doc(db, COLLECTIONS.USERS, u.id);
      batch.set(ref, u);
    });

    // Initial instructors
    INITIAL_INSTRUCTORS.forEach((inst) => {
      const ref = doc(db, COLLECTIONS.INSTRUCTORS, inst.id);
      batch.set(ref, inst);
    });

    // Initial courses
    INITIAL_COURSES.forEach((c) => {
      const ref = doc(db, COLLECTIONS.COURSES, c.id);
      batch.set(ref, c);
    });

    // Initial sections
    INITIAL_SECTIONS.forEach((s) => {
      const ref = doc(db, COLLECTIONS.SECTIONS, s.id);
      batch.set(ref, s);
    });

    // Initial students
    INITIAL_STUDENTS.forEach((st) => {
      const ref = doc(db, COLLECTIONS.STUDENTS, st.id);
      batch.set(ref, st);
    });

    // Initial attendance
    INITIAL_ATTENDANCE.forEach((att) => {
      const ref = doc(db, COLLECTIONS.ATTENDANCE, att.id);
      batch.set(ref, att);
    });

    await batch.commit();
    console.log('Firestore seed completed successfully!');
    // Attempt Supabase seed if tables ready
    SupabaseSync.seedSupabaseIfEmpty().catch(() => {});
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'initial_seed');
  }
}

// Subscribe to real-time changes
export function subscribeToUsers(onUpdate: (users: User[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.USERS),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as User));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.USERS);
    }
  );
}

export function subscribeToStudents(onUpdate: (students: Student[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.STUDENTS),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Student));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.STUDENTS);
    }
  );
}

export function subscribeToInstructors(onUpdate: (instructors: Instructor[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.INSTRUCTORS),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Instructor));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.INSTRUCTORS);
    }
  );
}

export function subscribeToCourses(onUpdate: (courses: Course[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.COURSES),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Course));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.COURSES);
    }
  );
}

export function subscribeToSections(onUpdate: (sections: Section[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.SECTIONS),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as Section));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.SECTIONS);
    }
  );
}

export function subscribeToAttendance(onUpdate: (records: AttendanceRecord[]) => void) {
  return onSnapshot(
    collection(db, COLLECTIONS.ATTENDANCE),
    (snapshot) => {
      const list = snapshot.docs.map((d) => ({ ...d.data(), id: d.id } as AttendanceRecord));
      onUpdate(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.ATTENDANCE);
    }
  );
}

// User CRUD
export async function saveUserToDb(user: User): Promise<void> {
  SupabaseSync.saveUserToSupabase(user).catch(() => {});
  try {
    await setDoc(doc(db, COLLECTIONS.USERS, user.id), user, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.USERS}/${user.id}`);
  }
}

// Student CRUD
export async function addStudentToDb(student: Student): Promise<void> {
  SupabaseSync.addStudentToSupabase(student).catch(() => {});
  try {
    await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.STUDENTS}/${student.id}`);
  }
}

export async function updateStudentInDb(id: string, updates: Partial<Student>): Promise<void> {
  SupabaseSync.updateStudentInSupabase(id, updates).catch(() => {});
  try {
    await updateDoc(doc(db, COLLECTIONS.STUDENTS, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.STUDENTS}/${id}`);
  }
}

export async function deleteStudentFromDb(id: string): Promise<void> {
  SupabaseSync.deleteStudentFromSupabase(id).catch(() => {});
  try {
    await deleteDoc(doc(db, COLLECTIONS.STUDENTS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.STUDENTS}/${id}`);
  }
}

// Instructor CRUD
export async function addInstructorToDb(instructor: Instructor): Promise<void> {
  SupabaseSync.addInstructorToSupabase(instructor).catch(() => {});
  try {
    await setDoc(doc(db, COLLECTIONS.INSTRUCTORS, instructor.id), instructor);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.INSTRUCTORS}/${instructor.id}`);
  }
}

export async function updateInstructorInDb(id: string, updates: Partial<Instructor>): Promise<void> {
  SupabaseSync.updateInstructorInSupabase(id, updates).catch(() => {});
  try {
    await updateDoc(doc(db, COLLECTIONS.INSTRUCTORS, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.INSTRUCTORS}/${id}`);
  }
}

export async function deleteInstructorFromDb(id: string): Promise<void> {
  SupabaseSync.deleteInstructorFromSupabase(id).catch(() => {});
  try {
    await deleteDoc(doc(db, COLLECTIONS.INSTRUCTORS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.INSTRUCTORS}/${id}`);
  }
}

// Course CRUD
export async function addCourseToDb(course: Course): Promise<void> {
  SupabaseSync.addCourseToSupabase(course).catch(() => {});
  try {
    await setDoc(doc(db, COLLECTIONS.COURSES, course.id), course);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.COURSES}/${course.id}`);
  }
}

export async function updateCourseInDb(id: string, updates: Partial<Course>): Promise<void> {
  SupabaseSync.updateCourseInSupabase(id, updates).catch(() => {});
  try {
    await updateDoc(doc(db, COLLECTIONS.COURSES, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.COURSES}/${id}`);
  }
}

export async function deleteCourseFromDb(id: string): Promise<void> {
  SupabaseSync.deleteCourseFromSupabase(id).catch(() => {});
  try {
    await deleteDoc(doc(db, COLLECTIONS.COURSES, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.COURSES}/${id}`);
  }
}

// Section CRUD
export async function addSectionToDb(section: Section): Promise<void> {
  SupabaseSync.addSectionToSupabase(section).catch(() => {});
  try {
    await setDoc(doc(db, COLLECTIONS.SECTIONS, section.id), section);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${COLLECTIONS.SECTIONS}/${section.id}`);
  }
}

export async function updateSectionInDb(id: string, updates: Partial<Section>): Promise<void> {
  SupabaseSync.updateSectionInSupabase(id, updates).catch(() => {});
  try {
    await updateDoc(doc(db, COLLECTIONS.SECTIONS, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.SECTIONS}/${id}`);
  }
}

export async function deleteSectionFromDb(id: string): Promise<void> {
  SupabaseSync.deleteSectionFromSupabase(id).catch(() => {});
  try {
    await deleteDoc(doc(db, COLLECTIONS.SECTIONS, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.SECTIONS}/${id}`);
  }
}

// Attendance CRUD
export async function saveAttendanceBatchToDb(records: AttendanceRecord[]): Promise<void> {
  SupabaseSync.saveAttendanceBatchToSupabase(records).catch(() => {});
  try {
    const batch = writeBatch(db);
    records.forEach((record) => {
      const ref = doc(db, COLLECTIONS.ATTENDANCE, record.id);
      batch.set(ref, record);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTIONS.ATTENDANCE);
  }
}

export async function updateAttendanceRecordInDb(
  id: string,
  status: AttendanceStatus,
  remarks?: string
): Promise<void> {
  SupabaseSync.updateAttendanceRecordInSupabase(id, status, remarks).catch(() => {});
  try {
    const updates: Partial<AttendanceRecord> = { status };
    if (remarks !== undefined) updates.remarks = remarks;
    await updateDoc(doc(db, COLLECTIONS.ATTENDANCE, id), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.ATTENDANCE}/${id}`);
  }
}

export async function deleteAttendanceRecordFromDb(id: string): Promise<void> {
  SupabaseSync.deleteAttendanceRecordFromSupabase(id).catch(() => {});
  try {
    await deleteDoc(doc(db, COLLECTIONS.ATTENDANCE, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.ATTENDANCE}/${id}`);
  }
}

export async function deleteAttendanceSessionFromDb(date: string, sectionId: string): Promise<void> {
  SupabaseSync.deleteAttendanceSessionFromSupabase(date, sectionId).catch(() => {});
  try {
    const q = query(
      collection(db, COLLECTIONS.ATTENDANCE),
      where('date', '==', date),
      where('sectionId', '==', sectionId)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((docItem) => {
      batch.delete(docItem.ref);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, COLLECTIONS.ATTENDANCE);
  }
}

// Reset entire database to initial sample state
export async function resetDatabaseToSampleData(): Promise<void> {
  SupabaseSync.resetSupabaseToSampleData().catch(() => {});
  try {
    const batch = writeBatch(db);

    // Delete existing records in collections
    const collectionsToReset = [
      COLLECTIONS.USERS,
      COLLECTIONS.STUDENTS,
      COLLECTIONS.INSTRUCTORS,
      COLLECTIONS.COURSES,
      COLLECTIONS.SECTIONS,
      COLLECTIONS.ATTENDANCE,
    ];

    for (const colName of collectionsToReset) {
      const snap = await getDocs(collection(db, colName));
      snap.docs.forEach((d) => batch.delete(d.ref));
    }

    // Re-seed
    INITIAL_USERS.forEach((u) => batch.set(doc(db, COLLECTIONS.USERS, u.id), u));
    INITIAL_INSTRUCTORS.forEach((i) => batch.set(doc(db, COLLECTIONS.INSTRUCTORS, i.id), i));
    INITIAL_COURSES.forEach((c) => batch.set(doc(db, COLLECTIONS.COURSES, c.id), c));
    INITIAL_SECTIONS.forEach((s) => batch.set(doc(db, COLLECTIONS.SECTIONS, s.id), s));
    INITIAL_STUDENTS.forEach((st) => batch.set(doc(db, COLLECTIONS.STUDENTS, st.id), st));
    INITIAL_ATTENDANCE.forEach((a) => batch.set(doc(db, COLLECTIONS.ATTENDANCE, a.id), a));

    await batch.commit();
    console.log('Database reset to fresh sample university dataset.');
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'reset_database');
  }
}
