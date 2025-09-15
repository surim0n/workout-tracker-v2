"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Exercise {
  id: string
  name: string
  category: string
}

interface Workout {
  id: string
  name: string
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

interface ExerciseProgressProps {
  workouts: Workout[]
  exercises: Exercise[]
}

export function ExerciseProgress({ workouts, exercises }: ExerciseProgressProps) {
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>("")

  const getExerciseProgressData = (exerciseId: string) => {
    const exerciseWorkouts = workouts
      .map((workout) => {
        const exerciseData = workout.workout_exercises.find((we) => we.exercises.id === exerciseId)
        if (!exerciseData) return null

        const date = new Date(workout.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })

        // Calculate metrics based on exercise type
        if (exerciseData.exercises.category === "cardio") {
          return {
            date,
            distance: exerciseData.distance || 0,
            duration: exerciseData.duration_seconds ? Math.round(exerciseData.duration_seconds / 60) : 0,
            workout: workout.name,
          }
        } else {
          // For strength exercises, calculate max weight and total volume
          const maxWeight = exerciseData.weight ? Math.max(...exerciseData.weight) : 0
          const totalVolume =
            exerciseData.weight && exerciseData.reps
              ? exerciseData.weight.reduce((sum, weight, index) => sum + weight * (exerciseData.reps?.[index] || 0), 0)
              : 0

          return {
            date,
            maxWeight,
            totalVolume,
            workout: workout.name,
          }
        }
      })
      .filter(Boolean)
      .slice(-15) // Last 15 workouts with this exercise

    return exerciseWorkouts
  }

  const selectedExercise = exercises.find((e) => e.id === selectedExerciseId)
  const progressData = selectedExerciseId ? getExerciseProgressData(selectedExerciseId) : []

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
        <CardTitle>Exercise-Specific Progress</CardTitle>
        <div className="flex gap-4 items-center">
          <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select an exercise to track" />
            </SelectTrigger>
            <SelectContent>
              {exercises.map((exercise) => (
                <SelectItem key={exercise.id} value={exercise.id}>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getCategoryColor(exercise.category)}>
                      {exercise.category}
                    </Badge>
                    {exercise.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {!selectedExerciseId ? (
          <div className="text-center py-8 text-muted-foreground">
            Select an exercise to view your progress over time
          </div>
        ) : progressData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No data available for this exercise</div>
        ) : (
          <div className="space-y-6">
            {selectedExercise?.category === "cardio" ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Distance Progress</h4>
                  <ChartContainer
                    config={{
                      distance: {
                        label: "Distance (miles)",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="distance"
                          stroke="var(--color-chart-4)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-chart-4)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3">Duration Progress</h4>
                  <ChartContainer
                    config={{
                      duration: {
                        label: "Duration (min)",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="duration"
                          stroke="var(--color-chart-5)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-chart-5)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-3">Max Weight Progress</h4>
                  <ChartContainer
                    config={{
                      maxWeight: {
                        label: "Max Weight (lbs)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="maxWeight"
                          stroke="var(--color-chart-1)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-chart-1)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-3">Total Volume Progress</h4>
                  <ChartContainer
                    config={{
                      totalVolume: {
                        label: "Volume (lbs)",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="totalVolume"
                          stroke="var(--color-chart-2)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-chart-2)" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
