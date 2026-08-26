import { z } from "zod";

// Checkout form validation schema
export const CheckoutSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .email("Invalid email address")
    .max(100, "Email too long"),
  
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  
  address: z.string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address too long")
    .regex(/^[a-zA-Z0-9\s,-.#/]+$/, "Address contains invalid characters"),
  
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City too long")
    .regex(/^[a-zA-Z\s]+$/, "City can only contain letters and spaces"),
  
  pincode: z.string()
    .regex(/^\d{6}$/, "Invalid Indian pincode"),
});

// Razorpay order creation schema
export const RazorpayOrderSchema = z.object({
  amount: z.number()
    .positive("Amount must be positive")
    .max(100000, "Amount too large")
    .multipleOf(0.01, "Amount must have at most 2 decimal places"),
  
  currency: z.string()
    .length(3, "Invalid currency code")
    .default("INR"),
  
  receipt: z.string()
    .max(50, "Receipt too long")
    .optional(),
});

// Razorpay webhook validation schema
export const RazorpayWebhookSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z.object({
      entity: z.object({
        id: z.string().startsWith("pay_"),
        order_id: z.string().startsWith("order_"),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
        method: z.string().optional(),
        notes: z.record(z.string()).optional(),
        created_at: z.number(),
      }).optional(),
    }).optional(),
    order: z.object({
      entity: z.object({
        id: z.string().startsWith("order_"),
        amount: z.number(),
        currency: z.string(),
        status: z.string(),
        created_at: z.number(),
      }).optional(),
    }).optional(),
  }),
});

// Cart item validation schema
export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number().positive(),
  image: z.string().url(),
  quantity: z.number().int().positive().max(10),
  size: z.enum(["S", "M", "L", "XL"]),
  slug: z.string(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
export type RazorpayOrderInput = z.infer<typeof RazorpayOrderSchema>;
export type CartItemInput = z.infer<typeof CartItemSchema>;
