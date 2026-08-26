// Security utilities for input validation and sanitization

export class SecurityValidator {
  // Validate email with strict regex
  static validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  }

  // Validate Indian phone number (10 digits)
  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.trim());
  }

  // Validate Indian pincode (6 digits)
  static validatePincode(pincode: string): boolean {
    const pincodeRegex = /^\d{6}$/;
    return pincodeRegex.test(pincode.trim());
  }

  // Sanitize string input
  static sanitizeString(input: string, maxLength: number = 100): string {
    return input
      .trim()
      .slice(0, maxLength)
      .replace(/[<>]/g, ''); // Remove potential HTML tags
  }

  // Validate name (letters, spaces, basic punctuation)
  static validateName(name: string): boolean {
    const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
    return nameRegex.test(name.trim());
  }

  // Validate address (alphanumeric, spaces, basic punctuation)
  static validateAddress(address: string): boolean {
    const addressRegex = /^[a-zA-Z0-9\s,-.#/]{5,200}$/;
    return addressRegex.test(address.trim());
  }

  // Validate amount (positive number, max 100000)
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 100000 && Number.isInteger(amount * 100);
  }
}

// Rate limiting in-memory store (for production, use Redis)
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  static isAllowed(
    identifier: string, 
    maxRequests: number = 10, 
    windowMs: number = 60000 // 1 minute
  ): boolean {
    const now = Date.now();
    const key = identifier;
    const record = this.requests.get(key);

    if (!record || now > record.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    if (record.count >= maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.requests.entries()) {
      if (now > record.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

// CSRF token generation and validation
export class CSRFProtection {
  private static readonly TOKEN_LENGTH = 32;
  private static readonly COOKIE_NAME = 'csrf-token';
  private static readonly HEADER_NAME = 'x-csrf-token';

  static generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < this.TOKEN_LENGTH; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  static validateToken(requestToken: string, sessionToken: string): boolean {
    return !!(requestToken && sessionToken && requestToken === sessionToken);
  }
}
