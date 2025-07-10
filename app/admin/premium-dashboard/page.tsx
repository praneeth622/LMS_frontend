"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Settings,
  Crown
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PremiumLayout, PremiumSection, PremiumGrid } from '@/components/ui/premium-layout'
import { 
  PremiumStatsCard, 
  MetricCard,
  GlassCard,
  AnimatedProgress,
  FeatureCard
} from '@/components/ui/premium-components'
import { PremiumAreaChart, PremiumBarChart } from '@/components/ui/premium-charts'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context'

// Mock data for admin charts
const platformGrowthData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1800 },
  { name: "Mar", value: 2400 },
  { name: "Apr", value: 3200 },
  { name: "May", value: 4100 },
  { name: "Jun", value: 5200 },
  { name: "Jul", value: 6800 }
]

const revenueData = [
  { name: "Courses", value: 45000 },
  { name: "Subscriptions", value: 32000 },
  { name: "Certifications", value: 18000 },
  { name: "Enterprise", value: 25000 },
  { name: "Partnerships", value: 12000 }
]

const topInstructors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Data Science",
    students: 2847,
    rating: 4.9,
    revenue: 45200,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    specialty: "Web Development",
    students: 3241,
    rating: 4.8,
    revenue: 52100,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Machine Learning",
    students: 1923,
    rating: 4.9,
    revenue: 38900,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
]

const systemMetrics = [
  { label: "Server Uptime", value: 99.9, color: "admin" },
  { label: "User Satisfaction", value: 94, color: "admin" },
  { label: "Course Completion", value: 87, color: "admin" },
  { label: "Platform Performance", value: 96, color: "admin" }
]

export default function AdminPremiumDashboard() {
  const { user, userProfile } = useAuth()

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <PremiumLayout role="admin">
        {/* Premium Admin Header */}
        <PremiumSection>
          <div className="relative overflow-hidden rounded-3xl p-8 text-white gradient-admin shadow-xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-white/10 opacity-50" />
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/5 rounded-full" />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold mb-3">
                      Admin Command Center
                    </h1>
                    <p className="text-white/90 text-xl">
                      Monitor, manage, and optimize your learning platform
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Shield className="h-3 w-3 mr-1" />
                        Super Admin
                      </Badge>
                      <Badge className="bg-white/20 text-white border-white/30">
                        <Activity className="h-3 w-3 mr-1" />
                        All Systems Operational
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button className="bg-white text-indigo-600 hover:bg-white/90 font-semibold">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </PremiumSection>

        {/* Premium Stats Grid */}
        <PremiumSection>
          <PremiumGrid columns={4}>
            <MetricCard
              title="Total Users"
              value="24,847"
              subtitle="Active learners"
              icon={Users}
              trend={{ value: "+15%", direction: "up" }}
              gradient="admin"
            />
            <MetricCard
              title="Platform Revenue"
              value="$142,500"
              subtitle="This month"
              icon={DollarSign}
              trend={{ value: "+23%", direction: "up" }}
              gradient="admin"
            />
            <MetricCard
              title="Course Catalog"
              value="1,247"
              subtitle="Published courses"
              icon={BookOpen}
              trend={{ value: "+8%", direction: "up" }}
              gradient="admin"
            />
            <MetricCard
              title="Completion Rate"
              value="87.3%"
              subtitle="Average completion"
              icon={Target}
              trend={{ value: "+5%", direction: "up" }}
              gradient="admin"
            />
          </PremiumGrid>
        </PremiumSection>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <PremiumAreaChart
              title="Platform Growth"
              description="User registration and engagement over time"
              data={platformGrowthData}
              role="admin"
            />
            
            <PremiumBarChart
              title="Revenue Breakdown"
              description="Revenue distribution across different services"
              data={revenueData}
              role="admin"
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* System Health */}
            <GlassCard>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-600" />
                System Health
              </h3>
              <div className="space-y-4">
                {systemMetrics.map((metric, index) => (
                  <AnimatedProgress
                    key={index}
                    label={metric.label}
                    value={metric.value}
                    color={metric.color as "admin"}
                    showPercentage
                  />
                ))}
              </div>
            </GlassCard>
            
            {/* Top Instructors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Top Instructors</h3>
              <div className="space-y-3">
                {topInstructors.map((instructor, index) => (
                  <div 
                    key={instructor.id}
                    className="bg-card dark:bg-card border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 border-2 border-indigo-200 dark:border-indigo-800">
                        <AvatarImage src={instructor.avatar} alt={instructor.name} />
                        <AvatarFallback className="gradient-admin text-white">
                          {instructor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{instructor.name}</h4>
                        <p className="text-xs text-muted-foreground">{instructor.specialty}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {instructor.students.toLocaleString()} students
                          </span>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs font-medium">{instructor.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600 dark:text-green-400">
                          ${instructor.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">revenue</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <FeatureCard
                  title="User Management"
                  description="Manage users and permissions"
                  icon={Users}
                  gradient="admin"
                />
                <FeatureCard
                  title="Course Review"
                  description="Review pending courses"
                  icon={BookOpen}
                  gradient="admin"
                />
                <FeatureCard
                  title="Analytics"
                  description="View detailed reports"
                  icon={BarChart3}
                  gradient="admin"
                />
                <FeatureCard
                  title="System Config"
                  description="Configure platform settings"
                  icon={Settings}
                  gradient="admin"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </PremiumLayout>
    </ProtectedRoute>
  )
}
