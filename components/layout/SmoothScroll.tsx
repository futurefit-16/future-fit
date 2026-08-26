"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const contentRef = useRef<HTMLDivElement>(null);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);

    // Smooth out the velocity
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const skewY = useTransform(smoothVelocity, [-1000, 1000], [-2, 2]);

    return (
        <motion.div
            ref={contentRef}
            style={{ skewY }}
            className="w-full min-h-screen"
        >
            {children}
        </motion.div>
    );
}
