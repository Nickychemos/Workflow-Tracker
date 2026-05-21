import type { ApplicationFilters } from "./api"

export const qk = {
  applications: {
    all: ["applications"] as const,
    list: (filters: ApplicationFilters) =>
      ["applications", "list", filters] as const,
    detail: (id: string) => ["applications", "detail", id] as const,
  },
}
