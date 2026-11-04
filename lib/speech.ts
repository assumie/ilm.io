'use client';

/*
 * speech.ts — Read-aloud using the device's built-in voices (Web Speech API).
 * Nothing plays until the learner presses a button.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LessonOutputLanguage } from './supabase';

export const VOICE_LANG: Record<LessonOutputLanguage, string> = {
  en: 'en-GB',
  bm: 'ms-MY',
  zh: 'zh-CN',
  ta: 'ta-IN',
  rojak: 'ms-MY',
};

export function speechSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Whether this device has a voice for the language (voices load async). */
export function useHasVoice(language: LessonOutputLanguage) {
  const [hasVoice, setHasVoice] = useState<boolean | null>(null);
  useEffect(() => {
    if (!speechSupported()) {
      setHasVoice(false);
      return;
    }
    const prefix = VOICE_LANG[language].slice(0, 2).toLowerCase();
    const check = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      setHasVoice(voices.some((v) => v.lang.toLowerCase().startsWith(prefix)));
    };
    check();
    window.speechSynthesis.addEventListener('voiceschanged', check);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', check);
  }, [language]);
  return hasVoice;
}

function pickVoice(language: LessonOutputLanguage) {
  const target = VOICE_LANG[language].toLowerCase();
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase() === target) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(target.slice(0, 2))) ??
    null
  );
}

/**
 * Speaks a list of sentences one after another.
 * `current` is the index being spoken (or -1), for highlighting.
 */
export function useSpeaker(language: LessonOutputLanguage) {
  const [current, setCurrent] = useState(-1);
  const runId = useRef(0);

  const stop = useCallback(() => {
    runId.current++;
    if (speechSupported()) window.speechSynthesis.cancel();
    setCurrent(-1);
  }, []);

  const speak = useCallback(
    (sentences: string[], startAt = 0, rate = 1) => {
      if (!speechSupported() || sentences.length === 0) return;
      window.speechSynthesis.cancel();
      const id = ++runId.current;
      const voice = pickVoice(language);
      const sayAt = (i: number) => {
        if (id !== runId.current) return;
        if (i >= sentences.length) {
          setCurrent(-1);
          return;
        }
        setCurrent(i);
        const u = new SpeechSynthesisUtterance(sentences[i]);
        u.lang = VOICE_LANG[language];
        if (voice) u.voice = voice;
        u.rate = rate;
        u.onend = () => sayAt(i + 1);
        u.onerror = () => sayAt(i + 1);
        window.speechSynthesis.speak(u);
      };
      sayAt(startAt);
    },
    [language]
  );

  // Stop talking when the language changes or the component goes away.
  useEffect(() => stop, [language, stop]);

  return { current, speaking: current >= 0, speak, stop };
}
