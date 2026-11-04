import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  SEED_TEACHER,
  SEED_CLASS,
  SEED_STUDENTS,
  SEED_LESSON_RAW_TEXT,
  SEED_READER_OUTPUT,
  SEED_OUTPUTS,
} from '@/lib/seed-data';
import { ALL_FORMATS, ALL_LANGUAGES } from '@/lib/agents';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    // Check if teacher already exists
    const { data: existingTeacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', SEED_TEACHER.email)
      .maybeSingle();

    let teacherId: string;

    if (existingTeacher) {
      teacherId = existingTeacher.id;
    } else {
      const { data: teacher, error: teacherErr } = await supabase
        .from('teachers')
        .insert(SEED_TEACHER)
        .select('id')
        .single();
      if (teacherErr) throw teacherErr;
      teacherId = teacher.id;
    }

    // Create class
    const { data: classRow, error: classErr } = await supabase
      .from('classes')
      .insert({ name: SEED_CLASS.name, teacher_id: teacherId })
      .select('id')
      .single();
    if (classErr) throw classErr;
    const classId = classRow.id;

    // Create students
    for (const student of SEED_STUDENTS) {
      await supabase.from('students').insert({
        name: student.name,
        class_id: classId,
      });
    }

    // Create lesson
    const { data: lesson, error: lessonErr } = await supabase
      .from('lessons')
      .insert({
        teacher_id: teacherId,
        class_id: classId,
        title: SEED_READER_OUTPUT.title,
        subject: SEED_READER_OUTPUT.subject,
        level: SEED_READER_OUTPUT.level,
        raw_text: SEED_LESSON_RAW_TEXT,
        status: 'live',
        reader_output: SEED_READER_OUTPUT as unknown as Record<string, unknown>,
      })
      .select('id')
      .single();
    if (lessonErr) throw lessonErr;
    const lessonId = lesson.id;

    // Create all lesson outputs (5 formats × 5 languages = 25)
    const outputs: {
      lesson_id: string;
      format: string;
      language: string;
      content: unknown;
      approved: boolean;
    }[] = [];

    for (const lang of ALL_LANGUAGES) {
      for (const format of ALL_FORMATS) {
        outputs.push({
          lesson_id: lessonId,
          format,
          language: lang,
          content: SEED_OUTPUTS[lang][format],
          approved: true,
        });
      }
    }

    const { error: outputsErr } = await supabase
      .from('lesson_outputs')
      .insert(outputs);
    if (outputsErr) throw outputsErr;

    return NextResponse.json({
      success: true,
      teacherId,
      classId,
      lessonId,
      message: 'Seed data created: 1 teacher, 1 class, 5 students, 1 lesson, 25 outputs',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
