"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Dynamic import to avoid SSR issues
let LiquidGlass: any = null

interface LiquidGlassWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  intensity?: 'light' | 'medium' | 'strong'
}

export function LiquidGlassWrapper({
  children,
  className,
  displacementScale,
  blurAmount,
  saturation,
  aberrationIntensity,
  elasticity,
  cornerRadius,
  intensity = 'medium',
  ...props
}: LiquidGlassWrapperProps) {
  const [isClient, setIsClient] = useState(false)
  const [LiquidGlassComponent, setLiquidGlassComponent] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    // Dynamic import to avoid SSR issues
    import('liquid-glass-react')
      .then((module) => {
        setLiquidGlassComponent(() => module.default)
      })
      .catch((error) => {
        console.warn('Failed to load liquid-glass-react:', error)
      })
  }, [])

  // Preset configurations for different intensities
  const presets = {
    light: {
      displacementScale: 32,
      blurAmount: 0.05,
      saturation: 120,
      aberrationIntensity: 0.3,
      elasticity: 0.4,
      cornerRadius: 12,
    },
    medium: {
      displacementScale: 48,
      blurAmount: 0.08,
      saturation: 125,
      aberrationIntensity: 0.5,
      elasticity: 0.6,
      cornerRadius: 16,
    },
    strong: {
      displacementScale: 64,
      blurAmount: 0.12,
      saturation: 130,
      aberrationIntensity: 0.7,
      elasticity: 0.8,
      cornerRadius: 20,
    },
  }

  const settings = presets[intensity]

  // If not client-side or component not loaded, render fallback with glass effect
  if (!isClient || !LiquidGlassComponent) {
    return (
      <div 
        className={cn(
          "relative bg-card/80 backdrop-blur-md border border-border/50 text-card-foreground shadow-lg rounded-xl w-full h-auto",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }

  // Render with LiquidGlass effect
  try {
    return (
      <div className={cn("relative w-full h-auto", className)} {...props}>
        <LiquidGlassComponent
          displacementScale={displacementScale ?? settings.displacementScale}
          blurAmount={blurAmount ?? settings.blurAmount}
          saturation={saturation ?? settings.saturation}
          aberrationIntensity={aberrationIntensity ?? settings.aberrationIntensity}
          elasticity={elasticity ?? settings.elasticity}
          cornerRadius={cornerRadius ?? settings.cornerRadius}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          <div style={{ width: '100%', height: '100%' }}>
            {children}
          </div>
        </LiquidGlassComponent>
      </div>
    )
  } catch (error) {
    console.warn('LiquidGlass render error:', error)
    // Fallback to regular glass effect
    return (
      <div 
        className={cn(
          "relative bg-card/80 backdrop-blur-md border border-border/50 text-card-foreground shadow-lg rounded-xl w-full h-auto",
          className
        )} 
        {...props}
      >
        {children}
      </div>
    )
  }
}

// Specialized component for cards with liquid glass effect
export function LiquidGlassCard({
  children,
  className,
  intensity = 'light',
  ...props
}: LiquidGlassWrapperProps) {
  return (
    <LiquidGlassWrapper
      className={cn(
        "bg-card/80 backdrop-blur-md border border-border/50 text-card-foreground shadow-lg",
        className
      )}
      intensity={intensity}
      {...props}
    >
      {children}
    </LiquidGlassWrapper>
  )
}

// Specialized component for buttons with liquid glass effect
export function LiquidGlassButton({
  children,
  className,
  intensity = 'medium',
  ...props
}: LiquidGlassWrapperProps) {
  return (
    <LiquidGlassWrapper
      className={cn(
        "bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm border border-primary/20",
        className
      )}
      intensity={intensity}
      cornerRadius={8}
      {...props}
    >
      {children}
    </LiquidGlassWrapper>
  )
}