'use client';

/*
 * LessonPlayer — the student's lesson page.
 * One lesson, one chosen way to learn, one language. The learner's last
 * format and language are remembered, so the lesson opens the way they left it.
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  GalleryHorizontal,
  Network,
  BookOpenText,
  Headphones,
  ListChecks,
  type LucideIcon,
} from 'lucide-react';
import type { LessonBundle } from '@/lib/lessons';
import type { LessonOutputFormat, LessonOutputLanguage } from '@/lib/supabase';
import type {
  AudioScriptOutput,
  EasyReadOutput,
  FocusSlidesOutput,
  MindMapOutput,
  QuickCheckOutput,
} from '@/lib/agents';
import { LANGUAGE_LABELS } from '@/lib/agents';
import { usePreferences } from '@/lib/preferences';
import { logActivity, type ActivityContext } from '@/lib/activity';
import { cn } from '@/lib/utils';
import { FocusSlides } from './focus-slides';
import { MindMap } from './mind-map';
import { EasyRead } from './easy-read';
import { AudioLesson } from './audio-lesson';
import { QuickCheck } from './quick-check';

const FORMAT_INFO: Record<
  LessonOutputFormat,
  { label: string; icon: LucideIcon; goodFor: string; why: string }
> = {
  focus_slides: {
    label: 'Focus Slides',
    icon: GalleryHorizontal,
    goodFor: 'staying focused',
    why: 'One idea at a time, in big text.',
  },
  mind_map: {
    label: 'Mind Map',
    icon: Network,
    goodFor: 'seeing the whole picture',
    why: 'The whole topic in one calm picture. Tap a branch for one fact.',
  },
  easy_read: {
    label: 'Easy Read',
    icon: BookOpenText,
    goodFor: 'easier reading',
    why: 'Short sentences and simple words. Tap a sentence to hear it.',
  },
  audio_script: {
    label: 'Audio',
    icon: Headphones,
    goodFor: 'learning by listening',
    why: 'Listen while each sentence lights up.',
  },
  quick_check: {
    label: 'Quick Check',
    icon: ListChecks,
    goodFor: 'checking what you know',
    why: 'Three short questions. You can always try again.',
  },
};

// "Rojak" reads better than the longer internal label for students.
const languageLabel = (l: LessonOutputLanguage) => (l === 'rojak' ? 'Rojak' : LANGUAGE_LABELS[l]);

export function LessonPlayer({ lesson }: { lesson: LessonBundle }) {
  const { prefs, setPref } = usePreferences();

  // Use the remembered choice when this lesson has it, otherwise the first available.
  const format = lesson.formats.includes(prefs.format) ? prefs.format : lesson.formats[0];
  const language = lesson.languages.includes(prefs.language) ? prefs.language : lesson.languages[0];

  // Fall back to English (or any language) if this format is missing in the chosen language.
  const content =
    lesson.outputs[language]?.[format] ??
    lesson.outputs.en?.[format] ??
    lesson.languages.map((l) => lesson.outputs[l]?.[format]).find(Boolean);

  const ctx: ActivityContext = {
    lessonId: lesson.id,
    studentId: lesson.studentId,
    isSample: lesson.isSample,
  };
  const ctxRef = useRef(ctx);
  ctxRef.current = ctx;

  useEffect(() => {
    logActivity(ctxRef.current, format, 'lesson_opened');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstFormat = useRef(true);
  useEffect(() => {
    if (firstFormat.current) {
      firstFormat.current = false;
      return;
    }
    logActivity(ctxRef.current, format, 'format_selected', language);
  }, [format, language]);

  const completedLogged = useRef(false);
  const info = FORMAT_INFO[format];

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/learn"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        My lessons
      </Link>

      <header className="mt-1">
        <p className="text-sm text-muted-foreground">
          {lesson.subject}
          {lesson.level ? ` · ${lesson.level}` : ''}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-foreground sm:text-4xl">{lesson.title}</h1>
      </header>

      {/* Choose how to learn + language */}
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <p id="format-label" className="mb-2 text-sm font-medium text-foreground">
            How do you want to learn?
          </p>
          <div
            role="radiogroup"
            aria-labelledby="format-label"
            className="flex flex-wrap gap-2"
          >
            {lesson.formats.map((f) => {
              const Icon = FORMAT_INFO[f].icon;
              const active = f === format;
              return (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPref('format', f)}
                  className={cn(
                    'inline-flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-4 font-medium',
                    active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {FORMAT_INFO[f].label}
                </button>
              );
            })}
          </div>
        </div>

        {lesson.languages.length > 1 && (
          <label className="flex items-center gap-2 text-sm font-medium text-foreground" htmlFor="lesson-language">
            Language
            <select
              id="lesson-language"
              value={language}
              onChange={(e) => setPref('language', e.target.value as LessonOutputLanguage)}
              className="min-h-[48px] rounded-xl border-2 border-border bg-card px-3 text-base text-foreground"
            >
              {lesson.languages.map((l) => (
                <option key={l} value={l}>
                  {languageLabel(l)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <p className="mt-4 text-foreground">
        <span className="font-medium">Good for {info.goodFor}.</span>{' '}
        <span className="text-muted-foreground">{info.why}</span>
      </p>

      <div className="mt-5">
        {!content ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            This part is not ready yet. Please choose another way to learn.
          </p>
        ) : format === 'focus_slides' ? (
          <FocusSlides
            key={language}
            data={content as FocusSlidesOutput}
            onSlide={(i) => logActivity(ctx, format, 'slide_reached', i + 1)}
            onComplete={() => {
              if (completedLogged.current) return;
              completedLogged.current = true;
              logActivity(ctx, format, 'focus_completed');
            }}
            onQuickCheck={lesson.formats.includes('quick_check') ? () => setPref('format', 'quick_check') : undefined}
          />
        ) : format === 'mind_map' ? (
          <MindMap key={language} data={content as MindMapOutput} />
        ) : format === 'easy_read' ? (
          <EasyRead
            key={language}
            data={content as EasyReadOutput}
            language={language}
            keyTerms={lesson.keyTerms}
          />
        ) : format === 'audio_script' ? (
          <AudioLesson
            key={language}
            data={content as AudioScriptOutput}
            language={language}
            onPlay={() => logActivity(ctx, format, 'audio_played', language)}
          />
        ) : (
          <QuickCheck
            key={language}
            data={content as QuickCheckOutput}
            onAnswer={(q, correct) => logActivity(ctx, format, 'quiz_answered', `${q + 1}:${correct}`)}
          />
        )}
      </div>

      {lesson.isSample && (
        <p className="mt-8 text-sm text-muted-foreground">
          This is a sample lesson. Lessons your teacher publishes will appear in My lessons.
        </p>
      )}
    </div>
  );
}
