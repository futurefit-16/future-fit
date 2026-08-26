"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const DotWave = dynamic(() => import("@/components/layout/DotWave"), { ssr: false });
const SmoothScroll = dynamic(() => import("@/components/layout/SmoothScroll"), { ssr: false });

export default function ClientEffects({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const effectsEnabled = pathname === "/";

    if (!effectsEnabled) {
        return <>{children}</>;
    }

    return (
        <>
            <DotWave />
            <SmoothScroll>
                {children}
            </SmoothScroll>
        </>
    );
}
