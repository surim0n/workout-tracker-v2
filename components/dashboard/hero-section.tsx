"use client"

import { useState, useEffect } from "react"
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
  const [quote, setQuote] = useState("Your body can do it. It's your mind you need to convince!")
  const [isClient, setIsClient] = useState(false)
  
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

  useEffect(() => {
    setIsClient(true)
    // Only set random quote on client side to avoid hydration issues
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600" />
      <div className="absolute inset-0 bg-gradient-to-tl from-amber-300/80 via-pink-400/60 to-purple-500/80" />
      <div className="absolute inset-0 bg-[url('/abstract-fitness-pattern.png')] opacity-10" />

      <Card className="relative text-white border-0 bg-transparent shadow-2xl">
        <div className="backdrop-blur-sm bg-white/10 rounded-xl">
          <div className="p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow-lg">
                    Welcome back, {profile?.full_name?.split(" ")[0] || "Champion"}! 🔥
                  </h1>
                  <p className="text-xl md:text-2xl text-white/90 font-medium max-w-2xl drop-shadow-md">
                    {quote}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-md border-white/40 text-white shadow-lg"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    {totalWorkouts} Total Workouts
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-md border-white/40 text-white shadow-lg"
                  >
                    <Flame className="w-4 h-4 mr-2" />
                    {thisWeekWorkouts} This Week
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="px-4 py-2 text-sm font-semibold bg-white/20 backdrop-blur-md border-white/40 text-white shadow-lg"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    On Fire!
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white/90 hover:bg-white text-orange-600 hover:text-orange-700 shadow-xl text-lg px-8 py-6 rounded-xl font-bold transition-all duration-300 hover:scale-105"
                  >
                    <Link href="/workouts/new">
                      <Target className="w-5 h-5 mr-2" />
                      Start Today's Workout
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="w-64 h-64 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-48 h-48 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
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
