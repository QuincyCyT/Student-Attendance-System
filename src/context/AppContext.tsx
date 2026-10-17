import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Student,
  Instructor,
  Course,
  Section,
  AttendanceRecord,
  AttendanceStatus,
  AttendanceSummary,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_INSTRUCTORS,
  INITIAL_COURSES,
  INITIAL_SECTIONS,
  INITIAL_STUDENTS,
  INITIAL_ATTENDANCE,
} from '../data/seedData';
import {
  seedInitialDatabaseIfEmpty,
  subscribeToUsers,
  subscribeToStudents,
  subscribeToInstructors,
  subscribeToCourses,
  subscribeToSections,
  subscribeToAttendance,
  saveUserToDb,
  addStudentToDb,
  updateStudentInDb,
  deleteStudentFromDb,
  addInstructorToDb,
  updateInstructorInDb,
  deleteInstructorFromDb,
  addCourseToDb,
  updateCourseInDb,
  deleteCourseFromDb,
  addSectionToDb,
  updateSectionInDb,
  deleteSectionFromDb,
  saveAttendanceBatchToDb,
  updateAttendanceRecordInDb,
  deleteAttendanceRecordFromDb,
  deleteAttendanceSessionFromDb,
  resetDatabaseToSampleData,
} from '../services/dbService';
import {
  checkSupabaseStatus,
  subscribeToSupabaseUsers,
  subscribeToSupabaseStudents,
  subscribeToSupabaseInstructors,
  subscribeToSupabaseCourses,
  subscribeToSupabaseSections,
  subscribeToSupabaseAttendance,
} from '../services/supabaseService';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  students: Student[];
  instructors: Instructor[];
  courses: Course[];
  sections: Section[];
  attendanceRecords: AttendanceRecord[];
  activeView: 'login' | 'signup' | 'dashboard';
  setActiveView: (view: 'login' | 'signup' | 'dashboard') => void;
  isDatabaseReady: boolean;
  login: (
    username: string,
    password: string,
    rememberMe?: boolean
  ) => { success: boolean; error?: string };
  signup: (
    userData: Omit<User, 'id' | 'createdAt'>,
    autoLogin?: boolean
  ) => { success: boolean; error?: string; user?: User };
  loginWithGoogle: () => Promise<{ success: boolean; error?: string; cancelled?: boolean }>;
  logout: () => void;
  // Student CRUD
  addStudent: (student: Omit<Student, 'id'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  // Instructor CRUD
  addInstructor: (instructor: Omit<Instructor, 'id'>) => Instructor;
  updateInstructor: (id: string, updates: Partial<Instructor>) => void;
  deleteInstructor: (id: string) => void;
  // Course CRUD
  addCourse: (course: Omit<Course, 'id'>) => Course;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  // Section CRUD (Classes)
  addSection: (section: Omit<Section, 'id'>) => Section;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  // Attendance CRUD
  saveAttendanceBatch: (
    date: string,
    sectionId: string,
    entries: { studentId: string; status: AttendanceStatus; remarks?: string }[]
  ) => void;
  updateAttendanceRecord: (id: string, status: AttendanceStatus, remarks?: string) => void;
  deleteAttendanceRecord: (id: string) => void;
  deleteAttendanceSession: (date: string, sectionId: string) => void;
  // Helpers
  getCourseById: (courseId: string) => Course | undefined;
  getInstructorById: (instructorId: string) => Instructor | undefined;
  getSectionById: (sectionId: string) => Section | undefined;
  getStudentsBySection: (sectionId: string) => Student[];
  getAttendanceSummaryForSection: (sectionId: string) => AttendanceSummary[];
  resetToSampleData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: 'sas_current_user',
  USERS: 'sas_users',
  STUDENTS: 'sas_students',
  INSTRUCTORS: 'sas_instructors',
  COURSES: 'sas_courses',
  SECTIONS: 'sas_sections',
  ATTENDANCE: 'sas_attendance',
};

