import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { listStudentLessons } from '@/lib/lessons';

export const dynamic = 'force-dynamic';

export default async function LearnPage() {
  const lessons = await listStudentLessons();

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="font-serif text-3xl text-foreground sm:text-4xl">My lessons</h1>
      <p className="mt-2 text-foreground">
        Pick a lesson. Then choose the way you like to learn.
      </p>

      <ul className="mt-6 space-y-3">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              href={`/learn/${lesson.id}`}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 hover:bg-secondary"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <BookOpen className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-xl text-foreground">{lesson.title}</span>
                <span className="mt-0.5 block text-sm text-muted-foreground">
                  {lesson.subject}
                  {lesson.level ? ` · ${lesson.level}` : ''} · {lesson.formatCount} ways to learn
                  {lesson.isSample ? ' · Sample lesson' : ''}
                </span>
              </span>
              <ChevronRight className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
