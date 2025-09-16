"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Clock, Target, Flame } from "lucide-react"

interface EnhancedStatsProps {
  workouts: any[]
}

export function EnhancedStats({ workouts }: EnhancedStatsProps) {
  const totalWorkouts = workouts?.length || 0
  const totalMinutes = workouts?.reduce((sum, w) => sum + (w.duration_minutes || 0), 0) || 0
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0

  // Calculate this week's stats
  const thisWeek =
    workouts?.filter((w) => {
      const workoutDate = new Date(w.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return workoutDate >= weekAgo
    }) || []

  const weeklyGoal = 4 // Target workouts per week
  const weeklyProgress = Math.min((thisWeek.length / weeklyGoal) * 100, 100)

  // Calculate streak
  const sortedWorkouts = [...(workouts || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )

  let currentStreak = 0
  const today = new Date()

  for (let i = 0; i < sortedWorkouts.length; i++) {
    const workoutDate = new Date(sortedWorkouts[i].created_at)
    const daysDiff = Math.floor((today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysDiff <= i + 1) {
      currentStreak++
    } else {
      break
    }
  }

  const stats = [
    {
      title: "Weekly Progress",
      value: `${thisWeek.length}/${weeklyGoal}`,
      subtitle: "workouts completed",
      icon: Target,
      color: "bg-chart-1",
      trend: thisWeek.length >= weeklyGoal ? "On track!" : "Keep going!",
    },
    {
      title: "Current Streak",
      value: currentStreak,
      subtitle: currentStreak === 1 ? "day" : "days",
      icon: Flame,
      color: "bg-chart-3",
      badge: currentStreak >= 7 ? "🔥 Hot Streak!" : currentStreak >= 3 ? "💪 Building!" : "🌱 Growing",
    },
    {
      title: "Total Workouts",
      value: totalWorkouts,
      subtitle: "all time",
      icon: Activity,
      color: "bg-chart-2",
      badge: totalWorkouts >= 50 ? "🏆 Champion" : totalWorkouts >= 20 ? "⭐ Achiever" : "🚀 Starter",
    },
    {
      title: "Average Duration",
      value: avgDuration,
      subtitle: "minutes per workout",
      icon: Clock,
      color: "bg-chart-4",
      trend: avgDuration >= 45 ? "Intense!" : avgDuration >= 30 ? "Solid!" : "Quick & effective!",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="relative overflow-hidden border-0 glass-card shadow-glass hover:shadow-glass-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105"
        >
          <div className={`absolute top-0 left-0 right-0 h-1 gradient-apple-warm`} />
          <div className="glass-overlay">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg glass ${stat.color} bg-opacity-20 shadow-glass`}>
                  <stat.icon className={`w-4 h-4 text-chart-2`} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                <span className="text-sm text-muted-foreground">{stat.subtitle}</span>
              </div>

              {stat.progress !== undefined && (
                <div className="space-y-2">
                  <Progress value={stat.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{Math.round(stat.progress)}% of weekly goal</p>
                </div>
              )}

              {stat.badge && (
                <Badge variant="secondary" className="text-xs font-medium">
                  {stat.badge}
                </Badge>
              )}

              {stat.trend && <p className="text-xs text-accent font-medium">{stat.trend}</p>}
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  )
}
