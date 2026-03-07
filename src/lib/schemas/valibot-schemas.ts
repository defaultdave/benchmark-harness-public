import * as v from "valibot";

// Schema 1: Login form (simple)
export const loginSchemaValibot = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
  password: v.pipe(v.string(), v.minLength(8, "Password must be at least 8 characters")),
});
export type LoginInputValibot = v.InferOutput<typeof loginSchemaValibot>;

// Schema 2: Search params (moderate)
export const searchParamsSchemaValibot = v.object({
  location: v.optional(v.string()),
  date: v.optional(v.string()),
  minPrice: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0)), 0),
  maxPrice: v.optional(v.pipe(v.number(), v.integer(), v.maxValue(10000)), 1000),
  category: v.optional(
    v.picklist(["all", "bits", "bobs", "doodads", "thingamajigs", "widgets"]),
    "all"
  ),
  features: v.optional(v.array(v.string()), []),
  rating: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5))),
  sort: v.optional(
    v.picklist(["recommended", "price", "rating", "distance"]),
    "recommended"
  ),
  page: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1)), 1),
});
export type SearchParamsValibot = v.InferOutput<typeof searchParamsSchemaValibot>;

// Schema 3: Cart mutation (with auth context)
export const addToCartSchemaValibot = v.object({
  productId: v.pipe(v.string(), v.minLength(1, "Product ID is required")),
  quantity: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(20)),
  timeSlot: v.optional(v.string()),
  date: v.pipe(v.string(), v.regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format")),
});
export type AddToCartInputValibot = v.InferOutput<typeof addToCartSchemaValibot>;

// Schema 4: Order form (complex)
export const bookingSchemaValibot = v.object({
  guestDetails: v.object({
    firstName: v.pipe(v.string(), v.minLength(1, "First name is required")),
    lastName: v.pipe(v.string(), v.minLength(1, "Last name is required")),
    email: v.pipe(v.string(), v.email("Invalid email")),
    phone: v.pipe(v.string(), v.minLength(10, "Phone must be at least 10 digits")),
    country: v.pipe(v.string(), v.minLength(2, "Country is required")),
  }),
  paymentMethod: v.picklist(["card", "apple_pay", "google_pay"]),
  specialRequests: v.optional(v.pipe(v.string(), v.maxLength(500))),
  agreeToTerms: v.literal(true, "You must agree to the terms"),
  promoCode: v.optional(v.string()),
  giftCardCode: v.optional(v.string()),
});
export type BookingInputValibot = v.InferOutput<typeof bookingSchemaValibot>;
