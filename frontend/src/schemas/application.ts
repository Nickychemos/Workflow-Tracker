import { z } from "zod"

export const APPLICATION_TYPES = [
  "RECORDATION",
  "RENEWAL",
  "CHANGE_OF_OWNERSHIP",
  "CHANGE_OF_NAME",
  "DISCONTINUATION",
] as const

export const applicationSchema = z.object({
  applicant_name: z.string().min(1, "Required").max(255),
  applicant_email: z.string().email("Enter a valid email"),
  company_name: z.string().min(1, "Required").max(255),
  application_type: z.enum(APPLICATION_TYPES, {
    required_error: "Pick a type",
    invalid_type_error: "Pick a type",
  }),
  description: z.string().max(2000).optional().default(""),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>
