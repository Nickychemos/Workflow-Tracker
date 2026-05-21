import { Card, CardContent } from "@/components/ui/card"

export function ApplicationDetail() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Application detail
      </h1>
      <Card>
        <CardContent className="text-sm text-slate-500">
          The detail view will land in a subsequent commit.
        </CardContent>
      </Card>
    </div>
  )
}
