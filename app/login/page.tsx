"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { COUNTRY_CODES, validatePhone, isPhoneValid } from "@/lib/country-codes";

type AuthMode = "phone" | "email";
type OtpStep = "input" | "otp";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>("phone");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [step, setStep] = useState<OtpStep>("input");
    const [otp, setOtp] = useState("");
    const [devOtp, setDevOtp] = useState<string | null>(null);

    // Phone state
    const [phone, setPhone] = useState("");
    const [countryIdx, setCountryIdx] = useState(0);
    const [showCodes, setShowCodes] = useState(false);

    // Email state
    const [email, setEmail] = useState("");
    const [emailTouched, setEmailTouched] = useState(false);

    const country = COUNTRY_CODES[countryIdx];
    const phoneTarget = `${country.dial}${phone}`;
    const emailValid = EMAIL_RE.test(email);
    const phoneError = validatePhone(phone, country);
    const phoneOk = isPhoneValid(phone, country);
    const emailError = emailTouched && email.length > 0 && !emailValid ? "Enter a valid email address." : null;

    const canSendOtp = mode === "phone" ? phoneOk : emailValid;

    const handleSendOtp = async () => {
        setError(null);
        setLoading(true);
        try {
            const target = mode === "phone" ? phoneTarget : email;
            const res = await fetch("/api/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target, type: mode }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            if (data.otp) setDevOtp(data.otp);
            setStep("otp");
        } catch {
            setError("Failed to send OTP. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setError(null);
        setLoading(true);
        try {
            const target = mode === "phone" ? phoneTarget : email;
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target, type: mode, otp }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            if (data.verified) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("ff-auth", "true");
                    localStorage.setItem(mode === "phone" ? "ff-auth-phone" : "ff-auth-email", target);
                }
                router.push("/");
            }
        } catch {
            setError("Verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetStep = () => { setStep("input"); setOtp(""); setDevOtp(null); setError(null); setEmailTouched(false); };

    const displayTarget = mode === "phone" ? `${country.dial} ${phone}` : email;

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-black tracking-tighter">Welcome back</h1>
                    <p className="text-muted-foreground mt-2">Sign in to your account</p>
                </div>

                {/* Mode toggle — icons + short labels */}
                <div className="grid grid-cols-2 gap-2 bg-secondary rounded-lg p-1">
                    <button
                        onClick={() => { setMode("phone"); resetStep(); }}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${mode === "phone" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <Phone size={16} /> Phone
                    </button>
                    <button
                        onClick={() => { setMode("email"); resetStep(); }}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-colors ${mode === "email" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <Mail size={16} /> Email
                    </button>
                </div>

                {step === "input" ? (
                    <div className="space-y-4">
                        {mode === "phone" ? (
                            <div>
                                <div className="flex gap-2">
                                    {/* Country code picker */}
                                    <div className="relative">
                                        <button type="button" onClick={() => setShowCodes(!showCodes)}
                                            className="flex items-center gap-1 h-full px-3 bg-secondary rounded-md text-sm whitespace-nowrap hover:bg-muted transition-colors">
                                            <span>{country.flag}</span>
                                            <span className="font-medium">{country.dial}</span>
                                            <ChevronDown size={14} className="text-muted-foreground" />
                                        </button>
                                        {showCodes && (
                                            <div className="absolute top-full left-0 mt-1 w-48 max-h-60 overflow-y-auto bg-card border border-border rounded-lg shadow-xl z-50 no-scrollbar">
                                                {COUNTRY_CODES.map((c, i) => (
                                                    <button key={c.code} type="button"
                                                        onClick={() => { setCountryIdx(i); setShowCodes(false); setPhone(""); }}
                                                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors ${i === countryIdx ? "bg-secondary font-medium" : ""}`}>
                                                        <span>{c.flag}</span>
                                                        <span>{c.code}</span>
                                                        <span className="text-muted-foreground ml-auto">{c.dial}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <input type="tel" placeholder={`${country.digits}-digit number`} value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, country.digits))}
                                        maxLength={country.digits}
                                        className={`flex-1 p-3 bg-secondary rounded-md outline-none focus:ring-2 transition-colors ${phoneError ? "ring-2 ring-destructive/50 focus:ring-destructive" : "focus:ring-foreground"}`} />
                                </div>
                                {phoneError && <p className="text-xs text-destructive mt-1.5">{phoneError}</p>}
                            </div>
                        ) : (
                            <div>
                                <input type="email" placeholder="Email address" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onBlur={() => setEmailTouched(true)}
                                    className={`w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 transition-colors ${emailError ? "ring-2 ring-destructive/50 focus:ring-destructive" : "focus:ring-foreground"}`} />
                                {emailError && <p className="text-xs text-destructive mt-1.5">{emailError}</p>}
                            </div>
                        )}

                        <button onClick={handleSendOtp} disabled={loading || !canSendOtp}
                            className="w-full py-3 bg-foreground text-background font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            OTP sent to <span className="text-foreground font-medium">{displayTarget}</span>
                            <button onClick={resetStep} className="text-foreground font-bold ml-2 hover:underline">Change</button>
                        </p>
                        {devOtp && (
                            <div className="rounded-md border border-border bg-secondary p-3 text-sm text-center">
                                Test OTP: <span className="font-mono font-bold tracking-widest">{devOtp}</span>
                            </div>
                        )}
                        <input type="text" placeholder="Enter 6-character OTP" value={otp}
                            onChange={(e) => setOtp(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                            maxLength={6}
                            className="w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 focus:ring-foreground text-center font-mono text-lg tracking-[0.4em]" />
                        <button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6}
                            className="w-full py-3 bg-foreground text-background font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? "Verifying..." : "Verify & Sign In"}
                        </button>
                        <button onClick={handleSendOtp} disabled={loading}
                            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                            Resend OTP
                        </button>
                    </div>
                )}

                {error && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
                )}

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                </div>

                <div className="space-y-4">
                    <Link href="/" className="block w-full py-3 text-center border border-border rounded-md font-bold hover:bg-secondary transition-colors">
                        Continue as Guest
                    </Link>
                    <p className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account? <Link href="/register" className="text-foreground font-bold hover:underline">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
