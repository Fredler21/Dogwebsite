import type { ReactNode } from 'react';

export function DataTable<T>({ rows, columns, empty = 'No data' }: {
  rows: T[];
  columns: { key: string; label: string; render: (row: T) => ReactNode }[];
  empty?: string;
}) {
  if (rows.length === 0) return <div className="rounded border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">{empty}</div>;
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>{columns.map(c => <th key={c.key} className="px-4 py-2">{c.label}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map(c => <td key={c.key} className="px-4 py-3">{c.render(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
