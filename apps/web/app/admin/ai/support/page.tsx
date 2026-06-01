export default function AISupport() {
  return (
    <div>
      <h1 className="text-2xl font-bold">AI support assistant</h1>
      <p className="mt-2 text-sm text-slate-600">
        Tickets where <code>aiNeedsHumanReview == true</code> show first. Each card shows
        the AI summary, suggested reply, and escalation reasons. Admin edits and sends via
        <code> adminReplyToTicket</code>. Regenerate the draft with <code>aiDraftReply</code>.
      </p>
    </div>
  );
}
