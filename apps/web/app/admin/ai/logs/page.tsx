export default function AILogs() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI logs</h1>
      <p className="mt-2 text-sm text-slate-600">
        Every AI call is recorded to <code>/aiLogs</code> with task, model, token counts, related record,
        and whether the call was flagged. Use this to audit cost and behavior.
      </p>
    </div>
  );
}
