'use client';
import { useState } from 'react';

type Level = 'manual' | 'suggest' | 'assist' | 'autonomous_safe';

const LEVELS: Array<{ v: Level; title: string; desc: string }> = [
  { v: 'manual', title: 'Manual', desc: 'AI off. All actions human-initiated.' },
  { v: 'suggest', title: 'Suggest (default)', desc: 'AI classifies tickets, drafts replies, raises alerts. Humans send everything.' },
  { v: 'assist', title: 'Assist', desc: 'AI may auto-send tracking-status replies and review requests. Money actions still blocked.' },
  { v: 'autonomous_safe', title: 'Autonomous (safe)', desc: 'AI may auto-respond to clearly resolved tracking questions. Refunds, cancels, prices ALWAYS blocked.' }
];

export default function AutomationLevel() {
  const [level, setLevel] = useState<Level>('suggest');
  return (
    <div>
      <h1 className="text-2xl font-bold">AI automation level</h1>
      <p className="mt-2 text-sm text-slate-600">
        Refunds, cancellations, price changes, supplier payouts, and legal text edits are <strong>permanently blocked</strong> from AI execution at every level.
      </p>
      <div className="mt-6 space-y-3">
        {LEVELS.map(l => (
          <label key={l.v} className={`block cursor-pointer rounded-lg border p-4 ${level === l.v ? 'border-brand bg-brand/5' : 'border-slate-200 bg-white'}`}>
            <input type="radio" name="level" value={l.v} checked={level === l.v} onChange={() => setLevel(l.v)} className="mr-2" />
            <span className="font-semibold">{l.title}</span>
            <p className="ml-6 text-sm text-slate-600">{l.desc}</p>
          </label>
        ))}
      </div>
      <p className="mt-6 text-xs text-slate-500">Persisted to <code>/config/ai</code>.</p>
    </div>
  );
}
