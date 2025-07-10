"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Star,
  DollarSign,
  Calendar
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import {
  IncomeTrackerChart,
  UserGrowthChart,
  ProposalProgressChart
} from '@/components/admin/charts'
import {
  MetricCard
} from '@/components/ui/premium-components'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context'


// Mock data for charts
const enrollmentData = [
  { name: 'Jan', value: 45 },
  { name: 'Feb', value: 52 },
  { name: 'Mar', value: 48 },
  { name: 'Apr', value: 61 },
  { name: 'May', value: 55 },
  { name: 'Jun', value: 67 },
]

const revenueData = [
  { name: 'Mon', value: 120 },
  { name: 'Tue', value: 190 },
  { name: 'Wed', value: 300 },
  { name: 'Thu', value: 250 },
  { name: 'Fri', value: 400 },
  { name: 'Sat', value: 200 },
  { name: 'Sun', value: 150 },
]

export default function InstructorDashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { userProfile } = useAuth()





  const recentCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      students: 89,
      rating: 4.9,
      status: "published",
      lastUpdated: "2 days ago",
      progress: 85,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      students: 67,
      rating: 4.7,
      status: "published",
      lastUpdated: "1 week ago",
      progress: 92,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Node.js Masterclass",
      students: 0,
      rating: 0,
      status: "draft",
      lastUpdated: "3 days ago",
      progress: 45,
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=100&h=100&fit=crop&crop=center"
    }
  ]

  const recentStudents = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      course: "React Fundamentals",
      enrolledAt: "2 hours ago",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      progress: 75
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      course: "Advanced JavaScript",
      enrolledAt: "5 hours ago",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
      progress: 45
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@example.com",
      course: "React Fundamentals",
      enrolledAt: "1 day ago",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      progress: 90
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Dashboard"
            subtitle={`Welcome back, ${userProfile?.name || 'Instructor'}! Here's what's happening with your courses.`}
          />
          
          <main className="flex-1 overflow-y-auto bg-instructor">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              {/* Premium Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl p-8 text-white gradient-instructor shadow-xl"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white/10 opacity-50" />
                <div className="absolute -top-4 -right-4 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-white/5 rounded-full" />

                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">
                          {userProfile?.name?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-3xl font-bold mb-2">
                          Welcome back, {userProfile?.name || 'Instructor'}! 🎓
                        </h1>
                        <p className="text-white/90 text-lg">
                          Ready to inspire minds and shape the future of learning?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule
                      </Button>
                      <Button className="bg-white text-red-600 hover:bg-white/90 font-semibold">
                        Create Course
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                  title="Total Students"
                  value="1,247"
                  subtitle="Active learners"
                  icon={Users}
                  trend={{ value: "+12%", direction: "up" }}
                  gradient="instructor"
                />
                <MetricCard
                  title="Course Revenue"
                  value="$15,230"
                  subtitle="This month"
                  icon={DollarSign}
                  trend={{ value: "+8%", direction: "up" }}
                  gradient="instructor"
                />
                <MetricCard
                  title="Course Rating"
                  value="4.9"
                  subtitle="Average rating"
                  icon={Star}
                  trend={{ value: "+0.2", direction: "up" }}
                  gradient="instructor"
                />
                <MetricCard
                  title="Active Courses"
                  value="8"
                  subtitle="Published courses"
                  icon={BookOpen}
                  trend={{ value: "+2", direction: "up" }}
                  gradient="instructor"
                />
              </div>

              {/* Let's Connect Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                {/* Let's Connect */}
                <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        Let's Connect
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                        See all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentStudents.slice(0, 2).map((student) => (
                      <div key={student.id} className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{student.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Cybersecurity specialist</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Unlock Premium Features */}
                <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Unlock Premium Features
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Get access to exclusive benefits and expand your freelancing opportunities
                    </p>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white">
                      Upgrade now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Income Tracker - Takes 2 columns */}
                <div className="lg:col-span-2">
                  <IncomeTrackerChart
                    title="Income Tracker"
                    description="Track changes in income over time and access detailed data on each project and payments received"
                    data={enrollmentData}
                  />
                </div>

                {/* Recent Projects Sidebar */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-sm bg-white dark:bg-gray-800">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Your Recent Projects
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="text-gray-500 dark:text-gray-400">
                            See all Project
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {recentCourses.slice(0, 3).map((course) => (
                          <div key={course.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{course.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">${(course.students * 50).toLocaleString()}/hour</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {course.status === 'published' ? 'Paid' : 'Not Paid'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  Remote
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>

              {/* Revenue and Subscriptions Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                <UserGrowthChart
                  title="Revenue & Subscriptions"
                  description="Track your revenue and subscription growth"
                  data={enrollmentData}
                />
                <ProposalProgressChart
                  title="Course Progress"
                  description="Track your course creation and student engagement"
                  data={revenueData}
                />
              </motion.div>


            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}