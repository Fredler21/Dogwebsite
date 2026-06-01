import { StatCard } from '@/components/admin/StatCard';

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Today sales" value="$0.00" hint="Live via Firestore aggregation (V7)" />
        <StatCard label="Pending orders" value="0" />
        <StatCard label="Unfulfilled" value="0" />
        <StatCard label="Delayed" value="0" hint="Surfaced by AI in V6" />
        <StatCard label="Open tickets" value="0" />
        <StatCard label="Refund requests" value="0" />
        <StatCard label="AI urgent alerts" value="0" />
        <StatCard label="Estimated profit" value="$0.00" />
      </div>
    </div>
  );
}
