export default function ProductPage({ params }: { params: { slug: string } }) {
  return <main className="mx-auto max-w-5xl p-8"><h1 className="text-2xl font-semibold">Product: {params.slug}</h1><p className="mt-2 text-slate-600">Placeholder.</p></main>;
}
