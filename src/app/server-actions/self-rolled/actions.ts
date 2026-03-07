"use server";

import { createAction, createAuthAction } from "@/lib/self-rolled/safe-action";
import { z } from "zod";

const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().min(1).max(20),
  timeSlot: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export const addToCartAction = createAuthAction(addToCartSchema, async (input, ctx) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    cartId: "cart-456",
    itemId: "item-" + Math.random().toString(36).slice(2, 8),
    userId: ctx.userId,
    ...input,
    total: input.quantity * 49.99,
  };
});

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const submitContactAction = createAction(contactSchema, async (input) => {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return { success: true, ticketId: "TKT-" + Date.now() };
});
