import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "FAQ — Sizing, Shipping, Returns & Payments",
    description:
        "Answers to common Future Fit questions: how our oversized sizing runs, fabric weights, cancellations, returns within 7 days, refunds and payment methods.",
    alternates: { canonical: "/faq" },
    openGraph: {
        title: "FAQ — Future Fit",
        description:
            "Sizing, fabric, shipping, returns and payment questions answered.",
    },
};

interface Faq {
    q: string;
    a: React.ReactNode;
    /** Plain-text answer used for FAQPage structured data. */
    plain: string;
}

const FAQS: Faq[] = [
    {
        q: "What size should I order?",
        a: (
            <>
                Our tees are cut oversized with a drop shoulder and boxy body, so
                they run roomier than a standard fit. Use the{" "}
                <Link href="/fit-finder" className="text-foreground underline">
                    AI Fit Finder
                </Link>{" "}
                — answer three questions and it recommends your size. Fit
                recommendations are guidance only, since individual body
                differences and fabric properties cause slight variation.
            </>
        ),
        plain:
            "Our tees are cut oversized with a drop shoulder and boxy body, so they run roomier than a standard fit. Use the AI Fit Finder — answer three questions and it recommends your size. Fit recommendations are guidance only, since individual body differences and fabric properties cause slight variation.",
    },
    {
        q: "What fabric do you use?",
        a: (
            <>
                Oversized tees are 240 GSM cotton, round neck tees are 180 GSM,
                and hoodies are 320 GSM French Terry. Everything is bio-washed
                and pre-shrunk before it ships.
            </>
        ),
        plain:
            "Oversized tees are 240 GSM cotton, round neck tees are 180 GSM, and hoodies are 320 GSM French Terry. Everything is bio-washed and pre-shrunk before it ships.",
    },
    {
        q: "Will it shrink after washing?",
        a: (
            <>
                No. Every piece is pre-shrunk and bio-washed during production,
                which is exactly the problem we built the brand to solve. Wash
                cold and avoid a hot tumble dry to keep the hand feel.
            </>
        ),
        plain:
            "No. Every piece is pre-shrunk and bio-washed during production. Wash cold and avoid a hot tumble dry to keep the hand feel.",
    },
    {
        q: "Where do you ship, and how long does it take?",
        a: (
            <>
                We ship across India. For the current dispatch and delivery
                window on your order, email{" "}
                <a
                    href="mailto:hello@wearfuturefit.com"
                    className="text-foreground underline"
                >
                    hello@wearfuturefit.com
                </a>{" "}
                and we&apos;ll confirm.
            </>
        ),
        plain:
            "We ship across India. For the current dispatch and delivery window on your order, email hello@wearfuturefit.com and we'll confirm.",
    },
    {
        q: "Can I cancel my order?",
        a: (
            <>
                Yes, within 2 hours of placing it, for a full refund. After that
                window we may have already started processing and cancellation
                may not be possible. Email{" "}
                <a
                    href="mailto:hello@wearfuturefit.com"
                    className="text-foreground underline"
                >
                    hello@wearfuturefit.com
                </a>{" "}
                with your Payment ID.
            </>
        ),
        plain:
            "Yes, within 2 hours of placing it, for a full refund. After that window we may have already started processing and cancellation may not be possible. Email hello@wearfuturefit.com with your Payment ID.",
    },
    {
        q: "What is your return policy?",
        a: (
            <>
                Returns are accepted within 7 days of delivery, provided the item
                is unworn and unused, the original packaging and tags are intact,
                and you have proof of purchase. Full details are on the{" "}
                <Link
                    href="/refund-policy"
                    className="text-foreground underline"
                >
                    refund policy
                </Link>{" "}
                page.
            </>
        ),
        plain:
            "Returns are accepted within 7 days of delivery, provided the item is unworn and unused, the original packaging and tags are intact, and you have proof of purchase.",
    },
    {
        q: "How long do refunds take?",
        a: (
            <>
                Once we receive the item and verify its condition, the refund goes
                back to your original payment method through Razorpay within 5 to
                7 business days. Shipping charges are not refundable unless the
                return is due to a defective or incorrect item.
            </>
        ),
        plain:
            "Once we receive the item and verify its condition, the refund goes back to your original payment method through Razorpay within 5 to 7 business days. Shipping charges are not refundable unless the return is due to a defective or incorrect item.",
    },
    {
        q: "My order arrived damaged or incorrect. What now?",
        a: (
            <>
                Contact us within 48 hours of delivery with photos and we&apos;ll
                arrange a free replacement or a full refund, including shipping.
            </>
        ),
        plain:
            "Contact us within 48 hours of delivery with photos and we'll arrange a free replacement or a full refund, including shipping.",
    },
    {
        q: "Which payment methods do you accept?",
        a: (
            <>
                All payments run securely through Razorpay, which covers UPI,
                cards, net banking and wallets. Prices are in Indian Rupees (INR)
                and we never store your card details.
            </>
        ),
        plain:
            "All payments run securely through Razorpay, which covers UPI, cards, net banking and wallets. Prices are in Indian Rupees (INR) and we never store your card details.",
    },
    {
        q: "Do you have an affiliate program?",
        a: (
            <>
                Yes. Details and signup are on the{" "}
                <Link href="/affiliates" className="text-foreground underline">
                    affiliates
                </Link>{" "}
                page.
            </>
        ),
        plain:
            "Yes. Details and signup are on the affiliates page.",
    },
];

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.plain },
    })),
};

export default function FaqPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <h1 className="text-4xl font-black mb-2 tracking-tighter text-center">
                FAQ
            </h1>
            <p className="text-center text-muted-foreground mb-10">
                Sizing, fabric, shipping, returns and payments.
            </p>

            <div className="divide-y divide-foreground/10 border-y border-foreground/10">
                {FAQS.map((faq) => (
                    <details key={faq.q} className="group py-5">
                        <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
                            {faq.q}
                            <span
                                aria-hidden="true"
                                className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                            >
                                +
                            </span>
                        </summary>
                        <div className="mt-3 text-sm leading-relaxed text-muted-foreground">
                            {faq.a}
                        </div>
                    </details>
                ))}
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground mb-6">
                    Still stuck? We answer every email.
                </p>
                <Link
                    href="/contact"
                    className="px-8 py-3 bg-foreground text-background rounded-full font-bold text-sm hover:scale-105 transition-transform inline-block"
                >
                    Contact Us
                </Link>
            </div>
        </div>
    );
}
