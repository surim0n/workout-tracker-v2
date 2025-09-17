"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Dumbbell, Heart, ChevronRight, Trophy, Zap } from "lucide-react"
import Link from "next/link"

interface EnhancedRecentWorkoutsProps {
  workouts: any[]
}

export function EnhancedRecentWorkouts({ workouts }: EnhancedRecentWorkoutsProps) {
  const recentWorkouts = workouts?.slice(0, 4) || []

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "strength":
        return Dumbbell
      case "cardio":
        return Heart
      default:
        return Zap
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "strength":
        return "bg-chart-2 text-chart-2"
      case "cardio":
        return "bg-chart-3 text-chart-3"
      default:
        return "bg-chart-1 text-chart-1"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  if (!recentWorkouts.length) {
    return (
      <Card>
        <div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Recent Workouts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Dumbbell className="w-8 h-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Ready to start your fitness journey?</h3>
                <p className="text-muted-foreground">Log your first workout and begin tracking your progress!</p>
              </div>
              <Button asChild className="mt-4">
                <Link href="/workouts/new">
                  <Zap className="w-4 h-4 mr-2" />
                  Log Your First Workout
                </Link>
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              Recent Workouts
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/workouts/history">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {recentWorkouts.map((workout, index) => {
            const primaryCategory = workout.workout_exercises?.[0]?.exercises?.category || "general"
            const CategoryIcon = getCategoryIcon(primaryCategory)
            const categoryColor = getCategoryColor(primaryCategory)

            return (
              <div
                key={workout.id}
                className="group relative p-4 rounded-xl glass border-white/10 hover:glass-card hover:shadow-glass transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="glass-overlay">
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-lg glass ${categoryColor} bg-opacity-20 group-hover:scale-110 transition-transform duration-200 shadow-glass`}
                    >
                      <CategoryIcon className={`w-5 h-5 ${categoryColor.split(" ")[1]}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {workout.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {workout.duration_minutes} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(workout.created_at)}
                            </div>
                          </div>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                          {workout.workout_exercises?.length || 0} exercises
                        </Badge>
                      </div>

                      {workout.workout_exercises?.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {workout.workout_exercises.slice(0, 3).map((we: any, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {we.exercises?.name}
                            </Badge>
                          ))}
                          {workout.workout_exercises.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{workout.workout_exercises.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )
          })}

          <div className="pt-4 border-t border-white/10">
            <Button
              asChild
              className="w-full glass-card hover:gradient-apple-subtle transition-all duration-300 bg-transparent"
              variant="outline"
            >
              <Link href="/workouts/new">
                <Zap className="w-4 h-4 mr-2" />
                Log New Workout
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
