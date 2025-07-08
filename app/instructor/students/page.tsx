"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Users,
  BookOpen,
  TrendingUp,
  Mail,
  Calendar,
  Award,
  MessageSquare
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { DataTable } from '@/components/admin/data-table'
import { StatsCards } from '@/components/admin/stats-cards'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "react-hot-toast"
import { instructorApi, Enrollment as BaseEnrollment } from '@/lib/instructor-api'

type Enrollment = BaseEnrollment & {
  course?: {
    id: string
    title: string
    category?: string
  }
}
import { useAuth } from '@/contexts/auth-context'

export default function InstructorStudentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Total Students",
      value: enrollments.length.toString(),
      change: "+12 this month",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-blue-500"
    },
    {
      title: "Active Students",
      value: enrollments.filter(e => e.progress > 0 && e.progress < 100).length.toString(),
      change: "+8 this week",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "bg-green-500"
    },
    {
      title: "Completed Courses",
      value: enrollments.filter(e => e.progress === 100).length.toString(),
      change: "+3 this month",
      changeType: "positive" as const,
      icon: Award,
      color: "bg-purple-500"
    },
    {
      title: "Average Progress",
      value: `${Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length || 0)}%`,
      change: "+5% from last month",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "bg-orange-500"
    }
  ]

  const fetchStudents = async () => {
    try {
      setLoading(true)
      
      if (!userProfile?.id) {
        console.log('No user profile available')
        setEnrollments([])
        return
      }

      // Get all courses by instructor first
      const coursesResponse = await instructorApi.getCoursesByInstructor(userProfile.id)
      
      if (coursesResponse.success && coursesResponse.data.length > 0) {
        // Get enrollments for all instructor's courses
        const allEnrollments: Enrollment[] = []
        
        for (const course of coursesResponse.data) {
          try {
            const enrollmentsResponse = await instructorApi.getCourseEnrollments(course.id)
            if (enrollmentsResponse.success) {
              // Add course info to each enrollment
              const enrollmentsWithCourse = enrollmentsResponse.data.map(enrollment => ({
                ...enrollment,
                course: {
                  ...course,
                  id: course.id.toString() // Convert course.id to string
                }
              }))
              allEnrollments.push(...enrollmentsWithCourse)
            }
          } catch (error) {
            console.error(`Error fetching enrollments for course ${course.id}:`, error)
          }
        }
        
        setEnrollments(allEnrollments)
        console.log('Students loaded successfully:', allEnrollments.length)
      } else {
        setEnrollments([])
        toast.success('No courses found. Create courses to see student enrollments.')
      }
    } catch (error) {
      console.error('Error fetching students:', error)
      toast.error('Failed to load students')
      setEnrollments([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchStudents()
    }
  }, [userProfile])

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200"
    if (progress < 30) return "bg-red-500"
    if (progress < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return "Not Started"
    if (progress === 100) return "Completed"
    return "In Progress"
  }

  const columns: ColumnDef<Enrollment & { course?: any }>[] = [
    {
      accessorKey: "user",
      header: "Student",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user?.name?.charAt(0) || 'S'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name || 'Unknown Student'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "course",
      header: "Course",
      cell: ({ row }) => {
        const course = row.original.course
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-medium">{course?.title || 'Unknown Course'}</p>
              <p className="text-sm text-muted-foreground">{course?.category}</p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const progress = row.getValue<number>("progress")
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{progress}%</span>
              <Badge variant="outline" className="text-xs">
                {getProgressStatus(progress)}
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )
      },
    },
    {
      accessorKey: "enrolled_at",
      header: "Enrolled",
      cell: ({ row }) => {
        const date = row.getValue<string>("enrolled_at")
        return date ? format(new Date(date), "MMM dd, yyyy") : "N/A"
      },
    },
    {
      accessorKey: "completed_at",
      header: "Completed",
      cell: ({ row }) => {
        const date = row.getValue<string>("completed_at")
        return date ? format(new Date(date), "MMM dd, yyyy") : "-"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const enrollment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Mail className="mr-2 h-4 w-4" />
                Send message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TrendingUp className="mr-2 h-4 w-4" />
                View progress
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Award className="mr-2 h-4 w-4" />
                Issue certificate
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="My Students"
            subtitle="Track student progress and engagement"
            searchPlaceholder="Search students..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={stats} loading={loading} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Student Management</CardTitle>
                  <CardDescription>
                    Monitor and support your students' learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <Mail className="h-6 w-6" />
                      <span>Send Announcement</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <TrendingUp className="h-6 w-6" />
                      <span>Progress Report</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <Award className="h-6 w-6" />
                      <span>Issue Certificates</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span>Discussion Forum</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Students Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">All Students</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredEnrollments.length} students found
                    </p>
                  </div>
                </div>

                <DataTable
                  columns={columns}
                  data={filteredEnrollments}
                  searchKey="user.name"
                  searchPlaceholder="Search students..."
                  loading={loading}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}