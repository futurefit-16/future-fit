import type { Product, ProductColor, ProductImage } from "./products";

// Get product by ID
export function getProductById(id: string): Product | null {
  const { PRODUCTS } = require("./products");
  return PRODUCTS[id] || null;
}

// Get all products
export function getAllProducts(): Product[] {
  const { PRODUCTS } = require("./products");
  return Object.values(PRODUCTS);
}

// Get products by category
export function getProductsByCategory(category: Product['category']): Product[] {
  const products = getAllProducts();
  return products.filter(product => product.category === category);
}

// Get product color by variant ID
export function getProductColor(productId: string, colorId: string): ProductColor | null {
  const product = getProductById(productId);
  if (!product) return null;
  
  return product.colors.find(color => color.id === colorId) || null;
}

// Get product images by color
export function getProductImages(productId: string, colorId: string): ProductImage[] {
  const color = getProductColor(productId, colorId);
  return color?.images || [];
}

// Get hero image for a product color
export function getHeroImage(productId: string, colorId: string): ProductImage | null {
  const images = getProductImages(productId, colorId);
  return images.find(img => img.type === 'hero') || null;
}

// Validate image URL format (WebP requirement)
export function validateImageUrl(url: string): boolean {
  // Check if URL ends with .webp format
  return /\.(webp)$/i.test(url);
}

// Validate image dimensions (minimum 2000px on longest side)
export async function validateImageDimensions(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const longestSide = Math.max(img.width, img.height);
      resolve(longestSide >= 2000);
    };
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

// Get all available colors for a product
export function getProductColors(productId: string): ProductColor[] {
  const product = getProductById(productId);
  return product?.colors || [];
}

// Format color name for display
export function formatColorName(color: ProductColor): string {
  return color.name;
}

// Get color hex value
export function getColorHex(productId: string, colorId: string): string {
  const color = getProductColor(productId, colorId);
  return color?.hex || '#000000';
}

// Generate unique variant ID
export function generateVariantId(productId: string, colorId: string): string {
  return `${productId}-${colorId}`;
}

// Parse variant ID to get product and color IDs
export function parseVariantId(variantId: string): { productId: string; colorId: string } | null {
  const parts = variantId.split('-');
  if (parts.length < 2) return null;
  
  const colorId = parts.pop();
  const productId = parts.join('-');
  
  if (!colorId || !productId) return null;
  
  return { productId, colorId };
}

// Check if product has specific image type
export function hasImageType(productId: string, colorId: string, imageType: ProductImage['type']): boolean {
  const images = getProductImages(productId, colorId);
  return images.some(img => img.type === imageType);
}

// Get image by type
export function getImageByType(productId: string, colorId: string, imageType: ProductImage['type']): ProductImage | null {
  const images = getProductImages(productId, colorId);
  return images.find(img => img.type === imageType) || null;
}

// Get product display name with color
export function getProductDisplayName(product: Product, colorId: string): string {
  const color = getProductColor(product.id, colorId);
  return color ? `${product.name} - ${color.name}` : product.name;
}

// Get product count by category
export function getProductCountByCategory(): Record<Product['category'], number> {
  const products = getAllProducts();
  const counts = {
    'oversized-tee': 0,
    'premium-hoodie': 0,
    'round-neck-tee': 0,
  };
  
  products.forEach(product => {
    counts[product.category]++;
  });
  
  return counts;
}

// Get price range for a category
export function getPriceRange(category: Product['category']): { min: number; max: number } {
  const products = getProductsByCategory(category);
  const prices = products.map(p => p.price);
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

// Search products by name
export function searchProducts(query: string): Product[] {
  const products = getAllProducts();
  const lowercaseQuery = query.toLowerCase();
  
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
}
