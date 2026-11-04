import { notFound } from 'next/navigation';
import { getLessonBundle } from '@/lib/lessons';
import { LessonPlayer } from '@/components/learn/lesson-player';

export const dynamic = 'force-dynamic';

export default async function LearnLessonPage({ params }: { params: { id: string } }) {
  const lesson = await getLessonBundle(params.id);
  if (!lesson) notFound();
  return <LessonPlayer lesson={lesson} />;
}
