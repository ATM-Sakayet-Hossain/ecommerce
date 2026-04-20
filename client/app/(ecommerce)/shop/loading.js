export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
          <div className="mt-4 space-y-3">
            <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-11 animate-pulse rounded-2xl bg-slate-100" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
