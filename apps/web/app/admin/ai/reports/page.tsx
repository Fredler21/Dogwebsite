export default function AIReports() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Daily reports</h1>
      <p className="mt-2 text-sm text-slate-600">
        Reads from <code>/aiReports</code> where <code>type == &apos;daily&apos;</code>, ordered by <code>forDate</code> desc.
        Generated daily at 09:00 America/Toronto by <code>aiDailyReport</code>.
      </p>
    </div>
  );
}