function mergeById<T extends { id: string }>(existing: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  existing.forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });
  incoming.forEach((item) => {
    if (item && item.id) {
      map.set(item.id, { ...(map.get(item.id) || {}), ...item });
    }
  });
  return Array.from(map.values());
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      // Check session storage first, then local storage
      const sessionSaved = sessionStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      if (sessionSaved) {
        const parsed = JSON.parse(sessionSaved);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.role) {
          return parsed;
        }
      }
      const localSaved = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      if (localSaved) {
        const parsed = JSON.parse(localSaved);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.role) {
          return parsed;
        }
      }
      return null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_USERS, parsed);
        }
      }
      return INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_STUDENTS, parsed);
        }
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [instructors, setInstructors] = useState<Instructor[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.INSTRUCTORS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_INSTRUCTORS, parsed);
        }
      }
      return INITIAL_INSTRUCTORS;
    } catch {
      return INITIAL_INSTRUCTORS;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_COURSES, parsed);
        }
      }
      return INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [sections, setSections] = useState<Section[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SECTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_SECTIONS, parsed);
        }
      }
      return INITIAL_SECTIONS;
    } catch {
      return INITIAL_SECTIONS;
    }
  });

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ATTENDANCE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeById(INITIAL_ATTENDANCE, parsed);
        }
      }
      return INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  // The login page is strictly the default landing page for fresh access.
  const [activeView, setActiveView] = useState<'login' | 'signup' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#signup') return 'signup';
    }
    // Only allow dashboard on initial load if user already has an active authenticated session
    return currentUser ? 'dashboard' : 'login';
  });

  const [isDatabaseReady, setIsDatabaseReady] = useState<boolean>(false);

  // Initialize and seed Firestore database, subscribe to real-time updates
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initDb = async () => {
      try {
        await seedInitialDatabaseIfEmpty();
        setIsDatabaseReady(true);

        const unsubUsers = subscribeToUsers((dbUsers) => {
          if (dbUsers.length > 0) setUsers((prev) => mergeById(prev, dbUsers));
        });
        const unsubStudents = subscribeToStudents((dbStudents) => {
          if (dbStudents.length > 0) setStudents((prev) => mergeById(prev, dbStudents));
        });
        const unsubInstructors = subscribeToInstructors((dbInstructors) => {
          if (dbInstructors.length > 0) setInstructors((prev) => mergeById(prev, dbInstructors));
        });
        const unsubCourses = subscribeToCourses((dbCourses) => {
          if (dbCourses.length > 0) setCourses((prev) => mergeById(prev, dbCourses));
        });
        const unsubSections = subscribeToSections((dbSections) => {
          if (dbSections.length > 0) setSections((prev) => mergeById(prev, dbSections));
        });
        const unsubAtt = subscribeToAttendance((dbAtt) => {
          if (dbAtt.length > 0) setAttendanceRecords((prev) => mergeById(prev, dbAtt));
        });

        unsubs = [
          unsubUsers,
          unsubStudents,
          unsubInstructors,
          unsubCourses,
          unsubSections,
          unsubAtt,
        ];

        // Connect to Realtime subscriptions quietly
        try {
          const supaStatus = await checkSupabaseStatus();
          if (supaStatus.tablesReady) {
            const unsubSupaUsers = subscribeToSupabaseUsers((dbUsers) => {
              if (dbUsers.length > 0) setUsers((prev) => mergeById(prev, dbUsers));
            });
            const unsubSupaStudents = subscribeToSupabaseStudents((dbStudents) => {
              if (dbStudents.length > 0) setStudents((prev) => mergeById(prev, dbStudents));
            });
            const unsubSupaInstructors = subscribeToSupabaseInstructors((dbInstructors) => {
              if (dbInstructors.length > 0) setInstructors((prev) => mergeById(prev, dbInstructors));
            });
            const unsubSupaCourses = subscribeToSupabaseCourses((dbCourses) => {
              if (dbCourses.length > 0) setCourses((prev) => mergeById(prev, dbCourses));
            });
            const unsubSupaSections = subscribeToSupabaseSections((dbSections) => {
              if (dbSections.length > 0) setSections((prev) => mergeById(prev, dbSections));
            });
            const unsubSupaAtt = subscribeToSupabaseAttendance((dbAtt) => {
              if (dbAtt.length > 0) setAttendanceRecords((prev) => mergeById(prev, dbAtt));
            });
            unsubs.push(
              unsubSupaUsers,
              unsubSupaStudents,
              unsubSupaInstructors,
              unsubSupaCourses,
              unsubSupaSections,
              unsubSupaAtt
            );
          }
        } catch {
          // Quiet fallback
        }
      } catch {
        // Quiet fallback
      }
    };

    initDb();

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // Sync active user to session storage
  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        if (localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER)) {
          localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
        }
      } else {
        sessionStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // Safe ignore
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.INSTRUCTORS, JSON.stringify(instructors));
  }, [instructors]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendanceRecords));
  }, [attendanceRecords]);

  // Auth Functions
  const login = (
    username: string,
    password: string,
    rememberMe: boolean = false
  ): { success: boolean; error?: string } => {
    const trimmedUser = username.trim().toLowerCase();
    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === trimmedUser || u.email.toLowerCase() === trimmedUser) &&
        u.password === password
    );

    if (!user) {
      return {
        success: false,
        error: 'Invalid credentials. Please verify your username and password.',
      };
    }

    setCurrentUser(user);
    try {
      if (rememberMe) {
        localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
        localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // Safe ignore
    }
    setActiveView('dashboard');
    if (typeof window !== 'undefined') {
      window.location.hash = '#dashboard';
    }
    return { success: true };
  };

  const signup = (
    userData: Omit<User, 'id' | 'createdAt'>,
    autoLogin: boolean = false
  ): { success: boolean; error?: string; user?: User } => {
    if (!userData.username?.trim()) {
      return { success: false, error: 'Username is required.' };
    }
    if (userData.username.trim().length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long.' };
    }
    if (!userData.password || userData.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    if (!userData.fullName?.trim()) {
      return { success: false, error: 'Full name is required.' };
    }
    if (!userData.email?.includes('@')) {
      return { success: false, error: 'A valid email address is required.' };
    }

    // Check duplicate username or email
    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === userData.username.trim().toLowerCase() ||
        u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'Username or email is already registered.' };
    }

    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      username: userData.username.trim(),
      email: userData.email.trim(),
      fullName: userData.fullName.trim(),
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => {
      const updated = [...prev.filter((u) => u.id !== newUser.id), newUser];
      try {
        localStorage.setItem(LOCAL_STORAGE_KEYS.USERS, JSON.stringify(updated));
      } catch {
        // Safe ignore
      }
      return updated;
    });
    // Save to real Firestore database and Supabase
    saveUserToDb(newUser);

    // If role is instructor, automatically add to instructors directory in Firestore too
    if (newUser.role === 'instructor') {
      const newInst: Instructor = {
        id: `inst-${Date.now()}`,
        employeeId: newUser.employeeId || `INS-${Math.floor(100 + Math.random() * 900)}`,
        fullName: newUser.fullName,
        email: newUser.email,
        department: newUser.department || 'Computer Science',
        title: 'Instructor',
      };
      setInstructors((prev) => [...prev, newInst]);
      addInstructorToDb(newInst);
    }

    if (autoLogin) {
      setCurrentUser(newUser);
      setActiveView('dashboard');
    }

    return { success: true, user: newUser };
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string; cancelled?: boolean }> => {
    try {
      const res = await signInWithPopup(auth, googleAuthProvider);
      const googleUser = res.user;
      const email = googleUser.email || '';
      const fullName = googleUser.displayName || 'Faculty Member';

      // Check if user already exists in database
      let matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (!matchedUser) {
        // Create user in Firestore
        const newUser: User = {
          id: googleUser.uid,
          username: email.split('@')[0] || `user_${Date.now()}`,
          fullName,
          email,
          role: 'instructor',
          department: 'Computer Science',
          employeeId: `INS-${Date.now().toString().slice(-4)}`,
          password: 'oauth_authenticated',
          createdAt: new Date().toISOString(),
        };

        await saveUserToDb(newUser);
        setUsers((prev) => [...prev, newUser]);
        matchedUser = newUser;

        // Also add instructor record
        const newInst: Instructor = {
          id: `inst-${Date.now()}`,
          employeeId: newUser.employeeId || 'INS-101',
          fullName: newUser.fullName,
          email: newUser.email,
          department: newUser.department || 'Computer Science',
          title: 'Instructor',
        };
        await addInstructorToDb(newInst);
        setInstructors((prev) => [...prev, newInst]);
      }

      setCurrentUser(matchedUser);
      try {
        sessionStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER, JSON.stringify(matchedUser));
      } catch {
        // Safe ignore
      }
      setActiveView('dashboard');
      if (typeof window !== 'undefined') {
        window.location.hash = '#dashboard';
      }
      return { success: true };
    } catch (error: any) {
      const errorCode = error?.code || '';
      const errorMessage = error?.message || '';

      // User closed popup or cancelled - intentional user action, do not treat as an application failure
      if (
        errorCode === 'auth/popup-closed-by-user' ||
        errorCode === 'auth/cancelled-popup-request' ||
        errorMessage.includes('popup-closed-by-user') ||
        errorMessage.includes('cancelled-popup-request')
      ) {
        return {
          success: false,
          cancelled: true,
        };
      }

      // Popup blocked by browser policy/iframe
      if (errorCode === 'auth/popup-blocked' || errorMessage.includes('popup-blocked')) {
        return {
          success: false,
          error: 'Sign-in popup was blocked by the browser. Please allow popups or use your email and password below.',
        };
      }

      return {
        success: false,
        error: 'Authentication could not be completed. Please try again or use your password credentials.',
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
      sessionStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER);
    } catch {
      // Safe ignore
    }
    setActiveView('login');
    if (typeof window !== 'undefined') {
      window.location.hash = '';
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id'>): Student => {
    const newStudent: Student = {
      ...studentData,
      id: `stud-${Date.now()}`,
    };
    setStudents((prev) => [newStudent, ...prev]);
    addStudentToDb(newStudent);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    updateStudentInDb(id, updates);
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    setAttendanceRecords((prev) => prev.filter((a) => a.studentId !== id));
    deleteStudentFromDb(id);
  };

  // Instructor CRUD
  const addInstructor = (instData: Omit<Instructor, 'id'>): Instructor => {
    const newInst: Instructor = {
      ...instData,
      id: `inst-${Date.now()}`,
    };
    setInstructors((prev) => [newInst, ...prev]);
    addInstructorToDb(newInst);
    return newInst;
  };

  const updateInstructor = (id: string, updates: Partial<Instructor>) => {
    setInstructors((prev) => prev.map((inst) => (inst.id === id ? { ...inst, ...updates } : inst)));
    updateInstructorInDb(id, updates);
  };

  const deleteInstructor = (id: string) => {
    setInstructors((prev) => prev.filter((inst) => inst.id !== id));
    deleteInstructorFromDb(id);
  };

  // Course CRUD
  const addCourse = (courseData: Omit<Course, 'id'>): Course => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
    };
    setCourses((prev) => [newCourse, ...prev]);
    addCourseToDb(newCourse);
    return newCourse;
  };

  const updateCourse = (id: string, updates: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    updateCourseInDb(id, updates);
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    deleteCourseFromDb(id);
  };

  // Section CRUD (Classes)
  const addSection = (secData: Omit<Section, 'id'>): Section => {
    const newSec: Section = {
      ...secData,
      id: `sec-${Date.now()}`,
    };
    setSections((prev) => [newSec, ...prev]);
    addSectionToDb(newSec);
    return newSec;
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections((prev) => prev.map((sec) => (sec.id === id ? { ...sec, ...updates } : sec)));
    updateSectionInDb(id, updates);
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    setAttendanceRecords((prev) => prev.filter((a) => a.sectionId !== id));
    deleteSectionFromDb(id);
  };

  // Attendance CRUD
  const saveAttendanceBatch = (
    date: string,
    sectionId: string,
    entries: { studentId: string; status: AttendanceStatus; remarks?: string }[]
  ) => {
    const userId = currentUser?.id || 'sys-user';
    const timestamp = new Date().toISOString();

    const filteredExisting = attendanceRecords.filter(
      (rec) => !(rec.date === date && rec.sectionId === sectionId)
    );

    const newRecords: AttendanceRecord[] = entries.map((entry) => ({
      id: `att-${Date.now()}-${entry.studentId}`,
      date,
      sectionId,
      studentId: entry.studentId,
      status: entry.status,
      remarks: entry.remarks || '',
      markedByUserId: userId,
      createdAt: timestamp,
    }));

    setAttendanceRecords([...filteredExisting, ...newRecords]);
    saveAttendanceBatchToDb(newRecords);
  };

  const updateAttendanceRecord = (id: string, status: AttendanceStatus, remarks?: string) => {
    setAttendanceRecords((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status, remarks: remarks ?? rec.remarks } : rec))
    );
    updateAttendanceRecordInDb(id, status, remarks);
  };

  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords((prev) => prev.filter((rec) => rec.id !== id));
    deleteAttendanceRecordFromDb(id);
  };

  const deleteAttendanceSession = (date: string, sectionId: string) => {
    setAttendanceRecords((prev) =>
      prev.filter((rec) => !(rec.date === date && rec.sectionId === sectionId))
    );
    deleteAttendanceSessionFromDb(date, sectionId);
  };

  // Helpers
  const getCourseById = (courseId: string) => courses.find((c) => c.id === courseId);
  const getInstructorById = (instId: string) => instructors.find((i) => i.id === instId);
  const getSectionById = (secId: string) => sections.find((s) => s.id === secId);

  const getStudentsBySection = (sectionId: string) =>
    students.filter((s) => s.sectionId === sectionId);

  const getAttendanceSummaryForSection = (sectionId: string): AttendanceSummary[] => {
    const secStudents = getStudentsBySection(sectionId);
    const secRecords = attendanceRecords.filter((r) => r.sectionId === sectionId);

    const uniqueDates = Array.from(new Set(secRecords.map((r) => r.date)));
    const totalSessions = uniqueDates.length;

    return secStudents.map((stud) => {
      const studentRecs = secRecords.filter((r) => r.studentId === stud.id);
      const presentCount = studentRecs.filter((r) => r.status === 'Present').length;
      const lateCount = studentRecs.filter((r) => r.status === 'Late').length;
      const absentCount = studentRecs.filter((r) => r.status === 'Absent').length;
      const excusedCount = studentRecs.filter((r) => r.status === 'Excused').length;

      const score = presentCount + lateCount * 0.75 + excusedCount * 1.0;
      const percentage =
        totalSessions > 0 ? Math.min(100, Math.round((score / totalSessions) * 100)) : 100;

      return {
        studentId: stud.id,
        studentName: stud.fullName,
        studentCode: stud.studentId,
        totalSessions,
        presentCount,
        absentCount,
        lateCount,
        excusedCount,
        percentage,
      };
    });
  };

  const resetToSampleData = async () => {
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setInstructors(INITIAL_INSTRUCTORS);
    setCourses(INITIAL_COURSES);
    setSections(INITIAL_SECTIONS);
    setAttendanceRecords(INITIAL_ATTENDANCE);
    await resetDatabaseToSampleData();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        students,
        instructors,
        courses,
        sections,
        attendanceRecords,
        activeView,
        setActiveView,
        isDatabaseReady,
        login,
        signup,
        loginWithGoogle,
        logout,
        addStudent,
        updateStudent,
        deleteStudent,
        addInstructor,
        updateInstructor,
        deleteInstructor,
        addCourse,
        updateCourse,
        deleteCourse,
        addSection,
        updateSection,
        deleteSection,
        saveAttendanceBatch,
        updateAttendanceRecord,
        deleteAttendanceRecord,
        deleteAttendanceSession,
        getCourseById,
        getInstructorById,
        getSectionById,
        getStudentsBySection,
        getAttendanceSummaryForSection,
        resetToSampleData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
