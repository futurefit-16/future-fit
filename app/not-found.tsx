import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found",
    robots: { index: false, follow: false },
};

const SUGGESTIONS = [
    { href: "/shop", label: "Shop all products" },
    { href: "/collections", label: "Browse collections" },
    { href: "/fit-finder", label: "Find your size" },
    { href: "/contact", label: "Contact support" },
];

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="relative mb-8">
                <div className="w-24 h-24 border-2 border-foreground/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 border border-foreground/40 rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-2xl font-black tracking-tighter">F\F</span>
                    </div>
                </div>
            </div>

            <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">
                Error 404
            </p>
            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                OFF THE GRID
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mb-10">
                This page doesn&apos;t exist — it may have moved, or the link
                might be broken. The rest of the drop is still live.
            </p>

            <Link
                href="/shop"
                className="px-8 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:scale-105 transition-transform"
            >
                Shop the Drop
            </Link>

            <div className="mt-12 pt-8 border-t border-foreground/10 w-full max-w-md">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
                    Or try one of these
                </p>
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                    {SUGGESTIONS.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
