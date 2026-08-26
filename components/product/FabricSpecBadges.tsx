import { PRODUCTS } from "@/lib/products";

interface FabricSpecBadgesProps {
  productSlug: string;
}

export default function FabricSpecBadges({ productSlug }: FabricSpecBadgesProps) {
  const product = PRODUCTS[productSlug];
  
  if (!product) return null;

  const getSpecBadges = (category: string) => {
    switch (category) {
      case 'oversized-tee':
        return ["240 GSM", "Bio-Washed", "Drop Shoulder", "Boxy Cut"];
      case 'premium-hoodie':
        return ["320 GSM", "French Terry", "Double Hood", "Pre-Shrunk"];
      case 'round-neck-tee':
        return ["180 GSM", "Bio-Washed", "Pre-Shrunk"];
      default:
        return [];
    }
  };

  const badges = getSpecBadges(product.category);

  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {badges.map((badge, index) => (
        <span
          key={index}
          className="inline-block bg-[#1a1a1a] border border-[#333] text-white text-[11px] rounded-full px-2.5 py-1 leading-none"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}
