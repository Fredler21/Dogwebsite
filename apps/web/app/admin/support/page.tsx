export default function AdminSupport() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Support tickets</h1>
      <p className="mt-2 text-sm text-slate-600">
        Reads from <code>/supportTickets</code>. Filter by status, priority, category.
        Reply via the <code>adminReplyToTicket</code> callable. AI classification + draft reply lands in V6.
      </p>
      <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 text-sm">
        <p>Ticket states: open → pending_admin → waiting_customer → solved → closed.</p>
        <p className="mt-2">Reply emails go through Resend and are logged to <code>/emailLogs</code>.</p>
      </div>
    </div>
  );
}
