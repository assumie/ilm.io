/*
 * agents.ts — All AI agents for the ilm.io pipeline.
 *
 * Reader Agent: parses raw lesson text into structured key ideas and terms.
 * Output Agents: each produces a specific learning format in a specific language.
 * Orchestrator: runs output agents in parallel for all formats × languages.
 *
 * Every agent tries the LLM first, then falls back to a deterministic mock
 * that restructures the reader output without adding new facts.
 */

import { callLLMJSON } from './llm';
import type { LessonOutputFormat, LessonOutputLanguage } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────

export interface KeyIdea {
  heading: string;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  simple_definition: string;
}

export interface ReaderOutput {
  title: string;
  subject: string;
  level: string;
  key_ideas: KeyIdea[];
  key_terms: KeyTerm[];
}

export interface FocusSlide {
  heading: string;
  one_sentence: string;
}

export interface FocusSlidesOutput {
  slides: (FocusSlide | { type: 'break'; heading: string })[];
}

export interface MindMapBranch {
  label: string;
  fact: string;
}

export interface MindMapOutput {
  center: string;
  branches: MindMapBranch[];
}

export interface EasyReadSection {
  heading: string;
  sentences: string[];
}

export type EasyReadOutput = EasyReadSection[];

export type AudioScriptOutput = string[];

export interface QuickCheckQuestion {
  question: string;
  options: string[];
  answer_index: number;
  why: string;
}

export type QuickCheckOutput = QuickCheckQuestion[];

export type AgentOutput =
  | FocusSlidesOutput
  | MindMapOutput
  | EasyReadOutput
  | AudioScriptOutput
  | QuickCheckOutput;

// ─── Language labels ──────────────────────────────────────────────────────

export const LANGUAGE_LABELS: Record<LessonOutputLanguage, string> = {
  en: 'English',
  bm: 'Bahasa Melayu',
  zh: '中文',
  ta: 'தமிழ்',
  rojak: 'Manglish / Rojak',
};

export const LANGUAGE_INSTRUCTIONS: Record<LessonOutputLanguage, string> = {
  en: 'Write in clear, simple English.',
  bm: 'Write in clear, simple Bahasa Melayu.',
  zh: 'Write in clear, simple Chinese (简体中文).',
  ta: 'Write in clear, simple Tamil (தமிழ்).',
  rojak: 'Write in Malaysian Rojak — a natural mix of English, Bahasa Melayu, and casual Malaysian expressions.',
};

export const FORMAT_LABELS: Record<LessonOutputFormat, string> = {
  focus_slides: 'Focus Slides',
  mind_map: 'Mind Map',
  easy_read: 'Easy Read',
  audio_script: 'Audio Script',
  quick_check: 'Quick Check',
};

export const ALL_FORMATS: LessonOutputFormat[] = [
  'focus_slides',
  'mind_map',
  'easy_read',
  'audio_script',
  'quick_check',
];

export const ALL_LANGUAGES: LessonOutputLanguage[] = [
  'en',
  'bm',
  'zh',
  'ta',
  'rojak',
];

// ─── Reader Agent ─────────────────────────────────────────────────────────

export async function runReaderAgent(rawText: string): Promise<ReaderOutput> {
  const systemPrompt = `You are an expert educational content analyst for Malaysian classrooms. 
Analyze the given lesson text and extract its structure. 
Return ONLY valid JSON with this exact shape:
{
  "title": string,
  "subject": string,
  "level": string (e.g. "Tahun 4" or "Year 4"),
  "key_ideas": [{ "heading": string, "explanation": string }],
  "key_terms": [{ "term": string, "simple_definition": string }]
}
Rules:
- Only restructure the teacher's content. Do NOT add new facts.
- Keep meaning accurate.
- Write key_ideas and key_terms in the same language as the source text.
- "simple_definition" must use common, easy-to-understand words.`;

  const fallback = mockReaderOutput(rawText);

  return callLLMJSON<ReaderOutput>(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: rawText },
    ],
    fallback
  );
}

// ─── Output Agent: Focus Slides ───────────────────────────────────────────

