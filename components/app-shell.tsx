'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

type Role = 'teacher' | 'student';

const teacherNav = [
  { href: '/teacher/lessons', label: 'My Lessons', icon: LayoutDashboard },
  { href: '/teacher/lessons/new', label: 'Upload Lesson', icon: PlusCircle },
  { href: '/teacher/insights', label: 'Insights', icon: BarChart3 },
];

const studentNav = [
  { href: '/learn', label: 'My Lessons', icon: BookOpen },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isTeacherRoute = pathname.startsWith('/teacher');
  const role: Role = isTeacherRoute ? 'teacher' : 'student';
  const navItems = role === 'teacher' ? teacherNav : studentNav;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="font-serif text-xl text-foreground">
              ilm<span className="text-accent">.io</span>
            </span>
          </Link>

          {/* Role switch + theme toggle (desktop) */}
          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-border bg-secondary p-1 sm:flex">
              <Link
                href="/teacher/lessons"
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  role === 'teacher'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Teacher
              </Link>
              <Link
                href="/learn"
                className={cn(
                  'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                  role === 'student'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                Student
              </Link>
            </div>

            <button
              onClick={toggleTheme}
              className="tap-target flex items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="tap-target flex items-center justify-center rounded-lg border border-border bg-card text-foreground lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileNavOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Side nav (desktop) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border p-4 lg:block">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href !== '/teacher/lessons' &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div
            className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur-md lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <nav className="space-y-1 p-4" onClick={(e) => e.stopPropagation()}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  pathname === item.href ||
                  (item.href !== '/teacher/lessons' &&
                    pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-4 py-3.5 text-base font-medium transition-colors',
                      active
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    <Icon className="h-6 w-6 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}

              {/* Role switch in mobile menu */}
              <div className="mt-4 flex rounded-full border border-border bg-secondary p-1">
                <Link
                  href="/teacher/lessons"
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'flex-1 rounded-full px-4 py-2 text-center text-sm font-medium',
                    role === 'teacher'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  Teacher
                </Link>
                <Link
                  href="/learn"
                  onClick={() => setMobileNavOpen(false)}
                  className={cn(
                    'flex-1 rounded-full px-4 py-2 text-center text-sm font-medium',
                    role === 'student'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  Student
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Main content */}
        <main className="min-h-[calc(100vh-4rem)] flex-1 px-4 pb-24 pt-6 sm:px-6 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card lg:hidden">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== '/teacher/lessons' &&
                pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 text-xs font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
