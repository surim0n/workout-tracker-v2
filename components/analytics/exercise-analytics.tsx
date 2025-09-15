"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <Card>
      <CardHeader>
        <CardTitle>Exercise Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {exerciseTrends.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Complete more workouts to see exercise trends</p>
        ) : (
          <div className="space-y-4">
            {exerciseTrends.map((exercise) => {
              const TrendIcon = getTrendIcon(exercise!.trend)
              return (
                <div key={exercise!.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(exercise!.category)}>{exercise!.category}</Badge>
                    <div>
                      <h4 className="font-medium">{exercise!.name}</h4>
                      <p className="text-sm text-muted-foreground">{exercise!.sessions} sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendIcon className={`h-4 w-4 ${getTrendColor(exercise!.trend)}`} />
                    {exercise!.trendValue > 0 && (
                      <span className={`text-sm ${getTrendColor(exercise!.trend)}`}>{exercise!.trendValue}%</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
