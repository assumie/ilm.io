'use client';

/*
 * Mind Map — for learners who understand best when they see the whole picture
 * (often autistic and visual learners). Fixed, predictable layout. Nothing
 * moves. Tap a branch to show one short fact.
 * Phones get a simple top-down tree instead of a cramped circle.
 */

import { useState } from 'react';
import type { MindMapOutput } from '@/lib/agents';
import { cn } from '@/lib/utils';

export function MindMap({ data }: { data: MindMapOutput }) {
  const branches = (data?.branches ?? []).slice(0, 6);
  const [selected, setSelected] = useState<number | null>(null);

  // Even angles starting at the top, going clockwise.
  const pos = branches.map((_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / branches.length;
    return { x: 50 + Math.cos(a) * 36, y: 50 + Math.sin(a) * 38 };
  });

  const branchButton = (i: number, extra = '') => (
    <button
      key={i}
      type="button"
      onClick={() => setSelected(i)}
      aria-pressed={selected === i}
      className={cn(
        'rounded-xl border-2 px-4 py-3 text-left font-medium text-foreground',
        selected === i ? 'border-primary bg-primary/10' : 'border-primary/40 bg-card hover:bg-secondary',
        extra
      )}
    >
      {branches[i].label}
    </button>
  );

  return (
    <div>
      {/* Desktop / tablet: calm radial map */}
      <div className="relative hidden aspect-[16/10] w-full rounded-2xl border border-border bg-card sm:block">
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {pos.map((p, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke="hsl(var(--primary))"
              strokeOpacity={selected === i ? 0.9 : 0.35}
              strokeWidth={selected === i ? 3 : 2}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        <div
          className="absolute left-1/2 top-1/2 flex max-w-[30%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary px-6 py-6 text-center font-serif text-xl text-primary-foreground"
          style={{ minWidth: '9rem', minHeight: '9rem' }}
        >
          {data.center}
        </div>
        {pos.map((p, i) => (
          <div
            key={i}
            className="absolute max-w-[28%] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {branchButton(i, 'w-full text-center')}
          </div>
        ))}
      </div>

      {/* Phone: simple tree */}
      <div className="rounded-2xl border border-border bg-card p-4 sm:hidden">
        <div className="rounded-xl bg-primary px-4 py-3 text-center font-serif text-lg text-primary-foreground">
          {data.center}
        </div>
        <ul className="ml-5 mt-2 border-l-2 border-primary/40 pl-4">
          {branches.map((_, i) => (
            <li key={i} className="relative py-1.5">
              <span
                className="absolute -left-4 top-1/2 h-0.5 w-4 bg-primary/40"
                aria-hidden="true"
              />
              {branchButton(i, 'w-full')}
            </li>
          ))}
        </ul>
      </div>

      {/* The one fact */}
      <div
        aria-live="polite"
        className="mt-4 min-h-[4.5rem] rounded-xl bg-secondary px-5 py-4 text-lg text-foreground"
      >
        {selected === null ? (
          <span className="text-muted-foreground">Tap a branch to see one short fact.</span>
        ) : (
          <>
            <span className="font-medium">{branches[selected].label}: </span>
            {branches[selected].fact}
          </>
        )}
      </div>
    </div>
  );
}
