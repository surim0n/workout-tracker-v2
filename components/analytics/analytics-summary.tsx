"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, TrendingUp, Target, Award, Flame } from "lucide-react"

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
      muscle_groups: string[]
    }
  }>
}

interface AnalyticsSummaryProps {
  workouts: Workout[]
}

export function AnalyticsSummary({ workouts }: AnalyticsSummaryProps) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  // Calculate weekly stats
  const weeklyWorkouts = workouts.filter((w) => new Date(w.created_at) >= oneWeekAgo)
  const weeklyMinutes = weeklyWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0)
  const weeklyVolume = weeklyWorkouts.reduce((sum, workout) => {
    return (
      sum +
      workout.workout_exercises.reduce((exerciseSum, we) => {
        if (we.weight && we.reps) {
          return (
            exerciseSum +
            we.weight.reduce((weightSum, weight, index) => {
              return weightSum + weight * (we.reps?.[index] || 0)
            }, 0)
          )
        }
        return exerciseSum
      }, 0)
    )
  }, 0)

  // Calculate monthly stats
  const monthlyWorkouts = workouts.filter((w) => new Date(w.created_at) >= oneMonthAgo)
  const monthlyMinutes = monthlyWorkouts.reduce((sum, w) => sum + (w.duration_minutes || 0), 0)
  const monthlyVolume = monthlyWorkouts.reduce((sum, workout) => {
    return (
      sum +
      workout.workout_exercises.reduce((exerciseSum, we) => {
        if (we.weight && we.reps) {
          return (
            exerciseSum +
            we.weight.reduce((weightSum, weight, index) => {
              return weightSum + weight * (we.reps?.[index] || 0)
            }, 0)
          )
        }
        return exerciseSum
      }, 0)
    )
  }, 0)

  // Calculate streaks
  const workoutDates = workouts.map((w) => new Date(w.created_at).toDateString()).reverse()
  let currentStreak = 0
  const checkDate = new Date()

  for (let i = 0; i < 30; i++) {
    const dateStr = checkDate.toDateString()
    if (workoutDates.includes(dateStr)) {
      currentStreak++
    } else if (currentStreak > 0) {
      break
    }
    checkDate.setDate(checkDate.getDate() - 1)
  }

  // Most active muscle groups
  const muscleGroupCount: Record<string, number> = {}
  workouts.forEach((workout) => {
    workout.workout_exercises.forEach((we) => {
      we.exercises.muscle_groups.forEach((mg) => {
        muscleGroupCount[mg] = (muscleGroupCount[mg] || 0) + 1
      })
    })
  })
  const topMuscleGroups = Object.entries(muscleGroupCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  const summaryCards = [
    {
      title: "This Week",
      value: weeklyWorkouts.length,
      subtitle: `${weeklyMinutes} minutes`,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: "This Month",
      value: monthlyWorkouts.length,
      subtitle: `${Math.round(monthlyMinutes / 60)} hours`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: "Current Streak",
      value: currentStreak,
      subtitle: currentStreak === 1 ? "day" : "days",
      icon: Flame,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: "Weekly Volume",
      value: Math.round(weeklyVolume),
      subtitle: "lbs lifted",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Muscle Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMuscleGroups.map(([muscleGroup, count], index) => (
                <div key={muscleGroup} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="capitalize font-medium">{muscleGroup}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{count} exercises</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {workouts.length >= 10 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                    🏆 Consistent
                  </Badge>
                  <span className="text-sm">10+ workouts logged</span>
                </div>
              )}
              {currentStreak >= 7 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    🔥 On Fire
                  </Badge>
                  <span className="text-sm">7+ day streak</span>
                </div>
              )}
              {weeklyVolume >= 1000 && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                    💪 Strong
                  </Badge>
                  <span className="text-sm">1000+ lbs this week</span>
                </div>
              )}
              {workouts.length === 0 && (
                <p className="text-sm text-muted-foreground">Complete workouts to unlock achievements!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
