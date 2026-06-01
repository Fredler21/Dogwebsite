export default function SupplierScorecards() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Supplier scorecards</h1>
      <p className="mt-2 text-sm text-slate-600">
        Computed nightly by <code>computeSupplierScorecards</code> (V10). Sorts suppliers by composite score:
        on-time delivery (50%) + defect-free rate (30%) + lead-time vs. promised (20%).
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        Use this view to fire underperforming suppliers, request lower pricing, or rebalance SKU coverage.
      </div>
    </div>
  );
}
