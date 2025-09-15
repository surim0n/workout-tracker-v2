import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BarChart3, History, TrendingUp } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  return (
    <Card className="md:col-span-2 lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full justify-start" size="sm">
          <Link href="/workouts/new">
            <Plus className="mr-2 h-4 w-4" />
            Log New Workout
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Link href="/workouts">
            <History className="mr-2 h-4 w-4" />
            View History
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Link href="/progress">
            <TrendingUp className="mr-2 h-4 w-4" />
            Track Progress
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="sm">
          <Link href="/analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Analytics
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
