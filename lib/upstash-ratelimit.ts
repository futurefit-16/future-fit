import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";

// Use Vercel KV directly
const redis = kv;

// Create rate limiters for different endpoints
export const orderRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"), // 5 requests per 60 seconds
  analytics: true,
  prefix: "ratelimit:order",
});

export const paymentRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per 60 seconds
  analytics: true,
  prefix: "ratelimit:payment",
});

export const webhookRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"), // 20 requests per 60 seconds
  analytics: true,
  prefix: "ratelimit:webhook",
});

export const generalRateLimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(100, "60 s"), // 100 requests per 60 seconds
  analytics: true,
  prefix: "ratelimit:general",
});
