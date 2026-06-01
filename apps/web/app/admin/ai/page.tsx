import Link from 'next/link';

const SECTIONS = [
  { href: '/admin/ai/alerts', title: 'Alerts', desc: 'Risky orders, stuck shipments, anomalies.' },
  { href: '/admin/ai/orders', title: 'Order monitor', desc: 'AI scan of recent orders.' },
  { href: '/admin/ai/support', title: 'Support assistant', desc: 'AI-classified tickets + suggested replies.' },
  { href: '/admin/ai/reports', title: 'Daily reports', desc: 'Auto-generated daily briefing.' },
  { href: '/admin/ai/automation', title: 'Automation level', desc: 'Tune what AI may do without approval.' },
  { href: '/admin/ai/logs', title: 'AI logs', desc: 'Every prompt, response, and token count.' }
];

export default function AIHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI Operations Assistant</h1>
      <p className="mt-2 text-sm text-slate-600">
        AI suggests; humans decide. No refunds, cancellations, or price changes are ever executed autonomously.
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {SECTIONS.map(s => (
          <Link key={s.href} href={s.href} className="rounded-lg border border-slate-200 bg-white p-4 hover:border-brand-accent">
            <div className="font-semibold">{s.title}</div>
            <p className="mt-1 text-sm text-slate-600">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
