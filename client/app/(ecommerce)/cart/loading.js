export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-5 h-24 animate-pulse rounded-3xl bg-slate-100" />
      <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-4">
          <div className="h-[24rem] animate-pulse rounded-4xl bg-slate-100" />
          <div className="h-72 animate-pulse rounded-4xl bg-slate-100" />
        </div>
        <div className="h-[30rem] animate-pulse rounded-4xl bg-slate-100" />
      </div>
    </div>
  );
}
