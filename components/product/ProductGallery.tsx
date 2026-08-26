"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Box, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import ClientProduct from "@/components/3d/ClientProduct";
import type { ProductImage } from "@/lib/products";
import { getHeroImage, getProductImages } from "@/lib/productUtils";

interface ProductGalleryProps {
    productId: string;
    colorId: string;
    name: string;
    model?: string;
}

export default function ProductGallery({
    productId,
    colorId,
    name,
    model,
}: ProductGalleryProps) {
    const [show3D, setShow3D] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState<ProductImage[]>([]);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const productImages = getProductImages(productId, colorId);
        setImages(productImages);
        setCurrentImageIndex(0);
    }, [productId, colorId]);

    const currentImage = images[currentImageIndex];
    const heroImage = getHeroImage(productId, colorId);

    const handlePrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleThumbnailClick = (index: number) => {
        setCurrentImageIndex(index);
    };

    const getImageTypeLabel = (type: ProductImage['type']) => {
        const labels = {
            hero: 'Hero',
            back: 'Back',
            side: 'Side',
            'neck-detail': 'Neck Detail',
            texture: 'Texture',
            'on-model': 'On Model',
            'hood-detail': 'Hood Detail',
            'fleece-texture': 'Fleece',
            'size-chart': 'Size Chart'
        };
        return labels[type] || type;
    };

    if (!currentImage && !heroImage) {
        return (
            <div className="relative h-[50vh] lg:h-[65vh] w-full bg-secondary rounded-xl overflow-hidden flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-muted rounded-full animate-pulse mb-4 mx-auto"></div>
                    <p className="text-muted-foreground">Loading images...</p>
                </div>
            </div>
        );
    }

    const displayImage = currentImage || heroImage;

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative h-[50vh] lg:h-[65vh] w-full bg-secondary rounded-xl overflow-hidden group">
                {show3D && model ? (
                    <ClientProduct imageUrl={displayImage?.url || ''} modelPath={model} />
                ) : (
                    <div className={`relative w-full h-full ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                         onClick={() => setIsZoomed(!isZoomed)}>
                        <Image
                            src={displayImage?.url || ''}
                            alt={displayImage?.alt || name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 60vw, 50vw"
                            className={`object-cover transition-transform duration-300 ${
                                isZoomed ? 'scale-150' : 'scale-100'
                            }`}
                            priority
                            quality={85}
                        />
                    </div>
                )}

                {/* Navigation Arrows */}
                {images.length > 1 && !show3D && (
                    <>
                        <button
                            onClick={handlePrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Previous image"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg hover:bg-background transition-all opacity-0 group-hover:opacity-100"
                            aria-label="Next image"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Image Type Badge */}
                {!show3D && displayImage && (
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {getImageTypeLabel(displayImage.type)}
                    </div>
                )}

                {/* Zoom Indicator */}
                {!show3D && (
                    <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg">
                        <ZoomIn size={16} />
                    </div>
                )}

                {/* 3D Toggle */}
                <button
                    onClick={() => setShow3D(!show3D)}
                    className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm text-foreground px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-background transition-all shadow-lg z-10"
                >
                    <Box size={16} />
                    {show3D ? "Show Images" : "View in 3D"}
                </button>

                {/* Image Counter */}
                {images.length > 1 && !show3D && (
                    <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm text-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && !show3D && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`flex-shrink-0 relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                index === currentImageIndex
                                    ? 'border-foreground ring-2 ring-foreground/20'
                                    : 'border-border hover:border-foreground/50'
                            }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt}
                                fill
                                sizes="80px"
                                quality={75}
                                loading="lazy"
                                className="object-cover"
                            />
                            {index === currentImageIndex && (
                                <div className="absolute inset-0 bg-foreground/10 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-foreground rounded-full"></div>
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
