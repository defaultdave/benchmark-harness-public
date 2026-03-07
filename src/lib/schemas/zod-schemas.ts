import { z } from "zod";

// Schema 1: Login form (simple)
export const loginSchemaZod = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type LoginInputZod = z.infer<typeof loginSchemaZod>;

// Schema 2: Search params (moderate)
export const searchParamsSchemaZod = z.object({
  location: z.string().optional(),
  date: z.string().optional(),
  minPrice: z.number().int().min(0).default(0),
  maxPrice: z.number().int().max(10000).default(1000),
  category: z.enum(["all", "bits", "bobs", "doodads", "thingamajigs", "widgets"]).default("all"),
  features: z.array(z.string()).default([]),
  rating: z.number().int().min(1).max(5).optional(),
  sort: z.enum(["recommended", "price", "rating", "distance"]).default("recommended"),
  page: z.number().int().min(1).default(1),
});
export type SearchParamsZod = z.infer<typeof searchParamsSchemaZod>;

// Schema 3: Cart mutation (with auth context)
export const addToCartSchemaZod = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).max(20),
  timeSlot: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});
export type AddToCartInputZod = z.infer<typeof addToCartSchemaZod>;

// Schema 4: Order form (complex)
export const bookingSchemaZod = z.object({
  guestDetails: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    country: z.string().min(2, "Country is required"),
  }),
  paymentMethod: z.enum(["card", "apple_pay", "google_pay"]),
  specialRequests: z.string().max(500).optional(),
  agreeToTerms: z.literal(true, "You must agree to the terms"),
  promoCode: z.string().optional(),
  giftCardCode: z.string().optional(),
});
export type BookingInputZod = z.infer<typeof bookingSchemaZod>;
