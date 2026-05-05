"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import ProductCard from "../UI/ProductCard";
import { apiClient } from "@/lib/apiClient";

const ProducrSlider = ({ tittle }) => {
  const scrollRef = useRef(null);
  const [products, setProducts] = useState([]);
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

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const payload = await apiClient.get("/product/get", {
          revalidate: 60 * 5,
        });

        const nextProducts =
          payload?.data?.product ||
          payload?.data?.products ||
          payload?.product ||
          [];

        if (isMounted) {
          setProducts(nextProducts);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load products",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

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
  }, [products.length, updateControls]);

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

  if (!products.length) {
    return null;
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-3 pt-2">
        <h2 className="mt-1 text-2xl font-semibold text-slate-950">{tittle}</h2>
        <Link
          href="/shop"
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
        >
          Open all Products
        </Link>
      </div>

      <div className="relative mt-2 rounded-3xl">
        <div
          ref={scrollRef}
          onScroll={updateControls}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((product) => (
            <Link
              key={product?.slug}
              href={`/products/${product?.slug}`}
              data-slider-item
              className="block shrink-0 basis-1/2 sm:basis-1/4"
            >
              <ProductCard data={product} />
            </Link>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 sm:px-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            aria-label="Previous product"
            className="pointer-events-auto transition text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleLeft size={30} />
          </button>

          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            aria-label="Next product"
            className="pointer-events-auto transition text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FaRegArrowAltCircleRight size={30} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProducrSlider;
