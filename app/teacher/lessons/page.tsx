import Link from 'next/link';
import { LayoutDashboard, PlusCircle, ArrowRight } from 'lucide-react';

export default function TeacherLessonsPage() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-foreground">My Lessons</h1>
          <p className="mt-1 text-muted-foreground">
            Upload, review, and publish lessons for your classes.
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
        <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">
          No lessons yet. Upload your first lesson to get started.
        </p>
        <Link
          href="/teacher/lessons/new"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-all hover:bg-primary-dark"
        >
          <PlusCircle className="h-5 w-5" />
          Upload a lesson
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to ilm.io?{' '}
        <Link href="/about" className="font-medium text-primary underline underline-offset-4">
          See how it works
        </Link>
      </p>
    </div>
  );
}
