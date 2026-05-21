import { z } from "zod"

export const DECISIONS = [
  "APPROVED",
  "REJECTED",
  "NEED_MORE_INFO",
] as const

export const decisionSchema = z
  .object({
    decision: z.enum(DECISIONS, {
      errorMap: () => ({ message: "Pick a decision" }),
    }),
    comment: z.string().default(""),
  })
  .refine(
    (data) =>
      data.decision === "APPROVED" || data.comment.trim().length > 0,
    {
      message: "A comment is required for Reject and Need more info",
      path: ["comment"],
    },
  )

export type DecisionFormValues = z.infer<typeof decisionSchema>
