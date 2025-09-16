"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Flame, Trophy, Target, Zap } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  user: any
  profile: any
  workoutStats: any[]
}

export function HeroSection({ user, profile, workoutStats }: HeroSectionProps) {
  const totalWorkouts = workoutStats?.length || 0
  const thisWeekWorkouts =
    workoutStats?.filter((w) => {
      const workoutDate = new Date(w.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return workoutDate >= weekAgo
    }).length || 0

  const motivationalQuotes = [
    "Push yourself because no one else is going to do it for you!",
    "Great things never come from comfort zones!",
    "Don't stop when you're tired. Stop when you're done!",
    "The only bad workout is the one that didn't happen!",
    "Your body can do it. It's your mind you need to convince!",
  ]

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-apple-mesh opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
      <div className="absolute inset-0 bg-[url('/abstract-fitness-pattern.png')] opacity-5" />

      <Card className="relative border-0 glass-card shadow-glass-lg text-primary-foreground">
        <div className="glass-overlay">
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                    Welcome back, {profile?.full_name?.split(" ")[0] || "Champion"}! 🔥
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-md">
                    {randomQuote}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold glass border-white/30 text-white shadow-glass"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {totalWorkouts} Total Workouts
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold glass border-white/30 text-white shadow-glass"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    {thisWeekWorkouts} This Week
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold glass border-white/30 text-white shadow-glass"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    On Fire!
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="glass-card text-primary hover:glass shadow-glass text-lg px-8 py-6 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/workouts/new">
                      <Target className="w-5 h-5 mr-2" />
                      Start Today's Workout
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="w-64 h-64 glass rounded-full flex items-center justify-center shadow-glass-lg">
                  <div className="w-48 h-48 glass-card rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 gradient-apple-warm rounded-full flex items-center justify-center shadow-glass">
                      <Flame className="w-16 h-16 text-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
