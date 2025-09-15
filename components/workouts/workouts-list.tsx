import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Trash2 } from "lucide-react"
import Link from "next/link"

interface Workout {
  id: string
  name: string
  notes: string | null
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
      name: string
      category: string
    }
  }>
}

interface WorkoutsListProps {
  workouts: Workout[]
}

export function WorkoutsList({ workouts }: WorkoutsListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
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

  if (workouts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground mb-4">No workouts logged yet</p>
          <Button asChild>
            <Link href="/workouts/new">Log Your First Workout</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {workouts.map((workout) => (
        <Card key={workout.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{workout.name}</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(workout.created_at)}
              </div>
              {workout.duration_minutes && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {workout.duration_minutes} minutes
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {workout.notes && <p className="text-muted-foreground mb-4">{workout.notes}</p>}

            <div className="space-y-3">
              {workout.workout_exercises.map((we) => (
                <div key={we.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(we.exercises.category)}>{we.exercises.category}</Badge>
                    <span className="font-medium">{we.exercises.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {we.sets && we.reps && (
                      <span>
                        {we.sets} sets × {we.reps.join(", ")} reps
                      </span>
                    )}
                    {we.weight && we.weight.length > 0 && <span className="ml-2">@ {we.weight.join(", ")} lbs</span>}
                    {we.distance && <span>{we.distance} miles</span>}
                    {we.duration_seconds && <span>{Math.round(we.duration_seconds / 60)} min</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
