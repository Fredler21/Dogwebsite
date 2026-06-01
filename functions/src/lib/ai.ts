import OpenAI from 'openai';
import { defineSecret } from 'firebase-functions/params';

const OPENAI_KEY = defineSecret('OPENAI_API_KEY');

let _client: OpenAI | null = null;
function client(): OpenAI {
  if (_client) return _client;
  const key = process.env.OPENAI_API_KEY ?? OPENAI_KEY.value();
  if (!key) throw new Error('OPENAI_API_KEY not set');
  _client = new OpenAI({ apiKey: key });
  return _client;
}

const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

export interface ChatOptions {
  json?: boolean;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResult {
  text: string;
  usage: { prompt: number; completion: number; total: number };
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export async function chat(system: string, user: string, opts: ChatOptions = {}): Promise<ChatResult> {
  const res = await client().chat.completions.create({
    model: MODEL,
    temperature: opts.temperature ?? 0.2,
    max_tokens: opts.maxTokens,
    response_format: opts.json ? { type: 'json_object' } : undefined,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]
  });
  const text = res.choices?.[0]?.message?.content ?? '';
  const u = res.usage;
  const promptTokens = u?.prompt_tokens ?? 0;
  const completionTokens = u?.completion_tokens ?? 0;
  const totalTokens = u?.total_tokens ?? 0;
  return {
    text,
    usage: { prompt: promptTokens, completion: completionTokens, total: totalTokens },
    promptTokens,
    completionTokens,
    totalTokens
  };
}

/** Best-effort JSON parse — returns null on failure rather than throwing. */
export function parseJson<T = unknown>(s: string): T | null {
  try { return JSON.parse(s) as T; } catch { return null; }
}
