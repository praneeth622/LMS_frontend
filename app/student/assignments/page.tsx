"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Upload,
  Download,
  Eye,
  Filter,
  Search,
  BookOpen,
  Star,
  ChevronRight
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

interface Assignment {
  id: number
  title: string
  description: string
  course: {
    id: number
    title: string
  }
  due_date: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: number
  max_grade: number
  submission_date?: string
  submission_url?: string
  feedback?: string
  created_at: string
}

export default function StudentAssignments() {
  const { userProfile } = useAuth()
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [courseFilter, setCourseFilter] = React.useState("all")

  // Mock data - replace with actual API calls
  React.useEffect(() => {
    const mockAssignments: Assignment[] = [
      {
        id: 1,
        title: "Build a React Todo App",
        description: "Create a fully functional todo application using React hooks and local storage",
        course: { id: 1, title: "Complete Web Development Bootcamp" },
        due_date: "2024-12-25T23:59:59Z",
        status: "pending",
        max_grade: 100,
        created_at: "2024-12-15T10:00:00Z"
      },
      {
        id: 2,
        title: "CSS Grid Layout Project",
        description: "Design a responsive website layout using CSS Grid and Flexbox",
        course: { id: 1, title: "Complete Web Development Bootcamp" },
        due_date: "2024-12-20T23:59:59Z",
        status: "submitted",
        max_grade: 100,
        submission_date: "2024-12-18T15:30:00Z",
        submission_url: "https://github.com/student/css-grid-project",
        created_at: "2024-12-10T10:00:00Z"
      },
      {
        id: 3,
        title: "JavaScript Algorithm Challenge",
        description: "Solve 5 algorithm problems using JavaScript",
        course: { id: 2, title: "Advanced JavaScript Concepts" },
        due_date: "2024-12-22T23:59:59Z",
        status: "graded",
        grade: 85,
        max_grade: 100,
        submission_date: "2024-12-19T12:00:00Z",
        submission_url: "https://github.com/student/js-algorithms",
        feedback: "Great work! Your solutions are efficient and well-documented. Consider optimizing the sorting algorithm for better performance.",
        created_at: "2024-12-12T10:00:00Z"
      },
      {
        id: 4,
        title: "Database Design Project",
        description: "Design and implement a database schema for an e-commerce application",
        course: { id: 3, title: "Database Management Systems" },
        due_date: "2024-12-15T23:59:59Z",
        status: "overdue",
        max_grade: 100,
        created_at: "2024-12-05T10:00:00Z"
      }
    ]

    setTimeout(() => {
      setAssignments(mockAssignments)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || assignment.status === statusFilter
    const matchesCourse = courseFilter === "all" || assignment.course.id.toString() === courseFilter
    
    return matchesSearch && matchesStatus && matchesCourse
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'graded': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-critical/10 text-critical border-critical/20'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'submitted': return Upload
      case 'graded': return CheckCircle
      case 'overdue': return AlertCircle
      default: return FileText
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Due today"
    if (diffDays === 1) return "Due tomorrow"
    return `Due in ${diffDays} days`
  }

  const getUniqueCoursesFromAssignments = () => {
    const courses = assignments.reduce((acc, assignment) => {
      if (!acc.find(course => course.id === assignment.course.id)) {
        acc.push(assignment.course)
      }
      return acc
    }, [] as Array<{id: number, title: string}>)
    return courses
  }

  const getAssignmentStats = () => {
    const total = assignments.length
    const pending = assignments.filter(a => a.status === 'pending').length
    const submitted = assignments.filter(a => a.status === 'submitted').length
    const graded = assignments.filter(a => a.status === 'graded').length
    const overdue = assignments.filter(a => a.status === 'overdue').length
    
    return { total, pending, submitted, graded, overdue }
  }

  const stats = getAssignmentStats()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Assignments"
            subtitle="Manage your assignments and track your progress"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
                      </div>
                      <Upload className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Graded</p>
                        <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Overdue</p>
                        <p className="text-2xl font-bold text-critical">{stats.overdue}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-critical" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search assignments..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                        <SelectItem value="graded">Graded</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={courseFilter} onValueChange={setCourseFilter}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by course" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {getUniqueCoursesFromAssignments().map(course => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Assignments List */}
              <div className="space-y-4">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredAssignments.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No assignments found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm || statusFilter !== "all" || courseFilter !== "all" 
                          ? "Try adjusting your filters" 
                          : "You don't have any assignments yet"}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAssignments.map((assignment, index) => {
                    const StatusIcon = getStatusIcon(assignment.status)
                    
                    return (
                      <motion.div
                        key={assignment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-md transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                      {assignment.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {assignment.description}
                                    </p>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <div className="flex items-center">
                                        <BookOpen className="h-4 w-4 mr-1" />
                                        {assignment.course.title}
                                      </div>
                                      <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        {getDaysUntilDue(assignment.due_date)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Badge className={getStatusColor(assignment.status)}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                                    </Badge>
                                  </div>
                                </div>
                                
                                {assignment.status === 'graded' && assignment.grade !== undefined && (
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Grade: {assignment.grade}/{assignment.max_grade}</span>
                                      <span>{Math.round((assignment.grade / assignment.max_grade) * 100)}%</span>
                                    </div>
                                    <Progress value={(assignment.grade / assignment.max_grade) * 100} className="h-2" />
                                    {assignment.feedback && (
                                      <div className="p-3 bg-muted rounded-lg">
                                        <p className="text-sm font-medium mb-1">Instructor Feedback:</p>
                                        <p className="text-sm text-muted-foreground">{assignment.feedback}</p>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between pt-3 border-t">
                                  <div className="text-sm text-muted-foreground">
                                    Due: {formatDate(assignment.due_date)}
                                    {assignment.submission_date && (
                                      <span className="ml-4">
                                        Submitted: {formatDate(assignment.submission_date)}
                                      </span>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    {assignment.submission_url && (
                                      <Button size="sm" variant="outline" asChild>
                                        <a href={assignment.submission_url} target="_blank" rel="noopener noreferrer">
                                          <Eye className="h-4 w-4 mr-1" />
                                          View Submission
                                        </a>
                                      </Button>
                                    )}
                                    
                                    {assignment.status === 'pending' && (
                                      <Button size="sm" asChild>
                                        <Link href={`/student/assignments/${assignment.id}/submit`}>
                                          <Upload className="h-4 w-4 mr-1" />
                                          Submit
                                        </Link>
                                      </Button>
                                    )}
                                    
                                    <Button size="sm" variant="outline" asChild>
                                      <Link href={`/student/assignments/${assignment.id}`}>
                                        <Eye className="h-4 w-4 mr-1" />
                                        View Details
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}