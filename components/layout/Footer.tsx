import Link from "next/link";
import { Mail, MapPin, Clock, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t border-border/50 bg-background">
            <div className="container mx-auto px-4 py-14 md:px-8">
                <div className="grid gap-8 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <Link href="/" className="font-black text-xl tracking-tighter">F\F</Link>
                        <p className="mt-3 text-sm text-muted-foreground">Wear the future.</p>
                        <div className="mt-4 space-y-2 text-xs text-muted-foreground">
                            <p className="flex items-center gap-2">
                                <Mail size={12} />
                                <a href="mailto:hello@wearfuturefit.com" className="hover:text-foreground transition-colors">hello@wearfuturefit.com</a>
                            </p>
                            <p className="flex items-start gap-2">
                                <MapPin size={12} className="mt-0.5 shrink-0" />
                                <span>Bengaluru, Karnataka, India</span>
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock size={12} />
                                <span>Mon–Sat, 10 AM – 6 PM IST</span>
                            </p>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-3">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
                            <li><Link href="/collections" className="hover:text-foreground transition-colors">Collections</Link></li>
                            <li><Link href="/fit-finder" className="hover:text-foreground transition-colors">AI Fit Finder</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-3">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
                            <li><Link href="/studio" className="hover:text-foreground transition-colors">Studio</Link></li>
                            <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
                            <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-sm mb-3">Growth</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/affiliates" className="hover:text-foreground transition-colors">Affiliates</Link></li>
                            <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/refund-policy" className="hover:text-foreground transition-colors">Refund &amp; Cancellation</Link></li>
                            <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms &amp; Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Payment badges */}
                <div className="mt-10 pt-6 border-t border-border">
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
                        <span className="text-xs text-muted-foreground">Secure payments via</span>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1.5 bg-secondary rounded text-xs font-bold tracking-wide">Razorpay</span>
                            <span className="px-3 py-1.5 bg-secondary rounded text-xs font-medium">Visa</span>
                            <span className="px-3 py-1.5 bg-secondary rounded text-xs font-medium">Mastercard</span>
                            <span className="px-3 py-1.5 bg-secondary rounded text-xs font-medium">UPI</span>
                            <span className="px-3 py-1.5 bg-secondary rounded text-xs font-medium">NetBanking</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                        <p>&copy; 2026 Future Fit. All rights reserved.</p>
                        <div className="flex items-center gap-4">
                            <a href="https://instagram.com/wearfuturefit" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-white transition-colors duration-200" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://twitter.com/wearfuturefit" target="_blank" rel="noopener noreferrer" className="text-[#888888] hover:text-white transition-colors duration-200" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                        </div>
                        <p>GSTIN: 29ANDPH4834K1ZR | Legal Entity: Future Fit</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
