"use client";

import { useCart } from "./CartContext";
import { X, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatPrice, getDiscountPercentage, isOnDiscount } from "@/lib/pricing";
import { getProductById } from "@/lib/productUtils";
import Image from "next/image";
import Link from "next/link";

export default function CartSidebar() {
    const { items, removeItem, isOpen, setIsOpen, total } = useCart();

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm animate-in fade-in"
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background border-l border-border shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <ShoppingBag size={24} />
                        Your Cart ({items.length})
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <ShoppingBag size={48} className="mb-4" />
                            <p>Your bag is empty.</p>
                        </div>
                    ) : (
                        items.map((item) => {
                            const product = getProductById(item.slug);
                            const imageUrl = product?.heroImage || '';
                            
                            return (
                                <div key={item.id} className="flex gap-4 p-4 border border-border rounded-lg bg-card">
                                    <div className="w-20 h-20 bg-muted rounded-md relative overflow-hidden shrink-0">
                                        {imageUrl ? (
                                            <Image src={imageUrl} alt={item.name} fill sizes="80px" className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                                <ShoppingBag size={24} className="text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <h4 className="font-medium line-clamp-1">{item.name}</h4>
                                        {item.size ? (
                                            <div className="text-xs text-muted-foreground">Size: {item.size}</div>
                                        ) : null}
                                        {item.customized && <span className="text-xs text-blue-500 font-medium">Customized</span>}
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="text-right">
                                            {isOnDiscount(item.mrp || 0, item.price) && (
                                                <div className="flex items-center gap-1">
                                                    <span className="text-xs text-muted-foreground line-through">{formatPrice(item.mrp || 0)}</span>
                                                    <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                                                        -{getDiscountPercentage(item.mrp || 0, item.price)}%
                                                    </span>
                                                </div>
                                            )}
                                            <span className="font-semibold">{formatPrice(item.price)}</span>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-xs text-destructive hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pt-6 border-t border-border mt-4">
                    <div className="flex items-center justify-between mb-4 text-lg font-bold">
                        <span>Total</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                    <Link
                        href="/checkout"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-4 bg-foreground text-background rounded-full font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none"
                    >
                        Checkout
                    </Link>
                </div>
            </div>
        </>
    );
}
