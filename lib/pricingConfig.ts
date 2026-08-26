export interface PricingConfig {
  mrp: number;
  salePrice: number;
  foundingMemberPrice: number;
  currency: string;
  symbol: string;
}

export const PRODUCT_PRICING: Record<string, PricingConfig> = {
  'oversized-tee': {
    mrp: 1299,
    salePrice: 999,
    foundingMemberPrice: 999,
    currency: 'INR',
    symbol: '₹'
  },
  'premium-hoodie': {
    mrp: 2499,
    salePrice: 1999,
    foundingMemberPrice: 1999,
    currency: 'INR',
    symbol: '₹'
  },
  'round-neck-tee': {
    mrp: 899,
    salePrice: 799,
    foundingMemberPrice: 799,
    currency: 'INR',
    symbol: '₹'
  }
};

export const PRICING_LABELS = {
  foundingMemberPrice: 'FOUNDING MEMBER PRICE',
  priceIncreaseNote: 'Price increases to MRP after first 150 units',
  currency: 'INR'
} as const;

// Helper functions
export function getPricingConfig(productCategory: string): PricingConfig {
  return PRODUCT_PRICING[productCategory] || {
    mrp: 0,
    salePrice: 0,
    foundingMemberPrice: 0,
    currency: 'INR',
    symbol: '₹'
  };
}

export function formatPrice(amount: number, symbol: string = '₹'): string {
  return `${symbol}${amount.toLocaleString('en-IN')}`;
}

export function getDiscountPercentage(mrp: number, salePrice: number): number {
  if (!mrp || mrp <= salePrice) return 0;
  return Math.round(((mrp - salePrice) / mrp) * 100);
}
