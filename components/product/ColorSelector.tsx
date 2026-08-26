"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { ProductColor } from "@/lib/products";
import { getProductColor, getColorHex } from "@/lib/productUtils";

interface ColorSelectorProps {
    productId: string;
    colors: ProductColor[];
    selectedColorId: string;
    onColorChange: (colorId: string) => void;
}

export default function ColorSelector({
    productId,
    colors,
    selectedColorId,
    onColorChange,
}: ColorSelectorProps) {
    const [hoveredColor, setHoveredColor] = useState<string | null>(null);

    const handleColorSelect = (colorId: string) => {
        onColorChange(colorId);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wide">Color</h3>
            <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                    const isSelected = selectedColorId === color.id;
                    const isHovered = hoveredColor === color.id;
                    
                    return (
                        <button
                            key={color.id}
                            onClick={() => handleColorSelect(color.id)}
                            onMouseEnter={() => setHoveredColor(color.id)}
                            onMouseLeave={() => setHoveredColor(null)}
                            className={`
                                relative w-12 h-12 rounded-full border-2 transition-all duration-200
                                ${isSelected 
                                    ? 'border-foreground ring-2 ring-foreground/20 scale-110' 
                                    : 'border-border hover:border-foreground/50 hover:scale-105'
                                }
                            `}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                        >
                            {isSelected && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center">
                                        <Check size={14} />
                                    </div>
                                </div>
                            )}
                            
                            {/* Tooltip */}
                            {isHovered && !isSelected && (
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap z-10">
                                    {color.name}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
            
            {/* Selected Color Name */}
            <div className="text-sm text-muted-foreground">
                Selected: {colors.find(c => c.id === selectedColorId)?.name || 'None'}
            </div>
        </div>
    );
}
