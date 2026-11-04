import Link from 'next/link';
import {
  Upload,
  Bot,
  GraduationCap,
  GalleryHorizontal,
  Network,
  BookOpenText,
  Headphones,
  ListChecks,
  Languages,
  ShieldCheck,
  Leaf,
} from 'lucide-react';

/*
 * /about — product overview for teachers, schools and judges.
 * Kept calm on purpose: no decorative blobs or motion, one accent colour,
 * icons that describe what each format actually is.
 */

const steps = [
  {
    icon: Upload,
    title: 'Teacher uploads',
    text: 'Upload a lesson PDF. The AI finds the key ideas and science terms.',
  },
  {
    icon: Bot,
    title: 'AI builds the formats',
    text: 'Five formats in five languages. The teacher checks and approves each one.',
  },
  {
    icon: GraduationCap,
    title: 'Students learn their way',
    text: 'Each student picks the format and language that works for them.',
  },
];

const formats = [
  {
    icon: GalleryHorizontal,
    name: 'Focus Slides',
    text: 'One idea per slide in big text. An optional focus timer and movement breaks, both off unless the student turns them on.',
  },
  {
    icon: Network,
    name: 'Mind Map',
    text: 'The whole topic in one calm picture. Tap a branch to see one short fact.',
  },
  {
    icon: BookOpenText,
    name: 'Easy Read',
    text: 'Short sentences and common words, with a reading font, bigger text and a reading ruler.',
  },
  {
    icon: Headphones,
    name: 'Audio',
    text: 'The lesson read aloud at the speed you choose, with each sentence highlighted.',
  },
  {
    icon: ListChecks,
    name: 'Quick Check',
    text: 'Three short questions. Wrong answers explain why, and you can try again.',
  },
];

const languages = ['English', 'Bahasa Melayu', '中文', 'தமிழ்', 'Rojak'];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl border border-border bg-card px-6 py-12 sm:px-10">
        <p className="text-sm font-medium text-muted-foreground">
          AI teaching assistant for Malaysian classrooms
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">
          One upload. <span className="text-primary">Many ways to learn.</span>
        </h1>
        <p className="mt-5 max-w-[60ch] text-lg text-foreground">
          ilm.io turns one lesson into five learning formats in five languages, so
          students with ADHD, dyslexia, autism and other learning differences can
          learn the same lesson in the way that suits them.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/teacher/lessons/new"
            className="tap-target inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary-dark"
          >
            <Upload className="h-5 w-5" aria-hidden="true" />
            Upload a lesson
          </Link>
          <Link
            href="/learn"
            className="tap-target inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium text-foreground hover:bg-secondary"
          >
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
            Open student view
          </Link>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">How it works</h2>
        <ol className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.title} className="rounded-xl border border-border bg-card p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                </div>
                <h3 className="mt-4 font-serif text-lg text-foreground">{s.title}</h3>
                <p className="mt-2 text-foreground">{s.text}</p>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">Five ways to learn</h2>
        <p className="mt-2 text-foreground">
          Any student can use any format. No labels, no diagnosis, just choice.
        </p>
        <ul className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <li key={f.name} className="flex gap-4 p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-foreground">{f.name}</h3>
                  <p className="mt-1 text-foreground">{f.text}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6">
          <Languages className="h-6 w-6 text-primary" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg text-foreground">Five languages</h3>
          <p className="mt-2 text-foreground">{languages.join(' · ')}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <Leaf className="h-6 w-6 text-primary" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg text-foreground">Calm by design</h3>
          <p className="mt-2 text-foreground">
            No autoplay, no flashing, no countdown pressure. Calm mode, reading font
            and text size are one tap away.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
          <h3 className="mt-3 font-serif text-lg text-foreground">Privacy first</h3>
          <p className="mt-2 text-foreground">
            Students are children. We store no diagnosis and show teachers class-level
            patterns only.
          </p>
        </div>
      </section>
    </div>
  );
}
