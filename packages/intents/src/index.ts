import { z } from "zod";

export const intentStatusSchema = z.enum([
  "draft",
  "planning",
  "active",
  "completed",
  "cancelled",
]);

export const intentSchema = z.object({
  type: z.string().trim().min(1).max(80),
  status: intentStatusSchema.default("draft"),
  summary: z.string().trim().min(1).max(500),
  constraints: z.record(z.string(), z.unknown()).default({}),
  missingInformation: z.array(z.string().trim().min(1).max(120)).default([]),
  confidence: z.number().min(0).max(1).nullable().default(null),
  sourceText: z.string().trim().max(20_000).nullable().default(null),
});

export type IntentInput = z.input<typeof intentSchema>;
export type Intent = z.output<typeof intentSchema>;

export function parseIntent(input: unknown): Intent {
  return intentSchema.parse(input);
}
