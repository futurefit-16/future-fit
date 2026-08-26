export interface PricingConfig {
  mrp: number;
  salePrice: number;
  landedCost: number;
  gst: number; // 12%
  shippingBuffer: number; // ₹150
}

export interface ProfitCalculation {
  salePrice: number;
  gst: number;
  landedCost: number;
  shippingBuffer: number;
  netProfit: number;
  profitMargin: number; // percentage
}

// Aggressive Newcomer Strategy Pricing
export const PRICING_CONFIG: Record<string, PricingConfig> = {
  // Oversized Tees (240 GSM)
  "oversized-box-tee": {
    mrp: 1299,
    salePrice: 999,
    landedCost: 355,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "oversized-acid-wash-tee": {
    mrp: 1299,
    salePrice: 999,
    landedCost: 355,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "oversized-graphic-tee": {
    mrp: 1299,
    salePrice: 999,
    landedCost: 355,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "oversized-drop-shoulder-tee": {
    mrp: 1299,
    salePrice: 999,
    landedCost: 355,
    gst: 0.12,
    shippingBuffer: 150,
  },

  // Premium Hoodies (320 GSM)
  "oversized-hoodie": {
    mrp: 2499,
    salePrice: 1999,
    landedCost: 580,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "pullover-hoodie": {
    mrp: 2499,
    salePrice: 1999,
    landedCost: 580,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "zip-up-hoodie": {
    mrp: 2499,
    salePrice: 1999,
    landedCost: 580,
    gst: 0.12,
    shippingBuffer: 150,
  },

  // Round Neck Tees (180 GSM)
  "classic-round-neck-tee": {
    mrp: 899,
    salePrice: 799,
    landedCost: 270,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "premium-round-neck-tee": {
    mrp: 899,
    salePrice: 799,
    landedCost: 270,
    gst: 0.12,
    shippingBuffer: 150,
  },
  "round-neck-graphic-tee": {
    mrp: 899,
    salePrice: 799,
    landedCost: 270,
    gst: 0.12,
    shippingBuffer: 150,
  },
};

// Get pricing config for a product
export function getPricingConfig(productId: string): PricingConfig | null {
  return PRICING_CONFIG[productId] || null;
}

// Calculate profit for a product
export function calculateProfit(productId: string): ProfitCalculation | null {
  const config = getPricingConfig(productId);
  if (!config) return null;

  const { salePrice, landedCost, gst, shippingBuffer } = config;
  const gstAmount = salePrice * gst;
  const netProfit = salePrice - gstAmount - landedCost - shippingBuffer;
  const profitMargin = salePrice > 0 ? (netProfit / salePrice) * 100 : 0;

  return {
    salePrice,
    gst: gstAmount,
    landedCost,
    shippingBuffer,
    netProfit,
    profitMargin,
  };
}

// Format price with currency
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

// Get discount percentage
export function getDiscountPercentage(mrp: number, salePrice: number): number {
  return mrp > salePrice ? Math.round(((mrp - salePrice) / mrp) * 100) : 0;
}

// Check if product is on discount
export function isOnDiscount(mrp: number, salePrice: number): boolean {
  return mrp > salePrice;
}
