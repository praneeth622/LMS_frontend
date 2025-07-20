"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Building2, 
  Activity, 
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProtectedRoute } from '@/components/auth/protected-route'
// import { AdminSidebar } from '@/components/admin/sidebar'
import { AdminHeader } from '@/components/admin/header'
import { StatsCards } from '@/components/admin/stats-cards'
import { 
  UserGrowthChart, 
  ActivityChart, 
  RoleDistributionChart, 
  SystemMetricsChart 
} from '@/components/admin/charts'
import { adminApiExtended } from '@/lib/admin-api-extended'
import { adminApi } from "@/lib/admin-api"

// Mock data for charts
const userGrowthData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
]

const activityData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 190 },
  { name: 'Wed', value: 300 },
  { name: 'Thu', value: 250 },
  { name: 'Fri', value: 400 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 150 },
]

const roleDistributionData = [
  { name: 'Students', value: 65 },
  { name: 'Instructors', value: 25 },
  { name: 'Admins', value: 10 },
]

const systemMetricsData = [
  { name: '00:00', value: 30, cpu: 30, memory: 45, disk: 20 },
  { name: '04:00', value: 25, cpu: 25, memory: 40, disk: 22 },
  { name: '08:00', value: 60, cpu: 60, memory: 70, disk: 25 },
  { name: '12:00', value: 80, cpu: 80, memory: 85, disk: 30 },
  { name: '16:00', value: 70, cpu: 70, memory: 75, disk: 28 },
  { name: '20:00', value: 45, cpu: 45, memory: 55, disk: 24 },
]

export default function AdminDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [stats, setStats] = React.useState([
    {
      title: "Total Users",
      value: "1,234",
      change: "+20.1% from last month",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-primary"
    },
    {
      title: "Organizations",
      value: "89",
      change: "+5 new this month",
      changeType: "positive" as const,
      icon: Building2,
      color: "bg-success"
    },
    {
      title: "Active Sessions",
      value: "2,456",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Activity,
      color: "bg-info"
    },
    {
      title: "Total Courses",
      value: "156",
      change: "-2.3% from last month",
      changeType: "negative" as const,
      icon: BookOpen,
      color: "bg-secondary"
    }
  ])

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        
        // Fetch users data
        const usersResponse = await adminApi.getAllUsers()
        if (usersResponse.success) {
          const totalUsers = usersResponse.data.length
          const activeUsers = usersResponse.data.filter(user => !user.is_deleted).length
          
          // Update stats with real data
          setStats(prev => prev.map(stat => {
            if (stat.title === "Total Users") {
              return { ...stat, value: totalUsers.toString() }
            }
            if (stat.title === "Active Sessions") {
              return { ...stat, value: activeUsers.toString() }
            }
            return stat
          }))
        }

        // Fetch organizations data
        try {
          const orgsResponse = await adminApi.getAllOrganizations()
          if (orgsResponse.success) {
            setStats(prev => prev.map(stat => {
              if (stat.title === "Organizations") {
                return { ...stat, value: orgsResponse.data.length.toString() }
              }
              return stat
            }))
          }
        } catch (error) {
          console.warn('Organizations endpoint not available')
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <ProtectedRoute allowedRoles={[1]}>
      <div 
        className="flex h-screen bg-gradient-to-br from-background via-muted/8 to-background"
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {/* <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        /> */}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="Admin Dashboard"
            subtitle="System Command Center - Monitor platform performance and manage your LMS infrastructure"
          />
          
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Enhanced Admin Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-white bg-gradient-to-br from-primary via-primary/90 to-violet-600 shadow-2xl"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10 opacity-50" />
                <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                      <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                        <Shield className="h-12 w-12 text-white" />
                      </div>
                      <div>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                          System Command Center 🛡️
                        </h1>
                        <p className="text-white/90 text-2xl leading-relaxed">
                          Complete oversight of platform operations and user management
                        </p>
                        <div className="flex items-center gap-4 mt-6">
                          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                            <Activity className="h-4 w-4 mr-2" />
                            System Online
                          </Badge>
                          <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                            <Shield className="h-4 w-4 mr-2" />
                            Admin Access
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex-1 lg:flex-none px-8 py-4 text-lg">
                        <Activity className="h-6 w-6 mr-3" />
                        System Health
                      </Button>
                      <Button className="bg-white text-primary hover:bg-white/90 font-semibold flex-1 lg:flex-none px-8 py-4 text-lg">
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Stats Cards with better spacing */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
                  >
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${stat.color} shadow-lg transition-transform duration-300 group-hover:scale-105`}>
                          <stat.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">{stat.value}</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">{stat.title}</h3>
                        <p className={`text-sm flex items-center gap-2 ${
                          stat.changeType === 'positive' ? 'text-success' : 'text-error'
                        }`}>
                          {stat.changeType === 'positive' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                          {stat.change}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Charts Grid with better spacing */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
                >
                  <div className="p-6 bg-gradient-to-r from-muted/10 to-muted/5 rounded-t-3xl">
                    <UserGrowthChart
                      title="User Growth Analytics"
                      description="Monthly user registration trends and detailed analytics"
                      data={userGrowthData}
                      loading={loading}
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
                >
                  <div className="p-6 bg-gradient-to-r from-muted/10 to-muted/5 rounded-t-3xl">
                    <ActivityChart
                      title="Weekly Activity Insights"
                      description="User engagement patterns and activity analytics"
                      data={activityData}
                      loading={loading}
                    />
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
                >
                  <div className="p-6 bg-gradient-to-r from-muted/10 to-muted/5 rounded-t-3xl">
                    <RoleDistributionChart
                      title="User Role Distribution"
                      description="Platform user composition and detailed role breakdown"
                      data={roleDistributionData}
                      loading={loading}
                    />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
                >
                  <div className="p-6 bg-gradient-to-r from-muted/10 to-muted/5 rounded-t-3xl">
                    <SystemMetricsChart
                      title="System Performance Metrics"
                      description="Real-time infrastructure health and performance monitoring"
                      data={systemMetricsData}
                      loading={loading}
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}