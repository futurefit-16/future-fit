"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRODUCTS } from "@/lib/products";

interface FabricAccordionProps {
  productSlug: string;
}

export default function FabricAccordion({ productSlug }: FabricAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const product = PRODUCTS[productSlug];
  
  if (!product) return null;

  const getFabricExplanation = (category: string) => {
    switch (category) {
      case 'oversized-tee':
        return "240 GSM is nearly double the weight of what most Indian brands call 'premium'. Combined with bio-washing, the fabric is soft from day one and holds its shape after every wash.";
      case 'premium-hoodie':
        return "320 GSM French Terry is heavyweight luxury that most brands avoid due to cost. The double hood construction provides extra warmth and the pre-shrunk treatment guarantees zero post-wash surprises.";
      case 'round-neck-tee':
        return "180 GSM strikes the perfect balance between substance and breathability. Bio-washed for instant softness and pre-shrunk so your perfect fit stays perfect, wash after wash.";
      default:
        return "";
    }
  };

  const explanation = getFabricExplanation(product.category);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-background hover:bg-muted/50 transition-colors duration-200 flex items-center justify-between text-left"
      >
        <span className="font-medium text-sm">Why this fabric?</span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      
      {isOpen && (
        <div className="px-4 py-3 bg-muted/30 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
}
