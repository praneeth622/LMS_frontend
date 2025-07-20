"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  Award,
  BookOpen,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { useAuth } from '@/contexts/auth-context'
import { studentApi, Enrollment } from '@/lib/student-api'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

// Mock data for charts
const weeklyProgressData = [
  { day: 'Mon', hours: 2.5, courses: 1 },
  { day: 'Tue', hours: 3.2, courses: 2 },
  { day: 'Wed', hours: 1.8, courses: 1 },
  { day: 'Thu', hours: 4.1, courses: 3 },
  { day: 'Fri', hours: 2.9, courses: 2 },
  { day: 'Sat', hours: 5.2, courses: 2 },
  { day: 'Sun', hours: 3.8, courses: 1 },
]

const monthlyProgressData = [
  { month: 'Jan', completed: 2, enrolled: 5 },
  { month: 'Feb', completed: 3, enrolled: 6 },
  { month: 'Mar', completed: 1, enrolled: 4 },
  { month: 'Apr', completed: 4, enrolled: 7 },
  { month: 'May', completed: 2, enrolled: 5 },
  { month: 'Jun', completed: 3, enrolled: 6 },
]

const skillsData = [
  { name: 'JavaScript', value: 85 },
  { name: 'React', value: 70 },
  { name: 'CSS', value: 90 },
  { name: 'Node.js', value: 60 },
  { name: 'Python', value: 45 },
]

const categoryData = [
  { name: 'Programming', value: 40, color: '#0088FE' },
  { name: 'Design', value: 25, color: '#00C49F' },
  { name: 'Business', value: 20, color: '#FFBB28' },
  { name: 'Marketing', value: 15, color: '#FF8042' },
]

export default function StudentProgressPage() {
  const { userProfile } = useAuth()
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchProgressData()
    }
  }, [userProfile])

  const fetchProgressData = async () => {
    if (!userProfile?.id) return

    try {
      setLoading(true)
      const response = await studentApi.getUserEnrollments(userProfile.id)
      if (response.success) {
        setEnrollments(response.data)
      }
    } catch (error) {
      console.error('Error fetching progress data:', error)
      // Mock data fallback
      setEnrollments([
        {
          course_id: 1,
          progress: 65,
          enrollment_date: new Date().toISOString(),
          course: {
            title: "Complete Web Development Bootcamp",
            description: "Learn HTML, CSS, JavaScript, React, Node.js and more"
          }
        },
        {
          course_id: 2,
          progress: 30,
          enrollment_date: new Date(Date.now() - 86400000).toISOString(),
          course: {
            title: "Advanced React Development",
            description: "Master React hooks, context, and advanced patterns"
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const averageProgress = enrollments.length > 0 
    ? enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length 
    : 0

  const completedCourses = enrollments.filter(e => e.progress >= 100).length
  const totalHours = 156 // Mock data
  const currentStreak = 7 // Mock data

  const stats = [
    {
      title: "Average Progress",
      value: `${Math.round(averageProgress)}%`,
      change: "+12% this month",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "bg-blue-500"
    },
    {
      title: "Completed Courses",
      value: completedCourses.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: Award,
      color: "bg-green-500"
    },
    {
      title: "Total Hours",
      value: totalHours.toString(),
      change: "+24 this week",
      changeType: "positive" as const,
      icon: Clock,
      color: "bg-orange-500"
    },
    {
      title: "Current Streak",
      value: `${currentStreak} days`,
      change: "Keep it up!",
      changeType: "positive" as const,
      icon: Target,
      color: "bg-purple-500"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex min-h-screen bg-background">
        <StudentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            title="Learning Progress"
            subtitle="Track your learning journey and achievements"
          />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                          <div className={`p-2 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-4 w-4 text-white" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {stat.value}
                          </div>
                          <p className="text-xs text-green-600">
                            {stat.change}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Weekly Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="mr-2 h-5 w-5" />
                        Weekly Activity
                      </CardTitle>
                      <CardDescription>
                        Your learning hours this week
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={weeklyProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="hours"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Course Categories */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <PieChart className="mr-2 h-5 w-5" />
                        Course Categories
                      </CardTitle>
                      <CardDescription>
                        Distribution of your enrolled courses
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RechartsPieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Monthly Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Monthly Progress
                      </CardTitle>
                      <CardDescription>
                        Courses completed vs enrolled over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyProgressData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="enrolled" fill="#8884d8" name="Enrolled" />
                          <Bar dataKey="completed" fill="#82ca9d" name="Completed" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Skills Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        Skills Progress
                      </CardTitle>
                      <CardDescription>
                        Your proficiency in different technologies
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {skillsData.map((skill, index) => (
                          <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">{skill.name}</span>
                              <span className="text-sm text-muted-foreground">{skill.value}%</span>
                            </div>
                            <Progress value={skill.value} className="h-2" />
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Course Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Course Progress
                    </CardTitle>
                    <CardDescription>
                      Detailed progress for each enrolled course
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <div key={i} className="animate-pulse">
                            <div className="flex items-center justify-between mb-2">
                              <div className="h-4 bg-muted rounded w-1/3"></div>
                              <div className="h-4 bg-muted rounded w-16"></div>
                            </div>
                            <div className="h-2 bg-muted rounded"></div>
                          </div>
                        ))
                      ) : (
                        enrollments.map((enrollment, index) => (
                          <motion.div
                            key={enrollment.course_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{enrollment.course.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Enrolled {new Date(enrollment.enrollment_date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold">{Math.round(enrollment.progress)}%</div>
                                <Badge variant={enrollment.progress >= 100 ? "default" : "secondary"}>
                                  {enrollment.progress >= 100 ? "Completed" : "In Progress"}
                                </Badge>
                              </div>
                            </div>
                            <Progress value={enrollment.progress} className="h-2" />
                          </motion.div>
                        ))
                      )}

                      {enrollments.length === 0 && !loading && (
                        <div className="text-center py-8">
                          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">No courses enrolled</h3>
                          <p className="text-muted-foreground">Start learning to see your progress here</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="mr-2 h-5 w-5" />
                      Learning Goals
                    </CardTitle>
                    <CardDescription>
                      Track your learning objectives
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">5</div>
                        <p className="text-sm text-muted-foreground">Courses to Complete</p>
                        <Progress value={40} className="mt-2" />
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">200</div>
                        <p className="text-sm text-muted-foreground">Hours Goal</p>
                        <Progress value={78} className="mt-2" />
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-primary mb-2">3</div>
                        <p className="text-sm text-muted-foreground">Certificates Goal</p>
                        <Progress value={33} className="mt-2" />
                      </div>
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