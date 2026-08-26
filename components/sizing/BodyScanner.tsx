"use client";

import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, ScanLine, CheckCircle2, Loader2 } from "lucide-react";

interface BodyScannerProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (size: string) => void;
}

type ScanState = "permission" | "ready" | "scanning" | "processing" | "result";

function BodyScannerInner({ onClose, onComplete }: Omit<BodyScannerProps, "isOpen">) {
    const [scanState, setScanState] = useState<ScanState>("permission");
    const [progress, setProgress] = useState(0);
    const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
    const webcamRef = useRef<Webcam>(null);

    const handleUserMedia = useCallback(() => {
        setTimeout(() => setScanState("ready"), 500);
    }, []);

    const startScan = useCallback(() => {
        setScanState("scanning");

        // Simulate scanning progress
        let p = 0;
        const interval = setInterval(() => {
            p += 2;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setScanState("processing");

                // Simulate processing delay
                setTimeout(() => {
                    const sizes = ["S", "M", "L", "XL"];
                    const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                    setRecommendedSize(randomSize);
                    setScanState("result");
                }, 2000);
            }
        }, 50);
    }, []);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            >
                <div className="relative w-full max-w-lg bg-card border border-border rounded-3xl overflow-hidden shadow-2xl">

                    {/* Header */}
                    <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/50 to-transparent">
                        <div className="flex items-center gap-2">
                            <ScanLine className="text-primary animate-pulse" />
                            <span className="font-bold tracking-wider text-sm">AI BODY SCANNER v1.0</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors backdrop-blur-sm"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Camera Area */}
                    <div className="relative aspect-[3/4] bg-black overflow-hidden">
                        {(scanState === "permission" || scanState === "ready" || scanState === "scanning") && (
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover scale-x-[-1]" // Mirror effect
                                onUserMedia={handleUserMedia}
                                videoConstraints={{ facingMode: "user" }}
                            />
                        )}

                        {/* Overlays based on state */}
                        <div className="absolute inset-0 z-10 pointer-events-none">

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
                                    backgroundSize: "40px 40px"
                                }}
                            />

                            {/* Scanning Laser */}
                            {scanState === "scanning" && (
                                <motion.div
                                    className="absolute left-0 right-0 h-1 bg-red-500 shadow-[0_0_20px_rgba(255,0,0,0.8)]"
                                    animate={{ top: ["0%", "100%", "0%"] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                />
                            )}

                            {/* UI Content Layer */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">

                                {scanState === "permission" && (
                                    <div className="bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-white/10 animate-in fade-in zoom-in">
                                        <Camera className="w-12 h-12 text-primary mx-auto mb-4 animate-bounce" />
                                        <h3 className="text-xl font-bold mb-2">Camera Access Required</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Allow access to scan your measurements. We plan data locally for privacy.
                                        </p>
                                    </div>
                                )}

                                {scanState === "ready" && (
                                    <div className="absolute bottom-8 left-0 right-0 px-8">
                                        <div className="bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-4 animate-in slide-in-from-bottom-4">
                                            <p className="text-sm font-medium text-white mb-1">Position yourself in frame</p>
                                            <p className="text-xs text-white/70">Stand 6 feet back. Arms slightly out (A-Pose).</p>
                                        </div>
                                        <button
                                            onClick={startScan}
                                            className="w-full py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] pointer-events-auto"
                                        >
                                            Start Scan
                                        </button>
                                    </div>
                                )}

                                {scanState === "processing" && (
                                    <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-white/10 flex flex-col items-center">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                                        <h3 className="text-xl font-bold animate-pulse">Analyzing Point Cloud...</h3>
                                        <p className="text-sm text-muted-foreground mt-2">Calculating body dimensions</p>
                                    </div>
                                )}

                                {scanState === "result" && recommendedSize && (
                                    <div className="bg-black/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 w-full animate-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-black mb-1">Perfect Fit Found!</h3>
                                        <p className="text-muted-foreground mb-6">Based on your measurements</p>

                                        <div className="flex items-center justify-center gap-4 mb-8">
                                            <div className="text-center">
                                                <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Size</div>
                                                <div className="text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                                    {recommendedSize}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => onComplete(recommendedSize)}
                                            className="w-full py-4 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform pointer-events-auto"
                                        >
                                            Apply Size
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer / Status Bar */}
                    {(scanState === "scanning" || scanState === "processing") && (
                        <div className="h-2 bg-muted/20 w-full overflow-hidden">
                            <motion.div
                                className="h-full bg-primary"
                                initial={{ width: "0%" }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function BodyScanner({ isOpen, onClose, onComplete }: BodyScannerProps) {
    if (!isOpen) return null;
    return <BodyScannerInner onClose={onClose} onComplete={onComplete} />;
}
