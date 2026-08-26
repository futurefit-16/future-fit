"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { COUNTRY_CODES, validatePhone, isPhoneValid } from "@/lib/country-codes";

type RegStep = "form" | "otp" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [step, setStep] = useState<RegStep>("form");
    const [otp, setOtp] = useState("");
    const [devOtp, setDevOtp] = useState<string | null>(null);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [countryIdx, setCountryIdx] = useState(0);
    const [showCodes, setShowCodes] = useState(false);
    const [emailTouched, setEmailTouched] = useState(false);

    const country = COUNTRY_CODES[countryIdx];
    const phoneTarget = `${country.dial}${phone}`;

    const nameValid = firstName.trim().length >= 1 && lastName.trim().length >= 1;
    const phoneError = validatePhone(phone, country);
    const phoneOk = isPhoneValid(phone, country);
    const emailValid = EMAIL_RE.test(email);
    const emailError = emailTouched && email.length > 0 && !emailValid ? "Enter a valid email address." : null;

    const formValid = nameValid && phoneOk && emailValid;

    const handleSendOtp = async () => {
        setEmailTouched(true);
        if (!formValid) { setError("Please fill in all fields correctly."); return; }
        setError(null);
        setLoading(true);
        try {
            const res = await fetch("/api/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: phoneTarget, type: "phone" }),
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
            const res = await fetch("/api/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ target: phoneTarget, type: "phone", otp }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            if (data.verified) {
                if (typeof window !== "undefined") {
                    localStorage.setItem("ff-auth", "true");
                    localStorage.setItem("ff-auth-name", firstName);
                    localStorage.setItem("ff-auth-phone", phoneTarget);
                    localStorage.setItem("ff-auth-email", email);
                }
                setStep("done");
                setSuccess("Account created successfully!");
                setTimeout(() => router.push("/"), 1500);
            }
        } catch {
            setError("Verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const resetStep = () => { setStep("form"); setOtp(""); setDevOtp(null); setError(null); };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-black tracking-tighter">Create Account</h1>
                    <p className="text-muted-foreground mt-2">Join the Future Fit community</p>
                </div>

                {step === "form" && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="First name *" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 focus:ring-foreground" />
                            <input type="text" placeholder="Last name *" value={lastName} onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 focus:ring-foreground" />
                        </div>

                        {/* Phone — mandatory */}
                        <div>
                            <div className="flex gap-2">
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
                                <input type="tel" placeholder={`${country.digits}-digit mobile *`} value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, country.digits))}
                                    maxLength={country.digits}
                                    className={`flex-1 p-3 bg-secondary rounded-md outline-none focus:ring-2 transition-colors ${phoneError ? "ring-2 ring-destructive/50 focus:ring-destructive" : "focus:ring-foreground"}`} />
                            </div>
                            {phoneError && <p className="text-xs text-destructive mt-1.5">{phoneError}</p>}
                        </div>

                        {/* Email — mandatory */}
                        <div>
                            <input type="email" placeholder="Email address *" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={() => setEmailTouched(true)}
                                className={`w-full p-3 bg-secondary rounded-md outline-none focus:ring-2 transition-colors ${emailError ? "ring-2 ring-destructive/50 focus:ring-destructive" : "focus:ring-foreground"}`} />
                            {emailError && <p className="text-xs text-destructive mt-1.5">{emailError}</p>}
                        </div>

                        <p className="text-xs text-muted-foreground">OTP will be sent to your mobile number for verification.</p>

                        <button onClick={handleSendOtp} disabled={loading || !formValid}
                            className="w-full py-3 bg-foreground text-background font-bold rounded-md hover:opacity-90 transition-opacity disabled:opacity-50">
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </div>
                )}

                {step === "otp" && (
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground text-center">
                            OTP sent to <span className="text-foreground font-medium">{country.dial} {phone}</span>
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
                            {loading ? "Verifying..." : "Verify & Create Account"}
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
                {success && (
                    <div className="rounded-md border border-border bg-secondary p-3 text-sm text-center">{success}</div>
                )}

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-foreground font-bold hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
