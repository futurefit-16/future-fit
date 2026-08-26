"use client";

import { useCanvas } from "./CanvasContext";
import * as fabric from "fabric";
import { Type, Square, Circle, Image as ImageIcon } from "lucide-react";

export default function Toolbar() {
    const { canvas } = useCanvas();

    const addText = () => {
        if (!canvas) return;
        const text = new fabric.IText("FUTURE FIT", {
            left: canvas.width ? canvas.width / 2 - 50 : 100,
            top: canvas.height ? canvas.height / 2 - 20 : 100,
            fontFamily: "var(--font-geist-sans)",
            fill: "#000000",
            fontSize: 40,
            fontWeight: 'bold',
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.requestRenderAll();
    };

    const addRect = () => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: canvas.width ? canvas.width / 2 - 50 : 100,
            top: canvas.height ? canvas.height / 2 - 50 : 100,
            fill: "#18181b", // zinc-950
            width: 100,
            height: 100,
            rx: 10, // rounded corners
            ry: 10,
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.requestRenderAll();
    };

    const addCircle = () => {
        if (!canvas) return;
        const circle = new fabric.Circle({
            left: canvas.width ? canvas.width / 2 - 50 : 100,
            top: canvas.height ? canvas.height / 2 - 50 : 100,
            fill: "#e4e4e7",
            radius: 50,
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.requestRenderAll();
    }

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!canvas || !e.target.files?.[0]) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = async (f) => {
            const data = f.target?.result as string;
            try {
                const maybeFabric = fabric as unknown as {
                    FabricImage?: { fromURL?: (url: string) => Promise<fabric.Image> };
                };

                if (typeof maybeFabric.FabricImage?.fromURL !== "function") {
                    throw new Error("FabricImage.fromURL not available");
                }

                const img = await maybeFabric.FabricImage.fromURL(data);
                img.set({
                    left: 100,
                    top: 100,
                });
                img.scaleToWidth(200);
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
            } catch {
                const fromURL = (fabric.Image.fromURL as unknown as (
                    url: string,
                    callback: (img: fabric.Image) => void,
                ) => void);

                fromURL(data, (img) => {
                    img.set({
                        left: 100,
                        top: 100,
                    });
                    img.scaleToWidth(200);
                    canvas.add(img);
                    canvas.setActiveObject(img);
                    canvas.requestRenderAll();
                });
            }
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <button
                onClick={addText}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                title="Add Text"
            >
                <Type size={20} />
            </button>
            <button
                onClick={addRect}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                title="Add Rectangle"
            >
                <Square size={20} />
            </button>
            <button
                onClick={addCircle}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                title="Add Circle"
            >
                <Circle size={20} />
            </button>

            <label
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm cursor-pointer"
                title="Upload Image"
            >
                <ImageIcon size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </label>
        </div>
    );
}
