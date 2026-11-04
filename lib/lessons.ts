/*
 * lessons.ts — Server-side loading of lessons for students.
 *
 * Reads live lessons and their approved outputs from Supabase. If Supabase is
 * not configured, unreachable, or has no live lessons yet, students still get
 * the built-in sample lesson (The Water Cycle) so the app is never empty.
 */

import { getSupabase } from './supabase';
import type { LessonOutputFormat, LessonOutputLanguage } from './supabase';
import { ALL_FORMATS, ALL_LANGUAGES, type KeyTerm, type ReaderOutput } from './agents';
import { SEED_OUTPUTS, SEED_READER_OUTPUT } from './seed-data';

export const DEMO_LESSON_ID = 'sample-water-cycle';

export type LessonOutputs = Partial<
  Record<LessonOutputLanguage, Partial<Record<LessonOutputFormat, unknown>>>
>;

export interface LessonSummary {
  id: string;
  title: string;
  subject: string;
  level: string;
  formatCount: number;
  isSample: boolean;
}

export interface LessonBundle {
  id: string;
  title: string;
  subject: string;
  level: string;
  keyTerms: KeyTerm[];
  outputs: LessonOutputs;
  /** Formats approved by the teacher, in display order. */
  formats: LessonOutputFormat[];
  /** Languages that have at least one approved output. */
  languages: LessonOutputLanguage[];
  /** Demo student identity used for activity logging (null = do not log). */
  studentId: string | null;
  isSample: boolean;
}

function sampleSummary(): LessonSummary {
  return {
    id: DEMO_LESSON_ID,
    title: SEED_READER_OUTPUT.title,
    subject: SEED_READER_OUTPUT.subject,
    level: SEED_READER_OUTPUT.level,
    formatCount: ALL_FORMATS.length,
    isSample: true,
  };
}

function sampleBundle(): LessonBundle {
  return {
    id: DEMO_LESSON_ID,
    title: SEED_READER_OUTPUT.title,
    subject: SEED_READER_OUTPUT.subject,
    level: SEED_READER_OUTPUT.level,
    keyTerms: SEED_READER_OUTPUT.key_terms,
    outputs: SEED_OUTPUTS,
    formats: [...ALL_FORMATS],
    languages: [...ALL_LANGUAGES],
    studentId: null,
    isSample: true,
  };
}

export async function listStudentLessons(): Promise<LessonSummary[]> {
  const db = getSupabase();
  if (!db) return [sampleSummary()];
  try {
    const { data: lessons, error } = await db
      .from('lessons')
      .select('id, title, subject, level')
      .eq('status', 'live')
      .order('created_at', { ascending: false });
    if (error) throw error;
    if (!lessons || lessons.length === 0) return [sampleSummary()];

    const { data: outputs } = await db
      .from('lesson_outputs')
      .select('lesson_id, format')
      .eq('approved', true)
      .in(
        'lesson_id',
        lessons.map((l) => l.id)
      );

    return lessons.map((l) => ({
      id: l.id,
      title: l.title,
      subject: l.subject,
      level: l.level,
      formatCount: new Set(
        (outputs ?? []).filter((o) => o.lesson_id === l.id).map((o) => o.format)
      ).size,
      isSample: false,
    }));
  } catch {
    return [sampleSummary()];
  }
}

export async function getLessonBundle(id: string): Promise<LessonBundle | null> {
  if (id === DEMO_LESSON_ID) return sampleBundle();
  const db = getSupabase();
  if (!db) return null;
  try {
    const { data: lesson, error } = await db
      .from('lessons')
      .select('id, title, subject, level, class_id, status, reader_output')
      .eq('id', id)
      .maybeSingle();
    if (error || !lesson || lesson.status !== 'live') return null;

    const { data: rows } = await db
      .from('lesson_outputs')
      .select('format, language, content')
      .eq('lesson_id', id)
      .eq('approved', true);

    const outputs: LessonOutputs = {};
    for (const row of rows ?? []) {
      const lang = row.language as LessonOutputLanguage;
      const fmt = row.format as LessonOutputFormat;
      outputs[lang] = { ...(outputs[lang] ?? {}), [fmt]: row.content };
    }
    const present = new Set((rows ?? []).map((r) => r.format));
    const formats = ALL_FORMATS.filter((f) => present.has(f));
    const languages = ALL_LANGUAGES.filter((l) => outputs[l]);
    if (formats.length === 0) return null;

    let studentId: string | null = null;
    if (lesson.class_id) {
      const { data: student } = await db
        .from('students')
        .select('id')
        .eq('class_id', lesson.class_id)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();
      studentId = student?.id ?? null;
    }

    const reader = lesson.reader_output as ReaderOutput | null;
    return {
      id: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      level: lesson.level,
      keyTerms: reader?.key_terms ?? [],
      outputs,
      formats,
      languages,
      studentId,
      isSample: false,
    };
  } catch {
    return null;
  }
}
