"use client";

import { useEffect, useState } from "react";
import { useCanvas } from "./CanvasContext";
import * as fabric from "fabric";
import { ChevronUp, ChevronDown, Trash2, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LayerManager() {
    const { canvas, activeObject } = useCanvas();
    const [layers, setLayers] = useState<fabric.Object[]>([]);

    useEffect(() => {
        if (!canvas) return;

        const updateLayers = () => {
            // getObjects returns items in drawing order (bottom to top)
            // We want to display top layers at the top of the list, so we reverse
            setLayers([...canvas.getObjects()].reverse());
        };

        canvas.on("object:added", updateLayers);
        canvas.on("object:removed", updateLayers);
        canvas.on("object:modified", updateLayers);
        // Also listen to stacking order changes if possible, or just re-render manually on button click

        updateLayers();

        return () => {
            canvas.off("object:added", updateLayers);
            canvas.off("object:removed", updateLayers);
            canvas.off("object:modified", updateLayers);
        };
    }, [canvas]);

    const moveUp = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        if (!canvas) return;
        // bringForward: Moves object one step up in stack
        canvas.bringObjectForward(obj);
        canvas.requestRenderAll();
        setLayers([...canvas.getObjects()].reverse());
    };

    const moveDown = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        if (!canvas) return;
        // sendBackwards: Moves object one step down
        canvas.sendObjectBackwards(obj);
        canvas.requestRenderAll();
        setLayers([...canvas.getObjects()].reverse());
    };

    const deleteObject = (e: React.MouseEvent, obj: fabric.Object) => {
        e.stopPropagation();
        if (!canvas) return;
        canvas.remove(obj);
        canvas.requestRenderAll();
    };

    const selectObject = (obj: fabric.Object) => {
        if (!canvas) return;
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
    };

    if (!canvas) return null;

    return (
        <div className="flex flex-col gap-2 w-full select-none">
            {layers.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-muted-foreground opacity-50">
                    <Layers size={24} className="mb-2" />
                    <span className="text-xs">No layers</span>
                </div>
            ) : (
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[300px] pr-1">
                    {layers.map((obj, index) => {
                        // Determine a label
                        let typeLabel = obj.type;
                        if (obj.type === 'i-text' || obj.type === 'text') {
                            // @ts-expect-error - Fabric types do not expose `text` on base Object
                            const preview = (obj.text as string | undefined) ?? "";
                            typeLabel = `"${preview.substring(0, 10)}${preview.length > 10 ? '...' : ''}"`;
                        } else if (obj.type === 'image') {
                            typeLabel = "Image";
                        }

                        return (
                            <div
                                key={index}
                                className={cn(
                                    "group flex items-center justify-between p-2 rounded-md text-sm cursor-pointer border border-transparent transition-all",
                                    activeObject === obj
                                        ? "bg-accent text-accent-foreground border-border shadow-sm"
                                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                )}
                                onClick={() => selectObject(obj)}
                            >
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="w-2 h-2 rounded-full bg-primary/20 shrink-0" />
                                    <span className="truncate max-w-[80px] font-medium text-xs capitalized">{typeLabel}</span>
                                </div>

                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {/* Only show move/delete on hover or active? For now always show for clarity in demo, or maybe active only */}
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <button onClick={(e) => moveUp(e, obj)} className="p-1 hover:bg-background rounded-sm focus:outline-none" title="Bring Forward">
                                        <ChevronUp size={12} />
                                    </button>
                                    <button onClick={(e) => moveDown(e, obj)} className="p-1 hover:bg-background rounded-sm focus:outline-none" title="Send Backward">
                                        <ChevronDown size={12} />
                                    </button>
                                    <button onClick={(e) => deleteObject(e, obj)} className="p-1 hover:bg-destructive/10 hover:text-destructive rounded-sm focus:outline-none ml-1" title="Delete">
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
