"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  BookOpen,
  Users,
  DollarSign,
  TrendingUp
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
import { toast } from "react-hot-toast"
import { instructorApi, Course } from '@/lib/instructor-api'
import { authApi } from '@/lib/api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

const statusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'published': 'bg-green-100 text-green-800',
  'archived': 'bg-red-100 text-red-800'
}

export default function InstructorCoursesPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true)
  const [courses, setCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { userProfile, user, loading: authLoading } = useAuth()

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 InstructorCourses - Auth state:', {
      hasUser: !!user,
      userEmail: user?.email,
      hasUserProfile: !!userProfile,
      userProfileId: userProfile?.id,
      userProfileRoleId: userProfile?.role_id,
      authLoading,
      coursesLoading: loading
    })
  }, [user, userProfile, authLoading, loading])

  const stats = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "bg-blue-500"
    },
    {
      title: "Published Courses",
      value: courses.filter(c => c.status === 'published').length.toString(),
      change: "+1 this month",
      changeType: "positive" as const,
      icon: Eye,
      color: "bg-green-500"
    },
    {
      title: "Total Students",
      value: "456",
      change: "+23 new enrollments",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-orange-500"
    },
    {
      title: "Total Revenue",
      value: "$12,450",
      change: "+15.3% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "bg-purple-500"
    }
  ]

  const testApiConnection = async () => {
    try {
      console.log('🔍 Testing API connection...')
      const healthResponse = await authApi.healthCheck()
      console.log('✅ Health check response:', healthResponse)
      return true
    } catch (error) {
      console.error('❌ Health check failed:', error)
      return false
    }
  }

  const fetchCourses = async () => {
    try {
      setLoading(true)
      
      // First test API connection
      const apiConnected = await testApiConnection()
      if (!apiConnected) {
        toast.error('Cannot connect to API server')
        setCourses([])
        return
      }
      
      if (!userProfile?.id) {
        console.log('No user profile available')
        setCourses([])
        toast.success('Please ensure you are logged in as an instructor')
        return
      }
      
      console.log('Fetching courses for instructor:', userProfile.id)
      const response = await instructorApi.getCoursesByInstructor(userProfile.id)
      console.log('API response:', response)
      
      if (response.success) {
        setCourses(response.data)
        console.log('Courses loaded successfully:', response.data.length)
        if (response.data.length === 0) {
          toast.success('No courses found. Create your first course!')
        }
      } else {
        console.error('API returned error:', response)
        toast.error(`Failed to load courses: ${response.message || 'Unknown error'}`)
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      toast.error('Network error. Please check your connection.')
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    // Don't fetch courses while authentication is still loading
    if (authLoading) {
      console.log('Auth still loading, waiting...')
      return
    }

    // Fetch courses once auth is complete
    fetchCourses()
  }, [userProfile, authLoading])

  const handleDeleteCourse = async (courseId: number) => {
    try {
      await instructorApi.deleteCourse(courseId)
      toast.success('Course deleted successfully')
      fetchCourses()
    } catch (error) {
      console.error('Error deleting course:', error)
      toast.error('Failed to delete course')
    }
  }

  const handlePublishCourse = async (courseId: number) => {
    try {
      await instructorApi.updateCourse(courseId, { status: 'published' })
      toast.success('Course published successfully')
      fetchCourses()
    } catch (error) {
      console.error('Error publishing course:', error)
      toast.error('Failed to publish course')
    }
  }

  const columns: ColumnDef<Course>[] = [
    {
      accessorKey: "title",
      header: "Course",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium">{row.getValue("title")}</p>
            <p className="text-sm text-muted-foreground">{row.original.category}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue<string>("status")
        return (
          <Badge className={statusColors[status as keyof typeof statusColors]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => {
        const price = row.getValue<number>("price")
        return <span>${typeof price === 'number' ? price.toFixed(2) : '0.00'}</span>
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue<string>("created_at")
        return date ? format(new Date(date), "MMM dd, yyyy") : "N/A"
      },
    },
    {
      id: "students",
      header: "Students",
      cell: () => (
        <span className="text-muted-foreground">
          {Math.floor(Math.random() * 100) + 10}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const course = row.original

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
                <Eye className="mr-2 h-4 w-4" />
                View course
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit course
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {course.status === 'draft' && (
                <DropdownMenuItem onClick={() => handlePublishCourse(course.id)}>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Publish course
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                onClick={() => handleDeleteCourse(course.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
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
            title="My Courses"
            subtitle="Manage your courses and track their performance"
            searchPlaceholder="Search courses..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={stats} loading={loading} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common tasks to manage your courses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="h-auto p-4 flex-col space-y-2">
                      <Link href="/instructor/courses/create">
                        <Plus className="h-6 w-6" />
                        <span>Create New Course</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <Users className="h-6 w-6" />
                      <span>View Students</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <TrendingUp className="h-6 w-6" />
                      <span>Analytics</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Courses Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">All Courses</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredCourses.length} courses found
                    </p>
                  </div>
                  
                  <Button asChild>
                    <Link href="/instructor/courses/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Course
                    </Link>
                  </Button>
                </div>

                <DataTable
                  columns={columns}
                  data={filteredCourses}
                  searchKey="title"
                  searchPlaceholder="Search courses..."
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