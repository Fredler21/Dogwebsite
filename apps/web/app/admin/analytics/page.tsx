function StatCard({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="w-32 truncate text-sm">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded bg-slate-100">
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-16 text-right text-xs text-slate-600">{value}</span>
    </div>
  );
}

const MOCK_PRODUCTS = [
  { label: 'Premium Phone Mount', value: 142 },
  { label: 'Backseat Organizer', value: 118 },
  { label: 'Trunk Cargo Net', value: 94 },
  { label: 'Wireless Car Charger', value: 71 },
  { label: 'Steering Wheel Cover', value: 55 }
];
const MAX = Math.max(...MOCK_PRODUCTS.map(p => p.value));

export default function AdminAnalytics() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="mt-2 text-sm text-slate-600">
        Live KPIs powered by Firestore aggregates. GA4/Meta/TikTok/Pinterest data lives in those dashboards.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Revenue (30d)" value="$24,180" hint="paid orders only" />
        <StatCard title="Orders (30d)" value="312" hint="↑ 14% vs prior 30d" />
        <StatCard title="Gross margin" value="38.2%" hint="net of supplier cost + Stripe fees" />
        <StatCard title="Refund rate" value="2.1%" hint="target < 3%" />
      </div>

      <h2 className="mt-10 text-lg font-semibold">Top products (30d)</h2>
      <div className="mt-4 space-y-2 rounded-lg border border-slate-200 bg-white p-4">
        {MOCK_PRODUCTS.map(p => <Bar key={p.label} {...p} max={MAX} />)}
      </div>

      <p className="mt-6 text-xs text-slate-500">Mocked values. Wire to <code>/orderAggregates</code> daily rollup written by <code>aiDailyReport</code> (V6).</p>
    </div>
  );
}
