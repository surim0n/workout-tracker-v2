"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Workout {
  id: string
  name: string
  duration_minutes: number | null
  created_at: string
  workout_exercises: Array<{
    exercises: {
      category: string
    }
  }>
}

interface WorkoutBreakdownProps {
  workouts: Workout[]
}

export function WorkoutBreakdown({ workouts }: WorkoutBreakdownProps) {
  // Category breakdown
  const categoryCount: Record<string, number> = {}
  workouts.forEach((workout) => {
    workout.workout_exercises.forEach((we) => {
      categoryCount[we.exercises.category] = (categoryCount[we.exercises.category] || 0) + 1
    })
  })

  const categoryData = Object.entries(categoryCount).map(([category, count]) => ({
    name: category,
    value: count,
    percentage: Math.round((count / Object.values(categoryCount).reduce((a, b) => a + b, 0)) * 100),
  }))

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  // Weekly workout distribution
  const weeklyData = workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.created_at)
      const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "long" })
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const weeklyChartData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => ({
    day: day.slice(0, 3),
    workouts: weeklyData[day] || 0,
  }))

  // Average workout duration by month
  const monthlyDuration = workouts.reduce(
    (acc, workout) => {
      if (!workout.duration_minutes) return acc

      const date = new Date(workout.created_at)
      const monthKey = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0 }
      }
      acc[monthKey].total += workout.duration_minutes
      acc[monthKey].count += 1

      return acc
    },
    {} as Record<string, { total: number; count: number }>,
  )

  const durationChartData = Object.entries(monthlyDuration)
    .map(([month, data]) => ({
      month,
      avgDuration: Math.round(data.total / data.count),
    }))
    .slice(-6) // Last 6 months

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold bg-gradient-to-r from-chart-1 to-chart-1/70 bg-clip-text text-transparent">
            Exercise Categories
          </h3>
          <p className="text-muted-foreground text-sm mt-1">Distribution of workout types</p>
        </div>
        <div className="p-6">
          <ChartContainer
            config={{
              strength: { label: "Strength", color: "hsl(var(--chart-1))" },
              cardio: { label: "Cardio", color: "hsl(var(--chart-2))" },
              flexibility: { label: "Flexibility", color: "hsl(var(--chart-3))" },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm p-2 rounded-lg bg-gradient-to-r from-muted/20 to-muted/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="capitalize font-medium">{item.name}</span>
                </div>
                <span className="text-muted-foreground font-medium">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h3 className="text-xl font-bold bg-gradient-to-r from-chart-2 to-chart-2/70 bg-clip-text text-transparent">
            Weekly Distribution
          </h3>
          <p className="text-muted-foreground text-sm mt-1">Most active days</p>
        </div>
        <div className="p-6">
          <ChartContainer
            config={{
              workouts: {
                label: "Workouts",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="workouts" fill="var(--color-chart-2)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      {durationChartData.length > 0 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold bg-gradient-to-r from-chart-3 to-chart-3/70 bg-clip-text text-transparent">
              Duration Trend
            </h3>
            <p className="text-muted-foreground text-sm mt-1">Monthly averages</p>
          </div>
          <div className="p-6">
            <ChartContainer
              config={{
                avgDuration: {
                  label: "Avg Duration (min)",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.2} />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgDuration" fill="var(--color-chart-3)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      )}
    </div>
  )
}