async function runFocusSlides(
  reader: ReaderOutput,
  lang: LessonOutputLanguage
): Promise<FocusSlidesOutput> {
  const systemPrompt = `You are an expert in creating ADHD-friendly learning slides for children.
Create focus slides from the lesson content. 
Return ONLY valid JSON: { "slides": [{ "heading": string, "one_sentence": string }] }
Rules:
- ONE idea per slide.
- Each "one_sentence" must be max 15 words.
- Use the same key_ideas from the lesson — do NOT add new facts.
- Insert a movement break after every 3 slides as: { "type": "break", "heading": "Time to move!" }
- Keep meaning accurate.
- ${LANGUAGE_INSTRUCTIONS[lang]}`;

  const fallback = mockFocusSlides(reader, lang);

  return callLLMJSON<FocusSlidesOutput>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          title: reader.title,
          key_ideas: reader.key_ideas,
          key_terms: reader.key_terms,
        }),
      },
    ],
    fallback
  );
}

// ─── Output Agent: Mind Map ───────────────────────────────────────────────

async function runMindMap(
  reader: ReaderOutput,
  lang: LessonOutputLanguage
): Promise<MindMapOutput> {
  const systemPrompt = `You are an expert in creating visual mind maps for autistic and visual learners.
Create a mind map from the lesson content.
Return ONLY valid JSON: { "center": string, "branches": [{ "label": string, "fact": string }] }
Rules:
- "center" is the main topic (use the lesson title).
- Maximum 6 branches.
- Use literal wording, no idioms.
- Each "fact" must be a true fact from the lesson — do NOT add new facts.
- Keep meaning accurate.
- ${LANGUAGE_INSTRUCTIONS[lang]}`;

  const fallback = mockMindMap(reader, lang);

  return callLLMJSON<MindMapOutput>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          title: reader.title,
          key_ideas: reader.key_ideas,
          key_terms: reader.key_terms,
        }),
      },
    ],
    fallback
  );
}

// ─── Output Agent: Easy Read ──────────────────────────────────────────────

async function runEasyRead(
  reader: ReaderOutput,
  lang: LessonOutputLanguage
): Promise<EasyReadOutput> {
  const systemPrompt = `You are an expert in creating easy-to-read content for dyslexic learners.
Create an easy-read version of the lesson.
Return ONLY valid JSON: [{ "heading": string, "sentences": [string] }]
Rules:
- Max 12 words per sentence.
- Use common, everyday words.
- Keep science terms but explain them simply.
- Do NOT add new facts — only restructure the lesson content.
- Keep meaning accurate.
- ${LANGUAGE_INSTRUCTIONS[lang]}`;

  const fallback = mockEasyRead(reader, lang);

  return callLLMJSON<EasyReadOutput>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          title: reader.title,
          key_ideas: reader.key_ideas,
          key_terms: reader.key_terms,
        }),
      },
    ],
    fallback
  );
}

// ─── Output Agent: Audio Script ───────────────────────────────────────────

async function runAudioScript(
  reader: ReaderOutput,
  lang: LessonOutputLanguage
): Promise<AudioScriptOutput> {
  const systemPrompt = `You are an expert in writing narration scripts for auditory learners.
Create an audio narration script from the lesson.
Return ONLY valid JSON: ["sentence1", "sentence2", ...]
Rules:
- Write ordered sentences suitable for narration.
- Use a warm, clear, conversational tone.
- Do NOT add new facts — only restructure the lesson content.
- Keep meaning accurate.
- ${LANGUAGE_INSTRUCTIONS[lang]}`;

  const fallback = mockAudioScript(reader, lang);

  return callLLMJSON<AudioScriptOutput>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          title: reader.title,
          key_ideas: reader.key_ideas,
          key_terms: reader.key_terms,
        }),
      },
    ],
    fallback
  );
}

// ─── Output Agent: Quick Check ────────────────────────────────────────────

