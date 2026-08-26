export function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidIndianPhone(phone: string): boolean {
    const digits = phone.replace(/[\s\-+]/g, "");
    // 10-digit Indian mobile or with 91 prefix
    return /^(91)?[6-9]\d{9}$/.test(digits);
}

export function isValidPincode(pincode: string): boolean {
    return /^\d{6}$/.test(pincode.trim());
}

export function normalizePhone(phone: string): string {
    const digits = phone.replace(/[\s\-+]/g, "");
    if (digits.startsWith("91") && digits.length === 12) return digits.slice(2);
    return digits;
}
