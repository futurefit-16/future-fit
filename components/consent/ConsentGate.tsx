"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import Clarity from "@/components/Clarity";
import MetaPixel from "@/components/MetaPixel";

const STORAGE_KEY = "ff-cookie-consent";

type Consent = "granted" | "denied";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function readStoredConsent(): Consent | null {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return value === "granted" || value === "denied" ? value : null;
    } catch {
        // Private browsing or blocked storage — treat as undecided.
        return null;
    }
}

export default function ConsentGate() {
    const [consent, setConsent] = useState<Consent | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setConsent(readStoredConsent());
        setMounted(true);
    }, []);

    function decide(next: Consent) {
        try {
            window.localStorage.setItem(STORAGE_KEY, next);
        } catch {
            // Ignore storage failures; the choice still applies this session.
        }
        setConsent(next);
    }

    if (!mounted) return null;

    if (consent === "granted") {
        return (
            <>
                {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
                <Clarity />
                <MetaPixel />
                <Script
                    id="goaffpro-script"
                    strategy="afterInteractive"
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function(w,d,s,o,f,js,fjs){
                              w['GoAffProObject']=o;w[o]=w[o]||function(){
                              (w[o].q=w[o].q||[]).push(arguments)};w[o].l=1*new Date();
                              js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
                              js.async=1;js.src=f;fjs.parentNode.insertBefore(js,fjs);
                            })(window,document,'script','goaffpro','https://cdn.goaffpro.com/goaffpro.js');
                            goaffpro('init', 'future-fit');
                        `,
                    }}
                />
            </>
        );
    }

    if (consent === "denied") return null;

    return (
        <div
            role="dialog"
            aria-label="Cookie consent"
            className="fixed bottom-0 left-0 right-0 z-[100] border-t border-foreground/15 bg-background/95 backdrop-blur-sm"
        >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    We use cookies for analytics and affiliate tracking to
                    understand how the store is used. See our{" "}
                    <Link
                        href="/privacy"
                        className="text-foreground underline underline-offset-4"
                    >
                        Privacy Policy
                    </Link>
                    .
                </p>
                <div className="flex shrink-0 gap-3">
                    <button
                        type="button"
                        onClick={() => decide("denied")}
                        className="rounded-full border border-foreground/25 px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        Decline
                    </button>
                    <button
                        type="button"
                        onClick={() => decide("granted")}
                        className="rounded-full bg-foreground px-5 py-2 text-sm font-bold text-background transition-transform hover:scale-105"
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