async function runQuickCheck(
  reader: ReaderOutput,
  lang: LessonOutputLanguage
): Promise<QuickCheckOutput> {
  const systemPrompt = `You are an expert in creating kind, encouraging quizzes for children.
Create 3 multiple-choice questions from the lesson.
Return ONLY valid JSON: [{ "question": string, "options": [string, string, string], "answer_index": number, "why": string }]
Rules:
- Exactly 3 questions.
- Each question has exactly 3 options.
- "answer_index" is 0, 1, or 2.
- "why" must explain the answer kindly and encouragingly.
- Questions must be based ONLY on facts in the lesson — do NOT add new facts.
- Keep meaning accurate.
- ${LANGUAGE_INSTRUCTIONS[lang]}`;

  const fallback = mockQuickCheck(reader, lang);

  return callLLMJSON<QuickCheckOutput>(
    [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: JSON.stringify({
          title: reader.title,
          key_ideas: reader.key_ideas,
          key_terms: reader.key_terms,
        }),
      },
    ],
    fallback
  );
}

// ─── Orchestrator ─────────────────────────────────────────────────────────

export interface OrchestratorTask {
  format: LessonOutputFormat;
  language: LessonOutputLanguage;
}

export interface OrchestratorResult {
  format: LessonOutputFormat;
  language: LessonOutputLanguage;
  content: AgentOutput;
}

export function buildTasks(
  formats: LessonOutputFormat[] = ALL_FORMATS,
  languages: LessonOutputLanguage[] = ALL_LANGUAGES
): OrchestratorTask[] {
  const tasks: OrchestratorTask[] = [];
  for (const format of formats) {
    for (const language of languages) {
      tasks.push({ format, language });
    }
  }
  return tasks;
}

export async function runOutputAgent(
  reader: ReaderOutput,
  format: LessonOutputFormat,
  language: LessonOutputLanguage
): Promise<AgentOutput> {
  switch (format) {
    case 'focus_slides':
      return runFocusSlides(reader, language);
    case 'mind_map':
      return runMindMap(reader, language);
    case 'easy_read':
      return runEasyRead(reader, language);
    case 'audio_script':
      return runAudioScript(reader, language);
    case 'quick_check':
      return runQuickCheck(reader, language);
  }
}

/**
 * Run all output agents in parallel for all formats × languages.
 * Returns results as they complete (via callback) and as a final array.
 */
export async function runOrchestrator(
  reader: ReaderOutput,
  tasks: OrchestratorTask[],
  onProgress?: (result: OrchestratorResult) => void
): Promise<OrchestratorResult[]> {
  const promises = tasks.map(async (task) => {
    const content = await runOutputAgent(reader, task.format, task.language);
    const result: OrchestratorResult = {
      format: task.format,
      language: task.language,
      content,
    };
    onProgress?.(result);
    return result;
  });

  return Promise.all(promises);
}

// ─── Mock fallbacks ───────────────────────────────────────────────────────
// These restructure the reader output deterministically without adding facts.

