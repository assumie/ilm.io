import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type LessonOutputFormat =
  | 'focus_slides'
  | 'mind_map'
  | 'easy_read'
  | 'audio_script'
  | 'quick_check';

export type LessonOutputLanguage = 'en' | 'bm' | 'zh' | 'ta' | 'rojak';

export type LessonStatus = 'draft' | 'processing' | 'live';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface ClassRow {
  id: string;
  name: string;
  teacher_id: string;
  created_at: string;
}

export interface Student {
  id: string;
  name: string;
  class_id: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  teacher_id: string;
  class_id: string | null;
  title: string;
  subject: string;
  level: string;
  raw_text: string;
  status: LessonStatus;
  reader_output: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface LessonOutput {
  id: string;
  lesson_id: string;
  format: LessonOutputFormat;
  language: LessonOutputLanguage;
  content: Record<string, unknown>;
  approved: boolean;
  created_at: string;
}

export interface Activity {
  id: string;
  student_id: string;
  lesson_id: string;
  format: LessonOutputFormat;
  event: string;
  value: string | null;
  timestamp: string;
}
