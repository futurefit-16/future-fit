import { getPricingConfig, formatPrice, getDiscountPercentage, PRICING_LABELS } from "@/lib/pricingConfig";

interface PricingDisplayProps {
  productCategory: string;
  showFoundingMemberBadge?: boolean;
  showPriceIncreaseNote?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function PricingDisplay({ 
  productCategory, 
  showFoundingMemberBadge = true,
  showPriceIncreaseNote = true,
  size = 'md'
}: PricingDisplayProps) {
  const pricing = getPricingConfig(productCategory);
  const discount = getDiscountPercentage(pricing.mrp, pricing.salePrice);

  const sizeClasses = {
    sm: {
      mrp: 'text-sm',
      salePrice: 'text-base font-bold',
      badge: 'text-[10px]',
      note: 'text-xs'
    },
    md: {
      mrp: 'text-base',
      salePrice: 'text-lg font-bold',
      badge: 'text-[10px]',
      note: 'text-xs'
    },
    lg: {
      mrp: 'text-lg',
      salePrice: 'text-xl font-bold',
      badge: 'text-[10px]',
      note: 'text-sm'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        {/* MRP with strikethrough */}
        <span className={`${classes.mrp} text-[#888888] line-through`}>
          {formatPrice(pricing.mrp)}
        </span>
        
        {/* Sale Price */}
        <span className={`${classes.salePrice} text-white`}>
          {formatPrice(pricing.salePrice)}
        </span>
        
        {/* Founding Member Badge */}
        {showFoundingMemberBadge && (
          <span className="bg-[#166534] text-[#22c55e] px-2 py-1 rounded-full text-[10px] font-medium">
            {PRICING_LABELS.foundingMemberPrice}
          </span>
        )}
      </div>
      
      {/* Price Increase Note */}
      {showPriceIncreaseNote && (
        <p className={`${classes.note} text-[#888888]`}>
          {PRICING_LABELS.priceIncreaseNote}
        </p>
      )}
    </div>
  );
}
