import { Link } from "react-router-dom"
import { AlertCircle, Check, Pencil, Send, ShieldCheck, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { Application } from "@/lib/types"

interface ActionBarProps {
  application: Application
  onSubmit: () => void
  onStartReview: () => void
  isSubmitting?: boolean
  isStartingReview?: boolean
}

export function ActionBar({
  application,
  onSubmit,
  onStartReview,
  isSubmitting,
  isStartingReview,
}: ActionBarProps) {
  const { id, status } = application

  if (status === "DRAFT") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="info-soft">
          <Link to={`/applications/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="info-soft"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    )
  }

  if (status === "NEED_MORE_INFO") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="info-soft">
          <Link to={`/applications/${id}/edit`}>
            <Pencil className="h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="info-soft"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          <Send className="h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Resubmit"}
        </Button>
      </div>
    )
  }

  if (status === "SUBMITTED") {
    return (
      <Button
        variant="info-soft"
        onClick={onStartReview}
        disabled={isStartingReview}
      >
        <ShieldCheck className="h-4 w-4" />
        {isStartingReview ? "Starting Review..." : "Start Review"}
      </Button>
    )
  }

  if (status === "UNDER_REVIEW") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="success-soft">
          <Link to={`/applications/${id}/review?decision=APPROVED`}>
            <Check className="h-4 w-4" />
            Approve
          </Link>
        </Button>
        <Button asChild variant="warning-soft">
          <Link to={`/applications/${id}/review?decision=NEED_MORE_INFO`}>
            <AlertCircle className="h-4 w-4" />
            Need More Information
          </Link>
        </Button>
        <Button asChild variant="destructive-soft">
          <Link to={`/applications/${id}/review?decision=REJECTED`}>
            <X className="h-4 w-4" />
            Reject
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <p className="text-sm text-slate-500">
      This application is in a terminal state. No further actions available.
    </p>
  )
}
