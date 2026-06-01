export default function AIOrderMonitor() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI order monitor</h1>
      <p className="mt-2 text-sm text-slate-600">
        Last <code>aiMonitorOrders</code> scan results. Runs every 6 hours via Cloud Scheduler.
      </p>
    </div>
  );
}
