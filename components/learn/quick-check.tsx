'use client';

/*
 * Quick Check — three short questions with kind, instant feedback.
 * Wrong answers explain why and invite another try. No timer, no score pressure:
 * the summary counts what the learner got right, never what they got wrong.
 */

import { useState } from 'react';
import { Check, RotateCcw, Lightbulb } from 'lucide-react';
import type { QuickCheckOutput } from '@/lib/agents';
import { cn } from '@/lib/utils';

export function QuickCheck({
  data,
  onAnswer,
}: {
  data: QuickCheckOutput;
  onAnswer: (questionIndex: number, correct: boolean) => void;
}) {
  const questions = data ?? [];
  // chosen[q] = option index the learner picked last
  const [chosen, setChosen] = useState<Record<number, number>>({});
  // firstTry[q] = whether the first attempt was right
  const [firstTry, setFirstTry] = useState<Record<number, boolean>>({});

  const answer = (q: number, o: number) => {
    const correct = o === questions[q].answer_index;
    setChosen((c) => ({ ...c, [q]: o }));
    if (!(q in firstTry)) {
      setFirstTry((f) => ({ ...f, [q]: correct }));
      onAnswer(q, correct);
    }
  };

  const solved = questions.filter((q, i) => chosen[i] === q.answer_index).length;
  const allSolved = questions.length > 0 && solved === questions.length;

  return (
    <div className="max-w-2xl space-y-4">
      {questions.map((q, qi) => {
        const picked = chosen[qi];
        const isRight = picked === q.answer_index;
        return (
          <fieldset key={qi} className="rounded-2xl border border-border bg-card p-5">
            <legend className="sr-only">Question {qi + 1}</legend>
            <p className="text-sm font-medium text-muted-foreground">Question {qi + 1} of {questions.length}</p>
            <p className="mt-1 text-xl text-foreground">{q.question}</p>
            <div className="mt-4 grid gap-2">
              {q.options.map((opt, oi) => {
                const selected = picked === oi;
                return (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => answer(qi, oi)}
                    disabled={isRight}
                    aria-pressed={selected}
                    className={cn(
                      'flex min-h-[52px] items-center justify-between gap-3 rounded-xl border-2 px-4 text-left text-lg',
                      selected && isRight && 'border-success bg-success/10',
                      selected && !isRight && 'border-warning bg-warning/10',
                      !selected && 'border-border hover:bg-secondary',
                      isRight && !selected && 'opacity-60'
                    )}
                  >
                    <span>{opt}</span>
                    {selected && isRight && <Check className="h-5 w-5 text-success" aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
            <div aria-live="polite">
              {picked !== undefined && (
                <p
                  className={cn(
                    'mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-foreground',
                    isRight ? 'bg-success/10' : 'bg-warning/10'
                  )}
                >
                  {isRight ? (
                    <Check className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : (
                    <Lightbulb className="mt-1 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                  )}
                  <span>{isRight ? q.why : 'Not quite. Have another look and try again.'}</span>
                </p>
              )}
            </div>
          </fieldset>
        );
      })}

      {allSolved && (
        <div className="rounded-2xl bg-secondary p-5" role="status">
          <p className="font-serif text-xl text-foreground">You answered every question. Great work!</p>
          <p className="mt-1 text-foreground">
            You got {Object.values(firstTry).filter(Boolean).length} of {questions.length} right on the first try.
          </p>
          <button
            type="button"
            onClick={() => {
              setChosen({});
              setFirstTry({});
            }}
            className="tap-target mt-3 inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 font-medium hover:bg-background"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Do it again
          </button>
        </div>
      )}
    </div>
  );
}
