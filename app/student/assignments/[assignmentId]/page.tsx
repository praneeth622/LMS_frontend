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
  BookOpen,
  Star,
  ArrowLeft,
  ExternalLink
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"
import { useParams } from "next/navigation"

interface Assignment {
  id: number
  title: string
  description: string
  instructions: string
  course: {
    id: number
    title: string
    instructor: string
  }
  due_date: string
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
  grade?: number
  max_grade: number
  submission_date?: string
  submission_url?: string
  submission_text?: string
  feedback?: string
  created_at: string
  attachments?: Array<{
    id: number
    name: string
    url: string
    type: string
  }>
}

export default function AssignmentDetails() {
  const { assignmentId } = useParams()
  const { userProfile } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [assignment, setAssignment] = React.useState<Assignment | null>(null)
  const [loading, setLoading] = React.useState(true)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const mockAssignment: Assignment = {
      id: parseInt(assignmentId as string),
      title: "Build a React Todo App",
      description: "Create a fully functional todo application using React hooks and local storage",
      instructions: `
        ## Assignment Requirements

        Create a todo application with the following features:

        ### Core Features
        1. **Add new todos** - Users should be able to add new todo items
        2. **Mark as complete** - Users should be able to mark todos as completed
        3. **Delete todos** - Users should be able to remove todo items
        4. **Edit todos** - Users should be able to edit existing todo text
        5. **Filter todos** - Show all, active, or completed todos

        ### Technical Requirements
        - Use React functional components with hooks
        - Implement local storage to persist todos
        - Use proper state management
        - Include proper error handling
        - Write clean, readable code with comments

        ### Bonus Features (Optional)
        - Add due dates to todos
        - Implement drag and drop reordering
        - Add categories or tags
        - Include search functionality

        ### Submission Guidelines
        1. Create a GitHub repository for your project
        2. Include a README.md with setup instructions
        3. Deploy your application (Netlify, Vercel, etc.)
        4. Submit both the GitHub repository link and live demo link

        ### Grading Criteria
        - **Functionality (40%)** - All core features work correctly
        - **Code Quality (30%)** - Clean, readable, well-structured code
        - **UI/UX (20%)** - User-friendly interface and good design
        - **Documentation (10%)** - Clear README and code comments
      `,
      course: { 
        id: 1, 
        title: "Complete Web Development Bootcamp",
        instructor: "John Smith"
      },
      due_date: "2024-12-25T23:59:59Z",
      status: "pending",
      max_grade: 100,
      created_at: "2024-12-15T10:00:00Z",
      attachments: [
        {
          id: 1,
          name: "Assignment Rubric.pdf",
          url: "https://example.com/rubric.pdf",
          type: "pdf"
        },
        {
          id: 2,
          name: "Starter Code.zip",
          url: "https://example.com/starter.zip",
          type: "zip"
        }
      ]
    }

    setTimeout(() => {
      setAssignment(mockAssignment)
      setLoading(false)
    }, 1000)
  }, [assignmentId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'graded': return 'bg-green-100 text-green-800'
      case 'overdue': return 'bg-red-100 text-red-800'
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
      month: 'long',
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

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return '📄'
      case 'zip': return '📦'
      case 'doc':
      case 'docx': return '📝'
      default: return '📎'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="flex h-screen bg-background">
          <StudentSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentHeader 
              title="Assignment Details"
              subtitle="Loading assignment information..."
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-muted rounded w-1/3"></div>
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-64 bg-muted rounded"></div>
              </div>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!assignment) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="flex h-screen bg-background">
          <StudentSidebar 
            collapsed={sidebarCollapsed} 
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentHeader 
              title="Assignment Not Found"
              subtitle="The assignment you're looking for doesn't exist"
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Assignment not found</h3>
                  <p className="text-muted-foreground mb-4">
                    The assignment you're looking for doesn't exist or you don't have access to it.
                  </p>
                  <Button asChild>
                    <Link href="/student/assignments">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Assignments
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const StatusIcon = getStatusIcon(assignment.status)

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Assignment Details"
            subtitle="Review assignment requirements and submit your work"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Back Button */}
              <Button variant="ghost" asChild>
                <Link href="/student/assignments">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assignments
                </Link>
              </Button>

              {/* Assignment Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-2xl">{assignment.title}</CardTitle>
                      <CardDescription className="text-base">
                        {assignment.description}
                      </CardDescription>
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
                    
                    <Badge className={getStatusColor(assignment.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Assignment Details */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Instructions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Instructions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed">
                          {assignment.instructions}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Attachments */}
                  {assignment.attachments && assignment.attachments.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                        <CardDescription>
                          Download assignment resources and materials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {assignment.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getFileIcon(attachment.type)}</span>
                                <div>
                                  <p className="font-medium text-sm">{attachment.name}</p>
                                  <p className="text-xs text-muted-foreground">{attachment.type.toUpperCase()}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submission */}
                  {assignment.status === 'submitted' || assignment.status === 'graded' ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Submission</CardTitle>
                        <CardDescription>
                          Submitted on {assignment.submission_date && formatDate(assignment.submission_date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {assignment.submission_url && (
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center space-x-3">
                                <ExternalLink className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium text-sm">Submission Link</p>
                                  <p className="text-xs text-muted-foreground">{assignment.submission_url}</p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline" asChild>
                                <a href={assignment.submission_url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </a>
                              </Button>
                            </div>
                          )}
                          
                          {assignment.submission_text && (
                            <div className="p-3 border rounded-lg">
                              <p className="font-medium text-sm mb-2">Submission Text</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {assignment.submission_text}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Submit Assignment</CardTitle>
                        <CardDescription>
                          Ready to submit your work?
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button asChild>
                          <Link href={`/student/assignments/${assignment.id}/submit`}>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {/* Feedback */}
                  {assignment.status === 'graded' && assignment.feedback && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Instructor Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="p-4 bg-muted rounded-lg">
                          <p className="text-sm leading-relaxed">{assignment.feedback}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Assignment Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Assignment Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Course</p>
                        <p className="text-sm">{assignment.course.title}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Instructor</p>
                        <p className="text-sm">{assignment.course.instructor}</p>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Due Date</p>
                        <p className="text-sm">{formatDate(assignment.due_date)}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Max Grade</p>
                        <p className="text-sm">{assignment.max_grade} points</p>
                      </div>
                      
                      {assignment.status === 'graded' && assignment.grade !== undefined && (
                        <>
                          <Separator />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Your Grade</p>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold">{assignment.grade}/{assignment.max_grade}</span>
                                <span className="text-sm text-muted-foreground">
                                  {Math.round((assignment.grade / assignment.max_grade) * 100)}%
                                </span>
                              </div>
                              <Progress value={(assignment.grade / assignment.max_grade) * 100} className="h-2" />
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/student/courses/${assignment.course.id}`}>
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Course
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/assignments">
                          <FileText className="mr-2 h-4 w-4" />
                          All Assignments
                        </Link>
                      </Button>
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