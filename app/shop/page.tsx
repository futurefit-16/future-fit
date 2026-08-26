import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { formatPrice, getDiscountPercentage, isOnDiscount } from "@/lib/pricing";
import { PRODUCTS } from "@/lib/products";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";
import FabricSpecBadges from "@/components/product/FabricSpecBadges";
import PricingDisplay from "@/components/product/PricingDisplay";

export const metadata: Metadata = {
    title: "Shop | Future Fit Heavyweight Streetwear",
    description: "Shop 240 GSM oversized tees, 320 GSM French Terry hoodies and essentials. Bio-washed & pre-shrunk. Ships across India.",
    openGraph: {
        title: "Shop | Future Fit Heavyweight Streetwear",
        description: "Shop 240 GSM oversized tees, 320 GSM French Terry hoodies and essentials. Bio-washed & pre-shrunk. Ships across India.",
        type: "website",
        siteName: "Future Fit",
    },
    twitter: {
        card: "summary_large_image",
        title: "Shop | Future Fit Heavyweight Streetwear",
        description: "Shop 240 GSM oversized tees, 320 GSM French Terry hoodies and essentials. Bio-washed & pre-shrunk. Ships across India.",
        site: "@wearfuturefit",
    },
};

// Convert PRODUCTS to shop format
const SHOP_PRODUCTS = Object.values(PRODUCTS).map(product => ({
    id: product.id,
    name: product.name,
    price: product.price,
    mrp: product.mrp,
    image: product.heroImage,
    alt: `${product.name} - Heavyweight Streetwear India - 240 GSM`,
    slug: product.slug,
    category: product.category,
    categoryLabel: product.category === 'oversized-tee' ? 'Oversized Tees' : 
                  product.category === 'premium-hoodie' ? 'Hoodies' : 
                  'Round Neck Tees',
}));

export default function ShopPage() {
    return (
        <>
        <BreadcrumbSchema 
            items={[
                { name: "Home", url: "https://wearfuturefit.com/" },
                { name: "Shop", url: "https://wearfuturefit.com/shop" }
            ]}
        />
        <div>
            <div className="w-full px-1 sm:px-2 pt-6 pb-6 sm:pt-8 sm:pb-8">
                <div className="mb-10">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">The Collection</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">COLLECTION 01</h1>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3">
                    {SHOP_PRODUCTS.map((product, index) => (
                        <Link
                            href={`/product/${product.slug}`}
                            key={product.id}
                            className="group animate-fade-up"
                            style={{ animationDelay: `${index * 80}ms` }}
                        >
                            <div className="aspect-[4/5] relative bg-secondary rounded-lg overflow-hidden mb-2 shadow-soft group-hover:shadow-soft-lg transition-all duration-500 group-hover:-translate-y-1">
                                <Image
                                    src={product.image}
                                    alt={product.alt}
                                    fill
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                                    quality={85}
                                    priority={index < 4}
                                    loading={index < 4 ? undefined : "lazy"}
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-xs sm:text-sm leading-tight truncate">{product.name}</h3>
                                <FabricSpecBadges productSlug={product.slug} />
                                <div className="space-y-2">
                                    <p className="text-muted-foreground text-xs truncate">{product.categoryLabel}</p>
                                    <PricingDisplay 
                                        productCategory={product.category} 
                                        size="sm"
                                        showPriceIncreaseNote={false}
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
}
