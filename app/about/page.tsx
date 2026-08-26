import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Instagram, Linkedin, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Future Fit",
  description: "Future Fit is a premium AI-powered streetwear brand based in Bengaluru, India, specializing in heavyweight artifacts and tech-driven fashion.",
  openGraph: {
    title: "About Future Fit | Premium AI Streetwear",
    description: "Future Fit is a premium AI-powered streetwear brand based in Bengaluru, India, specializing in heavyweight artifacts and tech-driven fashion.",
    url: "https://wearfuturefit.com/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
            About Future Fit
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Future Fit is a premium AI-powered streetwear brand based in Bengaluru, India, 
            specializing in heavyweight artifacts and tech-driven fashion.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <div className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Our Story</h2>
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <p className="mb-6">
                Born in the heart of Bengaluru's tech hub, Future Fit represents the fusion of 
                cutting-edge technology and street culture. We're not just another clothing brand – 
                we're a movement that bridges the gap between fashion innovation and everyday wear.
              </p>
              <p className="mb-6">
                Our journey began with a simple question: What if your clothes could adapt to you? 
                This led us to develop AI-powered customization tools that allow every customer to 
                create truly unique pieces that reflect their individual style.
              </p>
              <p>
                From heavyweight artifacts that make a statement to tech-driven fashion that 
                anticipates your needs, Future Fit is redefining what streetwear can be in the 
                digital age.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
              <p className="text-muted-foreground">
                Pushing boundaries with AI-powered customization and tech-driven design solutions.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background text-2xl font-bold">HQ</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Heavyweight artifacts and premium materials that stand the test of time.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-foreground rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-background text-2xl font-bold">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sustainable Future</h3>
              <p className="text-muted-foreground">
                Committed to ethical production and reducing our environmental footprint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sustainability - Commented Out */}
      {/* <div className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Sustainability Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-2xl font-bold">🌱</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Eco-Friendly Materials</h3>
              <p className="text-muted-foreground">
                Using sustainable fabrics and eco-conscious production methods.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl font-bold">💧</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Water Conservation</h3>
              <p className="text-muted-foreground">
                Reducing water usage by 40% through innovative dyeing processes.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Renewable Energy</h3>
              <p className="text-muted-foreground">
                100% of our facilities run on renewable energy sources.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Location */}
      <div className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Based in Bengaluru</h2>
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-6">
            <MapPin size={20} />
            <span className="text-lg">Bengaluru, India</span>
          </div>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
            Proudly operating from India's Silicon Valley, where technology and creativity converge 
            to shape the future of fashion.
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-wrap justify-center gap-6">
            <a 
              href="mailto:info@wearfuturefit.com" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail size={20} />
              info@wearfuturefit.com
            </a>
            <a 
              href="tel:+919876543210" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone size={20} />
              +91 98765 43210
            </a>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Future</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of technology and streetwear. 
            Customize your style with AI and stand out from the crowd.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/shop" 
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Shop Collection
            </Link>
            <Link 
              href="/studio" 
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground rounded-full font-medium hover:bg-foreground hover:text-background transition-colors"
            >
              Design Your Style
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
