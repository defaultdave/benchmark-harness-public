import { bench, describe } from "vitest";
import { z } from "zod";
import * as v from "valibot";
import {
  loginSchemaZod,
  searchParamsSchemaZod,
  addToCartSchemaZod,
  bookingSchemaZod,
} from "./zod-schemas";
import {
  loginSchemaValibot,
  searchParamsSchemaValibot,
  addToCartSchemaValibot,
  bookingSchemaValibot,
} from "./valibot-schemas";

// --- Test data ---
const validLogin = { email: "test@example.com", password: "password123" };
const invalidLogin = { email: "not-an-email", password: "short" };
const validSearch = {
  location: "Miami",
  date: "2026-03-15",
  minPrice: 50,
  maxPrice: 300,
  category: "bits" as const,
  features: ["wifi", "parking"],
  rating: 4,
  sort: "price" as const,
  page: 1,
};
const validCart = {
  productId: "prod-123",
  quantity: 2,
  timeSlot: "10:00 AM",
  date: "2026-03-15",
};
const validBooking = {
  guestDetails: {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "1234567890",
    country: "US",
  },
  paymentMethod: "card" as const,
  specialRequests: "Late checkout please",
  agreeToTerms: true as const,
  promoCode: "SAVE10",
};

// --- Validation benchmarks (reused schemas) ---

describe("Validation: Login (valid)", () => {
  bench("Zod", () => {
    loginSchemaZod.safeParse(validLogin);
  });
  bench("Valibot", () => {
    v.safeParse(loginSchemaValibot, validLogin);
  });
});

describe("Validation: Login (invalid)", () => {
  bench("Zod", () => {
    loginSchemaZod.safeParse(invalidLogin);
  });
  bench("Valibot", () => {
    v.safeParse(loginSchemaValibot, invalidLogin);
  });
});

describe("Validation: Search Params (9 fields)", () => {
  bench("Zod", () => {
    searchParamsSchemaZod.safeParse(validSearch);
  });
  bench("Valibot", () => {
    v.safeParse(searchParamsSchemaValibot, validSearch);
  });
});

describe("Validation: Cart Mutation (4 fields)", () => {
  bench("Zod", () => {
    addToCartSchemaZod.safeParse(validCart);
  });
  bench("Valibot", () => {
    v.safeParse(addToCartSchemaValibot, validCart);
  });
});

describe("Validation: Order Form (nested, 10+ fields)", () => {
  bench("Zod", () => {
    bookingSchemaZod.safeParse(validBooking);
  });
  bench("Valibot", () => {
    v.safeParse(bookingSchemaValibot, validBooking);
  });
});

// --- Schema creation benchmarks (one-shot) ---

describe("Schema Creation: Simple", () => {
  bench("Zod", () => {
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });
  });
  bench("Valibot", () => {
    v.object({
      email: v.pipe(v.string(), v.email()),
      password: v.pipe(v.string(), v.minLength(8)),
    });
  });
});

describe("Schema Creation: Complex (nested + arrays)", () => {
  bench("Zod", () => {
    z.object({
      customer: z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(10),
      }),
      items: z.array(
        z.object({
          id: z.string(),
          qty: z.number().int().min(1).max(20),
        })
      ),
      payment: z.enum(["card", "apple_pay"]),
      agree: z.literal(true),
    });
  });
  bench("Valibot", () => {
    v.object({
      customer: v.object({
        name: v.pipe(v.string(), v.minLength(1)),
        email: v.pipe(v.string(), v.email()),
        phone: v.pipe(v.string(), v.minLength(10)),
      }),
      items: v.array(
        v.object({
          id: v.string(),
          qty: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(20)),
        })
      ),
      payment: v.picklist(["card", "apple_pay"]),
      agree: v.literal(true),
    });
  });
});
