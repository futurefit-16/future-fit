"use client";

import { lazy, Suspense, useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

// Lazy load heavy components
const AIStyleAdvisor = lazy(() => import("@/components/ai/AIStyleAdvisor").then(mod => ({ default: mod.default })));
const SocialGallery = lazy(() => import("@/components/social/SocialGallery").then(mod => ({ default: mod.default })));
const RewardsSystem = lazy(() => import("@/components/gamification/RewardsSystem").then(mod => ({ default: mod.default })));
const SustainabilityTracker = lazy(() => import("@/components/sustainability/SustainabilityTracker").then(mod => ({ default: mod.default })));

interface LazyFeatureLoaderProps {
  feature: "ai-advisor" | "social-gallery" | "rewards" | "sustainability";
  fallback?: React.ReactNode;
}

export default function LazyFeatureLoader({ feature, fallback }: LazyFeatureLoaderProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="animate-spin text-muted-foreground" size={24} />
    </div>
  );

  const renderFeature = () => {
    switch (feature) {
      case "ai-advisor":
        return <AIStyleAdvisor />;
      case "social-gallery":
        return <SocialGallery />;
      case "rewards":
        return <RewardsSystem />;
      case "sustainability":
        return <SustainabilityTracker />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {renderFeature()}
    </Suspense>
  );
}

