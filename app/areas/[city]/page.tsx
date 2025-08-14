export default function CityPage({ params }: { params: { city: string } }) {
  const city = decodeURIComponent(params.city || '').replace(/\b\w/g, (l) => l.toUpperCase());
  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-extrabold tracking-tight">{city} Property Management</h1>
        <p className="mt-3 text-white/80 max-w-2xl">
          Professional leasing, responsive maintenance, and transparent reporting in {city}. Get a free rent analysis to see your expected monthly income.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="/#lead" className="inline-flex items-center rounded-2xl bg-blue px-5 py-3 font-medium">Get rent analysis</a>
          <a href="/" className="inline-flex items-center rounded-2xl border border-white/15 px-5 py-3">Back home</a>
        </div>
      </section>
    </main>
  );
}
