import JSONLD from "@/components/JSONLD";
import CountdownTimerWrapper from "@/components/homepage/CountdownTimerWrapper";
import WaitlistForm from "@/components/homepage/WaitlistForm";
import FeatureCards from "@/components/homepage/FeatureCards";
import FounderStory from "@/components/homepage/FounderStory";
import FabricSpecs from "@/components/homepage/FabricSpecs";
import FabricManifesto from "@/components/homepage/FabricManifesto";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Future Fit | Heavyweight Streetwear India",
  description: "Experience India's premier heavyweight streetwear. Shop 240 GSM oversized tees and 320 GSM hoodies with our built-in AI Fit Finder for the perfect boxy fit.",
  keywords: "heavyweight streetwear India, 240 GSM oversized tee, boxy fit t-shirts, premium streetwear Bangalore, AI size finder",
  openGraph: {
    title: "Future Fit | Heavyweight Streetwear India",
    description: "Experience India's premier heavyweight streetwear. Shop 240 GSM oversized tees and 320 GSM hoodies with our built-in AI Fit Finder for the perfect boxy fit.",
    type: "website",
    siteName: "Future Fit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Future Fit | Heavyweight Streetwear India",
    description: "Experience India's premier heavyweight streetwear. Shop 240 GSM oversized tees and 320 GSM hoodies with our built-in AI Fit Finder for the perfect boxy fit.",
    site: "@wearfuturefit",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden px-4">
        <JSONLD />

        {/* Ambient glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] animate-glow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/[0.03] rounded-full blur-[100px] animate-glow pointer-events-none" style={{ animationDelay: "2s" }} />

        <div className="flex flex-col items-center gap-8 text-center relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter animate-in fade-in duration-1000">
            Premium Heavyweight Streetwear India | Future Fit
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 leading-relaxed">
            240 GSM. Bio-Washed. Drop Shoulder. Built by a frontend developer who got tired of streetwear brands shipping bad product — thin fabric, wrong cuts, shrinks in one wash.
          </p>

          {/* Countdown Timer */}
          <div className="w-full animate-in fade-in duration-1000 delay-300">
            <CountdownTimerWrapper />
          </div>

          {/* Email Capture Form */}
          <div className="w-full animate-in fade-in duration-1000 delay-500">
            <WaitlistForm />
          </div>
        </div>
      </div>

      {/* Fabric Manifesto Section */}
      <FabricManifesto />

      {/* Section A - Why Future Fit is Different */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Future Fit is Different</h2>
          <FeatureCards />
        </div>
      </section>

      {/* Section B - The Founder's Journey */}
      <section className="py-20 px-4 bg-[#111111]">
        <div className="max-w-6xl mx-auto">
          <FounderStory />
        </div>
      </section>

      {/* Section C - Fabric Specs Bar */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-center mb-8">Technical Specifications</h3>
          <FabricSpecs />
        </div>
      </section>
    </div>
  );
}
