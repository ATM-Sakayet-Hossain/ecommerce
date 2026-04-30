"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import CategoryCard from "../UI/CategoryCard";

const CategorySlider = () => {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const updateControls = useCallback(() => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/category/get`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Unable to load categories");
        }

        const payload = await response.json();
        const nextCategories =
          payload?.data?.categories || payload?.categories || [];

        if (isMounted) {
          setCategories(nextCategories);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load categories",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    updateControls();

    window.addEventListener("resize", updateControls);

    return () => {
      window.removeEventListener("resize", updateControls);
    };
  }, [categories.length, updateControls]);

  const scrollByCard = (direction) => {
    const element = scrollRef.current;

    if (!element) {
      return;
    }

    const card = element.querySelector("[data-slider-item]");
    const cardWidth =
      card?.getBoundingClientRect().width ?? element.clientWidth;
    const styles = window.getComputedStyle(element);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");

    element.scrollBy({
      left: direction * (cardWidth + gap),
      behavior: "smooth",
    });
  };

  if (isLoading) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex min-h-56 items-center justify-center rounded-3xl bg-slate-50 text-sm text-slate-500">
          Loading categories...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex min-h-56 items-center justify-center rounded-3xl bg-slate-50 text-sm text-rose-600">
          {error}
        </div>
      </section>
    );
  }

  if (!categories.length) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 pt-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
            Category tree
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-950">
            Featured Categories
          </h2>
        </div>

        <Link
          href="/categories"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
        >
          Open all categories
        </Link>
      </div>

      <div className="relative mt-2 rounded-3xl bg-slate-50/80">
        <div
          ref={scrollRef}
          onScroll={updateControls}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((cat) => (
            <Link
              key={cat?.slug}
              href={`/categories/${cat?.slug}`}
              data-slider-item
              className="block min-w-0 shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/6"
            >
              <CategoryCard data={cat} />
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:px-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous category"
            className="pointer-events-auto transition text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleLeft size={30} />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Next category"
            className="pointer-events-auto transition text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleRight size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySlider;
