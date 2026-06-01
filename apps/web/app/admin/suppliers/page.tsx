export default function SuppliersList() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <a href="/admin/suppliers/new" className="rounded bg-brand px-4 py-2 text-sm text-white">New supplier</a>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        Reads from <code>/suppliers</code>. Columns: name, platform, region, lead time, on-time %, defect %, active.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        Scorecard fields (<code>onTimeRate</code>, <code>defectRate</code>, <code>avgLeadTimeDays</code>) are populated by the scheduled
        <code> computeSupplierScorecards</code> function shipped in V10.
      </div>
    </div>
  );
}
