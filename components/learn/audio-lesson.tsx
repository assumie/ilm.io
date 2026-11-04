'use client';

/*
 * Audio — for learners who understand better by listening (auditory learners,
 * weaker readers). Nothing plays until the learner presses Play.
 * Each sentence is highlighted while it is spoken, so listening also builds reading.
 */

import { useEffect, useRef, useState } from 'react';
import { Play, Square, SkipBack, SkipForward, Info } from 'lucide-react';
import type { AudioScriptOutput } from '@/lib/agents';
import type { LessonOutputLanguage } from '@/lib/supabase';
import { usePreferences } from '@/lib/preferences';
import { speechSupported, useHasVoice, useSpeaker } from '@/lib/speech';
import { cn } from '@/lib/utils';

const SPEEDS = [0.75, 1, 1.25];

export function AudioLesson({
  data,
  language,
  onPlay,
}: {
  data: AudioScriptOutput;
  language: LessonOutputLanguage;
  onPlay: () => void;
}) {
  const sentences = data ?? [];
  const { prefs } = usePreferences();
  const { current, speaking, speak, stop } = useSpeaker(language);
  const hasVoice = useHasVoice(language);
  const [rate, setRate] = useState(1);
  const [position, setPosition] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const supported = speechSupported();

  useEffect(() => {
    if (current >= 0) setPosition(current);
  }, [current]);

  // Keep the spoken sentence in view, without animated scrolling.
  useEffect(() => {
    if (current < 0) return;
    const el = listRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [current]);

  const play = (from = position) => {
    onPlay();
    speak(sentences, from, rate);
  };

  const jump = (delta: number) => {
    const to = Math.min(Math.max(position + delta, 0), sentences.length - 1);
    setPosition(to);
    if (speaking) speak(sentences, to, rate);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <button
          type="button"
          onClick={() => jump(-1)}
          disabled={!supported || position === 0}
          className="tap-target flex items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40"
          aria-label="Previous sentence"
        >
          <SkipBack className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => (speaking ? stop() : play())}
          disabled={!supported}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary-dark disabled:opacity-40"
          aria-label={speaking ? 'Stop' : 'Play lesson'}
        >
          {speaking ? <Square className="h-5 w-5" aria-hidden="true" /> : <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />}
        </button>
        <button
          type="button"
          onClick={() => jump(1)}
          disabled={!supported || position >= sentences.length - 1}
          className="tap-target flex items-center justify-center rounded-full border border-border hover:bg-secondary disabled:opacity-40"
          aria-label="Next sentence"
        >
          <SkipForward className="h-5 w-5" aria-hidden="true" />
        </button>

        <p className="min-w-[9rem] flex-1 text-sm text-muted-foreground" aria-live="polite">
          {speaking ? `Sentence ${current + 1} of ${sentences.length}` : `${sentences.length} sentences`}
        </p>

        <div className="flex gap-1" role="group" aria-label="Speed">
          {SPEEDS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setRate(s);
                if (speaking) speak(sentences, position, s);
              }}
              aria-pressed={rate === s}
              className={cn(
                'min-h-[40px] min-w-[52px] rounded-lg border px-2 text-sm font-medium tabular-nums',
                rate === s
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-secondary'
              )}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      {(!supported || hasVoice === false) && (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-secondary px-4 py-3 text-sm text-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {!supported
            ? 'This browser cannot read aloud. Try Chrome or Safari, or use Easy Read.'
            : 'This device has no voice for this language, so it may sound unclear. You can still follow the text below.'}
        </p>
      )}

      <ol
        ref={listRef}
        className={cn(
          'mt-4 max-w-[62ch] space-y-1 rounded-2xl border border-border bg-card px-4 py-5 text-xl sm:px-6',
          prefs.readingFont && 'font-accessible',
          prefs.extraSpacing ? 'leading-[2.1]' : 'leading-relaxed'
        )}
      >
        {sentences.map((s, i) => (
          <li key={i}>
            <button
              type="button"
              onClick={() => {
                setPosition(i);
                play(i);
              }}
              disabled={!supported}
              className={cn(
                'w-full rounded-md px-2 py-0.5 text-left text-foreground disabled:cursor-default',
                current === i ? 'bg-warning/25' : 'hover:bg-secondary'
              )}
              aria-current={current === i ? 'true' : undefined}
            >
              {s}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
