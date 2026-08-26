export type Size = "S" | "M" | "L" | "XL";

export type SizeChart = {
    chestCm: Record<Size, number>;
    lengthCm: Record<Size, number>;
};

export type ProductColor = {
    id: string;
    name: string;
    hex: string;
    images: ProductImage[];
};

export type ProductImage = {
    type: 'hero' | 'back' | 'side' | 'neck-detail' | 'texture' | 'on-model' | 'hood-detail' | 'fleece-texture' | 'size-chart';
    url: string;
    alt: string;
};

export type Product = {
    id: string;
    name: string;
    price: number; // sale price (what customer pays)
    mrp?: number; // maximum retail price (for display with strikethrough)
    description: string;
    slug: string;
    model?: string;
    sizeChart?: SizeChart;
    gsm: number;
    colors: ProductColor[];
    category: 'oversized-tee' | 'premium-hoodie' | 'round-neck-tee';
    heroImage: string; // Primary image for listings
};

import { getPricingConfig } from "./pricingConfig";

export const PRODUCTS: Record<string, Product> = {
    // --- Oversized Tees (240 GSM) ---
    "oversized-box-tee": {
        id: "oversized-box-tee",
        name: "Oversized Box Tee",
        price: 999,
        mrp: 1299,
        description: "Engineered with a square, architectural silhouette. This 240gsm heavy-cotton piece features a high-density weave for a structured look that never sags. AI-modeled for the ultimate 'street-statue' aesthetic.",
        slug: "oversized-box-tee",
        gsm: 240,
        category: "oversized-tee",
        heroImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
        sizeChart: {
            chestCm: { S: 112, M: 118, L: 124, XL: 130 },
            lengthCm: { S: 72, M: 74, L: 76, XL: 78 },
        },
        colors: [
            {
                id: "black",
                name: "Black",
                hex: "#000000",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1594634316868-9416b9e1b2b6?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - Side Profile" },
                    { type: "neck-detail", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - Neck Detail" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Black Oversized Box Tee - On Model" },
                ]
            },
            {
                id: "beige",
                name: "Beige",
                hex: "#F5F5DC",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1594634316868-9416b9e1b2b6?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - Side Profile" },
                    { type: "neck-detail", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - Neck Detail" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Beige Oversized Box Tee - On Model" },
                ]
            },
            {
                id: "sage",
                name: "Sage",
                hex: "#87A96B",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1594634316868-9416b9e1b2b6?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - Side Profile" },
                    { type: "neck-detail", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - Neck Detail" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Sage Oversized Box Tee - On Model" },
                ]
            }
        ]
    },

    // --- Premium Hoodie (320 GSM) ---
    "oversized-hoodie": {
        id: "oversized-hoodie",
        name: "Oversized Hoodie",
        price: 1999,
        mrp: 2499,
        description: "Your personal sanctuary. A heavyweight 320gsm French Terry hoodie with an extra-large 'cyber-hood' and dropped sleeves. Designed to provide a cocoon-like fit without sacrificing mobility.",
        slug: "oversized-hoodie",
        gsm: 320,
        category: "premium-hoodie",
        heroImage: "https://images.unsplash.com/photo-1551698618-1d74eaae32f5?q=80&w=800&auto=format&fit=crop",
        sizeChart: {
            chestCm: { S: 118, M: 124, L: 130, XL: 136 },
            lengthCm: { S: 70, M: 72, L: 74, XL: 76 },
        },
        colors: [
            {
                id: "pitch-black",
                name: "Pitch Black",
                hex: "#0A0A0A",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1551698618-1d74eaae32f5?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1551698618-1d74eaae32f5?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Side Profile" },
                    { type: "hood-detail", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Hood Detail" },
                    { type: "fleece-texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Internal Fleece Texture" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop", alt: "Pitch Black Oversized Hoodie - On Model" },
                ]
            }
        ]
    },

    // --- Round Neck Tees (180 GSM) ---
    "classic-round-neck-tee": {
        id: "classic-round-neck-tee",
        name: "Classic Round Neck Tee",
        price: 799,
        mrp: 899,
        description: "The base layer of the digital nomad. A streamlined 180gsm ring-spun cotton build that transitions perfectly from the studio to the street. Features a signature ribbed collar and an essential crew neck fit.",
        slug: "classic-round-neck-tee",
        gsm: 180,
        category: "round-neck-tee",
        heroImage: "https://images.unsplash.com/photo-1503341455253-b2e723099de5?q=80&w=800&auto=format&fit=crop",
        sizeChart: {
            chestCm: { S: 96, M: 102, L: 108, XL: 114 },
            lengthCm: { S: 68, M: 70, L: 72, XL: 74 },
        },
        colors: [
            {
                id: "navy-blue",
                name: "Navy Blue",
                hex: "#000080",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1503341455253-b2e723099de5?q=80&w=2000&auto=format&fit=crop", alt: "Navy Blue Classic Round Neck Tee - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Navy Blue Classic Round Neck Tee - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", alt: "Navy Blue Classic Round Neck Tee - Side Profile" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "Navy Blue Classic Round Neck Tee - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "Navy Blue Classic Round Neck Tee - On Model" },
                ]
            },
            {
                id: "white",
                name: "White",
                hex: "#FFFFFF",
                images: [
                    { type: "hero", url: "https://images.unsplash.com/photo-1503341455253-b2e723099de5?q=80&w=2000&auto=format&fit=crop", alt: "White Classic Round Neck Tee - Hero Shot" },
                    { type: "back", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "White Classic Round Neck Tee - Back View" },
                    { type: "side", url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop", alt: "White Classic Round Neck Tee - Side Profile" },
                    { type: "texture", url: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=2000&auto=format&fit=crop", alt: "White Classic Round Neck Tee - Fabric Texture" },
                    { type: "on-model", url: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=2000&auto=format&fit=crop", alt: "White Classic Round Neck Tee - On Model" },
                ]
            }
        ]
    },
};
