"use client"

import { Target, Clock, Zap } from "lucide-react"
import { PolarGrid, RadialBar, RadialBarChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

interface WorkoutChartsProps {
  workouts: Array<{
    id: string
    duration_minutes: number
    created_at: string
  }>
}

export function WorkoutCharts({ workouts }: WorkoutChartsProps) {
  // Calculate weekly goal progress (assuming 4 workouts per week goal)
  const weeklyGoal = 4
  const thisWeekWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.created_at)
    const now = new Date()
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
    return workoutDate >= weekStart
  }).length

  const goalProgress = Math.min((thisWeekWorkouts / weeklyGoal) * 100, 100)

  // Calculate average workout duration
  const avgDuration =
    workouts.length > 0 ? workouts.reduce((sum, w) => sum + w.duration_minutes, 0) / workouts.length : 0
  const durationProgress = Math.min((avgDuration / 60) * 100, 100) // Target 60 min avg

  // Calculate workout consistency (workouts in last 7 days)
  const last7Days = workouts.filter((workout) => {
    const workoutDate = new Date(workout.created_at)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    return workoutDate >= sevenDaysAgo
  }).length

  const consistencyProgress = Math.min((last7Days / 7) * 100, 100) // Target daily workouts

  const goalChartData = [{ metric: "goal", value: goalProgress, fill: "var(--color-goal)" }]

  const durationChartData = [{ metric: "duration", value: durationProgress, fill: "var(--color-duration)" }]

  const consistencyChartData = [{ metric: "consistency", value: consistencyProgress, fill: "var(--color-consistency)" }]

  const chartConfig = {
    goal: {
      label: "Weekly Goal",
      color: "var(--chart-1)",
    },
    duration: {
      label: "Avg Duration",
      color: "var(--chart-2)",
    },
    consistency: {
      label: "Consistency",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Weekly Goal Progress */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-rose-500" />
            <CardTitle className="text-sm">Weekly Goal</CardTitle>
          </div>
          <CardDescription className="text-xs">
            {thisWeekWorkouts} of {weeklyGoal} workouts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[120px]">
            <RadialBarChart data={goalChartData} innerRadius={20} outerRadius={50}>
              <PolarGrid gridType="circle" />
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-1 text-xs">
          <div className="flex items-center gap-1 font-medium">{goalProgress.toFixed(0)}% Complete</div>
        </CardFooter>
      </Card>

      {/* Average Duration */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-rose-600" />
            <CardTitle className="text-sm">Avg Duration</CardTitle>
          </div>
          <CardDescription className="text-xs">{avgDuration.toFixed(0)} minutes average</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[120px]">
            <RadialBarChart data={durationChartData} innerRadius={20} outerRadius={50}>
              <PolarGrid gridType="circle" />
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-1 text-xs">
          <div className="flex items-center gap-1 font-medium">Target: 60 min</div>
        </CardFooter>
      </Card>

      {/* Consistency */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-rose-700" />
            <CardTitle className="text-sm">Consistency</CardTitle>
          </div>
          <CardDescription className="text-xs">{last7Days} workouts this week</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[120px]">
            <RadialBarChart data={consistencyChartData} innerRadius={20} outerRadius={50}>
              <PolarGrid gridType="circle" />
              <RadialBar dataKey="value" cornerRadius={10} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col gap-1 text-xs">
          <div className="flex items-center gap-1 font-medium">{consistencyProgress.toFixed(0)}% Active</div>
        </CardFooter>
      </Card>
    </div>
  )
}
