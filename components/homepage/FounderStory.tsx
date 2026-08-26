import Image from "next/image";

export default function FounderStory() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Founder Photo Placeholder */}
        <div className="relative aspect-[4/5] bg-muted rounded-lg overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background text-2xl font-bold">FF</span>
              </div>
              <p className="text-muted-foreground text-sm">[FOUNDER PHOTO]</p>
            </div>
          </div>
        </div>

        {/* Right: Founder Story */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Why I Built This</h2>
          
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              I'm a frontend developer. I spend my days obsessing over details — pixel precision, zero defects, nothing ships until it's right.
            </p>
            <p>
              I brought that same mindset to streetwear. Indian brands were cutting corners on fabric weight, fit, and finish — so I went to the manufacturers directly, rejected bad samples, and engineered Future Fit to the spec I couldn't find anywhere else.
            </p>
            <p>
              This is Drop 01. 150 pieces. If it sells out, we build Drop 02 better.
            </p>
          </div>

          <div className="pt-4 border-l-2 border-foreground pl-4">
            <p className="text-sm text-muted-foreground">
              — [Your Name], Founder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
