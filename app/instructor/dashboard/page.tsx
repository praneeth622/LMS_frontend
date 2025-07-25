"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  MessageSquare,
  Plus,
  Calendar,
  Clock
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'

export default function InstructorDashboardPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = {
    totalStudents: 1234,
    totalRevenue: 45678.90,
    totalCourses: 12,
    activeCourses: 8,
    pendingReviews: 23,
    newMessages: 15
  }

  const recentCourses = [
    {
      id: 1,
      title: "React for Beginners",
      students: 150,
      progress: 85,
      status: "published"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      students: 89,
      progress: 92,
      status: "published"
    },
    {
      id: 3,
      title: "Node.js Fundamentals",
      students: 0,
      progress: 45,
      status: "draft"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "enrollment",
      message: "15 new students enrolled in React for Beginners",
      time: "2 hours ago"
    },
    {
      id: 2,
      type: "review",
      message: "New 5-star review for Advanced JavaScript",
      time: "4 hours ago"
    },
    {
      id: 3,
      type: "message",
      message: "3 new messages from students",
      time: "6 hours ago"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={['instructor']}>
      <div className="flex h-screen bg-gray-50">
        <InstructorSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Dashboard"
            subtitle="Welcome back! Here's what's happening with your courses"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">Good morning, Instructor!</h1>
                    <p className="text-blue-100 mt-1">
                      You have {stats.pendingReviews} pending reviews and {stats.newMessages} new messages
                    </p>
                  </div>
                  <Button asChild className="bg-white text-blue-600 hover:bg-blue-50">
                    <Link href="/instructor/courses/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                        <p className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+12% from last month</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                        <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                        <p className="text-xs text-green-600">+18% from last month</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Courses</p>
                        <p className="text-2xl font-bold">{stats.activeCourses}</p>
                        <p className="text-xs text-blue-600">out of {stats.totalCourses} total</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">New Messages</p>
                        <p className="text-2xl font-bold">{stats.newMessages}</p>
                        <p className="text-xs text-orange-600">Requires attention</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Overview and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Courses</CardTitle>
                    <CardDescription>
                      Your latest course activity and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentCourses.map((course) => (
                        <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{course.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                course.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {course.status}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                              <span>{course.students} students</span>
                              <span>{course.progress}% complete</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href="/instructor/courses">
                        View All Courses
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates from your courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0 mt-1">
                            {activity.type === 'enrollment' && <Users className="h-4 w-4 text-blue-600" />}
                            {activity.type === 'review' && <TrendingUp className="h-4 w-4 text-green-600" />}
                            {activity.type === 'message' && <MessageSquare className="h-4 w-4 text-orange-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.message}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4" variant="outline">
                      <Link href="/instructor/notifications">
                        View All Activity
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks and shortcuts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="h-20 flex-col space-y-2">
                      <Link href="/instructor/courses/create">
                        <Plus className="h-6 w-6" />
                        <span>Create New Course</span>
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                      <Link href="/instructor/analytics">
                        <TrendingUp className="h-6 w-6" />
                        <span>View Analytics</span>
                      </Link>
                    </Button>
                    
                    <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                      <Link href="/instructor/discussions">
                        <MessageSquare className="h-6 w-6" />
                        <span>Manage Discussions</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}