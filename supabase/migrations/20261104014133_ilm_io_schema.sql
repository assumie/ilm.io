/*
# ilm.io — Core Schema

## Overview
Creates the full database schema for ilm.io, an AI teaching assistant for
Malaysian classrooms. One teacher uploads a lesson; the system generates
five accessible learning formats in five languages; students choose a
format and learn. This is a single-tenant demo app with no authentication,
so all tables are readable/writable by the anon + authenticated roles.

## New Tables

1. `teachers` — Teacher accounts (demo, no auth)
   - id (uuid, PK)
   - name (text)
   - email (text, unique)
   - created_at (timestamptz)

2. `classes` — A class (e.g. "4 Bestari") belongs to a teacher
   - id (uuid, PK)
   - name (text)
   - teacher_id (uuid FK → teachers)
   - created_at (timestamptz)

3. `students` — A student belongs to a class. No diagnosis, minimal data.
   - id (uuid, PK)
   - name (text)
   - class_id (uuid FK → classes)
   - preferred_format (text, nullable) — set by parent later
   - preferred_language (text, nullable) — set by parent later
   - created_at (timestamptz)

4. `lessons` — A teacher-uploaded lesson
   - id (uuid, PK)
   - teacher_id (uuid FK → teachers)
   - class_id (uuid FK → classes, nullable) — assigned on publish
   - title (text)
   - subject (text)
   - level (text)
   - raw_text (text) — extracted lesson text
   - status (text) — 'draft' | 'processing' | 'live'
   - reader_output (jsonb) — structured output from the Reader Agent
   - created_at, updated_at (timestamptz)

5. `lesson_outputs` — One generated format+language for a lesson
   - id (uuid, PK)
   - lesson_id (uuid FK → lessons)
   - format (text) — 'focus_slides' | 'mind_map' | 'easy_read' | 'audio_script' | 'quick_check'
   - language (text) — 'en' | 'bm' | 'zh' | 'ta' | 'rojak'
   - content (jsonb) — the generated format-specific JSON
   - approved (boolean, default false)
   - created_at (timestamptz)
   - UNIQUE (lesson_id, format, language)

6. `activities` — Student interaction events (for insights)
   - id (uuid, PK)
   - student_id (uuid FK → students)
   - lesson_id (uuid FK → lessons)
   - format (text)
   - event (text) — e.g. 'view', 'complete', 'slide_next', 'answer'
   - value (text, nullable) — e.g. slide number, answer index
   - timestamp (timestamptz)

## Security
- RLS enabled on all tables.
- All tables grant CRUD to anon + authenticated (single-tenant demo, no auth).
- Policies use USING (true) / WITH CHECK (true) — data is intentionally shared.
*/

-- Teachers
CREATE TABLE IF NOT EXISTS teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON teachers TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_teachers" ON teachers;
CREATE POLICY "anon_all_teachers" ON teachers FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_teachers" ON teachers;
CREATE POLICY "anon_insert_teachers" ON teachers FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_teachers" ON teachers;
CREATE POLICY "anon_update_teachers" ON teachers FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_teachers" ON teachers;
CREATE POLICY "anon_delete_teachers" ON teachers FOR DELETE TO anon, authenticated USING (true);

-- Classes
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON classes TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_classes" ON classes;
CREATE POLICY "anon_all_classes" ON classes FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_classes" ON classes;
CREATE POLICY "anon_insert_classes" ON classes FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_classes" ON classes;
CREATE POLICY "anon_update_classes" ON classes FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_classes" ON classes;
CREATE POLICY "anon_delete_classes" ON classes FOR DELETE TO anon, authenticated USING (true);

-- Students
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  preferred_format text,
  preferred_language text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON students TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_students" ON students;
CREATE POLICY "anon_all_students" ON students FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE TO anon, authenticated USING (true);

-- Lessons
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id) ON DELETE SET NULL,
  title text NOT NULL DEFAULT 'Untitled Lesson',
  subject text NOT NULL DEFAULT '',
  level text NOT NULL DEFAULT '',
  raw_text text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  reader_output jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON lessons TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_lessons" ON lessons;
CREATE POLICY "anon_all_lessons" ON lessons FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lessons" ON lessons;
CREATE POLICY "anon_insert_lessons" ON lessons FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lessons" ON lessons;
CREATE POLICY "anon_update_lessons" ON lessons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_lessons" ON lessons;
CREATE POLICY "anon_delete_lessons" ON lessons FOR DELETE TO anon, authenticated USING (true);

-- Lesson outputs
CREATE TABLE IF NOT EXISTS lesson_outputs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  format text NOT NULL,
  language text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE (lesson_id, format, language)
);
ALTER TABLE lesson_outputs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_outputs TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_lesson_outputs" ON lesson_outputs;
CREATE POLICY "anon_all_lesson_outputs" ON lesson_outputs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_lesson_outputs" ON lesson_outputs;
CREATE POLICY "anon_insert_lesson_outputs" ON lesson_outputs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_lesson_outputs" ON lesson_outputs;
CREATE POLICY "anon_update_lesson_outputs" ON lesson_outputs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_lesson_outputs" ON lesson_outputs;
CREATE POLICY "anon_delete_lesson_outputs" ON lesson_outputs FOR DELETE TO anon, authenticated USING (true);

-- Activities
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  format text NOT NULL,
  event text NOT NULL,
  value text,
  timestamp timestamptz DEFAULT now()
);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON activities TO anon, authenticated;
DROP POLICY IF EXISTS "anon_all_activities" ON activities;
CREATE POLICY "anon_all_activities" ON activities FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_activities" ON activities;
CREATE POLICY "anon_insert_activities" ON activities FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_activities" ON activities;
CREATE POLICY "anon_update_activities" ON activities FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_activities" ON activities;
CREATE POLICY "anon_delete_activities" ON activities FOR DELETE TO anon, authenticated USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_lessons_teacher_id ON lessons(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_class_id ON lessons(class_id);
CREATE INDEX IF NOT EXISTS idx_lesson_outputs_lesson_id ON lesson_outputs(lesson_id);
CREATE INDEX IF NOT EXISTS idx_activities_student_id ON activities(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_lesson_id ON activities(lesson_id);
CREATE INDEX IF NOT EXISTS idx_students_class_id ON students(class_id);
