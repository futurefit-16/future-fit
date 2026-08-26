import Link from "next/link";
import { ArrowRight, CheckCircle, Zap, Users, Package, TrendingUp } from "lucide-react";

export default function AffiliatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-foreground/[0.02] rounded-full blur-[150px] animate-glow pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-foreground/[0.03] rounded-full blur-[120px] animate-glow pointer-events-none" style={{ animationDelay: "2s" }} />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs md:text-sm font-mono uppercase tracking-[0.3em] text-muted-foreground mb-6 animate-in fade-in duration-1000">
              PARTNER PROTOCOL
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              JOIN THE<span className="text-shimmer">_PROTOCOL</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
              Become a Future Fit partner and earn 15% commission on every sale.
            </p>
            <div className="animate-in fade-in zoom-in duration-1000 delay-500">
              <Link
                href="https://future-fit.goaffpro.com/create-account"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background rounded-full font-bold text-lg hover:scale-105 hover:shadow-soft-lg transition-all duration-300 shadow-soft"
              >
                APPLY NOW
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">PROCESS</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">How It Works</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Sign Up",
                  description: "Apply to the Future Fit Affiliate Protocol. Get approved in 24 hours.",
                  icon: Users,
                },
                {
                  step: "02", 
                  title: "Share Your Link",
                  description: "Get your unique affiliate link and custom discount codes. Share with your audience.",
                  icon: Zap,
                },
                {
                  step: "03",
                  title: "Earn 15% Commission",
                  description: "Receive 15% on every successful sale. Track everything in real-time.",
                  icon: TrendingUp,
                },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative group animate-fade-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-border transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-2xl font-mono font-bold text-muted-foreground">{item.step}</span>
                      <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                        <item.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">PERKS</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Benefits</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Early access to new drops before anyone else",
                "Custom discount codes for your audience (10% off)",
                "Real-time tracking via PartnerStack dashboard",
                "Monthly commission payouts via your preferred method",
                "High-converting AI-generated product assets",
                "Dedicated affiliate support team",
                "Performance bonuses for top partners",
                "Co-marketing opportunities on our channels",
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-base leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Creator Assets */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-4">ASSETS</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Creator Assets</h2>
            </div>
            
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-20 h-20 rounded-2xl bg-foreground/10 flex items-center justify-center flex-shrink-0">
                  <Package className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">Everything You Need to Create</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    We provide high-res AI-generated lookbooks, 3D renders, tech-noir product shots, 
                    and lifestyle imagery. All assets are optimized for social media, stories, and web content. 
                    Available in your PartnerStack Resources tab upon approval.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    {["4K Renders", "Lookbooks", "Social Templates", "3D Models", "Video Assets"].map((tag) => (
                      <span
                        key={tag}
                        className="px-4 py-2 bg-foreground/5 border border-border/50 rounded-full text-sm font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Ready to Shape the Future?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Join the protocol. Earn 15% commission. Help us redefine streetwear through AI.
            </p>
            <Link
              href="https://future-fit.goaffpro.com/create-account"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-12 py-5 bg-foreground text-background rounded-full font-bold text-lg hover:scale-105 hover:shadow-soft-lg transition-all duration-300 shadow-soft"
            >
              APPLY NOW
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
