"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

const actionClient = createSafeActionClient();

const authClient = createSafeActionClient({
  handleServerError(e) {
    return e.message;
  },
});

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).max(20),
  timeSlot: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const addToCartAction = authClient
  .schema(addToCartSchema)
  .action(async ({ parsedInput }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
      cartId: "cart-456",
      itemId: "item-" + Math.random().toString(36).slice(2, 8),
      ...parsedInput,
      total: parsedInput.quantity * 49.99,
    };
  });

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const submitContactAction = actionClient
  .schema(contactSchema)
  .action(async ({ parsedInput }) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return { success: true, ticketId: "TKT-" + Date.now() };
  });
