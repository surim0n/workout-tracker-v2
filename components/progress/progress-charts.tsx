"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Workout {
  id: string
  name: string
  duration_minutes: number | null
  created_at: string
  workout_exercises: Array<{
    id: string
    sets: number | null
    reps: number[] | null
    weight: number[] | null
    distance: number | null
    duration_seconds: number | null
    exercises: {
      id: string
      name: string
      category: string
    }
  }>
}

interface ProgressChartsProps {
  workouts: Workout[]
}

export function ProgressCharts({ workouts }: ProgressChartsProps) {
  // Process data for workout frequency chart
  const workoutFrequencyData = workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.created_at)
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()))
      const weekKey = weekStart.toISOString().split("T")[0]

      acc[weekKey] = (acc[weekKey] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const frequencyChartData = Object.entries(workoutFrequencyData)
    .map(([week, count]) => ({
      week: new Date(week).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      workouts: count,
    }))
    .slice(-12) // Last 12 weeks

  // Process data for duration trend
  const durationData = workouts
    .filter((w) => w.duration_minutes)
    .slice(-20) // Last 20 workouts
    .map((workout, index) => ({
      workout: `#${index + 1}`,
      duration: workout.duration_minutes,
      date: new Date(workout.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }))

  // Process data for total volume (weight lifted)
  const volumeData = workouts
    .map((workout) => {
      const totalVolume = workout.workout_exercises.reduce((sum, we) => {
        if (we.weight && we.reps && we.sets) {
          const exerciseVolume = we.weight.reduce((weightSum, weight, index) => {
            return weightSum + weight * (we.reps?.[index] || 0)
          }, 0)
          return sum + exerciseVolume
        }
        return sum
      }, 0)

      return {
        date: new Date(workout.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        volume: totalVolume,
        name: workout.name,
      }
    })
    .filter((d) => d.volume > 0)
    .slice(-15) // Last 15 workouts with volume

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Workout Frequency</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              workouts: {
                label: "Workouts",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={frequencyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="workouts" fill="var(--color-chart-1)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Workout Duration Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              duration: {
                label: "Duration (min)",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={durationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="var(--color-chart-2)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-chart-2)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {volumeData.length > 0 && (
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Total Volume Progress (Weight × Reps)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                volume: {
                  label: "Volume (lbs)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="volume"
                    stroke="var(--color-chart-3)"
                    strokeWidth={2}
                    dot={{ fill: "var(--color-chart-3)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
