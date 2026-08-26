"use client";

import { useState } from "react";
import { Mail, Check } from "lucide-react";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          tag: "founding_member",
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setIsSuccess(true);
        setEmail("");
      } else {
        const data = await response.json();
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center space-y-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold">You're on the list.</h3>
        <p className="text-muted-foreground">We'll notify you first.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent placeholder-muted-foreground"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting || !email}
            className="px-6 py-3 bg-foreground text-background rounded-lg font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? "Joining..." : "Join Waitlist"}
          </button>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Get Founding Member Pricing
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            First 150 members get ₹999 pricing. No spam. Ever.
          </p>
        </div>
      </form>

      {error && (
        <div className="text-center text-sm text-red-500 mt-2">
          {error}
        </div>
      )}
    </div>
  );
}
