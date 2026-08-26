import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy — Future Fit",
    description: "Future Fit privacy policy. Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-center">PRIVACY POLICY</h1>
            <p className="text-center text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">1. Who We Are</h2>
                    <p>
                        Future Fit (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is committed to
                        protecting your privacy. This policy explains how we handle your personal information
                        when you use <Link href="/" className="text-foreground underline">wearfuturefit.com</Link>.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">2. Information We Collect</h2>
                    <p>We collect the following information solely to process your orders and improve your shopping experience:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Name</li>
                        <li>Email address</li>
                        <li>Phone number</li>
                        <li>Shipping address</li>
                        <li>Payment information (processed securely via Razorpay)</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">3. How We Use Your Data</h2>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>To process and deliver your orders</li>
                        <li>To send order confirmations and shipping updates</li>
                        <li>To improve our products and services</li>
                    </ul>
                    <p className="mt-2 font-medium text-foreground">We do not sell your data to third parties.</p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">4. Data Security</h2>
                    <p>
                        We use industry-standard encryption to protect your information. Payment processing
                        is handled securely by Razorpay — we never store your card details on our servers.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">5. Cookies</h2>
                    <p>
                        We use cookies to keep track of your shopping cart items and improve your browsing
                        experience. You can disable cookies in your browser settings, but some site features
                        may not work properly.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">6. Contact</h2>
                    <p>
                        For data inquiries, email us at{" "}
                        <a href="mailto:hello@wearfuturefit.com" className="text-foreground underline">hello@wearfuturefit.com</a>.
                    </p>
                </section>
            </div>
        </div>
    );
}
