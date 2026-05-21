import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { Plus, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
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

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 px-4 py-3">
          <div className="relative min-w-[260px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name, company or tracking number"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="pl-9"
            />
          </div>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All statuses</option>
            {Object.entries(APPLICATION_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={applicationType}
            onChange={(event) => setApplicationType(event.target.value)}
            className="h-9 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          >
            <option value="">All types</option>
            {Object.entries(APPLICATION_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      <Card>
        {isLoading ? (
          <CardContent className="px-6 py-16 text-center text-sm text-slate-500">
            Loading applications...
          </CardContent>
        ) : isError ? (
          <CardContent className="px-6 py-16 text-center text-sm text-rose-700">
            Could not reach the backend. Make sure `make run` is going.
          </CardContent>
        ) : showEmpty ? (
          <EmptyState
            title={
              hasFilters ? "No applications match your filters" : "No applications yet"
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
          <>
            <div className="border-b border-slate-100 px-6 py-3 text-xs text-slate-500">
              Showing {applications.length}{" "}
              {applications.length === 1 ? "application" : "applications"}
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking number</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs text-slate-600">
                      {app.tracking_number}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {app.applicant_name}
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
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="link" size="sm">
                          <Link to={`/applications/${app.id}`}>View</Link>
                        </Button>
                        {app.status === "DRAFT" ||
                        app.status === "NEED_MORE_INFO" ? (
                          <>
                            <span className="text-slate-300">·</span>
                            <Button asChild variant="link" size="sm">
                              <Link to={`/applications/${app.id}/edit`}>
                                Edit
                              </Link>
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </Card>
    </div>
  )
}
