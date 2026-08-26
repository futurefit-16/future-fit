"use client";

import { useState, useEffect } from "react";
import { Trophy, Star, Zap, Gift, Lock, ShoppingBag } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  points: number;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
}

interface UserStats {
  points: number;
  level: number;
  nextLevelPoints: number;
  achievementsUnlocked: number;
  totalAchievements: number;
}

export default function RewardsSystem() {
  const [userStats, setUserStats] = useState<UserStats>({
    points: 0,
    level: 1,
    nextLevelPoints: 100,
    achievementsUnlocked: 0,
    totalAchievements: 8
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "first_purchase",
      title: "First Step",
      description: "Complete your first purchase",
      icon: <ShoppingBag size={16} />,
      points: 50,
      unlocked: false
    },
    {
      id: "style_explorer",
      title: "Style Explorer",
      description: "Try on 5 different products",
      icon: <Star size={16} />,
      points: 30,
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: "social_butterfly",
      title: "Social Butterfly",
      description: "Share your style 3 times",
      icon: <Gift size={16} />,
      points: 40,
      unlocked: false,
      progress: 1,
      maxProgress: 3
    },
    {
      id: "loyalty_master",
      title: "Loyalty Master",
      description: "Make 10 purchases",
      icon: <Trophy size={16} />,
      points: 100,
      unlocked: false,
      progress: 3,
      maxProgress: 10
    },
    {
      id: "trendsetter",
      title: "Trendsetter",
      description: "Buy a new collection item",
      icon: <Zap size={16} />,
      points: 60,
      unlocked: false
    },
    {
      id: "early_bird",
      title: "Early Bird",
      description: "Shop within 1 hour of new drop",
      icon: <Star size={16} />,
      points: 75,
      unlocked: false
    },
    {
      id: "collector",
      title: "Collector",
      description: "Own 5 different products",
      icon: <Trophy size={16} />,
      points: 80,
      unlocked: false,
      progress: 2,
      maxProgress: 5
    },
    {
      id: "influencer",
      title: "Influencer",
      description: "Refer 5 friends who purchase",
      icon: <Gift size={16} />,
      points: 150,
      unlocked: false,
      progress: 1,
      maxProgress: 5
    }
  ]);

  // Calculate level based on points
  useEffect(() => {
    const calculateLevel = (points: number) => {
      return Math.floor(points / 100) + 1;
    };

    const level = calculateLevel(userStats.points);
    const nextLevelPoints = level * 100;
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    setUserStats(prev => ({
      ...prev,
      level,
      nextLevelPoints,
      achievementsUnlocked: unlockedCount
    }));
  }, [userStats.points, achievements]);

  const progressToNextLevel = (userStats.points % 100);

  return (
    <div className="py-4 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Coming Soon */}
        <div className="text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy size={24} className="text-primary" />
            </div>
            <h2 className="text-lg font-bold mb-2">AI Rewards System</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Neural-powered loyalty program with machine learning insights and personalized reward algorithms
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium text-primary">Coming Soon</span>
            </div>
          </div>
        </div>

              </div>
    </div>
  );
}
