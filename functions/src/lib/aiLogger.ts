import { db } from './admin';

export interface AiLogEntry {
  task: string;
  inputSummary: string;
  output: unknown;
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
  relatedRef?: { collection: string; id: string };
  flagged?: boolean;
  reason?: string;
  [key: string]: unknown;
}

export async function logAi(entry: AiLogEntry): Promise<void> {
  await db.collection('aiLog').add({
    ...entry,
    at: Date.now()
  });
}
