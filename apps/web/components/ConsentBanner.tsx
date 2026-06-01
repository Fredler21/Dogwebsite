'use client';
import { useEffect, useState } from 'react';

const KEY = 'ayc-consent-v1';

export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { if (!localStorage.getItem(KEY)) setShow(true); }, []);
  if (!show) return null;

  function accept(value: 'all' | 'essential') {
    localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() }));
    setShow(false);
    // Pixels auto-respect DNT; if user picks "essential" we also signal via a global flag.
    (window as unknown as { __consent?: string }).__consent = value;
  }

  return (
    <div role="dialog" aria-live="polite" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies for essential site functions and (with your consent) analytics + ads. See our <a className="underline" href="/privacy">Privacy Policy</a>.
        </p>
        <div className="flex gap-2">
          <button onClick={() => accept('essential')} className="rounded border border-slate-300 px-4 py-2 text-sm">Essential only</button>
          <button onClick={() => accept('all')} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">Accept all</button>
        </div>
      </div>
    </div>
  );
}
