import Link from 'next/link';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="space-y-6">
        <h1 className="text-3xl font-semibold">Job detail</h1>
        <p className="text-base text-neutral-600">
          This job detail route is available at <span className="font-mono">/jobs/{id}</span>.
        </p>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            A full job detail page is not yet wired. Use this page as a placeholder while the App Router route structure is complete.
          </p>
        </div>
        <Link href="/jobs" className="inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-black">
          Back to job listings
        </Link>
      </div>
    </main>
  );
}
