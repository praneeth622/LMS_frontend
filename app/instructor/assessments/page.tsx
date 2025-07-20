"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Clock,
  Users,
  FileText,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { DataTable } from '@/components/admin/data-table'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"
import { instructorApi, Quiz, Assignment } from '@/lib/instructor-api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

export default function InstructorAssessmentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true)
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Total Quizzes",
      value: quizzes.length.toString(),
      change: "+3 this month",
      changeType: "positive" as const,
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Total Assignments",
      value: assignments.length.toString(),
      change: "+2 this month",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Pending Reviews",
      value: "12",
      change: "5 new submissions",
      changeType: "neutral" as const,
      icon: AlertCircle,
      color: "bg-orange-500"
    },
    {
      title: "Avg. Score",
      value: "85%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-purple-500"
    }
  ]

  React.useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      
      // Mock data for demonstration
      setQuizzes([
        {
          id: 1,
          course_id: 1,
          title: "JavaScript Fundamentals Quiz",
          description: "Test your knowledge of JavaScript basics",
          time_limit: 1800, // 30 minutes
          passing_score: 70,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          title: "React Components Quiz",
          description: "Quiz on React component concepts",
          time_limit: 2400, // 40 minutes
          passing_score: 75,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ])

      setAssignments([
        {
          id: 1,
          course_id: 1,
          title: "Build a Todo App",
          description: "Create a fully functional todo application using React",
          due_date: "2025-02-15",
          max_points: 100,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          title: "Portfolio Website",
          description: "Design and develop a personal portfolio website",
          due_date: "2025-02-28",
          max_points: 150,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ])

    } catch (error) {
      console.error('Error fetching assessments:', error)
      toast.error('Failed to load assessments')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuiz = async (quizId: number) => {
    try {
      // await instructorApi.deleteQuiz(quizId)
      toast.success('Quiz deleted successfully')
      fetchAssessments()
    } catch (error) {
      console.error('Error deleting quiz:', error)
      toast.error('Failed to delete quiz')
    }
  }

  const handleDeleteAssignment = async (assignmentId: number) => {
    try {
      // await instructorApi.deleteAssignment(assignmentId)
      toast.success('Assignment deleted successfully')
      fetchAssessments()
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Failed to delete assignment')
    }
  }

  const quizColumns: ColumnDef<Quiz>[] = [
    {
      accessorKey: "title",
      header: "Quiz Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("title")}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "time_limit",
      header: "Time Limit",
      cell: ({ row }) => {
        const timeLimit = row.getValue<number>("time_limit")
        const minutes = Math.floor(timeLimit / 60)
        return (
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{minutes} min</span>
          </div>
        )
      },
    },
    {
      accessorKey: "passing_score",
      header: "Passing Score",
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue("passing_score")}%
        </Badge>
      ),
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
      id: "submissions",
      header: "Submissions",
      cell: () => (
        <span className="text-muted-foreground">
          {Math.floor(Math.random() * 50) + 10}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const quiz = row.original

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
              <DropdownMenuItem asChild>
                <Link href={`/instructor/assessments/quiz/${quiz.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/assessments/quiz/${quiz.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Quiz
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteQuiz(quiz.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Quiz
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const assignmentColumns: ColumnDef<Assignment>[] = [
    {
      accessorKey: "title",
      header: "Assignment Title",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.getValue("title")}</p>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {row.original.description}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: ({ row }) => {
        const dueDate = row.getValue<string>("due_date")
        const isOverdue = new Date(dueDate) < new Date()
        return (
          <Badge variant={isOverdue ? "destructive" : "default"}>
            {format(new Date(dueDate), "MMM dd, yyyy")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "max_points",
      header: "Max Points",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("max_points")}</span>
      ),
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
      id: "submissions",
      header: "Submissions",
      cell: () => (
        <span className="text-muted-foreground">
          {Math.floor(Math.random() * 30) + 5}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const assignment = row.original

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
              <DropdownMenuItem asChild>
                <Link href={`/instructor/assessments/assignment/${assignment.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/assessments/assignment/${assignment.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Assignment
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteAssignment(assignment.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Assignment
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredQuizzes = quizzes.filter(quiz =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredAssignments = assignments.filter(assignment =>
    assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    assignment.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
            title="Assessments"
            subtitle="Manage quizzes and assignments for your courses"
            searchPlaceholder="Search assessments..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
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
                        <p className={`text-xs ${
                          stat.changeType === 'positive' ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {stat.change}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Enhanced Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="enhanced-card overflow-hidden">
                  <CardHeader className="pb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Plus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">Quick Actions</CardTitle>
                        <CardDescription className="text-lg">
                          Create new assessments for your courses
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group"
                      >
                        <Button 
                          asChild 
                          className="h-auto p-0 w-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link href="/instructor/assessments/quiz/create">
                            <div className="flex flex-col items-center justify-center p-10 space-y-4 w-full">
                              <div className="p-4 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                                <FileText className="h-12 w-12 text-white" />
                              </div>
                              <div className="text-center space-y-2">
                                <span className="text-2xl font-bold text-white">Create Quiz</span>
                                <p className="text-red-100 text-base leading-relaxed">
                                  Build interactive quizzes with timers and instant feedback
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 text-red-100">
                                <span className="text-sm">Get Started</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </div>
                          </Link>
                        </Button>
                      </motion.div>
                      
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="group"
                      >
                        <Button 
                          asChild 
                          variant="outline" 
                          className="h-auto p-0 w-full border-2 border-border/60 hover:border-primary/30 bg-card hover:bg-accent/50 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Link href="/instructor/assessments/assignment/create">
                            <div className="flex flex-col items-center justify-center p-10 space-y-4 w-full">
                              <div className="p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                                <CheckCircle className="h-12 w-12 text-primary" />
                              </div>
                              <div className="text-center space-y-2">
                                <span className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">Create Assignment</span>
                                <p className="text-muted-foreground text-base leading-relaxed group-hover:text-foreground transition-colors duration-300">
                                  Design assignments with file uploads and detailed instructions
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                                <span className="text-sm">Get Started</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                              </div>
                            </div>
                          </Link>
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Assessments Tabs */}
              <Tabs defaultValue="quizzes" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quizzes" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">All Quizzes</h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredQuizzes.length} quizzes found
                      </p>
                    </div>
                    
                    <Button asChild>
                      <Link href="/instructor/assessments/quiz/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Quiz
                      </Link>
                    </Button>
                  </div>

                  <DataTable
                    columns={quizColumns}
                    data={filteredQuizzes}
                    searchKey="title"
                    searchPlaceholder="Search quizzes..."
                    loading={loading}
                  />
                </TabsContent>
                
                <TabsContent value="assignments" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">All Assignments</h2>
                      <p className="text-sm text-muted-foreground">
                        {filteredAssignments.length} assignments found
                      </p>
                    </div>
                    
                    <Button asChild>
                      <Link href="/instructor/assessments/assignment/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Assignment
                      </Link>
                    </Button>
                  </div>

                  <DataTable
                    columns={assignmentColumns}
                    data={filteredAssignments}
                    searchKey="title"
                    searchPlaceholder="Search assignments..."
                    loading={loading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}