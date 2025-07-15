"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Calendar, MoreHorizontal } from "lucide-react"

interface ChartData {
  name: string
  value: number
  [key: string]: any
}

interface ChartProps {
  title: string
  description?: string
  data: ChartData[]
  loading?: boolean
  className?: string
  role?: "student" | "instructor" | "admin"
}

export function PremiumAreaChart({ 
  title, 
  description, 
  data, 
  loading = false,
  className,
  role = "student"
}: ChartProps) {
  const [hoveredData, setHoveredData] = React.useState<any>(null)
  
  const roleColors = {
    student: {
      gradient: ["#10B981", "#059669"],
      stroke: "#10B981",
      fill: "#10B981"
    },
    instructor: {
      gradient: ["#EF4444", "#F97316"],
      stroke: "#EF4444",
      fill: "#EF4444"
    },
    admin: {
      gradient: ["#6366F1", "#8B5CF6"],
      stroke: "#6366F1",
      fill: "#6366F1"
    }
  }
  
  const currentColors = roleColors[role]
  
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  const totalValue = data.reduce((sum, item) => sum + item.value, 0)
  const averageValue = Math.round(totalValue / data.length)
  const maxValue = Math.max(...data.map(item => item.value))
  
  // Calculate growth percentage
  const firstValue = data[0]?.value || 0
  const lastValue = data[data.length - 1]?.value || 0
  const growthPercentage = firstValue === 0 ? 0 : Math.round(((lastValue - firstValue) / firstValue) * 100)
  const trend = growthPercentage >= 0 ? "up" : "down"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-0 shadow-lg bg-card dark:bg-card hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">{title}</CardTitle>
              {description && (
                <CardDescription className="text-sm mt-1">
                  {description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={trend === "up" ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1",
                  trend === "up" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : 
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(growthPercentage)}%
              </Badge>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold">{totalValue.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average</p>
              <p className="text-2xl font-bold">{averageValue.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Peak</p>
              <p className="text-2xl font-bold">{maxValue.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                onMouseMove={(e) => {
                  if (e.activePayload) {
                    setHoveredData(e.activePayload[0].payload)
                  }
                }}
                onMouseLeave={() => setHoveredData(null)}
              >
                <defs>
                  <linearGradient id={`colorGradient-${role}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentColors.fill} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={currentColors.fill} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  dx={-10}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    marginBottom: '4px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={currentColors.stroke}
                  strokeWidth={3}
                  fill={`url(#colorGradient-${role})`}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Time Period Selector */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                Day
              </Button>
              <Button variant="outline" size="sm" className="h-8 bg-muted/50">
                Week
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Month
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                Year
              </Button>
            </div>
            <Button variant="outline" size="sm" className="h-8 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <span>Custom</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function PremiumBarChart({ 
  title, 
  description, 
  data, 
  loading = false,
  className,
  role = "student"
}: ChartProps) {
  const roleColors = {
    student: "#10B981",
    instructor: "#EF4444",
    admin: "#6366F1"
  }
  
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="border-0 shadow-lg bg-card dark:bg-card hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-sm mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="value" 
                  fill={roleColors[role]}
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
