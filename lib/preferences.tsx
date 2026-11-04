'use client';

/*
 * preferences.tsx — Remembers each learner's comfort settings on this device.
 *
 * Neurodivergent learners benefit from predictability: the app should open
 * the way they left it, instead of asking them to set it up every time.
 * Stored in localStorage only (no server, no diagnosis, nothing personal).
 */

import { createContext, useContext, useEffect, useState } from 'react';
import type { LessonOutputFormat, LessonOutputLanguage } from './supabase';

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface Preferences {
  /** Last learning format the student chose. */
  format: LessonOutputFormat;
  /** Last language the student chose. */
  language: LessonOutputLanguage;
  /** Dyslexia-friendly reading font (Atkinson Hyperlegible) everywhere. */
  readingFont: boolean;
  textSize: TextSize;
  /** Extra line and letter spacing. */
  extraSpacing: boolean;
  /** Highlight the line under the pointer while reading. */
  readingRuler: boolean;
  /** Calm mode: no motion, no colour accents, more space. */
  calmMode: boolean;
  /** Focus Slides timer. OFF by default: timers can cause anxiety. */
  focusTimer: boolean;
  /** Movement break suggestions in Focus Slides. OFF by default. */
  movementBreaks: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  format: 'focus_slides',
  language: 'en',
  readingFont: false,
  textSize: 'normal',
  extraSpacing: false,
  readingRuler: false,
  calmMode: false,
  focusTimer: false,
  movementBreaks: false,
};

const STORAGE_KEY = 'ilm-preferences';

type PreferencesContextType = {
  prefs: Preferences;
  setPref: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  resetPrefs: () => void;
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

function readStored(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setPrefs(readStored());
    setLoaded(true);
  }, []);

  // Save, and reflect the global comfort settings on <html> so CSS can react.
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* storage blocked: settings still work for this visit */
    }
    const root = document.documentElement;
    root.classList.toggle('calm', prefs.calmMode);
    root.classList.toggle('reading-font', prefs.readingFont);
    root.classList.toggle('extra-spacing', prefs.extraSpacing);
    root.dataset.textSize = prefs.textSize;
  }, [prefs, loaded]);

  const setPref: PreferencesContextType['setPref'] = (key, value) =>
    setPrefs((prev) => ({ ...prev, [key]: value }));

  const resetPrefs = () => setPrefs(DEFAULT_PREFERENCES);

  return (
    <PreferencesContext.Provider value={{ prefs, setPref, resetPrefs }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}
