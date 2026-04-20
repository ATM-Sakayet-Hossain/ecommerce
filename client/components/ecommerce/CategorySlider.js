"use client";
import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "../UI/CategoryCard";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import Link from "next/link";

const CategorySlider = ({ data }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateControls = () => {
    const element = scrollRef.current;
    if (!element) {
      return;
    }
    setCanScrollLeft(element.scrollLeft > 0);
    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    );
  };

  useEffect(() => {
    updateControls();
  }, [data?.length]);
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
  if (!data?.length) {
    return null;
  }

  return (
    <div className="bg-slate-100 flex items-center justify-center">
      <div className="w-full relative">
        {/* Slider */}
        <div
          ref={scrollRef}
          onScroll={updateControls}
          className="flex gap-3 overflow-x-auto scroll-smooth px-12 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {data.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              data-slider-item
              className="block min-w-0 shrink-0 basis-1/2 sm:basis-1/3 lg:basis-1/6"
            >
              <CategoryCard data={cat} />
            </Link>
          ))}
        </div>
        {/* Controls */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous category"
            className="pointer-events-auto rounded-full p-3 text-slate-900 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleLeft />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Next category"
            className="pointer-events-auto rounded-full bg-white/90 p-3 text-slate-900 shadow-lg backdrop-blur-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategorySlider;
