"use client";

import Link from "next/link";
import { ShoppingBag, Menu, User, X, Instagram } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { useSyncExternalStore } from "react";
import { useEffect, useState } from "react";

function useHasHydrated(): boolean {
    return useSyncExternalStore(
        () => () => {},
        () => true,
        () => false,
    );
}

const NAV_LINKS = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/fit-finder", label: "AI Fit Finder" },
    { href: "/studio", label: "Studio" },
    { href: "/collections", label: "Collections" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const { setIsOpen, items } = useCart();
    const hasHydrated = useHasHydrated();
    const [isAuthed, setIsAuthed] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        let cleanup: (() => void) | undefined;

        import("@/lib/supabase/client").then(({ createSupabaseBrowserClient }) => {
            const supabase = createSupabaseBrowserClient();
            if (!supabase) return;

            const extractName = (session: { user?: { user_metadata?: Record<string, unknown> } } | null) => {
                const meta = session?.user?.user_metadata;
                return (meta?.first_name as string) || (meta?.name as string) || null;
            };

            supabase.auth.getSession().then(({ data }) => {
                setIsAuthed(Boolean(data.session));
                setUserName(extractName(data.session));
            });

            const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
                setIsAuthed(Boolean(session));
                setUserName(extractName(session));
            });

            cleanup = () => sub.subscription.unsubscribe();
        });

        return () => cleanup?.();
    }, []);

    // Scroll detection for navbar styling
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-4 md:px-8 justify-between transition-all duration-300 ${
                isScrolled 
                    ? 'bg-[#0a0a0a]/85 backdrop-blur-md border-b border-[#1a1a1a]' 
                    : 'bg-background/60 backdrop-blur-xl border-b border-border/50'
            }`}>
                <div className="flex items-center gap-4 md:gap-8 min-w-0">
                    <Link href="/" className="font-black text-lg sm:text-xl tracking-tighter shrink-0">
                        F\F
                    </Link>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        {NAV_LINKS.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <Link
                        href="https://instagram.com/wearfuturefit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-2 p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram size={20} />
                    </Link>
                    <Link
                        href={hasHydrated ? (isAuthed ? "/logout" : "/login") : "/login"}
                        className="flex items-center gap-2 p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <User size={20} />
                        {hasHydrated && (
                            <span className="hidden md:inline text-sm font-medium">
                                Hi, {isAuthed && userName ? userName : "Guest"}
                            </span>
                        )}
                    </Link>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ShoppingBag size={20} />
                        {hasHydrated && items.length > 0 && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-foreground text-background text-[10px] font-bold flex items-center justify-center rounded-full">
                                {items.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="md:hidden p-2 hover:bg-muted rounded-full transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <span className="font-black text-lg tracking-tighter">F\F</span>
                            <button onClick={() => setMobileOpen(false)} className="p-2 hover:bg-muted rounded-full transition-colors" aria-label="Close menu">
                                <X size={20} />
                            </button>
                        </div>
                        <nav className="flex-1 py-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block px-6 py-3 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                        <div className="p-4 border-t border-border space-y-2">
                            <Link
                                href="https://instagram.com/wearfuturefit"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                                Instagram
                            </Link>
                            <Link
                                href={hasHydrated ? (isAuthed ? "/logout" : "/login") : "/login"}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-3 px-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <User size={18} />
                                {hasHydrated ? (isAuthed && userName ? userName : "Sign In") : "Sign In"}
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
