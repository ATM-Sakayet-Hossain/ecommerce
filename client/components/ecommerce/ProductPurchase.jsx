"use client";

import React, { useEffect, useMemo, useState } from "react";
import Counter from "@/components/ecommerce/Counter";

const formatSizeLabel = (size) => (size ? String(size).toUpperCase() : "—");

const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

export default function ProductPurchase({ productId, variants = [], inStock }) {
  const availableVariants = useMemo(
    () => (variants ?? []).filter((v) => Number(v?.stock) > 0),
    [variants],
  );

  const defaultVariant = availableVariants[0] ?? variants[0] ?? null;
  const [selectedColor, setSelectedColor] = useState(
    normalize(defaultVariant?.color),
  );
  const [selectedSize, setSelectedSize] = useState(
    normalize(defaultVariant?.size),
  );

  useEffect(() => {
    setSelectedColor(normalize(defaultVariant?.color));
    setSelectedSize(normalize(defaultVariant?.size));
  }, [defaultVariant?.sku]);

  const colorOptions = useMemo(() => {
    const seen = new Set();
    return (variants ?? []).reduce((items, variant) => {
      const colorValue = normalize(variant?.color);
      if (!colorValue || seen.has(colorValue)) {
        return items;
      }
      seen.add(colorValue);
      items.push({ value: colorValue, label: variant.color });
      return items;
    }, []);
  }, [variants]);

  const sizeOptions = useMemo(() => {
    const pool = selectedColor
      ? (variants ?? []).filter(
          (variant) => normalize(variant?.color) === selectedColor,
        )
      : variants;
    const seen = new Set();
    return (pool ?? []).reduce((items, variant) => {
      const sizeValue = normalize(variant?.size);
      if (!sizeValue || seen.has(sizeValue)) {
        return items;
      }
      seen.add(sizeValue);
      items.push({ value: sizeValue, label: variant.size });
      return items;
    }, []);
  }, [variants, selectedColor]);

  const selectedVariant = useMemo(() => {
    const exactMatch = (variants ?? []).find(
      (variant) =>
        normalize(variant?.color) === selectedColor &&
        normalize(variant?.size) === selectedSize,
    );
    if (exactMatch) {
      return exactMatch;
    }

    const colorMatch = selectedColor
      ? (variants ?? []).find(
          (variant) => normalize(variant?.color) === selectedColor,
        )
      : null;
    if (colorMatch) {
      return colorMatch;
    }

    const sizeMatch = selectedSize
      ? (variants ?? []).find(
          (variant) => normalize(variant?.size) === selectedSize,
        )
      : null;
    return sizeMatch ?? defaultVariant;
  }, [variants, selectedColor, selectedSize, defaultVariant]);

  const handleColorSelect = (color) => {
    const nextColor = normalize(color);
    const variantsForColor = (variants ?? []).filter(
      (variant) => normalize(variant?.color) === nextColor,
    );
    const nextSize = normalize(variantsForColor[0]?.size);
    setSelectedColor(nextColor);
    if (nextSize) {
      setSelectedSize(nextSize);
    }
  };

  const handleSizeSelect = (size) => {
    const nextSize = normalize(size);
    const variantsForSize = (variants ?? []).filter(
      (variant) => normalize(variant?.size) === nextSize,
    );
    const nextColor = normalize(variantsForSize[0]?.color);
    setSelectedSize(nextSize);
    if (nextColor) {
      setSelectedColor(nextColor);
    }
  };

  const hasSelectableVariants = (variants ?? []).length > 0;

  return (
    <div className="space-y-4">
      {hasSelectableVariants ? (
        <div>
          {colorOptions.length > 0 ? (
            <>
              <h3 className="font-medium mb-2">Color:</h3>
              <div className="flex gap-2 flex-wrap">
                {colorOptions.map((option) => {
                  const isSelected = option.value === selectedColor;
                  const optionHasStock = availableVariants.some(
                    (variant) => normalize(variant?.color) === option.value,
                  );
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!optionHasStock}
                      onClick={() => handleColorSelect(option.value)}
                      className={`px-4 py-1 rounded-lg border capitalize text-sm transition ${
                        isSelected
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-green-600"
                      } ${!optionHasStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                      aria-pressed={isSelected}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}

          {sizeOptions.length > 0 ? (
            <>
              <h3 className="font-medium mb-2 mt-3">Size:</h3>
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((option) => {
                  const isSelected = option.value === selectedSize;
                  const optionHasStock = availableVariants.some(
                    (variant) => normalize(variant?.size) === option.value,
                  );
                  return (
                    <button
                      key={option.value}
                      type="button"
                      disabled={!optionHasStock}
                      onClick={() => handleSizeSelect(option.value)}
                      className={`px-4 py-1 rounded-lg border uppercase text-sm transition ${
                        isSelected
                          ? "border-green-600 bg-green-600 text-white"
                          : "border-slate-300 bg-white text-slate-700 hover:border-green-600"
                      } ${!optionHasStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
                      aria-pressed={isSelected}
                    >
                      {formatSizeLabel(option.label)}
                    </button>
                  );
                })}
              </div>
            </>
          ) : null}
          {selectedVariant?.color ? (
            <p className="mt-2 text-sm text-slate-600">
              Color: <span className="capitalize">{selectedVariant.color}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      <Counter
        productId={productId}
        sku={selectedVariant?.sku}
        maxStock={selectedVariant?.stock ?? 0}
        disabled={!inStock || !selectedVariant?.sku}
      />
    </div>
  );
}
