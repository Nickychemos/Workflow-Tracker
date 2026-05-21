import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ChevronLeft } from "lucide-react"
import type { AxiosError } from "axios"

import { ApplicationForm } from "@/components/ApplicationForm"
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
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="h-4 w-4" />
          Applications
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
          New application
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in the applicant and application details. The tracking number is
          generated for you.
        </p>
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
