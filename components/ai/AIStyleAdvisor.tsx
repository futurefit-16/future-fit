"use client";

import { useState, useCallback, useMemo } from "react";
import { Sparkles, RefreshCw, X } from "lucide-react";

interface StyleRecommendation {
  id: string;
  name: string;
  price: number;
  image: string;
  reason: string;
  matchScore: number;
}

interface AIStyleAdvisorProps {
  currentProduct?: string;
  userPreferences?: string[];
  onProductSelect?: (productId: string) => void;
}

export default function AIStyleAdvisor({ 
  currentProduct, 
  userPreferences = [], 
  onProductSelect 
}: AIStyleAdvisorProps) {
  const [recommendations, setRecommendations] = useState<StyleRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Simulated AI recommendations (in production, this would call your AI API)
  const generateRecommendations = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock AI recommendations based on current product
    const mockRecommendations: StyleRecommendation[] = [
      {
        id: "oversized-box-tee",
        name: "Oversized Box Tee",
        price: 999,
        image: "https://images.unsplash.com/photo-1521572163464-5e8f35443e2b?w=400&h=400&fit=crop",
        reason: "Perfect for your streetwear aesthetic",
        matchScore: 95
      },
      {
        id: "premium-round-neck-tee",
        name: "Premium Round Neck Tee",
        price: 799,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
        reason: "Versatile base layer for any outfit",
        matchScore: 88
      },
      {
        id: "oversized-hoodie",
        name: "Oversized Hoodie",
        price: 1999,
        image: "https://images.unsplash.com/photo-1551698618-1d74eaae32f5?w=400&h=400&fit=crop",
        reason: "Complete your tech-noir look",
        matchScore: 92
      }
    ];

    setRecommendations(mockRecommendations);
    setIsLoading(false);
  }, [currentProduct]);

  // Memoized recommendations to prevent unnecessary re-renders
  const sortedRecommendations = useMemo(() => {
    return recommendations.sort((a, b) => b.matchScore - a.matchScore);
  }, [recommendations]);

  if (!isVisible) {
    return (
      <button
        onClick={() => {
          setIsVisible(true);
          generateRecommendations(); // Auto-generate when opened
        }}
        className="fixed bottom-20 right-4 bg-foreground text-background p-3 rounded-full shadow-lg hover:scale-105 transition-transform z-40"
        aria-label="Get AI Style Recommendations"
      >
        <Sparkles size={20} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 w-80 max-h-96 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          <h3 className="font-semibold text-sm">AI Style Advisor</h3>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-muted rounded transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-80">
        {isLoading && (
          <div className="text-center py-8">
            <RefreshCw size={24} className="mx-auto animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">
              AI is analyzing your style...
            </p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">
                Recommended for you
              </p>
              <button
                onClick={generateRecommendations}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                <RefreshCw size={12} />
                Refresh
              </button>
            </div>

            {sortedRecommendations.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => {
                  // Navigate to product page
                  window.location.href = `/product/${item.id}`;
                }}
              >
                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.reason}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold">₹{item.price}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${item.matchScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {item.matchScore}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
