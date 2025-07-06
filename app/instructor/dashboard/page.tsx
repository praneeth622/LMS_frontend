"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus,
  Play,
  MessageSquare,
  Star,
  DollarSign
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { StatsCards } from '@/components/admin/stats-cards'
import { UserGrowthChart, ActivityChart } from '@/components/admin/charts'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

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

  const stats = [
    {
      title: "My Courses",
      value: "12",
      change: "3 published this month",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Total Students",
      value: "456",
      change: "+23 new enrollments",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Course Rating",
      value: "4.8",
      change: "Average across all courses",
      changeType: "positive" as const,
      icon: Star,
      color: "bg-yellow-500"
    },
    {
      title: "Monthly Revenue",
      value: "$3,240",
      change: "+18.2% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "bg-purple-500"
    }
  ]

  const recentCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      students: 89,
      rating: 4.9,
      status: "published",
      lastUpdated: "2 days ago"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      students: 67,
      rating: 4.7,
      status: "published",
      lastUpdated: "1 week ago"
    },
    {
      id: 3,
      title: "Node.js Masterclass",
      students: 0,
      rating: 0,
      status: "draft",
      lastUpdated: "3 days ago"
    }
  ]

  const recentStudents = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@example.com",
      course: "React Fundamentals",
      enrolledAt: "2 hours ago",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@example.com",
      course: "Advanced JavaScript",
      enrolledAt: "5 hours ago",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@example.com",
      course: "React Fundamentals",
      enrolledAt: "1 day ago",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150"
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
            subtitle={`Welcome back, ${userProfile?.name || 'Instructor'}!`}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={stats} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Get started with common tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button asChild className="h-auto p-4 flex-col space-y-2">
                      <Link href="/instructor/courses/create">
                        <Plus className="h-6 w-6" />
                        <span>Create Course</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <Play className="h-6 w-6" />
                      <span>Record Lecture</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span>View Messages</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <TrendingUp className="h-6 w-6" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserGrowthChart
                  title="Student Enrollments"
                  description="Monthly enrollment trends"
                  data={enrollmentData}
                />
                <ActivityChart
                  title="Weekly Revenue"
                  description="Revenue over the past week"
                  data={revenueData}
                />
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>
                      Your latest course activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{course.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {course.students} students • Updated {course.lastUpdated}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {course.rating > 0 && (
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="text-sm">{course.rating}</span>
                              </div>
                            )}
                            <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                              {course.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Students */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Students</CardTitle>
                    <CardDescription>
                      Latest student enrollments
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentStudents.map((student) => (
                        <div key={student.id} className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={student.avatar} alt={student.name} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{student.name}</p>
                            <p className="text-sm text-muted-foreground truncate">
                              Enrolled in {student.course}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{student.enrolledAt}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}