import { Navigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"
import type { ReactNode } from "react"

import { ActionBar } from "@/components/ActionBar"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { StatusBadge } from "@/components/StatusBadge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { api } from "@/lib/api"
import { qk } from "@/lib/queryKeys"
import { APPLICATION_TYPE_LABELS } from "@/lib/types"

function formatDateTime(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
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

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: qk.applications.all })
    if (id) {
      queryClient.invalidateQueries({
        queryKey: qk.applications.detail(id),
      })
    }
  }

  const onError = (error: AxiosError<{ detail?: string }>) => {
    const detail = error.response?.data?.detail
    toast.error(
      typeof detail === "string" ? detail : "Action failed",
    )
  }

  const submitMutation = useMutation({
    mutationFn: () => api.submit(id!),
    onSuccess: () => {
      invalidate()
      toast.success("Application submitted")
    },
    onError,
  })

  const startReviewMutation = useMutation({
    mutationFn: () => api.startReview(id!),
    onSuccess: () => {
      invalidate()
      toast.success("Review started")
    },
    onError,
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

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mt-6 border-b border-slate-100 bg-slate-50 pt-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Applications", to: "/" },
            { label: application.tracking_number },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-mono text-2xl font-semibold text-slate-900">
            {application.tracking_number}
          </h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="mt-1 text-sm text-slate-500">
          {application.applicant_name}
          {" · "}
          {application.company_name}
          {" · "}
          {APPLICATION_TYPE_LABELS[application.application_type]}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <Field label="Name">{application.applicant_name}</Field>
              <Field label="Email">{application.applicant_email}</Field>
              <Field label="Company">{application.company_name}</Field>
              <Field label="Type">
                {APPLICATION_TYPE_LABELS[application.application_type]}
              </Field>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lifecycle</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-3">
              <Field label="Created">
                {formatDateTime(application.created_at)}
              </Field>
              <Field label="Updated">
                {formatDateTime(application.updated_at)}
              </Field>
              <Field label="Submitted">
                {formatDateTime(application.submitted_at)}
              </Field>
              <Field label="Reviewed">
                {formatDateTime(application.reviewed_at)}
              </Field>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="whitespace-pre-wrap text-sm text-slate-700">
          {application.description || (
            <span className="italic text-slate-400">No description.</span>
          )}
        </CardContent>
      </Card>

      {application.reviewer_comment ? (
        <Card>
          <CardHeader>
            <CardTitle>Reviewer comment</CardTitle>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap text-sm text-slate-700">
            {application.reviewer_comment}
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionBar
            application={application}
            onSubmit={() => submitMutation.mutate()}
            onStartReview={() => startReviewMutation.mutate()}
            isSubmitting={submitMutation.isPending}
            isStartingReview={startReviewMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}

interface FieldProps {
  label: string
  children: ReactNode
}

function Field({ label, children }: FieldProps) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right text-slate-900">{children}</dd>
    </div>
  )
}
