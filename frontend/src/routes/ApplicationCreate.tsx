import { useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"

import { ApplicationForm } from "@/components/ApplicationForm"
import { Breadcrumbs } from "@/components/Breadcrumbs"
import { api } from "@/lib/api"
import { qk } from "@/lib/queryKeys"
import type { ApplicationFormValues } from "@/schemas/application"

export function ApplicationCreate() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (values: ApplicationFormValues) =>
      api.create({
        applicant_name: values.applicant_name,
        applicant_email: values.applicant_email,
        company_name: values.company_name,
        application_type: values.application_type,
        description: values.description ?? "",
      }),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: qk.applications.all })
      toast.success(`Application ${created.tracking_number} created`)
      navigate(`/applications/${created.id}`)
    },
    onError: (error: AxiosError<{ detail?: string }>) => {
      const detail = error.response?.data?.detail
      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not create the application",
      )
    },
  })

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mt-6 border-b border-slate-100 bg-slate-50 pt-6 pb-4">
        <Breadcrumbs
          items={[
            { label: "Applications", to: "/" },
            { label: "New application" },
          ]}
        />
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          New application
        </h1>
      </div>
      <ApplicationForm
        submitLabel="Create application"
        onSubmit={(values) => mutation.mutateAsync(values)}
        onCancel={() => navigate(-1)}
        isSubmitting={mutation.isPending}
      />
    </div>
  )
}
