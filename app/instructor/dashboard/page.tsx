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
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true)
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
      <div className="flex h-screen bg-gradient-to-br from-background via-muted/8 to-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Dashboard"
            subtitle={`Welcome back, ${userProfile?.name || 'Instructor'}! Here's what's happening with your courses.`}
          />
          
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Enhanced Premium Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-white bg-gradient-to-br from-primary via-primary/90 to-accent shadow-2xl"
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
                        <span className="text-white font-bold text-4xl">
                          {userProfile?.name?.charAt(0) || 'I'}
                        </span>
                      </div>
                      <div>
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                          Welcome back, {userProfile?.name || 'Instructor'}! 🎓
                        </h1>
                        <p className="text-white/90 text-2xl leading-relaxed">
                          Ready to inspire minds and shape the future of learning?
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 w-full lg:w-auto">
                      <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex-1 lg:flex-none px-8 py-4 text-lg">
                        <Calendar className="h-6 w-6 mr-3" />
                        Schedule
                      </Button>
                      <Button className="bg-white text-primary hover:bg-white/90 font-semibold flex-1 lg:flex-none px-8 py-4 text-lg">
                        Create Course
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Enhanced Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <MetricCard
                    title="Total Students"
                    value="1,247"
                    subtitle="Active learners across all courses"
                    icon={Users}
                    trend={{ value: "+12%", direction: "up" }}
                    gradient="instructor"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <MetricCard
                    title="Course Revenue"
                    value="$15,230"
                    subtitle="Total earnings this month"
                    icon={DollarSign}
                    trend={{ value: "+8%", direction: "up" }}
                    gradient="instructor"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <MetricCard
                    title="Course Rating"
                    value="4.9"
                    subtitle="Average student rating"
                    icon={Star}
                    trend={{ value: "+0.2", direction: "up" }}
                    gradient="instructor"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <MetricCard
                    title="Active Courses"
                    value="8"
                    subtitle="Currently published"
                    icon={BookOpen}
                    trend={{ value: "+2", direction: "up" }}
                    gradient="instructor"
                  />
                </motion.div>
              </div>

              {/* Enhanced Community Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              >
                {/* Enhanced Let's Connect */}
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        Let's Connect
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        See all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    {recentStudents.slice(0, 2).map((student) => (
                      <div key={student.id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                        <Avatar className="h-14 w-14 shadow-lg">
                          <AvatarImage src={student.avatar} alt={student.name} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{student.name}</h4>
                          <p className="text-sm text-muted-foreground">Cybersecurity specialist</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Enhanced Unlock Premium Features */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                        <Star className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-foreground mb-4">
                          Unlock Premium Features
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          Get access to exclusive benefits and expand your teaching opportunities
                        </p>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Upgrade now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Enhanced Income Tracker - Takes 2 columns */}
                <motion.div 
                  className="lg:col-span-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className="bg-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <IncomeTrackerChart
                      title="Income Tracker"
                      description="Track changes in income over time and access detailed data on each project and payments received"
                      data={enrollmentData}
                    />
                  </div>
                </motion.div>

                {/* Enhanced Recent Projects Sidebar */}
                <motion.div 
                  className="space-y-10"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold text-foreground">
                          Your Recent Projects
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          See all Projects
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-8 p-8">
                      {recentCourses.slice(0, 3).map((course) => (
                        <div key={course.id} className="project-item flex items-center space-x-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300">
                            <BookOpen className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground truncate transition-colors">{course.title}</h4>
                            <p className="text-muted-foreground">${(course.students * 50).toLocaleString()}/hour</p>
                            <div className="flex items-center gap-3 mt-2">
                              <Badge variant="secondary" className="text-xs font-medium">
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

              {/* Enhanced Revenue and Subscriptions Cards */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10"
              >
                <div className="bg-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <UserGrowthChart
                    title="Revenue & Subscriptions"
                    description="Track your revenue and subscription growth over time"
                    data={enrollmentData}
                  />
                </div>
                <div className="bg-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <ProposalProgressChart
                    title="Course Progress"
                    description="Track your course creation and student engagement metrics"
                    data={revenueData}
                  />
                </div>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}