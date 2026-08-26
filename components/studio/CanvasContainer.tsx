"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import * as fabric from "fabric";
import { useCanvas } from "./CanvasContext";
import { cn } from "@/lib/utils";

export default function CanvasContainer({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const { setCanvas, setActiveObject } = useCanvas();

    const searchParams = useSearchParams();
    const bgImage = searchParams.get("bg");

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        // Initialize Fabric Canvas
        const canvasInstance = new fabric.Canvas(canvasRef.current, {
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight,
            backgroundColor: "#ffffff",
            preserveObjectStacking: true,
            selection: true,
        });

        setCanvas(canvasInstance);

        // Load Background Image if available
        if (bgImage) {
            fabric.Image.fromURL(bgImage, {
                crossOrigin: "anonymous"
            }).then((img) => {
                if (!img) return;

                // Scale image to fit canvas while maintaining aspect ratio
                const canvasWidth = canvasInstance.width || 800;
                const canvasHeight = canvasInstance.height || 600;
                const scale = Math.min(
                    (canvasWidth * 0.8) / img.width!,
                    (canvasHeight * 0.8) / img.height!
                );

                img.set({
                    scaleX: scale,
                    scaleY: scale,
                    left: canvasWidth / 2,
                    top: canvasHeight / 2,
                    originX: "center",
                    originY: "center",
                    selectable: false, // Make it non-selectable by default (background)
                    evented: false,
                });

                canvasInstance.add(img);
                // In newer Fabric versions, sendToBack is removed. Use moveObjectTo or similar.
                // Assuming v6+:
                canvasInstance.moveObjectTo(img, 0);
                canvasInstance.requestRenderAll();
            }).catch(err => {
                console.error("Failed to load image", err);
            });
        }

        // Event Listeners
        canvasInstance.on("selection:created", (e) => {
            setActiveObject(e.selected?.[0] || null);
        });
        canvasInstance.on("selection:updated", (e) => {
            setActiveObject(e.selected?.[0] || null);
        });
        canvasInstance.on("selection:cleared", () => {
            setActiveObject(null);
        });

        // Resize Observer
        const resizeObserver = new ResizeObserver(() => {
            if (!containerRef.current) return;

            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;

            canvasInstance.setDimensions({ width, height });

            // Re-center background image on resize
            if (bgImage) {
                const objects = canvasInstance.getObjects();
                const bgObj = objects[0]; // Assuming first object is bg
                if (bgObj && !bgObj.selectable) {
                    bgObj.set({
                        left: width / 2,
                        top: height / 2
                    });
                    canvasInstance.requestRenderAll();
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        // Cleanup
        return () => {
            canvasInstance.dispose();
            resizeObserver.disconnect();
        };
    }, [setCanvas, setActiveObject, bgImage]);

    return (
        <div ref={containerRef} className={cn("w-full h-full relative", className)}>
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
            {/* T-Shirt Overlay or Background Image can be added here or as a fabric image */}
        </div>
    );
}
