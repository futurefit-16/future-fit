import type { Metadata } from "next";
import { Suspense } from "react";
import StudioWrapper from "@/components/studio/StudioWrapper";
import CanvasContainer from "@/components/studio/CanvasContainer";
import Toolbar from "@/components/studio/Toolbar";
import LayerManager from "@/components/studio/LayerManager";
import PropertiesPanel from "@/components/studio/PropertiesPanel";
import ExportTool from "@/components/studio/ExportTool";

export const metadata: Metadata = {
    title: "Design Studio — Customize Your Gear",
    description:
        "Use the Future Fit AI-powered design studio to customize tees, hoodies & apparel. Add graphics, text, and export your unique designs.",
    openGraph: {
        title: "Design Studio — Future Fit",
        description: "Customize your streetwear with AI-powered design tools.",
    },
};

export default function StudioPage() {
    return (
        <Suspense fallback={null}>
            <StudioWrapper>
                <div className="flex h-full">
                    {/* Left Sidebar */}
                    <aside className="w-16 border-r border-border bg-muted/50 hidden md:flex flex-col items-center py-4">
                        <div className="font-bold text-lg tracking-tighter mb-6">F\F</div>
                        <div className="flex-1 w-full px-2">
                            <Toolbar />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 relative bg-muted/20 flex flex-col">
                        {/* Header */}
                        <header className="bg-background border-b border-border px-6 py-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-xl font-black tracking-tighter">AI Design Studio</h1>
                                    <p className="text-xs text-muted-foreground">Create your unique streetwear designs</p>
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Powered by</span>
                                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-bold text-xs">AI</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        {/* Canvas Area */}
                        <div className="flex-1 relative">
                            <ExportTool />
                            <CanvasContainer className="w-full h-full" />
                        </div>
                    </main>

                    {/* Right Sidebar */}
                    <aside className="w-64 border-l border-border bg-muted/50 hidden lg:flex flex-col">
                        <div className="p-4 border-b border-border">
                            <h3 className="text-sm font-semibold">Properties</h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <LayerManager />
                            <PropertiesPanel />
                        </div>
                    </aside>
                </div>

                {/* Mobile Toolbar */}
                <div className="lg:hidden fixed bottom-4 left-4 right-4 z-20">
                    <div className="bg-background border border-border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold">Tools</h3>
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-primary font-bold text-xs">AI</span>
                            </div>
                        </div>
                        <Toolbar />
                    </div>
                </div>
            </StudioWrapper>
        </Suspense>
    );
}
