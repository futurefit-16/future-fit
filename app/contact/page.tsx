import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us — Customer Support & Partnerships",
    description:
        "Get in touch with Future Fit. Customer support, press inquiries, and partnership opportunities.",
    openGraph: {
        title: "Contact Us — Future Fit",
        description: "Get in touch with Future Fit for support or partnerships.",
    },
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-4xl font-black mb-8 tracking-tighter text-center">CONTACT US</h1>
            <div className="space-y-8 text-center">
                <p className="text-xl text-muted-foreground">
                    We are here to help you fit the future.
                </p>

                <div className="grid gap-6 md:grid-cols-2 text-left bg-secondary p-8 rounded-lg">
                    <div>
                        <h3 className="font-bold mb-2">Business Name</h3>
                        <p className="text-muted-foreground">Future Fit</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Founder</h3>
                        <p className="text-muted-foreground">Pradeep C Hosamani</p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Email</h3>
                        <a href="mailto:hello@wearfuturefit.com" className="text-foreground hover:underline">hello@wearfuturefit.com</a>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">Support Hours</h3>
                        <p className="text-muted-foreground">Mon – Sat, 10 AM – 6 PM IST</p>
                    </div>
                </div>

                <div className="bg-secondary p-8 rounded-lg text-left space-y-4">
                    <div>
                        <h3 className="font-bold mb-2">Business Address</h3>
                        <p className="text-muted-foreground">
                            Bengaluru,<br />
                            Karnataka – 560056, India
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold mb-2">GSTIN</h3>
                        <p className="text-muted-foreground">29ANDPH4834K1ZR</p>
                        <p className="text-muted-foreground text-xs mt-1">Legal Entity: Future Fit</p>
                    </div>
                </div>

                <div className="pt-4 text-sm text-muted-foreground">
                    <p>We typically respond within 24 hours.</p>
                </div>
            </div>
        </div>
    );
}
