"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Sparkles, RotateCcw, ChevronRight, Ruler, Weight } from "lucide-react";
import BreadcrumbSchema from "@/components/seo/BreadcrumbSchema";

type Step = 1 | 2 | 3 | 4;

interface FitResult {
  recommendedSize: string;
  confidence: string;
  explanation: string;
  isFallback?: boolean;
}

export default function FitFinderPage() {
  const [step, setStep] = useState<Step>(1);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [fitPreference, setFitPreference] = useState<"true-oversized" | "relaxed" | "standard">("relaxed");
  const [chest, setChest] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [result, setResult] = useState<FitResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const canProceedFromStep1 = () => height && weight && fitPreference;

  const callFitAPI = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/fit-finder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height: Number(height),
          weight: Number(weight),
          chest: chest ? Number(chest) : undefined,
          shoulder: shoulder ? Number(shoulder) : undefined,
          fitPreference,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get recommendation");
      }

      setResult({
        recommendedSize: data.recommendedSize,
        confidence: "high",
        explanation: data.explanation
      });
      
      setStep(4);
    } catch (err) {
      console.error('Frontend API error:', err);
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      await callFitAPI();
    }
  };

  const handleSkip = async () => {
    setStep(3);
    await callFitAPI();
  };

  const handleBack = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  const handleReset = () => {
    setStep(1);
    setHeight("");
    setWeight("");
    setFitPreference("relaxed");
    setChest("");
    setShoulder("");
    setResult(null);
    setError("");
  };

  const getProgressInfo = () => {
    if (step === 1) return { current: 1, total: 2, percentage: 50 };
    if (step === 2) return { current: 2, total: 2, percentage: 100 };
    if (step === 3 || step === 4) return { current: 0, total: 0, percentage: 0 }; // No progress bar for loading/result
    return { current: 1, total: 2, percentage: 50 };
  };

  const progressInfo = getProgressInfo();

  return (
    <>
      <BreadcrumbSchema 
        items={[
          { name: "Home", url: "https://wearfuturefit.com/" },
          { name: "AI Fit Finder", url: "https://wearfuturefit.com/fit-finder" }
        ]}
      />
      
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-gray-300">
                <Sparkles size={14} /> AI-Powered
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Find Your Perfect Fit</h1>
              <p className="text-gray-400 text-lg">Answer 3 questions. Our AI recommends your size.</p>
            </div>

            {/* Progress bar */}
            {progressInfo.total > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Step {progressInfo.current} of {progressInfo.total}</span>
                  <span>{progressInfo.percentage}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressInfo.percentage}%` }} 
                  />
                </div>
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/10">
                <h2 className="text-xl font-bold">Tell us about yourself</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Ruler size={16} /> Height (cm)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 175" 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      min={100} 
                      max={250}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Weight size={16} /> Weight (kg)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 70" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      min={25} 
                      max={250}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-300">Fit preference</label>
                  <div className="space-y-2">
                    {[
                      { value: "true-oversized", label: "True Oversized — very boxy and relaxed" },
                      { value: "relaxed", label: "Relaxed — slightly roomy, not too baggy" },
                      { value: "standard", label: "Standard — neat oversized, not swimming in it" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                        <input
                          type="radio"
                          name="fitPreference"
                          value={option.value}
                          checked={fitPreference === option.value}
                          onChange={(e) => setFitPreference(e.target.value as any)}
                          className="w-4 h-4 text-white"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Optional Measurements */}
            {step === 2 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/10">
                <h2 className="text-xl font-bold">Your measurements (optional but more accurate)</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Ruler size={16} /> Chest circumference (cm)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 95" 
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      min={50} 
                      max={180}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Ruler size={16} /> Shoulder width (cm)
                    </label>
                    <input 
                      type="number" 
                      placeholder="e.g. 45" 
                      value={shoulder}
                      onChange={(e) => setShoulder(e.target.value)}
                      min={30} 
                      max={80}
                      className="w-full p-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-white/20 text-white placeholder-gray-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSkip}
                  disabled={isLoading}
                  className="w-full py-3 bg-white/10 border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Skip — just use height & weight
                </button>
              </div>
            )}

            {/* Step 3: Loading */}
            {step === 3 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-12 text-center space-y-4 border border-white/10">
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                <p className="text-lg">Our AI is finding your perfect fit...</p>
              </div>
            )}

            {/* Step 4: Result */}
            {step === 4 && result && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-6 border border-white/10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-white/20 to-white/10 rounded-full border-2 border-white/30">
                    <span className="text-5xl font-black text-white">{result.recommendedSize}</span>
                  </div>
                  <h2 className="text-2xl font-bold">We recommend: SIZE {result.recommendedSize}</h2>
                  <div className="inline-flex items-center px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                    <span className="text-green-400 text-xs font-medium">Based on your measurements</span>
                  </div>
                  {!result.isFallback && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                      <Sparkles size={12} />
                      <span className="text-xs font-medium text-gray-300">AI-Powered</span>
                    </div>
                  )}
                  <p className="text-gray-300 text-sm leading-relaxed">{result.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors"
                  >
                    <RotateCcw size={16} /> Try Again
                  </button>
                  <Link 
                    href="/shop"
                    className="flex items-center justify-center gap-2 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Shop Now <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            )}

            {/* Error display */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Navigation buttons */}
            {step < 3 && (
              <div className="flex gap-3">
                {step > 1 && (
                  <button 
                    onClick={handleBack}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 flex-1 py-3 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                )}
                <button 
                  onClick={handleNext} 
                  disabled={!canProceedFromStep1() || isLoading}
                  className={`flex items-center justify-center gap-2 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${step > 1 ? "flex-1" : "w-full"}`}
                >
                  {step === 2 ? (
                    <><Sparkles size={16} /> Get My Size</>
                  ) : (
                    <>Next <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
