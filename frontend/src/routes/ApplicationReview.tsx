import { useEffect } from "react"
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import type { AxiosError } from "axios"

import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/StatusBadge"
import { api } from "@/lib/api"
import { qk } from "@/lib/queryKeys"
import {
  DECISIONS,
  decisionSchema,
  type DecisionFormValues,
} from "@/schemas/decision"
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_TYPE_LABELS,
  type DecisionValue,
} from "@/lib/types"

const DECISION_LABELS: Record<DecisionValue, string> = {
  APPROVED: "Approve",
  REJECTED: "Reject",
  NEED_MORE_INFO: "Need more information",
}

const DECISION_DESCRIPTIONS: Record<DecisionValue, string> = {
  APPROVED: "Approve the application. Comment is optional.",
  REJECTED: "Reject the application. Comment is required.",
  NEED_MORE_INFO:
    "Send back for changes. Comment is required so the applicant knows what to update.",
}

function isValidDecision(value: string | null): value is DecisionValue {
  return (
    value === "APPROVED" ||
    value === "REJECTED" ||
    value === "NEED_MORE_INFO"
  )
}

export function ApplicationReview() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const queryParam = searchParams.get("decision")
  const preSelected = isValidDecision(queryParam) ? queryParam : undefined
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: application,
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.applications.detail(id ?? ""),
    queryFn: () => api.get(id!),
    enabled: Boolean(id),
  })

  const isUnderReview = application?.status === "UNDER_REVIEW"

  useEffect(() => {
    if (application && !isUnderReview) {
      toast.error(
        "Decisions can only be recorded on Under Review applications",
      )
    }
  }, [application, isUnderReview])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<DecisionFormValues>({
    resolver: zodResolver(decisionSchema),
    defaultValues: {
      decision: preSelected,
      comment: "",
    },
  })

  const watchedDecision = watch("decision")
  const commentRequired =
    watchedDecision === "REJECTED" ||
    watchedDecision === "NEED_MORE_INFO"

  const mutation = useMutation({
    mutationFn: (values: DecisionFormValues) =>
      api.decide(id!, {
        decision: values.decision,
        comment: values.comment ?? "",
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: qk.applications.all })
      queryClient.invalidateQueries({
        queryKey: qk.applications.detail(updated.id),
      })
      toast.success(
        `Decision recorded: ${APPLICATION_STATUS_LABELS[updated.status]}`,
      )
      navigate(`/applications/${updated.id}`)
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail
      toast.error(
        typeof detail === "string" ? detail : "Could not record decision",
      )
    },
  })

  if (!id) return <Navigate to="/" replace />

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-sm text-slate-500">
          Loading...
        </CardContent>
      </Card>
    )
  }

  if (isError || !application) {
    return (
      <Card>
        <CardContent className="text-sm text-rose-700">
          Could not load this application.
        </CardContent>
      </Card>
    )
  }

  if (!isUnderReview) {
    return <Navigate to={`/applications/${id}`} replace />
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="sticky top-0 z-10 -mt-6 border-b border-slate-100 bg-slate-50 pt-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Applications", to: "/" },
            {
              label: application.tracking_number,
              to: `/applications/${id}`,
            },
            { label: "Reviewer decision" },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold text-slate-900">
            Reviewer decision
          </h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {application.applicant_name} · {application.company_name}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-700">
          <div>
            <span className="text-slate-500">Type: </span>
            {APPLICATION_TYPE_LABELS[application.application_type]}
          </div>
          {application.description ? (
            <div className="whitespace-pre-wrap">
              <span className="text-slate-500">Description: </span>
              {application.description}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <form
        onSubmit={handleSubmit((values) => mutation.mutateAsync(values))}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {DECISIONS.map((value) => (
              <label
                key={value}
                className="flex cursor-pointer items-start gap-3 rounded-md border border-slate-200 px-4 py-3 hover:bg-slate-50 has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50"
              >
                <input
                  type="radio"
                  value={value}
                  {...register("decision")}
                  className="mt-1 h-4 w-4 border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-slate-900">
                    {DECISION_LABELS[value]}
                  </div>
                  <div className="text-xs text-slate-500">
                    {DECISION_DESCRIPTIONS[value]}
                  </div>
                </div>
              </label>
            ))}
            {errors.decision ? (
              <p className="text-xs text-rose-600">
                {errors.decision.message}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Comment
              {commentRequired ? (
                <span className="ml-1 text-indigo-600">*</span>
              ) : (
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (optional)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={5}
              {...register("comment")}
              placeholder={
                commentRequired
                  ? "Explain the decision so the applicant knows what to do next"
                  : "Optional context for the applicant"
              }
            />
            {errors.comment ? (
              <p className="mt-2 text-xs text-rose-600">
                {errors.comment.message}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-6 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] md:left-60">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/applications/${id}`)}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Recording..." : "Record decision"}
          </Button>
        </div>
      </form>
    </div>
  )
}
