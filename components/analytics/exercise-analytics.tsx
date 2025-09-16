"use client"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface Workout {
  id: string
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
      muscle_groups: string[]
    }
  }>
}

interface ExerciseAnalyticsProps {
  workouts: Workout[]
}

export function ExerciseAnalytics({ workouts }: ExerciseAnalyticsProps) {
  // Get exercise performance data
  const exerciseData: Record<
    string,
    {
      name: string
      category: string
      sessions: Array<{
        date: string
        maxWeight?: number
        totalVolume?: number
        distance?: number
        duration?: number
      }>
    }
  > = {}

  workouts.forEach((workout) => {
    workout.workout_exercises.forEach((we) => {
      const exerciseId = we.exercises.id

      if (!exerciseData[exerciseId]) {
        exerciseData[exerciseId] = {
          name: we.exercises.name,
          category: we.exercises.category,
          sessions: [],
        }
      }

      const session: any = {
        date: workout.created_at,
      }

      if (we.exercises.category === "cardio") {
        session.distance = we.distance || 0
        session.duration = we.duration_seconds ? Math.round(we.duration_seconds / 60) : 0
      } else {
        session.maxWeight = we.weight ? Math.max(...we.weight) : 0
        session.totalVolume =
          we.weight && we.reps ? we.weight.reduce((sum, weight, index) => sum + weight * (we.reps?.[index] || 0), 0) : 0
      }

      exerciseData[exerciseId].sessions.push(session)
    })
  })

  // Calculate trends for each exercise
  const exerciseTrends = Object.entries(exerciseData)
    .map(([id, data]) => {
      const sessions = data.sessions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      if (sessions.length < 2) return null

      const recent = sessions.slice(-3) // Last 3 sessions
      const older = sessions.slice(-6, -3) // Previous 3 sessions

      if (recent.length === 0 || older.length === 0) return null

      let trend = "stable"
      let trendValue = 0

      if (data.category === "cardio") {
        const recentAvgDistance = recent.reduce((sum, s) => sum + (s.distance || 0), 0) / recent.length
        const olderAvgDistance = older.reduce((sum, s) => sum + (s.distance || 0), 0) / older.length

        if (recentAvgDistance > olderAvgDistance * 1.1) {
          trend = "improving"
          trendValue = Math.round(((recentAvgDistance - olderAvgDistance) / olderAvgDistance) * 100)
        } else if (recentAvgDistance < olderAvgDistance * 0.9) {
          trend = "declining"
          trendValue = Math.round(((olderAvgDistance - recentAvgDistance) / olderAvgDistance) * 100)
        }
      } else {
        const recentAvgVolume = recent.reduce((sum, s) => sum + (s.totalVolume || 0), 0) / recent.length
        const olderAvgVolume = older.reduce((sum, s) => sum + (s.totalVolume || 0), 0) / older.length

        if (recentAvgVolume > olderAvgVolume * 1.1) {
          trend = "improving"
          trendValue = Math.round(((recentAvgVolume - olderAvgVolume) / olderAvgVolume) * 100)
        } else if (recentAvgVolume < olderAvgVolume * 0.9) {
          trend = "declining"
          trendValue = Math.round(((olderAvgVolume - recentAvgVolume) / olderAvgVolume) * 100)
        }
      }

      return {
        id,
        name: data.name,
        category: data.category,
        sessions: sessions.length,
        trend,
        trendValue,
      }
    })
    .filter(Boolean)
    .sort((a, b) => b!.sessions - a!.sessions)
    .slice(0, 10) // Top 10 exercises

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return TrendingUp
      case "declining":
        return TrendingDown
      default:
        return Minus
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600"
      case "declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strength":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cardio":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "flexibility":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Exercise Performance Trends
        </h3>
        <p className="text-muted-foreground text-sm mt-1">Track improvement and decline patterns</p>
      </div>
      <div className="p-6">
        {exerciseTrends.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-muted/20 to-muted/5 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <p className="text-muted-foreground">Complete more workouts to see exercise trends</p>
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseTrends.map((exercise, index) => {
              const TrendIcon = getTrendIcon(exercise!.trend)
              return (
                <div
                  key={exercise!.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-muted/30 to-muted/10 backdrop-blur-sm border border-white/5 hover:scale-[1.02] transition-all duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <Badge className={`${getCategoryColor(exercise!.category)} font-medium`}>
                      {exercise!.category}
                    </Badge>
                    <div>
                      <h4 className="font-semibold">{exercise!.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise!.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <TrendIcon className={`h-5 w-5 ${getTrendColor(exercise!.trend)}`} />
                    {exercise!.trendValue > 0 && (
                      <span className={`text-sm font-bold ${getTrendColor(exercise!.trend)}`}>
                        {exercise!.trendValue}%
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
