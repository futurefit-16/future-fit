import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy — Future Fit",
    description: "Future Fit privacy policy. Learn how we collect, use, and protect your personal information.",
    alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-center">PRIVACY POLICY</h1>
            <p className="text-center text-muted-foreground mb-10">Last updated: August 2026</p>

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
                        <li>
                            With your consent, to measure site usage and the performance of our
                            advertising (including Meta / Facebook ads)
                        </li>
                    </ul>
                    <p className="mt-2 font-medium text-foreground">
                        We do not sell your personal data. Analytics and advertising tools only run
                        if you accept cookies.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">4. Data Security</h2>
                    <p>
                        We use industry-standard encryption to protect your information. Payment processing
                        is handled securely by Razorpay — we never store your card details on our servers.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">5. Cookies &amp; Similar Technologies</h2>
                    <p>
                        We use cookies and similar technologies for essential site functions and,
                        only with your consent, for analytics and advertising. Third-party tools
                        such as Google Analytics and the Meta Pixel are used to measure traffic
                        and help deliver relevant ads.
                    </p>

                    <h3 className="text-foreground font-semibold mt-4 mb-2">Essential cookies</h3>
                    <p>
                        These are needed for the site to work — for example, remembering items in your
                        shopping cart and your cookie consent choice. They do not require a separate
                        opt-in.
                    </p>

                    <h3 className="text-foreground font-semibold mt-4 mb-2">
                        Analytics &amp; advertising cookies (consent required)
                    </h3>
                    <p className="mb-2">
                        If you click <strong className="text-foreground">Accept</strong> on our cookie
                        banner, we may load the following tools. If you click{" "}
                        <strong className="text-foreground">Decline</strong>, they are not loaded.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>
                            <strong className="text-foreground">Meta Pixel (Facebook)</strong> — helps
                            us measure visits, understand how ads perform, and show relevant Future Fit
                            ads on Meta platforms (Facebook / Instagram). Meta may receive page-view
                            and device/browser information for that purpose. See{" "}
                            <a
                                href="https://www.facebook.com/privacy/policy/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground underline"
                            >
                                Meta&apos;s Privacy Policy
                            </a>
                            .
                        </li>
                        <li>
                            <strong className="text-foreground">Google Analytics</strong> — if
                            configured, helps us understand aggregate traffic and how pages are used.
                        </li>
                        <li>
                            <strong className="text-foreground">Microsoft Clarity</strong> — if
                            configured, helps us understand session behaviour (for example, which
                            areas of a page are used) so we can improve the site.
                        </li>
                        <li>
                            <strong className="text-foreground">GoAffPro</strong> — affiliate
                            tracking so we can attribute referrals from partners.
                        </li>
                    </ul>

                    <h3 className="text-foreground font-semibold mt-4 mb-2">Your choices</h3>
                    <p>
                        You can accept or decline non-essential cookies via the banner on your first
                        visit. To see the banner again, clear this site&apos;s cookies / site data in
                        your browser, or use a private browsing window. You can also block cookies in
                        your browser settings; some shopping features may not work if essential
                        cookies are disabled.
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
