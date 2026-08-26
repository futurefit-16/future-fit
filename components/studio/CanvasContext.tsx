"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import * as fabric from "fabric";

interface CanvasContextType {
    canvas: fabric.Canvas | null;
    setCanvas: (canvas: fabric.Canvas | null) => void;
    activeObject: fabric.Object | null;
    setActiveObject: (object: fabric.Object | null) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

    return (
        <CanvasContext.Provider value={{ canvas, setCanvas, activeObject, setActiveObject }}>
            {children}
        </CanvasContext.Provider>
    );
}

export function useCanvas() {
    const context = useContext(CanvasContext);
    if (context === undefined) {
        throw new Error("useCanvas must be used within a CanvasProvider");
    }
    return context;
}
