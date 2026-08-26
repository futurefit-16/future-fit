import type { Metadata } from "next";
import { formatCurrency } from "@/lib/utils";
import { formatPrice, getDiscountPercentage, isOnDiscount } from "@/lib/pricing";
import { PRODUCTS } from "@/lib/products";
import ProductPageClient from "@/components/product/ProductPageClient";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const product = PRODUCTS[slug];
    if (!product) return { title: "Product Not Found" };

    return {
        title: `${product.name} — ${formatPrice(product.price)}`,
        description: product.description,
        openGraph: {
            title: `${product.name} — Future Fit`,
            description: product.description,
            images: [{ url: product.heroImage, width: 800, height: 800, alt: product.name }],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description,
            images: [product.heroImage],
        },
    };
}

export default async function ProductPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const product = PRODUCTS[slug];

    if (!product) return <div className="p-20 text-center">Product not found</div>;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: product.heroImage,
        description: product.description,
        offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: "Future Fit" },
        },
    };

    return (
        <>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ProductPageClient product={product} />
        </>
    );
}
