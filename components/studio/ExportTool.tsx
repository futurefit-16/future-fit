"use client";

import { useCanvas } from "./CanvasContext";
import { Download, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function ExportTool() {
    const { canvas } = useCanvas();
    const { addItem } = useCart();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = (action: 'download' | 'cart') => {
        if (!canvas) return;
        setIsExporting(true);

        try {
            canvas.discardActiveObject();
            canvas.requestRenderAll();

            const dataURL = canvas.toDataURL({
                format: "png",
                quality: 1,
                multiplier: action === 'download' ? 4 : 1, // High res for download, preview for cart
            });

            if (action === 'download') {
                const link = document.createElement("a");
                link.download = `future-fit-${Date.now()}.png`;
                link.href = dataURL;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                addItem({
                    id: `custom-${Date.now()}`,
                    name: "Custom Design",
                    price: 1999, // Base custom price
                    image: dataURL,
                    customized: true,
                    quantity: 1,
                    slug: "custom-design"
                });
                // Optional: navigate to cart or show success
            }
        } catch (e) {
            console.error("Export failed", e);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="absolute top-4 right-4 z-20 flex gap-2">
            <button
                onClick={() => handleExport('cart')}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full shadow-lg hover:scale-105 transition-transform font-medium text-sm"
            >
                <ShoppingBag size={16} />
                Add to Cart
            </button>

            <button
                onClick={() => handleExport('download')}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full shadow-lg hover:scale-105 transition-transform font-medium text-sm"
            >
                <Download size={16} />
                {isExporting ? "Exporting..." : "Export"}
            </button>
        </div>
    );
}
