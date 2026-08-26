import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Careers — Join the Future of Fashion Tech",
    description:
        "Join Future Fit and build the next generation of AI-powered fashion. We are hiring soon.",
    openGraph: {
        title: "Careers — Future Fit",
        description: "Build the next generation of AI-powered fashion with us.",
    },
};

export default function CareersPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-2 border-foreground/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-foreground/40 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-2xl font-black tracking-tighter">F\F</span>
                    </div>
                </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">COMING SOON</h1>
            <p className="text-lg text-muted-foreground max-w-md mb-2">
                We&apos;re building the next generation of fashion technology.
            </p>
            <p className="text-sm text-muted-foreground mb-8">
                Interested? Reach out at{" "}
                <a href="mailto:hello@wearfuturefit.com" className="text-foreground underline">hello@wearfuturefit.com</a>
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
                Back to Home
            </Link>
        </div>
    );
}
