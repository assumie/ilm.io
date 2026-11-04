'use client';

/*
 * app-shell.tsx — One calm, predictable frame for every page.
 *
 * Design rules (neurodivergent-friendly):
 * - ONE navigation system: side nav on desktop, bottom bar on phones. No hamburger.
 * - Students never see the Teacher/Student switch. Teachers get a "Preview as student" link.
 * - A "Comfort" panel lets anyone turn on calm mode, a reading font, bigger text,
 *   extra spacing and dark mode. Choices are remembered on this device.
 * - No blur, no decorative motion.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  Upload,
  BarChart3,
  Eye,
  SlidersHorizontal,
  X,
  Sprout,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { usePreferences, type TextSize } from '@/lib/preferences';
import { cn } from '@/lib/utils';

const teacherNav = [
  { href: '/teacher/lessons', label: 'My Lessons', icon: LayoutDashboard, exact: true },
  { href: '/teacher/lessons/new', label: 'Upload', icon: Upload, exact: true },
  { href: '/teacher/insights', label: 'Insights', icon: BarChart3, exact: false },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith('/teacher');
  const [comfortOpen, setComfortOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link
            href={isTeacher ? '/teacher/lessons' : '/learn'}
            className="flex items-center gap-2.5"
            aria-label="ilm.io home"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-serif text-xl text-foreground">
              ilm<span className="text-primary">.io</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isTeacher && (
              <Link
                href="/learn"
                className="tap-target hidden items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-secondary sm:inline-flex"
              >
                <Eye className="h-4 w-4" aria-hidden="true" />
                Preview as student
              </Link>
            )}
            <button
              type="button"
              onClick={() => setComfortOpen((v) => !v)}
              aria-expanded={comfortOpen}
              aria-controls="comfort-panel"
              className="tap-target inline-flex items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium text-foreground hover:bg-secondary"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Comfort
            </button>
          </div>
        </div>
      </header>

      {comfortOpen && (
        <ComfortPanel isTeacher={isTeacher} onClose={() => setComfortOpen(false)} />
      )}

      <div className="mx-auto flex max-w-7xl">
        {/* Side nav: teachers only, desktop only */}
        {isTeacher && (
          <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border p-4 lg:block">
            <nav className="space-y-1" aria-label="Teacher">
              {teacherNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-secondary'
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        )}

        <main
          className={cn(
            'min-h-[calc(100vh-4rem)] min-w-0 flex-1 px-4 pt-6 sm:px-6',
            isTeacher ? 'pb-28 lg:pb-10' : 'pb-10'
          )}
        >
          {children}
        </main>
      </div>

      {/* Bottom bar: teachers on phones. Students have one place to go, so no bar. */}
      {isTeacher && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
          aria-label="Teacher"
        >
          <div className="flex items-stretch justify-around px-2">
            {teacherNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex min-h-[60px] flex-1 flex-col items-center justify-center gap-1 text-sm font-medium',
                    active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}

/* ---------------- Comfort panel ---------------- */

function ComfortPanel({ isTeacher, onClose }: { isTeacher: boolean; onClose: () => void }) {
  const { prefs, setPref, resetPrefs } = usePreferences();
  const { theme, setTheme } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const sizes: { value: TextSize; label: string }[] = [
    { value: 'normal', label: 'A' },
    { value: 'large', label: 'A+' },
    { value: 'xlarge', label: 'A++' },
  ];

  return (
    <div className="fixed inset-0 top-16 z-30" onClick={onClose}>
      <div
        id="comfort-panel"
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-label="Comfort settings"
        onClick={(e) => e.stopPropagation()}
        className="ml-auto max-h-[calc(100vh-5rem)] w-full overflow-y-auto border-b border-l border-border bg-card p-5 sm:mr-4 sm:mt-2 sm:w-96 sm:rounded-xl sm:border"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-xl text-foreground">Comfort settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Make ilm.io feel right for you. We remember your choices on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tap-target flex items-center justify-center rounded-lg hover:bg-secondary"
            aria-label="Close comfort settings"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 divide-y divide-border">
          <Toggle
            id="pref-calm"
            label="Calm mode"
            hint="No movement, fewer colours, quieter screen."
            checked={prefs.calmMode}
            onChange={(v) => setPref('calmMode', v)}
          />
          <Toggle
            id="pref-font"
            label="Reading font"
            hint="An easier-to-read font with clearer letters."
            checked={prefs.readingFont}
            onChange={(v) => setPref('readingFont', v)}
          />
          <Toggle
            id="pref-spacing"
            label="Extra spacing"
            hint="More space between lines and words."
            checked={prefs.extraSpacing}
            onChange={(v) => setPref('extraSpacing', v)}
          />
          <Toggle
            id="pref-dark"
            label="Dark screen"
            hint="Darker background, softer light."
            checked={theme === 'dark'}
            onChange={(v) => setTheme(v ? 'dark' : 'light')}
          />

          <div className="py-4">
            <p className="font-medium text-foreground" id="text-size-label">
              Text size
            </p>
            <div className="mt-2 flex gap-2" role="group" aria-labelledby="text-size-label">
              {sizes.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setPref('textSize', s.value)}
                  aria-pressed={prefs.textSize === s.value}
                  className={cn(
                    'tap-target flex-1 rounded-lg border font-medium',
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
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={resetPrefs}
            className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Reset to default
          </button>
          {isTeacher ? (
            <Link
              href="/learn"
              onClick={onClose}
              className="text-sm font-medium text-primary underline underline-offset-4 sm:hidden"
            >
              Preview as student
            </Link>
          ) : (
            <Link
              href="/teacher/lessons"
              onClick={onClose}
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Teacher? Open teacher view
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <label htmlFor={id} className="cursor-pointer">
        <span className="block font-medium text-foreground">{label}</span>
        <span className="block text-sm text-muted-foreground">{hint}</span>
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-full border-2 transition-colors',
          checked ? 'border-primary bg-primary' : 'border-input bg-secondary'
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 h-6 w-6 rounded-full bg-card transition-transform',
            checked ? 'translate-x-6' : 'translate-x-0.5'
          )}
          aria-hidden="true"
        />
        <span className="sr-only">{checked ? 'On' : 'Off'}</span>
      </button>
    </div>
  );
}
