import { useEffect } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"

import { ApplicationForm } from "@/components/ApplicationForm"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { Card, CardContent } from "@/components/ui/card"
import { api } from "@/lib/api"
import { qk } from "@/lib/queryKeys"
import type { ApplicationFormValues } from "@/schemas/application"

export function ApplicationEdit() {
  const { id } = useParams<{ id: string }>()
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

  const isEditable =
    application?.status === "DRAFT" ||
    application?.status === "NEED_MORE_INFO"

  useEffect(() => {
    if (application && !isEditable) {
      toast.error("This application is no longer editable")
    }
  }, [application, isEditable])

  const mutation = useMutation({
    mutationFn: (values: ApplicationFormValues) =>
      api.update(id!, {
        applicant_name: values.applicant_name,
        applicant_email: values.applicant_email,
        company_name: values.company_name,
        application_type: values.application_type,
        description: values.description ?? "",
      }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: qk.applications.all })
      queryClient.invalidateQueries({
        queryKey: qk.applications.detail(updated.id),
      })
      toast.success("Application updated")
      navigate(`/applications/${updated.id}`)
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail
      toast.error(
        typeof detail === "string" ? detail : "Could not save changes",
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

  if (!isEditable) {
    return <Navigate to={`/applications/${id}`} replace />
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mt-6 border-b border-slate-100 bg-slate-50 pt-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Applications", to: "/" },
            {
              label: application.tracking_number,
              to: `/applications/${id}`,
            },
            { label: "Edit" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          Edit {application.tracking_number}
        </h1>
      </div>
      <ApplicationForm
        defaultValues={{
          applicant_name: application.applicant_name,
          applicant_email: application.applicant_email,
          company_name: application.company_name,
          application_type: application.application_type,
          description: application.description,
        }}
        submitLabel="Save changes"
        onSubmit={(values) => mutation.mutateAsync(values)}
        onCancel={() => navigate(`/applications/${id}`)}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
