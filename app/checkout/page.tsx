"use client";

import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CheckCircle, ShoppingBag, ArrowLeft, AlertTriangle } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { formatCurrency } from "@/lib/utils";
import { updateStockAfterPurchase } from "@/lib/actions/inventory";
import { SecurityValidator } from "@/lib/security";
import { useState, useMemo, useEffect } from "react";

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

type CheckoutState = "form" | "processing" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[6-9]\d{9}$/;
const PINCODE_RE = /^\d{6}$/;

// Razorpay script is now loaded via Next.js Script component

export default function CheckoutPage() {
    const { items, total, removeItem, updateQuantity } = useCart();
    const [state, setState] = useState<CheckoutState>("form");
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isClient, setIsClient] = useState(false);

    // Fix hydration mismatch
    useEffect(() => {
        setIsClient(true);
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [pincode, setPincode] = useState("");

    const validations = useMemo(() => ({
        name: SecurityValidator.validateName(name),
        email: SecurityValidator.validateEmail(email),
        phone: SecurityValidator.validatePhone(phone),
        address: SecurityValidator.validateAddress(address),
        city: SecurityValidator.validateName(city) && city.trim().length >= 2,
        pincode: SecurityValidator.validatePincode(pincode),
    }), [name, email, phone, address, city, pincode]);

    const allValid = Object.values(validations).every(Boolean) && items.length > 0;

    const markTouched = (field: string) => setTouched((prev) => ({ ...prev, [field]: true }));

    const fieldError = (field: keyof typeof validations, msg: string) =>
        touched[field] && !validations[field] ? <p className="text-xs text-destructive mt-1">{msg}</p> : null;

    const inputCls = (field: keyof typeof validations) =>
        `w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 transition-colors ${touched[field] && !validations[field] ? "ring-2 ring-destructive/50 focus:ring-destructive" : "focus:ring-foreground"}`;

    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (window.Razorpay) { resolve(true); return; }
            const s = document.createElement("script");
            s.src = "https://checkout.razorpay.com/v1/checkout.js";
            s.onload = () => resolve(true);
            s.onerror = () => resolve(false);
            document.body.appendChild(s);
        });

    const handlePay = async () => {
        setTouched({ name: true, email: true, phone: true, address: true, city: true, pincode: true });
        if (!allValid) {
            setError("Please fix the highlighted fields before proceeding.");
            return;
        }
        setError(null);
        setLoading(true);

        try {
            // Check if Razorpay is available (loaded via Next.js Script component)
            if (!window.Razorpay) { 
                setError("Payment gateway is loading. Please wait a moment and try again."); 
                setLoading(false); 
                return; 
            }

            const res = await fetch("/api/razorpay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: total }),
            });
            const data = await res.json();

            if (!res.ok) {
                if (data.error?.includes("not configured")) {
                    setError("Payment gateway is being set up. Please try again later or contact hello@wearfuturefit.com.");
                } else {
                    setError(data.error || "Failed to create order. Please try again.");
                }
                setLoading(false);
                return;
            }

            setState("processing");
            const options: Record<string, unknown> = {
                key: data.keyId,
                amount: data.amount,
                currency: data.currency,
                name: "Future Fit",
                description: `Order of ${items.length} item(s)`,
                order_id: data.orderId,
                prefill: { name, email, contact: `+91${phone}` },
                theme: { color: "#000000" },
                handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
                    try {
                        const verifyRes = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(response),
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.verified) {
                            setPaymentId(verifyData.paymentId);
                            
                            // Decrement stock for each purchased item
                            for (const item of items) {
                                const slug = item.id.replace(/^.*:/, ""); // Remove any prefix if present
                                await updateStockAfterPurchase(slug, 1);
                            }
                            
                            // Store order details for PartnerStack tracking
                            if (typeof window !== "undefined") {
                                sessionStorage.setItem("future_fit_order", JSON.stringify({
                                    paymentId: verifyData.paymentId,
                                    total,
                                    email,
                                    items,
                                }));
                            }
                            
                            // Send order notification
                            fetch("/api/notify/order", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    phone, name, email, items, total,
                                    paymentId: verifyData.paymentId,
                                    address: `${address}, ${city} - ${pincode}`,
                                }),
                            }).catch(() => {});
                            
                            // Redirect to success page
                            window.location.href = `/checkout/success?payment_id=${verifyData.paymentId}&amount=${total}&email=${encodeURIComponent(email)}`;
                        } else {
                            setError("Payment verification failed. Contact support if amount was deducted.");
                            setState("error");
                        }
                    } catch {
                        setError("Payment verification failed. Contact support if amount was deducted.");
                        setState("error");
                    }
                },
                modal: {
                    ondismiss: () => { setState("form"); setLoading(false); },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
            setState("form");
            setLoading(false);
        }
    };

    if (state === "success") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <CheckCircle size={40} />
                </div>
                <h1 className="text-4xl font-black mb-4 tracking-tighter">Order Confirmed!</h1>
                <p className="text-xl text-muted-foreground max-w-md mb-2">
                    Your gear is being prepped. You&apos;ll receive a confirmation on +91 {phone}.
                </p>
                {paymentId && <p className="text-sm text-muted-foreground mb-8">Payment ID: {paymentId}</p>}
                <Link href="/" className="px-8 py-4 bg-foreground text-background rounded-full font-bold hover:scale-105 transition-transform">
                    Back to Home
                </Link>
            </div>
        );
    }

    if (!isClient || (items.length === 0 && state === "form")) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <ShoppingBag size={48} className="text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                <p className="text-muted-foreground mb-6">Add some items before checking out.</p>
                <Link href="/shop" className="px-6 py-3 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity">Shop Now</Link>
            </div>
        );
    }

    return (
        <>
        <div className="max-w-4xl mx-auto px-4 py-8 overflow-y-auto h-full">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
                <ArrowLeft size={16} /> Continue Shopping
            </Link>

            <h1 className="text-3xl font-black tracking-tighter mb-8">Checkout</h1>

            <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-3 space-y-4">
                    <h2 className="text-lg font-bold mb-2">Shipping Details</h2>
                    <div>
                        <input type="text" placeholder="Full Name" value={name}
                            onChange={(e) => setName(e.target.value)} onBlur={() => markTouched("name")}
                            className={inputCls("name")} />
                        {fieldError("name", "Name must be at least 2 characters.")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input type="email" placeholder="Email" value={email}
                                onChange={(e) => setEmail(e.target.value)} onBlur={() => markTouched("email")}
                                className={inputCls("email")} />
                            {fieldError("email", "Enter a valid email address.")}
                        </div>
                        <div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                                <input type="tel" placeholder="Mobile number" value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                                    onBlur={() => markTouched("phone")} maxLength={10}
                                    className={`${inputCls("phone")} pl-12`} />
                            </div>
                            {fieldError("phone", "Enter a valid 10-digit Indian mobile number.")}
                        </div>
                    </div>
                    <div>
                        <input type="text" placeholder="Full Address" value={address}
                            onChange={(e) => setAddress(e.target.value)} onBlur={() => markTouched("address")}
                            className={inputCls("address")} />
                        {fieldError("address", "Address must be at least 5 characters.")}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <input type="text" placeholder="City" value={city}
                                onChange={(e) => setCity(e.target.value)} onBlur={() => markTouched("city")}
                                className={inputCls("city")} />
                            {fieldError("city", "Enter a valid city name.")}
                        </div>
                        <div>
                            <input type="text" placeholder="Pincode" value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                                onBlur={() => markTouched("pincode")} maxLength={6}
                                className={inputCls("pincode")} />
                            {fieldError("pincode", "Enter a valid 6-digit pincode.")}
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2">
                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                    <div className="space-y-3 mb-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-3 p-3 border border-border rounded-lg bg-card">
                                <div className="w-14 h-14 bg-muted rounded-md relative overflow-hidden shrink-0">
                                    <Image src={item.image} alt={item.name} fill sizes="56px" quality={75} loading="lazy" className="object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                    {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 rounded border border-border bg-background hover:bg-muted flex items-center justify-center text-xs"
                                                disabled={item.quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded border border-border bg-background hover:bg-muted flex items-center justify-center text-xs"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                                            <button onClick={() => removeItem(item.id)} className="text-xs text-destructive hover:underline">Remove</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-border pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Shipping</span>
                            <span className="text-green-500 font-medium">Free</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                            <span>Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>

                    {error && (
                        <div className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive flex items-start gap-2">
                            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <button onClick={handlePay} disabled={loading}
                        className="w-full mt-6 py-4 bg-foreground text-background rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50">
                        {loading ? "Processing..." : `Pay ${formatCurrency(total)}`}
                    </button>

                    <p className="text-xs text-center text-muted-foreground mt-3">
                        Secured by Razorpay. UPI, Cards, Wallets accepted.
                    </p>
                </div>
            </div>
        </div>
        
        {/* Razorpay Script */}
        <Script 
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="afterInteractive"
            onLoad={() => {
                console.log('Razorpay script loaded successfully');
            }}
            onError={() => {
                console.error('Failed to load Razorpay script');
            }}
        />
        </>
    );
}
