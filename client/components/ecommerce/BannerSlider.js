"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import { API, apiPath } from "@/lib/routes";

function BannerSlider() {
  const [banners, setBanners] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    const loadBanners = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}${apiPath(API.banner.get)}`,
          {
            next: { revalidate: 500000 },
          },
        );
        if (!response.ok) {
          throw new Error("Unable to load banners");
        }
        const payload = await response.json();
        const nextBanners = payload?.data?.banners || payload?.banners || [];
        if (isMounted) {
          setBanners(nextBanners);
          setActiveIndex(0);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load banners",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    loadBanners();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused || banners.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [paused, banners.length]);

  useEffect(() => {
    if (activeIndex >= banners.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, banners.length]);

  const slide = banners[activeIndex];
  const slideImage = typeof slide?.image === "string" ? slide.image.trim() : "";

  const formatDate = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (isLoading) {
    return (
      <section className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <div className="relative aspect-4/5 min-h-96 sm:aspect-video lg:aspect-21/8">
          <Image
            src="/banner.png"
            alt="Loading banner"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1200px"
            priority
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(15,23,42,0.24))]" />
          <div className="relative flex h-full flex-col justify-end p-5 text-white sm:p-8 lg:p-10">
            <div className="max-w-2xl space-y-6">
              <div className="h-6 w-32 rounded-full bg-white/30" />
              <div className="h-12 w-3/4 rounded-2xl bg-white/25 sm:h-14 lg:h-20" />
              <div className="h-4 w-full max-w-xl rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex min-h-96 items-center justify-center p-8 text-sm font-medium text-rose-200">
          {error}
        </div>
      </section>
    );
  }

  if (!slide) {
    return (
      <section className="overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
        <div className="flex min-h-96 items-center justify-center p-8 text-sm font-medium text-slate-300">
          No banners available.
        </div>
      </section>
    );
  }

  return (
    <section className="group relative overflow-hidden rounded-4xl border border-slate-200 bg-slate-950 shadow-[0_20px_60px_rgba(15,23,42,0.18)]">
      <div className="relative aspect-4/5 min-h-96 sm:aspect-video lg:aspect-21/8">
        {slideImage ? (
          <Image
            src={slideImage}
            alt={slide?.title || "Banner image"}
            fill
            className="flex items-center justify-end h-20 w-20 object-cover transition duration-700 group-hover:scale-[1.08]"
            sizes="(max-width: 768px) 100vw, 1200px"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.15),rgba(2,6,23,0.76))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_30%)]" />
        {/* banner contant */}
        <div className="relative flex h-full flex-col justify-around p-5 text-white sm:p-8 lg:p-10">
          <div className="max-w-2xl space-y-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-100 backdrop-blur-md">
              Live campaign
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </div>
            <div className="space-y-10">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-6xl">
                {slide?.title}
              </h2>
              {slide?.subtitle ? (
                <p className="max-w-xl text-sm leading-6 text-slate-200 sm:text-base lg:text-lg">
                  {slide?.subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300 sm:text-sm">
              {slide?.startDate ? (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  Starts {formatDate(slide?.startDate)}
                </span>
              ) : null}
              {slide?.endDate ? (
                <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  Ends {formatDate(slide?.endDate)}
                </span>
              ) : null}
            </div>
          </div>
          {/* banner button */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {banners.map((banner, index) => (
                <button
                  key={banner?._id ?? banner?.slug ?? index}
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
                onClick={() =>
                  setActiveIndex(
                    (current) =>
                      (current - 1 + banners.length) % banners.length,
                  )
                }
                aria-label="Previous banner"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/15"
                onClick={() =>
                  setActiveIndex((current) => (current + 1) % banners.length)
                }
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
