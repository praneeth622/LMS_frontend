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
  Minus
} from "lucide-react"
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
      color: "bg-blue-500"
    },
    {
      title: "Organizations",
      value: "89",
      change: "+5 new this month",
      changeType: "positive" as const,
      icon: Building2,
      color: "bg-green-500"
    },
    {
      title: "Active Sessions",
      value: "2,456",
      change: "+12.5% from last month",
      changeType: "positive" as const,
      icon: Activity,
      color: "bg-orange-500"
    },
    {
      title: "Total Courses",
      value: "156",
      change: "-2.3% from last month",
      changeType: "negative" as const,
      icon: BookOpen,
      color: "bg-purple-500"
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
        className="flex h-screen bg-[#F8F9FA]"
        style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      >
        {/* <AdminSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        /> */}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader 
            title="Dashboard Overview"
            subtitle="Welcome to your admin dashboard"
          />
          
          <main className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-[#E8EAED] shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#1F2937] leading-tight">{stat.value}</div>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1F2937] mb-2">{stat.title}</h3>
                      <p className="text-sm text-[#6B7280] leading-relaxed">{stat.change}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-2xl border border-[#E8EAED] shadow-sm"
                >
                  <UserGrowthChart
                    title="User Growth"
                    description="Monthly user registration trends"
                    data={userGrowthData}
                    loading={loading}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl border border-[#E8EAED] shadow-sm"
                >
                  <ActivityChart
                    title="Weekly Activity"
                    description="User activity over the past week"
                    data={activityData}
                    loading={loading}
                  />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-2xl border border-[#E8EAED] shadow-sm"
                >
                  <RoleDistributionChart
                    title="User Role Distribution"
                    description="Breakdown of users by role"
                    data={roleDistributionData}
                    loading={loading}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-2xl border border-[#E8EAED] shadow-sm"
                >
                  <SystemMetricsChart
                    title="System Performance"
                    description="Real-time system metrics"
                    data={systemMetricsData}
                    loading={loading}
                  />
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}