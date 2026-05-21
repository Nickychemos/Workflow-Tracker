import { Card, CardContent } from "@/components/ui/card"

export function ApplicationList() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
        <p className="mt-1 text-sm text-slate-500">
          Track every application from draft to decision.
        </p>
      </div>
      <Card>
        <CardContent className="text-sm text-slate-500">
          The list will land in the next commit.
        </CardContent>
      </Card>
    </div>
  )
}
