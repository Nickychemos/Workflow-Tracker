import { Badge } from "@/components/ui/badge"
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/types"

type BadgeVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "destructive"
  | "outline"

const VARIANT_BY_STATUS: Record<ApplicationStatus, BadgeVariant> = {
  DRAFT: "default",
  SUBMITTED: "info",
  UNDER_REVIEW: "warning",
  NEED_MORE_INFO: "outline",
  APPROVED: "success",
  REJECTED: "destructive",
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <Badge variant={VARIANT_BY_STATUS[status]}>
      {APPLICATION_STATUS_LABELS[status]}
    </Badge>
  )
}
