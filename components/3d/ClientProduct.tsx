"use client";

import dynamic from "next/dynamic";

const ProductScene = dynamic(() => import("@/components/3d/ProductScene"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full min-h-[500px] bg-secondary/20 rounded-xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    ),
});

export default function ClientProduct({ imageUrl, modelPath }: { imageUrl: string; modelPath?: string }) {
    return <ProductScene imageUrl={imageUrl} modelPath={modelPath} />;
}
