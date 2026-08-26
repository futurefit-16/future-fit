"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ColorSelector from "@/components/product/ColorSelector";
import FabricSpecBadges from "@/components/product/FabricSpecBadges";
import FabricAccordion from "@/components/product/FabricAccordion";
import PricingDisplay from "@/components/product/PricingDisplay";

interface ProductPageClientProps {
    product: Product;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
    const [selectedColorId, setSelectedColorId] = useState(product.colors[0]?.id || '');

    const handleColorChange = (colorId: string) => {
        setSelectedColorId(colorId);
    };

    return (
        <div className="flex items-center min-h-[calc(100vh-4rem)]">
            <div className="container mx-auto px-4 py-8 lg:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    {/* Gallery */}
                    <div className="animate-fade-up">
                        <ProductGallery
                            productId={product.id}
                            colorId={selectedColorId}
                            name={product.name}
                            model={product.model}
                        />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col justify-start space-y-6 pt-4 lg:pt-0 animate-fade-up" style={{ animationDelay: "150ms" }}>
                        <div>
                            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-3">Future Fit</p>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-3">{product.name}</h1>
                            <FabricSpecBadges productSlug={product.slug} />
                            <PricingDisplay 
                            productCategory={product.category} 
                            size="lg"
                        />
                        </div>

                        {/* Product Details */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{product.gsm} GSM</span>
                                <span>•</span>
                                <span className="capitalize">{product.category.replace('-', ' ')}</span>
                            </div>
                            
                            <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Color Selector */}
                        <ColorSelector
                            productId={product.id}
                            colors={product.colors}
                            selectedColorId={selectedColorId}
                            onColorChange={handleColorChange}
                        />

                        {/* Size Chart */}
                        {product.sizeChart && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wide">Size Chart</h3>
                                <div className="grid grid-cols-4 gap-2 text-xs">
                                    {product.sizeChart?.chestCm && Object.entries(product.sizeChart.chestCm).map(([size, chest]) => {
                                        const sizeKey = size as keyof typeof product.sizeChart.lengthCm;
                                        return (
                                            <div key={size} className="text-center p-2 border border-border rounded">
                                                <div className="font-bold">{size}</div>
                                                <div className="text-muted-foreground">Chest: {chest}cm</div>
                                                <div className="text-muted-foreground">Length: {product.sizeChart?.lengthCm?.[sizeKey]}cm</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        <ProductActions product={product} />
                        
                        {/* Fabric Accordion */}
                        <FabricAccordion productSlug={product.slug} />
                    </div>
                </div>
            </div>
        </div>
    );
}
