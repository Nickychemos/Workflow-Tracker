import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/StatusBadge"
import { EmptyState } from "@/components/EmptyState"
import { api, type ApplicationFilters } from "@/lib/api"
import { qk } from "@/lib/queryKeys"
import { useDebouncedValue } from "@/lib/hooks"
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_TYPE_LABELS,
} from "@/lib/types"

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function ApplicationList() {
  const [status, setStatus] = useState("")
  const [applicationType, setApplicationType] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const search = useDebouncedValue(searchInput, 300)

  const filters: ApplicationFilters = {
    status: status || undefined,
    application_type: applicationType || undefined,
    search: search || undefined,
  }

  const {
    data: applications = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: qk.applications.list(filters),
    queryFn: () => api.list(filters),
  })

  const hasFilters = Boolean(status || applicationType || search)
  const showEmpty = !isLoading && !isError && applications.length === 0

  const clearFilters = () => {
    setStatus("")
    setApplicationType("")
    setSearchInput("")
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 -mt-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 bg-white pt-6 pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every application from draft to decision.
          </p>
        </div>
        <Button asChild>
          <Link to="/applications/new">
            <Plus className="h-4 w-4" />
            New application
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="relative min-w-[260px] max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name, company or tracking number"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="status-filter"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-9 min-w-[150px] rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All statuses</option>
            {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="type-filter"
            className="text-xs font-semibold uppercase tracking-wider text-slate-500"
          >
            Type
          </label>
          <select
            id="type-filter"
            value={applicationType}
            onChange={(event) => setApplicationType(event.target.value)}
            className="h-9 min-w-[150px] rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All types</option>
            {Object.entries(APPLICATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Loading applications...
        </div>
      ) : isError ? (
        <div className="py-16 text-center text-sm text-rose-700">
          Could not reach the backend. Make sure `make run` is going.
        </div>
      ) : showEmpty ? (
        <EmptyState
          title={
            hasFilters
              ? "No applications match your filters"
              : "No applications yet"
          }
          description={
            hasFilters
              ? "Try clearing a filter or widening your search."
              : "Create the first application to see it here."
          }
          actionLabel={hasFilters ? undefined : "New application"}
          actionHref={hasFilters ? undefined : "/applications/new"}
        />
      ) : (
        <div>
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">
              Showing {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}
            </span>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            ) : null}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tracking number</TableHead>
                <TableHead>Applicant name</TableHead>
                <TableHead>Company name</TableHead>
                <TableHead>Application type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created date</TableHead>
                <TableHead className="sticky right-0 z-[1] bg-slate-50 text-right shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.06)]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-mono text-xs text-slate-600">
                    {app.tracking_number}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/applications/${app.id}`}
                      className="font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      {app.applicant_name}
                    </Link>
                  </TableCell>
                  <TableCell>{app.company_name}</TableCell>
                  <TableCell>
                    {APPLICATION_TYPE_LABELS[app.application_type]}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {formatDate(app.created_at)}
                  </TableCell>
                  <TableCell className="sticky right-0 z-[1] bg-white text-right shadow-[-6px_0_6px_-6px_rgba(0,0,0,0.06)] group-hover:bg-slate-50">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        to={`/applications/${app.id}`}
                        className="font-medium text-indigo-600 hover:text-indigo-700"
                      >
                        View
                      </Link>
                      {app.status === "DRAFT" ||
                      app.status === "NEED_MORE_INFO" ? (
                        <Link
                          to={`/applications/${app.id}/edit`}
                          className="font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Edit
                        </Link>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
