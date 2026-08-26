"use client";

import { useEffect, useRef } from "react";

export default function DotWave() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width: number;
        let height: number;
        let mouseX = -1000;
        let mouseY = -1000;

        // Configuration
        const GAP = 30; // Distance between dots
        const RADIUS = 1; // Dot radius
        const SCALE = 1.5; // Scale factor on hover
        const AREA = 150; // Interaction radius

        const dots: { x: number; y: number; originX: number; originY: number }[] = [];

        const init = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;

            dots.length = 0;
            for (let x = 0; x < width; x += GAP) {
                for (let y = 0; y < height; y += GAP) {
                    dots.push({ x, y, originX: x, originY: y });
                }
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            const isDark = document.documentElement.classList.contains("dark") ||
                window.matchMedia('(prefers-color-scheme: dark)').matches;
            ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";

            dots.forEach((dot) => {
                const dx = mouseX - dot.x;
                const dy = mouseY - dot.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                let size = RADIUS;

                if (dist < AREA) {
                    const force = (AREA - dist) / AREA;
                    size = RADIUS + (SCALE * force);
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        init();
        draw();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none"
            aria-hidden="true"
        />
    );
}
