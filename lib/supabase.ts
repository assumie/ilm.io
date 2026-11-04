import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** True when the Supabase environment variables are set. */
export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * Shared client. When Supabase is not configured the app still runs in
 * demo mode (built-in sample lesson); calls through this client then fail
 * and API routes return a clear error instead of crashing the whole site.
 */
export const supabase: SupabaseClient = hasSupabase
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : (null as unknown as SupabaseClient);

/** Null-safe accessor for new code. */
export function getSupabase(): SupabaseClient | null {
  return hasSupabase ? supabase : null;
}

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
