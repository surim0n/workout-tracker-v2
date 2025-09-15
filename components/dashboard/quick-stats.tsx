import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Calendar, Clock, TrendingUp } from "lucide-react"

interface Workout {
  id: string
  duration_minutes: number | null
  created_at: string
}

interface QuickStatsProps {
  workouts: Workout[]
}

export function QuickStats({ workouts }: QuickStatsProps) {
  const totalWorkouts = workouts.length
  const totalMinutes = workouts.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0)
  const totalHours = Math.round((totalMinutes / 60) * 10) / 10

  // Calculate this week's workouts
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const thisWeekWorkouts = workouts.filter((workout) => new Date(workout.created_at) >= oneWeekAgo).length

  // Calculate this month's workouts
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const thisMonthWorkouts = workouts.filter((workout) => new Date(workout.created_at) >= oneMonthAgo).length

  const stats = [
    {
      title: "Total Workouts",
      value: totalWorkouts,
      icon: Activity,
      description: "All time",
    },
    {
      title: "This Week",
      value: thisWeekWorkouts,
      icon: Calendar,
      description: "Last 7 days",
    },
    {
      title: "This Month",
      value: thisMonthWorkouts,
      icon: TrendingUp,
      description: "Last 30 days",
    },
    {
      title: "Total Hours",
      value: totalHours,
      icon: Clock,
      description: "Time exercising",
    },
  ]

  return (
    <>
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
