import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { student_id, lesson_id, format, event, value } = body;

    if (!student_id || !lesson_id || !format || !event) {
      return NextResponse.json(
        { error: 'Missing required fields: student_id, lesson_id, format, event' },
        { status: 400 }
      );
    }

    const { error } = await supabase.from('activities').insert({
      student_id,
      lesson_id,
      format,
      event,
      value: value ?? null,
    });

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
