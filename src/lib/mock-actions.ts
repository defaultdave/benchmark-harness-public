// Client-side mock actions for static export (GitHub Pages)
// These replicate the server action validation + simulated responses

import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).max(20),
  timeSlot: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function mockAddToCart(input: Record<string, unknown>) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  const parsed = addToCartSchema.safeParse(input);
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors };
  }
  return {
    data: {
      cartId: "cart-456",
      itemId: "item-" + Math.random().toString(36).slice(2, 8),
      ...parsed.data,
      total: parsed.data.quantity * 49.99,
    },
  };
}

export async function mockSubmitContact(input: Record<string, unknown>) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { validationErrors: parsed.error.flatten().fieldErrors };
  }
  return {
    data: { success: true, ticketId: "TKT-" + Date.now() },
  };
}

export const isStaticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
