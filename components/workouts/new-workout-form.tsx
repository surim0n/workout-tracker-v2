"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Save } from "lucide-react"

interface Exercise {
  id: string
  name: string
  category: string
  muscle_groups: string[]
  instructions: string | null
}

interface WorkoutExercise {
  exerciseId: string
  exercise: Exercise
  sets: number
  reps: number[]
  weight: number[]
  distance?: number
  duration?: number
}

interface NewWorkoutFormProps {
  exercises: Exercise[]
  userId: string
}

export function NewWorkoutForm({ exercises, userId }: NewWorkoutFormProps) {
  const [workoutName, setWorkoutName] = useState("")
  const [workoutNotes, setWorkoutNotes] = useState("")
  const [duration, setDuration] = useState("")
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([])
  const [selectedExerciseId, setSelectedExerciseId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const addExercise = () => {
    if (!selectedExerciseId) return

    const exercise = exercises.find((e) => e.id === selectedExerciseId)
    if (!exercise) return

    const newWorkoutExercise: WorkoutExercise = {
      exerciseId: exercise.id,
      exercise,
      sets: 1,
      reps: [10],
      weight: [0],
      distance: exercise.category === "cardio" ? 0 : undefined,
      duration: exercise.category === "cardio" ? 0 : undefined,
    }

    setWorkoutExercises([...workoutExercises, newWorkoutExercise])
    setSelectedExerciseId("")
  }

  const removeExercise = (index: number) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index))
  }

  const updateExercise = (index: number, field: keyof WorkoutExercise, value: any) => {
    const updated = [...workoutExercises]
    updated[index] = { ...updated[index], [field]: value }
    setWorkoutExercises(updated)
  }

  const updateReps = (exerciseIndex: number, setIndex: number, value: number) => {
    const updated = [...workoutExercises]
    const newReps = [...updated[exerciseIndex].reps]
    newReps[setIndex] = value
    updated[exerciseIndex].reps = newReps
    setWorkoutExercises(updated)
  }

  const updateWeight = (exerciseIndex: number, setIndex: number, value: number) => {
    const updated = [...workoutExercises]
    const newWeight = [...updated[exerciseIndex].weight]
    newWeight[setIndex] = value
    updated[exerciseIndex].weight = newWeight
    setWorkoutExercises(updated)
  }

  const addSet = (exerciseIndex: number) => {
    const updated = [...workoutExercises]
    updated[exerciseIndex].reps.push(10)
    updated[exerciseIndex].weight.push(0)
    updated[exerciseIndex].sets += 1
    setWorkoutExercises(updated)
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...workoutExercises]
    updated[exerciseIndex].reps.splice(setIndex, 1)
    updated[exerciseIndex].weight.splice(setIndex, 1)
    updated[exerciseIndex].sets -= 1
    setWorkoutExercises(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workoutName.trim() || workoutExercises.length === 0) {
      setError("Please provide a workout name and add at least one exercise")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create workout
      const { data: workout, error: workoutError } = await supabase
        .from("workouts")
        .insert({
          user_id: userId,
          name: workoutName.trim(),
          notes: workoutNotes.trim() || null,
          duration_minutes: duration ? Number.parseInt(duration) : null,
        })
        .select()
        .single()

      if (workoutError) throw workoutError

      // Create workout exercises
      const workoutExerciseData = workoutExercises.map((we) => ({
        workout_id: workout.id,
        exercise_id: we.exerciseId,
        sets: we.sets,
        reps: we.reps,
        weight: we.weight,
        distance: we.distance || null,
        duration_seconds: we.duration ? we.duration * 60 : null,
      }))

      const { error: exerciseError } = await supabase.from("workout_exercises").insert(workoutExerciseData)

      if (exerciseError) throw exerciseError

      router.push("/workouts")
    } catch (error: any) {
      setError(error.message || "Failed to save workout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workout Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="workout-name">Workout Name</Label>
            <Input
              id="workout-name"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              placeholder="e.g., Upper Body Strength"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="How did the workout feel? Any observations..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Select value={selectedExerciseId} onValueChange={setSelectedExerciseId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select an exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {exercise.category}
                      </Badge>
                      {exercise.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={addExercise} disabled={!selectedExerciseId}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {workoutExercises.map((we, exerciseIndex) => (
              <Card key={exerciseIndex}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs">{we.exercise.category}</Badge>
                      <span className="font-medium">{we.exercise.name}</span>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeExercise(exerciseIndex)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {we.exercise.category === "cardio" ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Distance (miles)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={we.distance || 0}
                          onChange={(e) =>
                            updateExercise(exerciseIndex, "distance", Number.parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                      <div>
                        <Label>Duration (minutes)</Label>
                        <Input
                          type="number"
                          value={we.duration || 0}
                          onChange={(e) =>
                            updateExercise(exerciseIndex, "duration", Number.parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Sets & Reps</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => addSet(exerciseIndex)}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Set
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: we.sets }).map((_, setIndex) => (
                          <div key={setIndex} className="flex items-center gap-2">
                            <span className="text-sm font-medium w-12">Set {setIndex + 1}:</span>
                            <Input
                              type="number"
                              placeholder="Reps"
                              value={we.reps[setIndex] || 0}
                              onChange={(e) =>
                                updateReps(exerciseIndex, setIndex, Number.parseInt(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                            <span className="text-sm">reps @</span>
                            <Input
                              type="number"
                              placeholder="Weight"
                              value={we.weight[setIndex] || 0}
                              onChange={(e) =>
                                updateWeight(exerciseIndex, setIndex, Number.parseInt(e.target.value) || 0)
                              }
                              className="w-20"
                            />
                            <span className="text-sm">lbs</span>
                            {we.sets > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSet(exerciseIndex, setIndex)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Workout"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
