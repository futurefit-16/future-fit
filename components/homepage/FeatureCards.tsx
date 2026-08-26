import { Scale, Shield, Scissors } from "lucide-react";

export default function FeatureCards() {
  const features = [
    {
      icon: Scale,
      title: "240 GSM Heavyweight",
      description: "Most Indian brands use 160 GSM and call it premium. We don't.",
    },
    {
      icon: Shield,
      title: "Bio-Washed & Pre-Shrunk",
      description: "Guaranteed zero post-wash shrinkage. What you buy is what you keep.",
    },
    {
      icon: Scissors,
      title: "Drop Shoulder Boxy Cut",
      description: "Engineered silhouette. Not an afterthought.",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {features.map((feature, index) => (
        <div
          key={index}
          className="p-6 bg-card border border-border rounded-lg shadow-soft hover:shadow-soft-lg transition-all duration-300"
        >
          <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center mb-4">
            <feature.icon className="w-6 h-6 text-background" />
          </div>
          <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
