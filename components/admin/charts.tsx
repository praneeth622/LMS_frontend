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
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Calendar } from "lucide-react"

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4']

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
}

// Modern Income Tracker Component
export function IncomeTrackerChart({ title, description, data, loading = false }: ChartProps) {
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
  const weeklyGrowth = 20 // Mock data for growth percentage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/95 rounded-3xl overflow-hidden">
        <CardHeader className="pb-4 bg-gradient-to-r from-muted/10 to-muted/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {description}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              Week
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Metric */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                ${totalValue.toLocaleString()}
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{weeklyGrowth}%
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This week's income is higher than last week's
                </span>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Day Labels */}
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              {data.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-1">
                    {item.name.charAt(0)}
                  </div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Modern Revenue Card Component
export function RevenueCard({ title, description, data, loading = false }: ChartProps) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[120px] bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  const totalRevenue = 15231.89
  const growthPercentage = 20.1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 h-full">
        <CardHeader className="pb-2">
          <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
            Total Revenue
          </CardDescription>
          <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            ${totalRevenue.toLocaleString()}
          </CardTitle>
          <CardDescription className="text-green-600 dark:text-green-400 text-sm font-medium">
            +{growthPercentage}% from last month
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#ffffff"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, stroke: "#ffffff", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Modern Subscriptions Card Component
export function SubscriptionsCard({ title, description, data, loading = false }: ChartProps) {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="h-[120px] bg-muted rounded animate-pulse"></div>
        </CardContent>
      </Card>
    )
  }

  const totalSubscriptions = 2350
  const growthPercentage = 180.1

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800 h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                Subscriptions
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                +{totalSubscriptions.toLocaleString()}
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400 text-sm font-medium">
                +{growthPercentage}% from last month
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
              View More
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#ffffff"
                  fill="#ffffff"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function UserGrowthChart({ title, description, data, loading = false }: ChartProps) {
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
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-card to-card/95 rounded-3xl shadow-lg border-0 overflow-hidden"
    >
      <div className="p-6 bg-gradient-to-r from-muted/10 to-muted/5">
        <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
        {description && <CardDescription className="text-muted-foreground mt-2">{description}</CardDescription>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 p-6">
        <RevenueCard title="Revenue" data={data} />
        <SubscriptionsCard title="Subscriptions" data={data} />
      </div>
    </motion.div>
  )
}

// Modern Proposal Progress Component
export function ProposalProgressChart({ title, description, data, loading = false }: ChartProps) {
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

  const proposalData = [
    { label: "Proposals sent", value: 64, color: "#E5E7EB" },
    { label: "Interviews", value: 12, color: "#F59E0B" },
    { label: "Hires", value: 10, color: "#1F2937" }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Proposal Progress
              </CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4 mr-2" />
              April 11, 2024
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {proposalData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.label}
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {item.value}
                  </span>
                </div>
                <div className="h-16">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{ value: item.value }]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <Bar
                        dataKey="value"
                        fill={item.color}
                        radius={[2, 2, 2, 2]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function ActivityChart({ title, description, data, loading = false }: ChartProps) {
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/95 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/10 to-muted/5">
          <CardTitle className="text-xl font-bold text-foreground">
            {title}
          </CardTitle>
          {description && (
            <CardDescription className="text-muted-foreground">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function RoleDistributionChart({ title, description, data, loading = false }: ChartProps) {
  if (loading) {
    return (
      <Card>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/95 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/10 to-muted/5">
          <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function SystemMetricsChart({ title, description, data, loading = false }: ChartProps) {
  if (loading) {
    return (
      <Card>
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/95 rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-muted/10 to-muted/5">
          <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
          {description && <CardDescription className="text-muted-foreground">{description}</CardDescription>}
        </CardHeader>
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke={COLORS[0]} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="memory" stroke={COLORS[1]} strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="disk" stroke={COLORS[2]} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}