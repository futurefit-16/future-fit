import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
    title: "Collections — Oversized Tees, Round Neck Tees & Hoodies",
    description:
        "Explore Future Fit collections. Premium oversized tees, classic round neck tees, and cozy hoodies.",
    openGraph: {
        title: "Collections — Future Fit",
        description: "Explore premium oversized tees, round neck tees, and hoodies.",
    },
};

export default function CollectionsPage() {
    const collections = [
        { id: 1, name: "Oversized Tees", tag: "Drop Shoulder. Box Fit. Statement.", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop", alt: "Future Fit Oversized Tees Collection - AI Designed Drop Shoulder Streetwear" },
        { id: 2, name: "Round Neck Tees", tag: "Classic Cut. Premium Cotton. Everyday.", image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop", alt: "Future Fit Round Neck Tees Collection - Premium Cotton AI Streetwear" },
        { id: 3, name: "Hoodies", tag: "Heavyweight. Cozy. Streetwear Essential.", image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=800&auto=format&fit=crop", alt: "Future Fit Hoodies Collection - Heavyweight AI Designed Streetwear Essentials" },
    ];

    return (
        <div>
            <div className="container mx-auto px-4 pt-12 pb-12">
                <div className="mb-10">
                    <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-2">Browse By</p>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter">COLLECTIONS</h1>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {collections.map((collection, index) => (
                        <Link
                            href="/shop"
                            key={collection.id}
                            className="group relative aspect-[3/4] overflow-hidden rounded-2xl animate-fade-up shadow-soft group-hover:shadow-soft-lg transition-shadow duration-500"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <Image
                                src={collection.image}
                                alt={collection.alt}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                priority
                                quality={85}
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-colors group-hover:from-black/80" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
                                    {collection.name}
                                </h2>
                                <p className="text-white/60 text-sm mt-1 group-hover:text-white/80 transition-colors">
                                    {collection.tag}
                                </p>
                                <div className="mt-3 inline-flex items-center gap-1 text-white/70 text-xs font-medium group-hover:text-white group-hover:gap-2 transition-all duration-300">
                                    Shop Now
                                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
