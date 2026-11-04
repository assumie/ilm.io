import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <h1 className="font-serif text-3xl text-foreground">My Lessons</h1>
      <p className="mt-1 text-muted-foreground">
        Pick a lesson and choose how you want to learn.
      </p>
      <div className="mt-8 rounded-xl border border-border bg-card p-8 text-center">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-muted-foreground">
          No lessons available yet. Your teacher will publish lessons here.
        </p>
      </div>
    </div>
  );
}
