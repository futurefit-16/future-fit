import type { ProductImage } from "./products";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ImageValidationOptions {
  requireWebP: boolean;
  minWidth: number;
  minHeight: number;
  maxSizeMB: number;
  allowedFormats: string[];
}

const DEFAULT_VALIDATION_OPTIONS: ImageValidationOptions = {
  requireWebP: true,
  minWidth: 2000,
  minHeight: 2000,
  maxSizeMB: 5,
  allowedFormats: ['webp', 'jpg', 'jpeg', 'png'],
};

/**
 * Validates image URL format and dimensions
 */
export async function validateImageUrl(
  url: string,
  options: Partial<ImageValidationOptions> = {}
): Promise<ValidationResult> {
  const opts = { ...DEFAULT_VALIDATION_OPTIONS, ...options };
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check URL format
  try {
    new URL(url);
  } catch {
    errors.push('Invalid URL format');
  }

  // Check file extension
  const extension = url.split('.').pop()?.toLowerCase();
  if (!extension) {
    errors.push('No file extension found');
  } else if (opts.requireWebP && extension !== 'webp') {
    errors.push('Image must be in WebP format for 2026 conversion standards');
    } else if (!opts.allowedFormats.includes(extension)) {
    errors.push(`File format .${extension} is not allowed. Allowed formats: ${opts.allowedFormats.join(', ')}`);
  }

  // Check image dimensions
  try {
    const dimensions = await getImageDimensions(url);
    const { width, height } = dimensions;
    
    const longestSide = Math.max(width, height);
    if (longestSide < opts.minWidth) {
      errors.push(`Image must be at least ${opts.minWidth}px on the longest side. Current: ${longestSide}px`);
    }

    if (width < opts.minHeight || height < opts.minHeight) {
      warnings.push(`Image dimensions (${width}x${height}) are smaller than recommended (${opts.minHeight}px minimum)`);
    }

    // Check for square-ish aspect ratio for hero shots
    const aspectRatio = width / height;
    if (aspectRatio < 0.8 || aspectRatio > 1.2) {
      warnings.push('Hero shots should be close to square (1:1) aspect ratio for best results');
    }

  } catch (error) {
    errors.push('Failed to load image to check dimensions');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Gets image dimensions from URL
 */
export async function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

/**
 * Validates all images in a product color variant
 */
export async function validateProductImages(
  images: ProductImage[],
  options: Partial<ImageValidationOptions> = {}
): Promise<{ isValid: boolean; results: ValidationResult[] }> {
  const results = await Promise.all(
    images.map(image => validateImageUrl(image.url, options))
  );

  const isValid = results.every(result => result.isValid);
  
  return {
    isValid,
    results,
  };
}

/**
 * Checks if image meets 2026 e-commerce standards
 */
export function check2026Standards(image: ProductImage): {
  meetsStandards: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check image type
  const requiredTypes: Record<ProductImage['type'], string[]> = {
    hero: ['hero'],
    back: ['back'],
    side: ['side'],
    'neck-detail': ['neck-detail'],
    texture: ['texture'],
    'on-model': ['on-model'],
    'hood-detail': ['hood-detail'],
    'fleece-texture': ['fleece-texture'],
    'size-chart': ['size-chart'],
  };

  // Check for essential image types based on product category
  const essentialTypes = ['hero', 'texture', 'on-model'];
  if (!essentialTypes.includes(image.type)) {
    issues.push(`Image type "${image.type}" is not essential for 2026 standards`);
  }

  // Check alt text quality
  if (!image.alt || image.alt.length < 10) {
    issues.push('Alt text should be descriptive and at least 10 characters');
  }

  // Check for SEO-friendly alt text
  const seoKeywords = ['future fit', 'oversized', 'premium', 'streetwear', 'tech'];
  const hasSEOKeywords = seoKeywords.some(keyword => 
    image.alt.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (!hasSEOKeywords) {
    issues.push('Alt text should include relevant SEO keywords');
  }

  return {
    meetsStandards: issues.length === 0,
    issues,
  };
}

/**
 * Generates image optimization suggestions
 */
export function generateOptimizationSuggestions(image: ProductImage): string[] {
  const suggestions: string[] = [];

  // WebP conversion suggestion
  if (!image.url.endsWith('.webp')) {
    suggestions.push('Convert to WebP format for faster loading (40% smaller than JPEG)');
  }

  // Compression suggestion
  suggestions.push('Use quality setting of 85-90% for optimal balance of quality and file size');

  // Responsive image suggestion
  suggestions.push('Include responsive image srcset for different screen sizes');

  // Lazy loading suggestion
  suggestions.push('Implement lazy loading for below-the-fold images');

  // CDN suggestion
  suggestions.push('Use a CDN for faster image delivery globally');

  return suggestions;
}

/**
 * Validates image file before upload
 */
export function validateImageFile(file: File): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  const maxSizeMB = 5;
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum of ${maxSizeMB}MB`);
  }

  // Check file type
  const allowedTypes = ['image/webp', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Use WebP, JPEG, or PNG`);
  }

  // Check file name
  const fileName = file.name.toLowerCase();
  if (!fileName.includes('.webp') && !fileName.includes('.jpg') && !fileName.includes('.jpeg') && !fileName.includes('.png')) {
    errors.push('File must have a valid image extension (.webp, .jpg, .jpeg, .png)');
  }

  // Check for special characters in filename
  if (/[^a-zA-Z0-9.\-_]/.test(fileName)) {
    warnings.push('Filename contains special characters. Use only letters, numbers, dots, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
