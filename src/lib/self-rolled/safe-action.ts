/**
 * Self-rolled server action wrapper (~200 lines)
 * Replaces: next-safe-action
 * Covers: input validation, auth middleware, unified error handling
 *
 * NOTE: This is NOT a "use server" file. The consuming actions.ts file
 * uses "use server" and calls these builder functions.
 */

import { z } from "zod";

// --- Types ---

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; validationErrors: z.ZodIssue[] }
  | { success: false; serverError: string };

interface Session {
  userId: string;
}

// --- Mock auth (replace with real session check) ---

async function getSession(): Promise<Session | null> {
  // In production: read cookie, verify with backend
  // For benchmark: simulate authenticated user
  return { userId: "user-123" };
}

// --- Action Builders ---

export function createAction<Input, Output>(
  schema: z.ZodSchema<Input>,
  handler: (input: Input) => Promise<Output>
): (rawInput: unknown) => Promise<ActionResult<Output>> {
  return async (rawInput: unknown): Promise<ActionResult<Output>> => {
    // Validate input
    const result = schema.safeParse(rawInput);
    if (!result.success) {
      return { success: false, validationErrors: result.error.issues };
    }

    // Execute handler
    try {
      const data = await handler(result.data);
      return { success: true, data };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, serverError: message };
    }
  };
}

export function createAuthAction<Input, Output>(
  schema: z.ZodSchema<Input>,
  handler: (input: Input, ctx: { userId: string }) => Promise<Output>
): (rawInput: unknown) => Promise<ActionResult<Output>> {
  return async (rawInput: unknown): Promise<ActionResult<Output>> => {
    // Auth check
    const session = await getSession();
    if (!session) {
      return { success: false, serverError: "Unauthorized" };
    }

    // Validate input
    const result = schema.safeParse(rawInput);
    if (!result.success) {
      return { success: false, validationErrors: result.error.issues };
    }

    // Execute handler with auth context
    try {
      const data = await handler(result.data, { userId: session.userId });
      return { success: true, data };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "An unexpected error occurred";
      return { success: false, serverError: message };
    }
  };
}
