"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.14),transparent_28%)]" />
            <div className="relative space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">
                  Application Error
                </p>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                  Something broke while rendering this page.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-300">
                  The app caught a fatal error and switched to a recovery view. You can retry the render or reload the app.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-300">
                <p className="mb-2 font-semibold text-slate-100">Error details</p>
                <p className="break-words text-xs leading-5 text-slate-400">
                  {error?.message || "Unknown error"}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                >
                  Reload app
                </button>
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}