import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { ConditionalLayout } from "@/components/conditional-layout"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Workout Tracker - Track Your Fitness Journey",
  description: "Log workouts, track progress, and achieve your fitness goals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <Suspense fallback={null}>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