function mockReaderOutput(rawText: string): ReaderOutput {
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const title = lines[0]?.replace(/^#+\s*/, '') || 'Untitled Lesson';

  // Detect subject and level from text
  const lowerText = rawText.toLowerCase();
  let subject = 'General';
  if (lowerText.includes('sains') || lowerText.includes('science')) subject = 'Sains / Science';
  else if (lowerText.includes('matematik') || lowerText.includes('mathematics')) subject = 'Matematik / Mathematics';
  else if (lowerText.includes('bahasa')) subject = 'Bahasa / Language';

  let level = 'Tahun 4';
  if (lowerText.includes('tahun 5') || lowerText.includes('year 5')) level = 'Tahun 5';
  else if (lowerText.includes('tahun 6') || lowerText.includes('year 6')) level = 'Tahun 6';

  // Extract key ideas: look for heading-like lines
  const keyIdeas: KeyIdea[] = [];
  const keyTerms: KeyTerm[] = [];

  let currentHeading: string | null = null;
  let currentExplanation: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const isHeading =
      /^(#{1,4}\s|[\d]+[.)]\s|[A-Z][A-Z\s]{3,})/.test(line) ||
      (line.length < 80 && line.endsWith(':'));

    if (isHeading && currentHeading) {
      keyIdeas.push({
        heading: currentHeading.replace(/^#+\s/, '').replace(/:$/, ''),
        explanation: currentExplanation.join(' ').trim(),
      });
      currentHeading = line.replace(/^#+\s/, '').replace(/:$/, '');
      currentExplanation = [];
    } else if (isHeading) {
      currentHeading = line.replace(/^#+\s/, '').replace(/:$/, '');
      currentExplanation = [];
    } else {
      currentExplanation.push(line);
    }
  }
  if (currentHeading) {
    keyIdeas.push({
      heading: currentHeading,
      explanation: currentExplanation.join(' ').trim(),
    });
  }

  // If we didn't find structured ideas, treat paragraphs as ideas
  if (keyIdeas.length === 0) {
    const paragraphs = rawText.split(/\n\n+/).filter((p) => p.trim().length > 20);
    for (const p of paragraphs.slice(0, 6)) {
      const firstLine = p.split('\n')[0].trim();
      keyIdeas.push({
        heading: firstLine.slice(0, 60),
        explanation: p.trim().slice(0, 300),
      });
    }
  }

  // Extract potential key terms (capitalized words or bold text)
  const termPattern = /(?:^|\s)([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)/g;
  const seenTerms = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = termPattern.exec(rawText)) !== null && keyTerms.length < 8) {
    const term = match[1].trim();
    if (term.length > 3 && !seenTerms.has(term) && !['The', 'This', 'That', 'When', 'What', 'How', 'Why'].includes(term)) {
      seenTerms.add(term);
      // Find context around the term for a simple definition
      const termIdx = rawText.indexOf(term);
      const context = rawText.slice(termIdx, Math.min(termIdx + 200, rawText.length)).split(/[.!\n]/)[0];
      keyTerms.push({
        term,
        simple_definition: context.trim().slice(0, 150) || `A key term in ${title}.`,
      });
    }
  }

  return {
    title,
    subject,
    level,
    key_ideas: keyIdeas.slice(0, 8),
    key_terms: keyTerms.slice(0, 8),
  };
}

function mockFocusSlides(reader: ReaderOutput, _lang: LessonOutputLanguage): FocusSlidesOutput {
  const slides: FocusSlidesOutput['slides'] = [];
  let count = 0;

  for (const idea of reader.key_ideas) {
    slides.push({
      heading: idea.heading,
      one_sentence: truncateWords(idea.explanation || idea.heading, 15),
    });
    count++;
    if (count % 3 === 0) {
      slides.push({ type: 'break', heading: 'Time to move!' });
    }
  }

  if (slides.length === 0) {
    slides.push({
      heading: reader.title,
      one_sentence: truncateWords(reader.title, 15),
    });
  }

  return { slides };
}

function mockMindMap(reader: ReaderOutput, _lang: LessonOutputLanguage): MindMapOutput {
  const branches: MindMapBranch[] = reader.key_ideas.slice(0, 6).map((idea) => ({
    label: idea.heading,
    fact: truncateWords(idea.explanation, 20),
  }));

  if (branches.length === 0) {
    branches.push({ label: reader.title, fact: 'The main topic of this lesson.' });
  }

  return {
    center: reader.title,
    branches,
  };
}

function mockEasyRead(reader: ReaderOutput, _lang: LessonOutputLanguage): EasyReadOutput {
  const sections: EasyReadOutput = reader.key_ideas.map((idea) => {
    const sentences = splitIntoShortSentences(idea.explanation, 12);
    return {
      heading: idea.heading,
      sentences: sentences.length > 0 ? sentences : [truncateWords(idea.heading, 12)],
    };
  });

  if (sections.length === 0) {
    sections.push({
      heading: reader.title,
      sentences: [truncateWords(reader.title, 12)],
    });
  }

  // Add key terms section
  if (reader.key_terms.length > 0) {
    sections.push({
      heading: 'Key Words',
      sentences: reader.key_terms.map((t) =>
        truncateWords(`${t.term}: ${t.simple_definition}`, 12)
      ),
    });
  }

  return sections;
}

function mockAudioScript(reader: ReaderOutput, _lang: LessonOutputLanguage): AudioScriptOutput {
  const sentences: string[] = [];
  sentences.push(`Today we are learning about ${reader.title}.`);

  for (const idea of reader.key_ideas) {
    sentences.push(`Let us talk about ${idea.heading}.`);
    if (idea.explanation) {
      const parts = splitIntoShortSentences(idea.explanation, 20);
      sentences.push(...parts);
    }
  }

  if (reader.key_terms.length > 0) {
    sentences.push('Here are some important words to remember.');
    for (const term of reader.key_terms) {
      sentences.push(`${term.term} means ${truncateWords(term.simple_definition, 20)}.`);
    }
  }

  sentences.push('That is all for today. Great job learning!');

  return sentences.length > 1 ? sentences : [`Today we are learning about ${reader.title}.`];
}

function mockQuickCheck(reader: ReaderOutput, _lang: LessonOutputLanguage): QuickCheckOutput {
  const questions: QuickCheckOutput = [];

  const ideas = reader.key_ideas.slice(0, 3);

  for (let i = 0; i < Math.max(3, ideas.length); i++) {
    const idea = ideas[i] || reader.key_ideas[0];
    if (!idea) break;

    const correct = truncateWords(idea.explanation || idea.heading, 12);
    const wrong1 = shiftWords(correct);
    const wrong2 = negateSentence(truncateWords(idea.heading, 12));

    questions.push({
      question: `What is true about ${idea.heading}?`,
      options: shuffleOptions([correct, wrong1, wrong2]),
      answer_index: 0, // will be fixed by shuffleOptions
      why: `Great thinking! ${idea.heading} is about ${truncateWords(idea.explanation, 20)}.`,
    });
  }

  // Fix answer_index after shuffle
  for (const q of questions) {
    const correctText = q.options[0];
    // Re-shuffle properly
    const opts = [correctText, q.options[1], q.options[2]];
    const shuffled = shuffleThree(opts);
    q.options = shuffled.options;
    q.answer_index = shuffled.answerIndex;
  }

  if (questions.length === 0) {
    questions.push({
      question: `What is this lesson about?`,
      options: [reader.title, 'Something else', 'Not sure'],
      answer_index: 0,
      why: `Great job! This lesson is about ${reader.title}.`,
    });
  }

  return questions.slice(0, 3);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ') + '.';
}

function splitIntoShortSentences(text: string, maxWords: number): string[] {
  if (!text) return [];
  const rawSentences = text.split(/(?<=[.!?])\s+/);
  const result: string[] = [];

  for (const s of rawSentences) {
    const words = s.trim().split(/\s+/);
    if (words.length <= maxWords) {
      result.push(s.trim());
    } else {
      // Split long sentences at natural breakpoints
      let current: string[] = [];
      for (const w of words) {
        current.push(w);
        if (current.length >= maxWords) {
          result.push(current.join(' ') + '.');
          current = [];
        }
      }
      if (current.length > 0) {
        result.push(current.join(' ') + '.');
      }
    }
  }

  return result.filter((s) => s.length > 0);
}

function shiftWords(text: string): string {
  const words = text.trim().split(/\s+/);
  if (words.length < 2) return `Not about ${text}.`;
  // Swap first two words to create a wrong answer
  return [words[1], words[0], ...words.slice(2)].join(' ');
}

function negateSentence(text: string): string {
  return `It is not true that ${text.toLowerCase()}.`;
}

interface ShuffledResult {
  options: string[];
  answerIndex: number;
}

function shuffleOptions(opts: string[]): string[] {
  return opts; // placeholder, fixed below
}

function shuffleThree(opts: string[]): ShuffledResult {
  const correct = opts[0];
  // Simple deterministic shuffle: rotate by 1
  const rotated = [opts[1], opts[2], opts[0]];
  const answerIndex = rotated.indexOf(correct);
  return { options: rotated, answerIndex };
}
