import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, Trash2, Plus } from "lucide-react"
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
      <div className="glass-card rounded-3xl p-12 text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <Plus className="h-12 w-12 text-primary/60" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No workouts logged yet</h3>
        <p className="text-muted-foreground mb-6">Start your fitness journey by logging your first workout</p>
        <Button asChild className="glass-button">
          <Link href="/workouts/new">Log Your First Workout</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {workouts.map((workout, index) => (
        <div
          key={workout.id}
          className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 group"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                {workout.name}
              </h3>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded-full bg-primary/10">
                  <Calendar className="h-3 w-3 text-primary" />
                </div>
                {formatDate(workout.created_at)}
              </div>
              {workout.duration_minutes && (
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-full bg-secondary/10">
                    <Clock className="h-3 w-3 text-secondary" />
                  </div>
                  {workout.duration_minutes} minutes
                </div>
              )}
            </div>

            {workout.notes && <p className="text-muted-foreground mb-4 italic">{workout.notes}</p>}

            <div className="space-y-3">
              {workout.workout_exercises.map((we) => (
                <div
                  key={we.id}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/20 rounded-xl backdrop-blur-sm border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={`${getCategoryColor(we.exercises.category)} font-medium`}>
                      {we.exercises.category}
                    </Badge>
                    <span className="font-medium">{we.exercises.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
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
          </div>
        </div>
      ))}
    </div>
  )
}
