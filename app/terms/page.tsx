import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms & Conditions — Future Fit",
    description: "Terms and conditions for using wearfuturefit.com. Read before placing your order.",
};

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-center">TERMS &amp; CONDITIONS</h1>
            <p className="text-center text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                <p>
                    By using <Link href="/" className="text-foreground underline">wearfuturefit.com</Link>,
                    you agree to the following terms and conditions.
                </p>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">1. Usage</h2>
                    <p>
                        You will not use our designs, images, or content for unauthorized resale,
                        reproduction, or distribution without written consent from Future Fit.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">2. Pricing</h2>
                    <p>
                        All prices are listed in Indian Rupees (INR). We reserve the right to change
                        prices without prior notice. The price at the time of order placement will be
                        the price you pay.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">3. AI Fit Finder</h2>
                    <p>
                        While we strive for accurate size recommendations through our AI Fit Finder tool,
                        slight variations in fit may occur due to individual body differences and fabric
                        properties. Size recommendations are for guidance only.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">4. Payments</h2>
                    <p>
                        All payments are processed securely through Razorpay. We do not store your
                        payment card details. By placing an order, you confirm that the payment
                        information provided is accurate and that you are authorized to use the
                        payment method.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">5. Intellectual Property</h2>
                    <p>
                        All content on this website — including designs, logos, text, and images — is
                        the property of Future Fit and is protected by applicable intellectual property
                        laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">6. Limitation of Liability</h2>
                    <p>
                        Future Fit shall not be liable for any indirect, incidental, or consequential
                        damages arising from the use of our website or products beyond the purchase
                        price of the item(s) ordered.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">7. Governing Law</h2>
                    <p>
                        These terms are governed by the laws of India. Any disputes will be subject
                        to the jurisdiction of courts in Karnataka, India.
                    </p>
                </section>
            </div>
        </div>
    );
}
