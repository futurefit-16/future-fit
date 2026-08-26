const OTP_STORE = new Map<string, { otp: string; expiresAt: number }>();
const OTP_LENGTH = 6;
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const OTP_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // alphanumeric, no confusing chars

export function generateOtp(key: string): string {
    let otp = "";
    for (let i = 0; i < OTP_LENGTH; i++) {
        otp += OTP_CHARS[Math.floor(Math.random() * OTP_CHARS.length)];
    }
    OTP_STORE.set(key.toLowerCase(), { otp, expiresAt: Date.now() + OTP_EXPIRY_MS });
    return otp;
}

export function verifyOtp(key: string, otp: string): boolean {
    const entry = OTP_STORE.get(key.toLowerCase());
    if (!entry) return false;
    if (Date.now() > entry.expiresAt) {
        OTP_STORE.delete(key.toLowerCase());
        return false;
    }
    if (entry.otp.toUpperCase() !== otp.toUpperCase()) return false;
    OTP_STORE.delete(key.toLowerCase());
    return true;
}
