"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Sparkles,
  Zap,
  Target,
  Award,
  Star,
  Users,
  BookOpen,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PremiumCardProps {
  title: string
  value: string | number
  change?: string
  trend?: "up" | "down" | "neutral"
  icon?: React.ElementType
  gradient?: "primary" | "admin" | "instructor"
  className?: string
  children?: React.ReactNode
}

export function PremiumStatsCard({ 
  title, 
  value, 
  change, 
  trend = "neutral", 
  icon: Icon = TrendingUp,
  gradient = "primary",
  className 
}: PremiumCardProps) {
  const gradientClasses = {
    primary: "gradient-primary",
    admin: "gradient-admin", 
    instructor: "gradient-instructor"
  }

  const glowClasses = {
    primary: "shadow-glow",
    admin: "shadow-admin-glow",
    instructor: "shadow-instructor-glow"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("group", className)}
    >
      <Card className="card-premium hover:shadow-premium group-hover:scale-105 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center",
              gradientClasses[gradient]
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            {trend !== "neutral" && (
              <div className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium",
                trend === "up" 
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "bg-error/10 text-error dark:bg-error/20 dark:text-error-foreground"
              )}>
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-foreground">{value}</h3>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {change && trend === "neutral" && (
              <p className="text-xs text-muted-foreground">{change}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = true }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "glass-card rounded-2xl p-6",
        hover && "hover:shadow-premium hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {children}
    </motion.div>
  )
}

interface AnimatedProgressProps {
  value: number
  max?: number
  label?: string
  color?: "primary" | "admin" | "instructor"
  showPercentage?: boolean
  className?: string
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  label, 
  color = "primary",
  showPercentage = true,
  className 
}: AnimatedProgressProps) {
  const percentage = Math.round((value / max) * 100)
  
  const colorClasses = {
    primary: "bg-emerald-500",
    admin: "bg-indigo-500",
    instructor: "bg-red-500"
  }

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && (
            <span className="text-sm text-muted-foreground">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full", colorClasses[color])}
        />
      </div>
    </div>
  )
}

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ElementType
  gradient?: "primary" | "admin" | "instructor"
  onClick?: () => void
  className?: string
}

export function FeatureCard({ 
  title, 
  description, 
  icon: Icon, 
  gradient = "primary",
  onClick,
  className 
}: FeatureCardProps) {
  const gradientClasses = {
    primary: "gradient-primary",
    admin: "gradient-admin",
    instructor: "gradient-instructor"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn("cursor-pointer", className)}
      onClick={onClick}
    >
      <Card className="card-premium group">
        <CardContent className="p-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center mb-4",
            gradientClasses[gradient]
          )}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
            Learn more
            <ArrowUpRight className="h-4 w-4 ml-1" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  trend?: {
    value: string
    direction: "up" | "down"
  }
  gradient?: "primary" | "admin" | "instructor"
  className?: string
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  gradient = "primary",
  className 
}: MetricCardProps) {
  const gradientClasses = {
    primary: "from-emerald-500 to-teal-500",
    admin: "from-indigo-500 to-purple-500",
    instructor: "from-amber-500 to-orange-500"
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("group", className)}
    >
      <div className={cn(
        "relative overflow-hidden rounded-2xl p-6 text-white",
        `bg-gradient-to-br ${gradientClasses[gradient]}`,
        "hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
      )}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <Icon className="h-8 w-8 text-white/90" />
            {trend && (
              <div className="flex items-center space-x-1 text-white/90">
                {trend.direction === "up" ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{trend.value}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl font-bold">{value}</h3>
            <p className="text-white/90 font-medium">{title}</p>
            {subtitle && (
              <p className="text-white/70 text-sm">{subtitle}</p>
            )}
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
      </div>
    </motion.div>
  )
}
