"use client";

import { useState, useEffect } from "react";
import { Leaf, Recycle, TreePine, Droplets, Zap } from "lucide-react";

interface SustainabilityMetric {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  trend?: "up" | "down" | "neutral";
}

interface ProductImpact {
  productId: string;
  carbonFootprint: number;
  waterSaved: number;
  recyclable: boolean;
  sustainableMaterials: string[];
}

export default function SustainabilityTracker() {
  const [metrics, setMetrics] = useState<SustainabilityMetric[]>([
    {
      id: "carbon_offset",
      title: "Carbon Offset",
      value: "2.4 tons",
      description: "CO2 emissions offset through sustainable practices",
      icon: <Zap size={16} />,
      color: "text-green-600",
      trend: "up"
    },
    {
      id: "water_saved",
      title: "Water Saved",
      value: "15,000L",
      description: "Water conservation through eco-friendly production",
      icon: <Droplets size={16} />,
      color: "text-blue-600",
      trend: "up"
    },
    {
      id: "recycled_materials",
      title: "Recycled Materials",
      value: "68%",
      description: "Percentage of recycled materials in our products",
      icon: <Recycle size={16} />,
      color: "text-purple-600",
      trend: "up"
    },
    {
      id: "trees_planted",
      title: "Trees Planted",
      value: "124",
      description: "Trees planted through our reforestation program",
      icon: <TreePine size={16} />,
      color: "text-green-700",
      trend: "up"
    }
  ]);

  const [userImpact, setUserImpact] = useState({
    totalPurchases: 0,
    carbonSaved: 0,
    waterSaved: 0,
    recyclableItems: 0
  });

  // Mock product impact data
  const productImpacts: Record<string, ProductImpact> = {
    "oversized-box-tee": {
      productId: "oversized-box-tee",
      carbonFootprint: 2.1,
      waterSaved: 1200,
      recyclable: true,
      sustainableMaterials: ["Organic Cotton", "Recycled Polyester"]
    },
    "oversized-hoodie": {
      productId: "oversized-hoodie",
      carbonFootprint: 3.8,
      waterSaved: 2100,
      recyclable: true,
      sustainableMaterials: ["Recycled Cotton", "Bamboo Fiber"]
    },
    "premium-round-neck-tee": {
      productId: "premium-round-neck-tee",
      carbonFootprint: 1.8,
      waterSaved: 950,
      recyclable: true,
      sustainableMaterials: ["Pima Cotton", "TENCEL™"]
    }
  };

  useEffect(() => {
    // Calculate user impact based on their purchases
    // In production, this would fetch from your database
    const mockUserPurchases = ["oversized-box-tee", "premium-round-neck-tee"];
    
    let totalCarbon = 0;
    let totalWater = 0;
    let recyclableCount = 0;

    mockUserPurchases.forEach(productId => {
      const impact = productImpacts[productId];
      if (impact) {
        totalCarbon += impact.carbonFootprint;
        totalWater += impact.waterSaved;
        if (impact.recyclable) recyclableCount++;
      }
    });

    setUserImpact({
      totalPurchases: mockUserPurchases.length,
      carbonSaved: totalCarbon,
      waterSaved: totalWater,
      recyclableItems: recyclableCount
    });
  }, []);

  return (
    <div className="py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="text-green-600" size={24} />
            <h2 className="text-3xl font-bold">Sustainability Impact</h2>
          </div>
          <p className="text-muted-foreground">
            Track your environmental contribution with Future Fit
          </p>
        </div>

        {/* Global Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-background/80 backdrop-blur-sm rounded-lg p-6 text-center">
              <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 ${metric.color}`}>
                {metric.icon}
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm font-medium mb-2">{metric.title}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
              {metric.trend && (
                <div className={`inline-flex items-center gap-1 text-xs mt-2 ${
                  metric.trend === "up" ? "text-green-600" : 
                  metric.trend === "down" ? "text-red-600" : "text-gray-600"
                }`}>
                  {metric.trend === "up" && "↑"}
                  {metric.trend === "down" && "↓"}
                  {metric.trend === "neutral" && "→"}
                  <span>Positive impact</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* User Impact */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Your Environmental Impact</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">{userImpact.totalPurchases}</p>
                <p className="text-xs text-muted-foreground">Sustainable Purchases</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{userImpact.carbonSaved}kg</p>
                <p className="text-xs text-muted-foreground">Carbon Saved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{userImpact.waterSaved}L</p>
                <p className="text-xs text-muted-foreground">Water Conserved</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{userImpact.recyclableItems}</p>
                <p className="text-xs text-muted-foreground">Recyclable Items</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={16} className="text-green-600" />
                <p className="text-sm font-medium text-green-800">Your Contribution</p>
              </div>
              <p className="text-xs text-green-700">
                By choosing Future Fit, you've saved {userImpact.waterSaved}L of water and offset {userImpact.carbonSaved}kg of CO2.
              </p>
            </div>
          </div>
        </div>

        {/* Product Sustainability Info */}
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Our Sustainable Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Recycle className="text-green-600" size={20} />
              </div>
              <h4 className="font-medium mb-2">Recycled Materials</h4>
              <p className="text-xs text-muted-foreground">
                68% of our products use recycled materials without compromising quality
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Droplets className="text-blue-600" size={20} />
              </div>
              <h4 className="font-medium mb-2">Water Conservation</h4>
              <p className="text-xs text-muted-foreground">
                Our production process uses 40% less water than conventional methods
              </p>
            </div>
            
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-6">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Zap className="text-purple-600" size={20} />
              </div>
              <h4 className="font-medium mb-2">Renewable Energy</h4>
              <p className="text-xs text-muted-foreground">
                100% of our facilities run on renewable energy sources
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
