export type UserRole = 'instructor' | 'registrar' | 'super_admin';

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  createdAt: string;
}

export interface Student {
  id: string;
  studentId: string; // e.g. "2024-1002"
  fullName: string;
  email: string;
  courseId: string; // e.g. "CS101"
  sectionId: string; // e.g. "SEC-1A"
  yearLevel: string; // "1st Year", "2nd Year", etc.
  status: 'Active' | 'Inactive';
}

export interface Instructor {
  id: string;
  employeeId: string; // e.g. "INS-202"
  fullName: string;
  email: string;
  department: string;
  title: string; // "Associate Professor", "Lecturer", etc.
}

export interface Course {
  id: string;
  code: string; // "CS101"
  title: string; // "Introduction to Computer Science"
  credits: number;
  department: string;
}

export interface Section {
  id: string;
  name: string; // "CS101-A"
  courseId: string;
  instructorId: string; // Assigned instructor
  room: string;
  schedule: string; // "MWF 09:00 AM - 10:30 AM"
  capacity: number;
}

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Excused';

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  sectionId: string;
  studentId: string;
  status: AttendanceStatus;
  remarks?: string;
  markedByUserId?: string;
  createdAt: string;
}

export interface AttendanceSummary {
  studentId: string;
  studentName: string;
  studentCode: string;
  totalSessions: number;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  excusedCount: number;
  percentage: number;
}
