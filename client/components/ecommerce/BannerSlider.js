"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";

function BannerSlider({ banners, fallbackTitle = "No active campaigns right now", fallbackSubtitle = "Scheduled banners will appear here when they are live." }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || banners.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [banners.length, paused]);

  useEffect(() => {
    if (activeIndex >= banners.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, banners.length]);

  if (!banners.length) {
    return (
      <div className="relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.28),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="relative max-w-2xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">Campaigns</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{fallbackTitle}</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">{fallbackSubtitle}</p>
        </div>
      </div>
    );
  }

  const slide = banners[activeIndex];

  return (
    <section
      className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.18)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative aspect-4/5 min-h-[24rem] sm:aspect-16/9 lg:aspect-21/8">
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 1200px"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.76))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_30%)]" />

        <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-8 lg:p-10">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-100 backdrop-blur-md">
              Live campaign
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
                {slide.title}
              </h2>
              {slide.subtitle ? (
                <p className="max-w-xl text-sm leading-6 text-slate-200 sm:text-base lg:text-lg">
                  {slide.subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300 sm:text-sm">
              {slide.startDate ? (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  Starts {slide.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              ) : null}
              {slide.endDate ? (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  Ends {slide.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  aria-label={`Show banner ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2.5 rounded-full transition-all ${index === activeIndex ? "w-10 bg-white" : "w-2.5 bg-white/40 hover:bg-white/70"}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                onClick={() => setPaused((current) => !current)}
                aria-label={paused ? "Resume slider" : "Pause slider"}
              >
                {paused ? <FiPlay size={16} /> : <FiPause size={16} />}
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                onClick={() => setActiveIndex((current) => (current - 1 + banners.length) % banners.length)}
                aria-label="Previous banner"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                onClick={() => setActiveIndex((current) => (current + 1) % banners.length)}
                aria-label="Next banner"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BannerSlider;
