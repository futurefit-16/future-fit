"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { X, Ruler, ScanLine } from "lucide-react";

const BodyScanner = dynamic(() => import("@/components/sizing/BodyScanner"), {
  ssr: false,
});

type Size = "S" | "M" | "L" | "XL";

type SizeChart = {
  chestCm: Record<Size, number>;
  lengthCm: Record<Size, number>;
};

const SIZE_ORDER: readonly Size[] = ["S", "M", "L", "XL"] as const;

const DEFAULT_CHART: SizeChart = {
  chestCm: { S: 102, M: 108, L: 114, XL: 120 },
  lengthCm: { S: 70, M: 72, L: 74, XL: 76 },
};

function normalizeToSize(value: string | null): Size | null {
  if (!value) return null;
  return SIZE_ORDER.includes(value as Size) ? (value as Size) : null;
}

function indexOfSize(size: Size): number {
  return SIZE_ORDER.indexOf(size);
}

export default function VirtualFittingRoom({
  isOpen,
  onClose,
  productId,
  productName,
  sizeChart,
  onSelectedSizeChange,
}: {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  sizeChart?: SizeChart;
  onSelectedSizeChange?: (size: Size | null) => void;
}) {
  const [showScanner, setShowScanner] = useState(false);
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const storageKey = useMemo(() => `future-fit-size:${productId}`, [productId]);
  const [selectedSize, setSelectedSize] = useState<Size | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = window.localStorage.getItem(storageKey);
    return normalizeToSize(saved);
  });

  const chart = useMemo<SizeChart>(() => {
    return sizeChart ?? DEFAULT_CHART;
  }, [sizeChart]);

  const fit = useMemo(() => {
    const rec = normalizeToSize(recommendedSize);
    if (!rec || !selectedSize) return null;

    const diff = indexOfSize(selectedSize) - indexOfSize(rec);
    if (diff <= -1) return "tight" as const;
    if (diff === 0) return "regular" as const;
    return "oversized" as const;
  }, [recommendedSize, selectedSize]);

  const fitLabel = useMemo(() => {
    if (!recommendedSize) return "";
    if (!selectedSize) return `Recommended size: ${recommendedSize}`;
    if (!fit) return `Recommended size: ${recommendedSize}`;
    return `Fit: ${fit} (you picked ${selectedSize}, scan suggests ${recommendedSize})`;
  }, [fit, recommendedSize, selectedSize]);

  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    if (selectedSize) {
      window.localStorage.setItem(storageKey, selectedSize);
    } else {
      window.localStorage.removeItem(storageKey);
    }

    onSelectedSizeChange?.(selectedSize);
  }, [isOpen, onSelectedSizeChange, selectedSize, storageKey]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <div className="text-lg font-black tracking-tight">Virtual Fit</div>
            <div className="text-xs text-muted-foreground">
              {productName}
            </div>
          </div>
          <button
            onClick={() => {
              setShowScanner(false);
              onClose();
            }}
            className="rounded-full p-2 hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 p-5">
          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold">Fit meter</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {recommendedSize
                    ? "Based on your scan. You can rescan anytime."
                    : "Scan with your camera to get a recommended size."}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black">{recommendedSize ?? "—"}</div>
                <div className="text-[11px] text-muted-foreground">size</div>
              </div>
            </div>

            {fitLabel ? (
              <div className="mt-3 text-sm font-medium">{fitLabel}</div>
            ) : null}

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                onClick={() => setShowScanner(true)}
                className="h-11 rounded-full bg-foreground px-4 text-sm font-bold text-background hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <ScanLine size={16} />
                Scan with camera
              </button>
              <button
                onClick={() => {
                  setRecommendedSize(null);
                  setSelectedSize(null);
                }}
                className="h-11 rounded-full border border-border bg-background px-4 text-sm font-bold hover:bg-muted transition-colors inline-flex items-center justify-center gap-2"
              >
                <Ruler size={16} />
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-bold">Choose your size</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Pick what you want to wear. We’ll label the fit using your scan.
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black">{selectedSize ?? "—"}</div>
                <div className="text-[11px] text-muted-foreground">selected</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {SIZE_ORDER.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={
                    selectedSize === s
                      ? "h-10 rounded-full bg-foreground text-background text-sm font-bold"
                      : "h-10 rounded-full border border-border bg-background text-sm font-bold hover:bg-muted transition-colors"
                  }
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between text-xs">
                <div className="text-muted-foreground">Tight</div>
                <div className="text-muted-foreground">Regular</div>
                <div className="text-muted-foreground">Oversized</div>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={
                    fit === "tight"
                      ? "h-full w-1/3 bg-foreground"
                      : fit === "regular"
                        ? "h-full w-2/3 bg-foreground"
                        : fit === "oversized"
                          ? "h-full w-full bg-foreground"
                          : "h-full w-0"
                  }
                />
              </div>
              <div className="mt-2 text-sm font-medium">
                {fitLabel || "Scan and choose a size to see your fit."}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <div className="text-sm font-bold">Size chart (cm)</div>
            <div className="mt-3 grid gap-2 text-xs">
              <div className="grid grid-cols-5 gap-2 text-muted-foreground">
                <div className="font-bold">Metric</div>
                {SIZE_ORDER.map((s) => (
                  <div key={s} className="text-right font-bold">
                    {s}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-muted-foreground">Chest</div>
                {SIZE_ORDER.map((s) => (
                  <div key={s} className="text-right">
                    {chart.chestCm[s]}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-5 gap-2">
                <div className="text-muted-foreground">Length</div>
                {SIZE_ORDER.map((s) => (
                  <div key={s} className="text-right">
                    {chart.lengthCm[s]}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/40 p-4 text-xs text-muted-foreground">
            This is an MVP virtual fitting flow. Camera processing happens in your browser.
          </div>
        </div>
      </div>

      <BodyScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onComplete={(size) => {
          setRecommendedSize(size);
          const normalized = normalizeToSize(size);
          if (normalized) setSelectedSize((prev) => prev ?? normalized);
          setShowScanner(false);
        }}
      />
    </div>
  );
}
