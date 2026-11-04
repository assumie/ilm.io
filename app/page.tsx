import Link from 'next/link';
import {
  GraduationCap,
  Upload,
  Sparkles,
  Layers,
  Heart,
  Eye,
  Headphones,
  HelpCircle,
  ArrowRight,
  Shield,
  Languages,
} from 'lucide-react';
import { ThemeToggleLink } from '@/components/theme-toggle-link';

const formats = [
  {
    icon: Eye,
    name: 'Focus Slides',
    description:
      'One idea per slide, big text, a 5-minute focus timer, and a movement break every 3 slides.',
    color: 'text-primary',
  },
  {
    icon: Layers,
    name: 'Mind Map',
    description:
      'A calm visual layout with a center concept and up to 6 branches — tap any branch for a fact.',
    color: 'text-accent',
  },
  {
    icon: Heart,
    name: 'Easy Read',
    description:
      'Short sentences, common words, dyslexia-friendly font option, bigger text, and a reading ruler.',
    color: 'text-primary',
  },
  {
    icon: Headphones,
    name: 'Audio',
    description:
      'Listen to the lesson narrated at adjustable speed, with each sentence highlighted as it is spoken.',
    color: 'text-accent',
  },
  {
    icon: HelpCircle,
    name: 'Quick Check',
    description:
      'Three gentle multiple-choice questions with kind, encouraging feedback — and a "try again" option.',
    color: 'text-primary',
  },
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'bm', label: 'Bahasa Melayu' },
  { code: 'zh', label: '中文' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'rojak', label: 'Manglish / Rojak' },
];

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-secondary px-6 py-16 sm:px-12 sm:py-24">
        <div className="absolute right-0 top-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -mb-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-accent" />
            AI teaching assistant for Malaysian classrooms
          </div>

          <h1 className="font-serif text-4xl leading-tight text-foreground sm:text-5xl md:text-6xl">
            One upload.
            <br />
            <span className="text-primary">Many ways</span> to learn.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ilm.io turns a single teacher-uploaded lesson into five accessible
            learning formats — focus slides, mind maps, easy read, audio, and a
            quick check — in five languages, designed for neurodivergent and
            special-needs students.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/teacher/lessons/new"
              className="tap-target inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all hover:bg-primary-dark hover:shadow-lg"
            >
              <Upload className="h-5 w-5" />
              Upload a lesson
            </Link>
            <Link
              href="/learn"
              className="tap-target inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-medium text-foreground transition-all hover:bg-secondary"
            >
              <GraduationCap className="h-5 w-5" />
              Explore as student
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          How it works
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-foreground">
              1. Teacher uploads
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Upload a lesson PDF. The AI reads the content and understands the
              key ideas, terms, subject, and level.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-foreground">
              2. AI generates
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Five output agents run in parallel, producing all formats in all
              languages. Watch live progress as each one completes.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg text-foreground">
              3. Students learn
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Approve and publish. Students open the lesson, pick a format and
              language that works for them, and learn at their own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Formats */}
      <section className="mt-16">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          Five ways to learn
        </h2>
        <p className="mt-2 text-muted-foreground">
          Every lesson becomes five formats. Any student can use any format —
          no labels, no diagnosis, just choice.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {formats.map((format) => {
            const Icon = format.icon;
            return (
              <div
                key={format.name}
                className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg bg-secondary ${format.color}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-serif text-lg text-foreground">
                  {format.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {format.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Languages */}
      <section className="mt-16 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Languages className="h-6 w-6 text-primary" />
          <h2 className="font-serif text-2xl text-foreground">
            Five languages
          </h2>
        </div>
        <p className="mt-2 text-muted-foreground">
          Every format is generated in all five languages, so every student
          learns in the language that suits them best.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {languages.map((lang) => (
            <span
              key={lang.code}
              className="rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-medium text-foreground"
            >
              {lang.label}
            </span>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="mt-16 mb-8">
        <h2 className="font-serif text-2xl text-foreground sm:text-3xl">
          Built for inclusion
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <Shield className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-serif text-lg text-foreground">
              Privacy first
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Students are minors. We store no diagnosis, minimal personal data,
              and follow a PDPA 2010 mindset. Insights are aggregated per class
              only.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <Heart className="h-6 w-6 text-accent" />
            <h3 className="mt-3 font-serif text-lg text-foreground">
              Calm by design
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              No autoplay, no flashing, no countdown pressure. Large tap
              targets, WCAG 2.1 AA contrast, and a calm cream-and-sage palette.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8 rounded-2xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
        <h2 className="font-serif text-2xl text-primary-foreground sm:text-3xl">
          Ready to make every lesson accessible?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
          Upload your first lesson and see it transform in minutes.
        </p>
        <Link
          href="/teacher/lessons/new"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 font-medium text-primary transition-all hover:shadow-lg"
        >
          Get started
          <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}
