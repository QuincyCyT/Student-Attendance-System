# PantherCheck — University Student Attendance System 🐾

A modern, role-based Student Attendance and Academic Records Management System built with **React 19**, **TypeScript**, **Tailwind CSS**, and dual-database support featuring **Supabase PostgreSQL** and **Google Cloud Firestore**.

![PantherCheck System](panther_transparent.png)

---

## 🌟 Key Features

### 1. Multi-Role Architecture
- **Instructor Portal**:
  - Daily roll call & attendance marking (Present, Late, Absent, Excused) with live time-stamped remarks.
  - Section-based student rosters with visual attendance percentage counters and risk alerts.
  - Quick status toggles, mass "Mark All Present", and per-student remark notes.
  - Export attendance reports to CSV format.
- **Registrar & Administrative Portal**:
  - Full CRUD management across **Students**, **Instructors**, **Courses**, and **Class Sections**.
  - Student status management (Active, Inactive, On Leave) and academic standing indicators.
  - Real-time university-wide analytics and section capacity monitoring.

### 2. Dual Database & Realtime Sync
- **Supabase PostgreSQL**:
  - Direct connection to Supabase via `@supabase/supabase-js`.
  - Row Level Security (RLS) policies configured for secure access.
  - PostgreSQL Realtime Broadcast for instant updates across devices and browser sessions.
  - Built-in SQL setup runner & modal dialog in the app header.
- **Firebase Firestore**:
  - Cloud Firestore integration with real-time snapshot listeners.
  - Automatic fallback ensuring uninterrupted operation.

### 3. Analytics & Exporting
- Attendance percentage metrics per section and per student.
- At-risk absence detection (students exceeding thresholds).
- CSV export for registrar grading sheets and dean audits.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [Bun](https://bun.sh/)

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/panthercheck-attendance.git
   cd panthercheck-attendance
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase details (or use the pre-configured project):
   ```env
   VITE_SUPABASE_URL="https://cjghzrwmyasithmlekoc.supabase.co"
   VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The application runs on `http://localhost:3000`.

---

## 🗄️ Supabase PostgreSQL Setup

If you are connecting a new Supabase project, execute the SQL schema below in the [Supabase SQL Editor](https://supabase.com/dashboard):

```sql
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

-- Enable Row Level Security (RLS)
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
```

---

## 📁 Project Structure

```
├── public/                 # Static assets & logos
├── src/
│   ├── components/         # React UI Components
│   │   ├── AttendanceSheet.tsx
│   │   ├── Header.tsx
│   │   ├── InstructorDashboard.tsx
│   │   ├── RegistrarDashboard.tsx
│   │   ├── StudentManagementModal.tsx
│   │   ├── CourseManagementModal.tsx
│   │   ├── SectionManagementModal.tsx
│   │   ├── InstructorManagementModal.tsx
│   │   └── SupabaseModal.tsx
│   ├── context/            # React AppContext state & Realtime providers
│   ├── data/               # Seed university data
│   ├── lib/                # Supabase & Firebase client initialization
│   ├── services/           # Supabase & Firestore DB operations
│   ├── types.ts            # TypeScript interfaces & types
│   ├── App.tsx             # Root application component
│   └── main.tsx            # DOM entry point
├── .env.example            # Environment variables template
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build & server configuration
```

---

## 🛠️ Build for Production

To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## 📄 License
This project is licensed under the MIT License.
