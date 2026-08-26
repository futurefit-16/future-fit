"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ShoppingBag, Wand2, Ruler } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import type { Product, Size } from "@/lib/products";

const SIZES: Size[] = ["S", "M", "L", "XL"];

const VirtualFittingRoom = dynamic(
    () => import("@/components/fitting/VirtualFittingRoom"),
    { ssr: false },
);

export default function ProductActions({ product }: { product: Product }) {
    const router = useRouter();
    const { addItem } = useCart();
    const [showFitting, setShowFitting] = useState(false);
    const [sizeError, setSizeError] = useState(false);

    const storageKey = useMemo(() => `future-fit-size:${product.id}`, [product.id]);

    const [selectedSize, setSelectedSize] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        return window.localStorage.getItem(storageKey);
    });

    const handleSizeSelect = (size: Size) => {
        setSelectedSize(size);
        setSizeError(false);
        if (typeof window !== "undefined") {
            window.localStorage.setItem(storageKey, size);
        }
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        addItem({ 
            ...product, 
            customized: false, 
            size: selectedSize,
            slug: product.slug,
            image: product.heroImage,
            quantity: 1
        });
    };

    const handleCustomize = () => {
        const query = new URLSearchParams({
            bg: product.heroImage,
            id: product.id,
        }).toString();
        router.push(`/studio?${query}`);
    };

    return (
        <>
            {/* Size Selector */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold uppercase tracking-wide">
                        Select Size
                        {selectedSize && <span className="ml-2 text-muted-foreground font-normal">— {selectedSize}</span>}
                    </p>
                    {product.sizeChart && selectedSize && (
                        <p className="text-xs text-muted-foreground">
                            Chest {product.sizeChart.chestCm[selectedSize as Size]}cm · Length {product.sizeChart.lengthCm[selectedSize as Size]}cm
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {SIZES.map((size) => (
                        <button
                            key={size}
                            onClick={() => handleSizeSelect(size)}
                            className={`py-3 rounded-lg text-sm font-bold transition-all duration-200 border ${
                                selectedSize === size
                                    ? "bg-foreground text-background border-foreground scale-[1.02]"
                                    : "bg-transparent text-foreground border-border hover:border-foreground/50"
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
                {sizeError && (
                    <p className="text-xs text-red-500 mt-2">Please select a size before adding to cart.</p>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleAddToCart}
                    className="w-full py-4 bg-foreground text-background rounded-full font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                    <ShoppingBag size={20} />
                    Add to Cart{selectedSize ? ` — ${selectedSize}` : ""}
                </button>

                <button
                    onClick={handleCustomize}
                    className="w-full py-4 bg-secondary text-secondary-foreground rounded-full font-bold flex items-center justify-center gap-2 hover:bg-muted transition-colors"
                >
                    <Wand2 size={20} />
                    Customize in Studio
                </button>
            </div>

            <button
                onClick={() => setShowFitting(true)}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
                <div className="p-2 bg-secondary rounded-full group-hover:bg-muted transition-colors">
                    <Ruler size={16} />
                </div>
                <span className="underline decoration-dotted underline-offset-4">Not sure about your size? Try Virtual Fit</span>
            </button>

            {showFitting ? (
                <VirtualFittingRoom
                    isOpen={showFitting}
                    onClose={() => setShowFitting(false)}
                    productId={product.id}
                    productName={product.name}
                    sizeChart={product.sizeChart}
                    onSelectedSizeChange={(size) => {
                        setSelectedSize(size);
                        if (typeof window === "undefined") return;
                        if (size) window.localStorage.setItem(storageKey, size);
                        else window.localStorage.removeItem(storageKey);
                    }}
                />
            ) : null}
        </>
    );
}
