export default function OrderSuccess({ searchParams }: { searchParams: { session_id?: string } }) {
  return (
    <main className="mx-auto max-w-md px-6 py-16 text-center">
      <h1 className="text-2xl font-bold">Thank you for your order!</h1>
      <p className="mt-2 text-slate-600">A confirmation email is on its way. We will send tracking once your order ships.</p>
      {searchParams.session_id && <p className="mt-4 text-xs text-slate-500">Session: {searchParams.session_id}</p>}
    </main>
  );
}
