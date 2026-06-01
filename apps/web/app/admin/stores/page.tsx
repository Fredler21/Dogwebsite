export default function StoresAdmin() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Stores</h1>
      <p className="mt-2 text-sm text-slate-600">
        Multi-store config. Each store has its own domain, theme preset, brand name, and product taxonomy.
        Backed by <code>/stores/{`{storeId}`}</code> — see <code>docs/MULTI_SITE_SETUP.md</code>.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        Current stores: <code>allyoucanuse</code> (default).<br/>
        Run <code>firebase deploy --only hosting:&lt;site&gt;</code> per store to publish.
      </div>
    </div>
  );
}
