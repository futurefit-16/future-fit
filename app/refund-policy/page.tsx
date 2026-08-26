import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Refund & Cancellation Policy — Future Fit",
    description: "Future Fit refund and cancellation policy. Easy returns within 7 days, hassle-free refunds.",
};

export default function RefundPolicyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-2xl">
            <h1 className="text-4xl font-black mb-2 tracking-tighter text-center">REFUND &amp; CANCELLATION POLICY</h1>
            <p className="text-center text-muted-foreground mb-10">Last updated: February 2026</p>

            <div className="space-y-8 text-sm leading-relaxed text-muted-foreground">
                <p className="text-base text-foreground font-medium text-center">
                    At Future Fit, we want you to wear the future with confidence.
                </p>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">1. Cancellations</h2>
                    <p>
                        You can cancel your order within <span className="text-foreground font-semibold">2 hours</span> of
                        placement for a full refund. After this window, we may have already begun processing
                        your order and cancellation may not be possible.
                    </p>
                    <p className="mt-2">
                        To cancel, email us at{" "}
                        <a href="mailto:hello@wearfuturefit.com" className="text-foreground underline">hello@wearfuturefit.com</a>{" "}
                        with your Payment ID.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">2. Returns</h2>
                    <p>We accept returns within <span className="text-foreground font-semibold">7 days</span> of delivery if:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>The item is unworn and unused</li>
                        <li>Original packaging and tags are intact</li>
                        <li>You have proof of purchase (Payment ID or order confirmation)</li>
                    </ul>
                    <p className="mt-2">
                        To initiate a return, email{" "}
                        <a href="mailto:hello@wearfuturefit.com" className="text-foreground underline">hello@wearfuturefit.com</a>{" "}
                        with your Payment ID and reason for return.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">3. Refunds</h2>
                    <p>
                        Once we receive the returned item and verify its condition, your refund will be
                        processed to your original payment method (via Razorpay) within{" "}
                        <span className="text-foreground font-semibold">5-7 business days</span>.
                    </p>
                    <p className="mt-2">
                        Shipping charges are non-refundable unless the return is due to a defective or
                        incorrect item.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-bold text-foreground mb-3">4. Damaged or Defective Items</h2>
                    <p>
                        If you receive a damaged or defective item, contact us within 48 hours of delivery
                        with photos. We will arrange a free replacement or full refund.
                    </p>
                </section>
            </div>
        </div>
    );
}
