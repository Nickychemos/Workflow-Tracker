import { Card, CardContent } from "@/components/ui/card"

export function ApplicationReview() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">
        Reviewer decision
      </h1>
      <Card>
        <CardContent className="text-sm text-slate-500">
          The decision form will land in a subsequent commit.
        </CardContent>
      </Card>
    </div>
  )
}
