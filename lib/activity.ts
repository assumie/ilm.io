/*
 * activity.ts — Fire-and-forget learning events for the teacher's Insights.
 *
 * Never blocks or interrupts the student: failures are ignored silently.
 * Sample lessons and lessons without a student identity are not logged.
 */

import type { LessonOutputFormat } from './supabase';

export type ActivityEvent =
  | 'lesson_opened'
  | 'format_selected'
  | 'slide_reached'
  | 'focus_completed'
  | 'quiz_answered'
  | 'audio_played';

export interface ActivityContext {
  lessonId: string;
  studentId: string | null;
  isSample: boolean;
}

export function logActivity(
  ctx: ActivityContext,
  format: LessonOutputFormat,
  event: ActivityEvent,
  value?: string | number | boolean
) {
  if (ctx.isSample || !ctx.studentId) return;
  try {
    void fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        student_id: ctx.studentId,
        lesson_id: ctx.lessonId,
        format,
        event,
        value: value === undefined ? null : String(value),
      }),
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}
