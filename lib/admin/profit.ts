import { calculateProfit } from "@/lib/pricing";
import { PRODUCTS } from "@/lib/products";

export interface AdminProfitSummary {
  productId: string;
  productName: string;
  salePrice: number;
  mrp: number;
  landedCost: number;
  gst: number;
  shippingBuffer: number;
  netProfit: number;
  profitMargin: number;
  discountPercentage: number;
}

export function getAllProfitCalculations(): AdminProfitSummary[] {
  return Object.entries(PRODUCTS).map(([productId, product]) => {
    const profit = calculateProfit(productId);
    
    if (!profit) {
      throw new Error(`No pricing config found for product ${productId}`);
    }

    const discountPercentage = product.mrp && product.mrp > product.price 
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0;

    return {
      productId,
      productName: product.name,
      salePrice: product.price,
      mrp: product.mrp || product.price,
      landedCost: profit.landedCost,
      gst: profit.gst,
      shippingBuffer: profit.shippingBuffer,
      netProfit: profit.netProfit,
      profitMargin: profit.profitMargin,
      discountPercentage,
    };
  });
}

export function getTotalProfitSummary() {
  const allCalculations = getAllProfitCalculations();
  
  const totalRevenue = allCalculations.reduce((sum, item) => sum + item.salePrice, 0);
  const totalLandedCost = allCalculations.reduce((sum, item) => sum + item.landedCost, 0);
  const totalGST = allCalculations.reduce((sum, item) => sum + item.gst, 0);
  const totalShippingBuffer = allCalculations.reduce((sum, item) => sum + item.shippingBuffer, 0);
  const totalNetProfit = allCalculations.reduce((sum, item) => sum + item.netProfit, 0);
  
  const averageMargin = allCalculations.length > 0 
    ? allCalculations.reduce((sum, item) => sum + item.profitMargin, 0) / allCalculations.length
    : 0;

  return {
    totalProducts: allCalculations.length,
    totalRevenue,
    totalLandedCost,
    totalGST,
    totalShippingBuffer,
    totalNetProfit,
    averageMargin,
    calculations: allCalculations,
  };
}

export function getProductProfitAnalysis(productId: string): AdminProfitSummary | null {
  const product = PRODUCTS[productId];
  if (!product) return null;

  const profit = calculateProfit(productId);
  if (!profit) return null;

  const discountPercentage = product.mrp && product.mrp > product.price 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return {
    productId,
    productName: product.name,
    salePrice: product.price,
    mrp: product.mrp || product.price,
    landedCost: profit.landedCost,
    gst: profit.gst,
    shippingBuffer: profit.shippingBuffer,
    netProfit: profit.netProfit,
    profitMargin: profit.profitMargin,
    discountPercentage,
  };
}
