export default function AIAlerts() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI Alerts</h1>
      <p className="mt-2 text-sm text-slate-600">
        Reads from <code>/aiAlerts</code> where <code>resolved == false</code>, ordered by severity then createdAt desc.
        Click an alert to view the underlying order/ticket. Approving an alert calls <code>aiApproveAction</code>.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        Alert types: <code>order_monitor</code>, <code>support_escalation</code>, <code>anomaly</code>.<br/>
        Severity: <code>info</code> | <code>warning</code> | <code>critical</code>.
      </div>
    </div>
  );
}
