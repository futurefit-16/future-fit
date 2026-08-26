export interface CountryCode {
    code: string;
    dial: string;
    flag: string;
    digits: number;
    startRe?: RegExp;
}

export const COUNTRY_CODES: CountryCode[] = [
    { code: "IN", dial: "+91", flag: "\u{1F1EE}\u{1F1F3}", digits: 10, startRe: /^[6-9]/ },
    { code: "US", dial: "+1", flag: "\u{1F1FA}\u{1F1F8}", digits: 10 },
    { code: "GB", dial: "+44", flag: "\u{1F1EC}\u{1F1E7}", digits: 10 },
    { code: "CA", dial: "+1", flag: "\u{1F1E8}\u{1F1E6}", digits: 10 },
    { code: "AU", dial: "+61", flag: "\u{1F1E6}\u{1F1FA}", digits: 9 },
    { code: "AE", dial: "+971", flag: "\u{1F1E6}\u{1F1EA}", digits: 9 },
    { code: "SG", dial: "+65", flag: "\u{1F1F8}\u{1F1EC}", digits: 8 },
    { code: "DE", dial: "+49", flag: "\u{1F1E9}\u{1F1EA}", digits: 11 },
    { code: "FR", dial: "+33", flag: "\u{1F1EB}\u{1F1F7}", digits: 9 },
    { code: "JP", dial: "+81", flag: "\u{1F1EF}\u{1F1F5}", digits: 10 },
    { code: "KR", dial: "+82", flag: "\u{1F1F0}\u{1F1F7}", digits: 10 },
    { code: "CN", dial: "+86", flag: "\u{1F1E8}\u{1F1F3}", digits: 11 },
    { code: "BR", dial: "+55", flag: "\u{1F1E7}\u{1F1F7}", digits: 11 },
    { code: "ZA", dial: "+27", flag: "\u{1F1FF}\u{1F1E6}", digits: 9 },
    { code: "NG", dial: "+234", flag: "\u{1F1F3}\u{1F1EC}", digits: 10 },
    { code: "SA", dial: "+966", flag: "\u{1F1F8}\u{1F1E6}", digits: 9 },
    { code: "MY", dial: "+60", flag: "\u{1F1F2}\u{1F1FE}", digits: 10 },
    { code: "PH", dial: "+63", flag: "\u{1F1F5}\u{1F1ED}", digits: 10 },
    { code: "BD", dial: "+880", flag: "\u{1F1E7}\u{1F1E9}", digits: 10 },
    { code: "PK", dial: "+92", flag: "\u{1F1F5}\u{1F1F0}", digits: 10, startRe: /^[3]/ },
    { code: "LK", dial: "+94", flag: "\u{1F1F1}\u{1F1F0}", digits: 9 },
    { code: "NP", dial: "+977", flag: "\u{1F1F3}\u{1F1F5}", digits: 10 },
    { code: "NZ", dial: "+64", flag: "\u{1F1F3}\u{1F1FF}", digits: 9 },
    { code: "IT", dial: "+39", flag: "\u{1F1EE}\u{1F1F9}", digits: 10 },
    { code: "ES", dial: "+34", flag: "\u{1F1EA}\u{1F1F8}", digits: 9 },
];

export function validatePhone(phone: string, country: CountryCode): string | null {
    if (!phone) return null;
    if (phone.length > 0 && phone.length < country.digits) {
        return `Enter ${country.digits} digits for ${country.code}.`;
    }
    if (phone.length === country.digits && country.startRe && !country.startRe.test(phone)) {
        return `${country.code} numbers must start with ${country.code === "IN" ? "6, 7, 8 or 9" : "a valid digit"}.`;
    }
    if (phone.length > country.digits) {
        return `${country.code} numbers are ${country.digits} digits.`;
    }
    return null;
}

export function isPhoneValid(phone: string, country: CountryCode): boolean {
    if (phone.length !== country.digits) return false;
    if (country.startRe && !country.startRe.test(phone)) return false;
    return true;
}
