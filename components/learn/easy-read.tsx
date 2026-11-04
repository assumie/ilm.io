'use client';

/*
 * Easy Read — for learners who find reading tiring (often dyslexia).
 * Short sentences, clear headings, one sentence per line.
 * Reading font, text size, spacing and the reading ruler are remembered.
 * Tap any sentence to hear it.
 */

import { useState } from 'react';
import { Volume2 } from 'lucide-react';
import type { EasyReadOutput, KeyTerm } from '@/lib/agents';
import type { LessonOutputLanguage } from '@/lib/supabase';
import { usePreferences, type TextSize } from '@/lib/preferences';
import { speechSupported, useSpeaker } from '@/lib/speech';
import { cn } from '@/lib/utils';

export function EasyRead({
  data,
  language,
  keyTerms,
}: {
  data: EasyReadOutput;
  language: LessonOutputLanguage;
  keyTerms: KeyTerm[];
}) {
  const { prefs, setPref } = usePreferences();
  const { speak, stop } = useSpeaker(language);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const canSpeak = speechSupported();

  const sayOne = (key: string, text: string) => {
    if (!canSpeak) return;
    if (speakingKey === key) {
      stop();
      setSpeakingKey(null);
      return;
    }
    setSpeakingKey(key);
    speak([text]);
    // clear highlight once finished (approximate by utterance end via polling)
    const check = setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        setSpeakingKey((k) => (k === key ? null : k));
        clearInterval(check);
      }
    }, 300);
  };

  const sizes: { value: TextSize; label: string }[] = [
    { value: 'normal', label: 'A' },
    { value: 'large', label: 'A+' },
    { value: 'xlarge', label: 'A++' },
  ];

  return (
    <div>
      {/* Reading tools */}
      <div className="mb-4 flex flex-wrap items-center gap-2" role="group" aria-label="Reading tools">
        <Chip on={prefs.readingFont} onClick={() => setPref('readingFont', !prefs.readingFont)}>
          Reading font
        </Chip>
        <Chip on={prefs.extraSpacing} onClick={() => setPref('extraSpacing', !prefs.extraSpacing)}>
          Extra spacing
        </Chip>
        <Chip on={prefs.readingRuler} onClick={() => setPref('readingRuler', !prefs.readingRuler)}>
          Reading ruler
        </Chip>
        <span className="mx-1 hidden h-6 w-px bg-border sm:inline-block" aria-hidden="true" />
        <div className="flex gap-1" role="group" aria-label="Text size">
          {sizes.map((s) => (
            <button
              key={s.value}
              type="button"
              onClick={() => setPref('textSize', s.value)}
              aria-pressed={prefs.textSize === s.value}
              className={cn(
                'min-h-[40px] min-w-[44px] rounded-lg border px-2 text-sm font-medium',
                prefs.textSize === s.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-secondary'
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reading area */}
      <article
        className={cn(
          'max-w-[62ch] rounded-2xl border border-border bg-card px-6 py-6 sm:px-8',
          // Text size is applied app-wide through the Comfort setting (rem scaling).
          'text-xl',
          prefs.readingFont && 'font-accessible',
          prefs.extraSpacing ? 'leading-[2.1] tracking-wide' : 'leading-relaxed'
        )}
      >
        {(data ?? []).map((section, si) => (
          <section key={si} className={si > 0 ? 'mt-7' : ''}>
            <h3 className="font-sans text-[0.9em] font-bold text-primary">{section.heading}</h3>
            <ul className="mt-1 space-y-1">
              {section.sentences.map((sentence, i) => {
                const key = `${si}-${i}`;
                const active = speakingKey === key;
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => sayOne(key, sentence)}
                      className={cn(
                        'w-full rounded-md px-1 text-left text-foreground',
                        active && 'bg-warning/25',
                        prefs.readingRuler && !active && 'hover:bg-warning/20 focus-visible:bg-warning/20',
                        !prefs.readingRuler && !active && 'hover:bg-secondary'
                      )}
                      aria-label={canSpeak ? `${sentence} (tap to hear)` : sentence}
                    >
                      {sentence}
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </article>

      {canSpeak && (
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          Tap any sentence to hear it. Tap again to stop.
        </p>
      )}

      {keyTerms.length > 0 && (
        <section className="mt-6 max-w-[62ch]">
          <h3 className="font-serif text-lg text-foreground">
            Key words{language !== 'en' ? ' (English)' : ''}
          </h3>
          <dl className="mt-2 divide-y divide-border rounded-xl border border-border bg-card">
            {keyTerms.map((t) => (
              <div key={t.term} className="px-4 py-3">
                <dt className="font-medium text-foreground">{t.term}</dt>
                <dd className="text-foreground">{t.simple_definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        'min-h-[40px] rounded-full border px-4 text-sm font-medium',
        on ? 'border-primary bg-primary/10 text-foreground' : 'border-border text-muted-foreground hover:bg-secondary'
      )}
    >
      {children}
    </button>
  );
}
