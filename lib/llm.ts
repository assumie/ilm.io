/*
 * llm.ts — Single wrapper module for all LLM calls.
 *
 * Reads LLM_BASE_URL, LLM_API_KEY, LLM_MODEL from environment.
 * Uses an OpenAI-compatible client. If no LLM env vars are set,
 * falls back to a deterministic mock so the app works out of the box.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
}

export function getLLMConfig(): LLMConfig | null {
  const baseUrl = process.env.LLM_BASE_URL;
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL;

  if (!baseUrl || !apiKey || !model) {
    return null;
  }
  return { baseUrl, apiKey, model };
}

export function hasLLM(): boolean {
  return getLLMConfig() !== null;
}

/**
 * Call the LLM with messages and return the text response.
 * If no LLM is configured, throws so callers can catch and use fallback.
 */
export async function callLLM(messages: LLMMessage[]): Promise<string> {
  const config = getLLMConfig();
  if (!config) {
    throw new Error('No LLM configured');
  }

  const response = await fetch(`${config.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`LLM API error ${response.status}: ${text}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') {
    throw new Error('LLM returned empty or invalid response');
  }
  return content;
}

/**
 * Call the LLM and parse the response as JSON.
 * Retries once if the JSON is invalid.
 */
export async function callLLMJSON<T>(
  messages: LLMMessage[],
  fallback: T
): Promise<T> {
  const config = getLLMConfig();

  if (!config) {
    return fallback;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callLLM(messages);
      const cleaned = extractJSON(raw);
      return JSON.parse(cleaned) as T;
    } catch (err) {
      if (attempt === 1) {
        console.error('LLM JSON parse failed after retry:', err);
        return fallback;
      }
    }
  }
  return fallback;
}

function extractJSON(text: string): string {
  // Strip markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  // Find the first { or [ and last } or ]
  const firstBrace = cleaned.search(/[{[]/);
  const lastBrace = cleaned.search(/[}\]]\s*$/);
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}
