'use client';

/*
 * Focus Slides — for learners who lose focus with long pages (often ADHD).
 * One idea per slide, big text, clear progress.
 * The focus timer and movement breaks are OPTIONAL and OFF by default.
 * The timer never starts by itself and never makes a sound.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw, Timer, Footprints } from 'lucide-react';
import type { FocusSlidesOutput } from '@/lib/agents';
import { usePreferences } from '@/lib/preferences';
import { cn } from '@/lib/utils';

const FOCUS_SECONDS = 5 * 60;

type Slide = { kind: 'idea'; heading: string; text: string } | { kind: 'break'; text: string };

export function FocusSlides({
  data,
  onSlide,
  onComplete,
  onQuickCheck,
}: {
  data: FocusSlidesOutput;
  onSlide: (index: number) => void;
  onComplete: () => void;
  onQuickCheck?: () => void;
}) {
  const { prefs, setPref } = usePreferences();

  const slides: Slide[] = useMemo(
    () =>
      (data?.slides ?? [])
        .map((s): Slide =>
          'type' in s && s.type === 'break'
            ? { kind: 'break', text: s.heading }
            : { kind: 'idea', heading: (s as { heading: string }).heading, text: (s as { one_sentence: string }).one_sentence }
        )
        .filter((s) => s.kind === 'idea' || prefs.movementBreaks),
    [data, prefs.movementBreaks]
  );
  const ideaTotal = slides.filter((s) => s.kind === 'idea').length;

  const [index, setIndex] = useState(0);
  const done = index >= slides.length;
  const slide = slides[index];
  const ideaNumber = slides.slice(0, index + 1).filter((s) => s.kind === 'idea').length;

  // keep index valid if breaks are toggled
  useEffect(() => {
    setIndex((i) => Math.min(i, slides.length));
  }, [slides.length]);

  useEffect(() => {
    if (!done) onSlide(index);
    else onComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, done]);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, slides.length)), [slides.length]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  // Arrow keys move between slides
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t && ['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div>
      {/* Options: both optional, both off by default */}
      <div className="mb-4 flex flex-wrap gap-2">
        <OptionChip
          icon={<Timer className="h-4 w-4" aria-hidden="true" />}
          label="Focus timer"
          on={prefs.focusTimer}
          onToggle={() => setPref('focusTimer', !prefs.focusTimer)}
        />
        <OptionChip
          icon={<Footprints className="h-4 w-4" aria-hidden="true" />}
          label="Movement breaks"
          on={prefs.movementBreaks}
          onToggle={() => setPref('movementBreaks', !prefs.movementBreaks)}
        />
      </div>

      {/* Slide */}
      <section
        aria-live="polite"
        className={cn(
          'flex min-h-[18rem] flex-col items-center justify-center gap-4 rounded-2xl border p-8 text-center sm:p-12',
          slide?.kind === 'break' ? 'border-transparent bg-secondary' : 'border-border bg-card'
        )}
      >
        {done ? (
          <>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">You finished!</h2>
            <p className="max-w-[28ch] text-xl text-foreground">
              You went through all {ideaTotal} ideas. Well done.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              {onQuickCheck && (
                <button
                  type="button"
                  onClick={onQuickCheck}
                  className="tap-target rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-primary-dark"
                >
                  Try the Quick Check
                </button>
              )}
              <button
                type="button"
                onClick={() => setIndex(0)}
                className="tap-target inline-flex items-center gap-2 rounded-lg border border-border px-5 font-medium text-foreground hover:bg-secondary"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Start again
              </button>
            </div>
          </>
        ) : slide.kind === 'break' ? (
          <>
            <Footprints className="h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="font-serif text-3xl text-foreground">Movement break</h2>
            <p className="max-w-[28ch] text-xl text-foreground">{slide.text}</p>
            <p className="text-sm text-muted-foreground">Press Next when you are ready.</p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium text-muted-foreground">
              Idea {ideaNumber} of {ideaTotal}
            </p>
            <h2 className="font-serif text-3xl text-foreground sm:text-4xl">{slide.heading}</h2>
            <p className="max-w-[28ch] text-xl leading-relaxed text-foreground sm:text-2xl">
              {slide.text}
            </p>
          </>
        )}
      </section>

      {/* Progress */}
      <div
        className="mt-4 flex gap-1.5"
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuemin={0}
        aria-valuemax={slides.length}
        aria-valuenow={Math.min(index, slides.length)}
      >
        {slides.map((s, i) => (
          <span
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full',
              i < index || done ? 'bg-primary' : i === index ? 'bg-primary/50' : 'bg-muted'
            )}
          />
        ))}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={prev}
          disabled={index === 0}
          className="tap-target inline-flex items-center gap-2 rounded-lg border border-border px-4 font-medium text-foreground hover:bg-secondary disabled:opacity-40"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          Back
        </button>

        {prefs.focusTimer && <FocusTimer />}

        <button
          type="button"
          onClick={next}
          disabled={done}
          className="tap-target inline-flex items-center gap-2 rounded-lg bg-primary px-5 font-medium text-primary-foreground hover:bg-primary-dark disabled:opacity-40"
        >
          Next
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function OptionChip({
  icon,
  label,
  on,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={cn(
        'inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm font-medium',
        on ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-secondary'
      )}
    >
      {icon}
      {label}: {on ? 'On' : 'Off'}
    </button>
  );
}

/** A gentle, silent timer the learner starts and pauses themselves. */
function FocusTimer() {
  const [left, setLeft] = useState(FOCUS_SECONDS);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');

  if (left === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-foreground" role="status">
        <span>Focus time is done. Take a short rest.</span>
        <button
          type="button"
          onClick={() => setLeft(FOCUS_SECONDS)}
          className="rounded-md border border-border px-2 py-1 text-sm hover:bg-secondary"
        >
          Reset
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium tabular-nums text-foreground" aria-label={`${mm} minutes ${ss} seconds left`}>
        {mm}:{ss}
      </span>
      <button
        type="button"
        onClick={() => setRunning((r) => !r)}
        className="tap-target inline-flex items-center justify-center gap-1 rounded-lg border border-border px-3 text-sm font-medium hover:bg-secondary"
        aria-label={running ? 'Pause focus timer' : 'Start focus timer'}
      >
        {running ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />}
        <span className="hidden sm:inline">{running ? 'Pause' : 'Start'}</span>
      </button>
    </div>
  );
}
