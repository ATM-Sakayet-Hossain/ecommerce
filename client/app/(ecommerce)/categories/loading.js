export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="h-128 animate-pulse rounded-3xl bg-slate-100" />
        <div className="space-y-4">
          <div className="h-60 animate-pulse rounded-4xl bg-slate-100" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
