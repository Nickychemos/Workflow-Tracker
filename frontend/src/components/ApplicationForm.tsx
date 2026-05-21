import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  applicationSchema,
  type ApplicationFormValues,
} from "@/schemas/application"
import { APPLICATION_TYPE_LABELS } from "@/lib/types"

interface ApplicationFormProps {
  defaultValues?: Partial<ApplicationFormValues>
  submitLabel: string
  onSubmit: (values: ApplicationFormValues) => Promise<unknown> | void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ApplicationForm({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      applicant_name: "",
      applicant_email: "",
      company_name: "",
      description: "",
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 pb-2 md:grid-cols-2">
        <Section title="Applicant information">
          <FieldGroup
            id="applicant_name"
            label="Name"
            required
            error={errors.applicant_name?.message}
          >
            <Input
              id="applicant_name"
              placeholder="Full name"
              {...register("applicant_name")}
            />
          </FieldGroup>
          <FieldGroup
            id="applicant_email"
            label="Email"
            required
            error={errors.applicant_email?.message}
          >
            <Input
              id="applicant_email"
              type="email"
              placeholder="applicant@example.com"
              {...register("applicant_email")}
            />
          </FieldGroup>
          <FieldGroup
            id="company_name"
            label="Company"
            required
            error={errors.company_name?.message}
          >
            <Input
              id="company_name"
              placeholder="Company name"
              {...register("company_name")}
            />
          </FieldGroup>
        </Section>

        <Section title="Application details">
          <FieldGroup
            id="application_type"
            label="Type"
            required
            error={errors.application_type?.message}
          >
            <select
              id="application_type"
              {...register("application_type")}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <option value="">Select a type</option>
              {Object.entries(APPLICATION_TYPE_LABELS).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ),
              )}
            </select>
          </FieldGroup>
          <FieldGroup
            id="description"
            label="Description"
            error={errors.description?.message}
          >
            <Textarea
              id="description"
              rows={6}
              placeholder="Add any details that help the reviewer"
              {...register("description")}
            />
          </FieldGroup>
        </Section>
      </div>

      <div className="mt-6 flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  )
}

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="rounded-[10px] border border-slate-200 bg-white p-6">
      <h3 className="mb-5 border-b border-slate-200 pb-3 text-[15px] font-semibold text-slate-900">
        {title}
      </h3>
      <div className="space-y-5">{children}</div>
    </div>
  )
}

interface FieldGroupProps {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

function FieldGroup({
  id,
  label,
  required,
  error,
  children,
}: FieldGroupProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-[13px]">
        <span className="font-medium text-slate-700">{label}</span>
        {required ? (
          <span className="text-indigo-600" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="font-normal text-slate-400">(optional)</span>
        )}
      </Label>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}
