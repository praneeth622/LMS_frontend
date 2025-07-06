"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Play, 
  TrendingUp, 
  Calendar,
  Target,
  Award,
  BarChart3,
  Users,
  Star,
  ChevronRight,
  Download
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context'
import { studentApi, Enrollment, Certificate } from '@/lib/student-api'
import Link from "next/link"

export default function StudentDashboard() {
  const { user, userProfile } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([])
  const [certificates, setCertificates] = React.useState<Certificate[]>([])
  const [loading, setLoading] = React.useState(true)

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrollments.length.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Hours Learned",
      value: "24.5",
      change: "+8.2 this week",
      changeType: "positive" as const,
      icon: Clock,
      color: "bg-green-500"
    },
    {
      title: "Certificates",
      value: certificates.length.toString(),
      change: "1 new this month",
      changeType: "positive" as const,
      icon: Trophy,
      color: "bg-yellow-500"
    },
    {
      title: "Avg. Progress",
      value: `${Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / (enrollments.length || 1))}%`,
      change: "+12% this week",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ]

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchUserData()
    }
  }, [userProfile])

  const fetchUserData = async () => {
    if (!userProfile?.id) return

    try {
      setLoading(true)
      
      // Fetch enrollments
      const enrollmentsResponse = await studentApi.getUserEnrollments(userProfile.id)
      if (enrollmentsResponse.success) {
        setEnrollments(enrollmentsResponse.data)
      } else {
        // Mock data fallback
        setEnrollments([
          {
            course_id: 1,
            progress: 65,
            enrollment_date: new Date().toISOString(),
            course: {
              title: "Complete Web Development Bootcamp",
              description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
              thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          },
          {
            course_id: 2,
            progress: 30,
            enrollment_date: new Date(Date.now() - 86400000).toISOString(),
            course: {
              title: "Advanced React Development",
              description: "Master React hooks, context, and advanced patterns",
              thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          }
        ])
      }

      // Fetch certificates
      const certificatesResponse = await studentApi.getUserCertificates(userProfile.id)
      if (certificatesResponse.success) {
        setCertificates(certificatesResponse.data)
      } else {
        // Mock data fallback
        setCertificates([
          {
            id: 1,
            course_id: 3,
            issued_on: "2024-12-15",
            cert_url: "https://example.com/certificates/cert-123.pdf",
            course: {
              title: "JavaScript Fundamentals"
            }
          }
        ])
      }

    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-yellow-500"
    return "bg-red-500"
  }

  const recentActivity = [
    {
      type: "course_progress",
      title: "Completed lesson: React Hooks",
      course: "Advanced React Development",
      time: "2 hours ago",
      icon: Play
    },
    {
      type: "certificate",
      title: "Earned certificate",
      course: "JavaScript Fundamentals",
      time: "1 day ago",
      icon: Award
    },
    {
      type: "enrollment",
      title: "Enrolled in new course",
      course: "UI/UX Design Masterclass",
      time: "3 days ago",
      icon: BookOpen
    }
  ]

  const upcomingDeadlines = [
    {
      title: "Assignment: Build a React App",
      course: "Advanced React Development",
      dueDate: "Tomorrow",
      priority: "high"
    },
    {
      title: "Quiz: JavaScript Fundamentals",
      course: "Complete Web Development",
      dueDate: "In 3 days",
      priority: "medium"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Dashboard"
            subtitle="Continue your learning journey and achieve your goals"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {userProfile?.name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-blue-100 mb-4">
                  You're making great progress. Keep up the excellent work!
                </p>
                <Button variant="secondary" asChild>
                  <Link href="/student/courses">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Courses
                  </Link>
                </Button>
              </div>

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

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Continue Learning */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Play className="mr-2 h-5 w-5" />
                        Continue Learning
                      </CardTitle>
                      <CardDescription>
                        Pick up where you left off
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {loading ? (
                          [...Array(2)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="flex items-center space-x-4 p-4 border rounded-lg">
                                <div className="w-16 h-12 bg-muted rounded"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-muted rounded w-3/4"></div>
                                  <div className="h-3 bg-muted rounded w-1/2"></div>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          enrollments.slice(0, 3).map((enrollment) => (
                            <motion.div
                              key={enrollment.course_id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="group"
                            >
                              <Card className="border hover:shadow-md transition-all duration-300">
                                <CardContent className="p-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="relative">
                                      <img 
                                        src={enrollment.course.thumbnail} 
                                        alt={enrollment.course.title}
                                        className="w-16 h-12 object-cover rounded-lg"
                                      />
                                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Play className="h-4 w-4 text-white" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                                        {enrollment.course.title}
                                      </h4>
                                      <p className="text-sm text-muted-foreground truncate">
                                        {enrollment.course.description}
                                      </p>
                                      <div className="mt-2 space-y-1">
                                        <div className="flex items-center justify-between text-sm">
                                          <span>Progress</span>
                                          <span>{Math.round(enrollment.progress)}%</span>
                                        </div>
                                        <Progress value={enrollment.progress} className="h-2" />
                                      </div>
                                    </div>
                                    
                                    <Button size="sm" asChild>
                                      <Link href={`/student/learn/${enrollment.course_id}`}>
                                        Continue
                                        <ChevronRight className="ml-1 h-3 w-3" />
                                      </Link>
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          ))
                        )}
                        
                        {enrollments.length === 0 && !loading && (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No courses yet</h3>
                            <p className="text-muted-foreground mb-4">Start your learning journey today</p>
                            <Button asChild>
                              <Link href="/student/courses">Browse Courses</Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Learning Analytics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Learning Analytics
                      </CardTitle>
                      <CardDescription>
                        Your learning progress over time
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">7</div>
                          <p className="text-sm text-muted-foreground">Days streak</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">4.8</div>
                          <p className="text-sm text-muted-foreground">Avg. rating</p>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">156</div>
                          <p className="text-sm text-muted-foreground">Total hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Certificates */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Award className="mr-2 h-5 w-5" />
                        Certificates
                      </CardTitle>
                      <CardDescription>
                        Your achievements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {certificates.map((certificate) => (
                          <div key={certificate.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Trophy className="h-4 w-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{certificate.course.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Issued {new Date(certificate.issued_on).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <Button size="icon" variant="ghost" asChild>
                              <a href={certificate.cert_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        ))}
                        
                        {certificates.length === 0 && (
                          <div className="text-center py-4">
                            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No certificates yet</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {recentActivity.map((activity, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <activity.icon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{activity.title}</p>
                              <p className="text-xs text-muted-foreground">{activity.course}</p>
                              <p className="text-xs text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Deadlines */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5" />
                        Upcoming Deadlines
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingDeadlines.map((deadline, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-medium text-sm">{deadline.title}</p>
                              <Badge variant={deadline.priority === 'high' ? 'destructive' : 'secondary'}>
                                {deadline.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">{deadline.course}</p>
                            <p className="text-xs text-muted-foreground">Due {deadline.dueDate}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}