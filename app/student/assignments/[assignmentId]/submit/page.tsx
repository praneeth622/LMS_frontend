"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Upload,
  FileText,
  Link as LinkIcon,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Calendar,
  BookOpen
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"

interface Assignment {
  id: number
  title: string
  description: string
  course: {
    id: number
    title: string
  }
  due_date: string
  max_grade: number
  status: 'pending' | 'submitted' | 'graded' | 'overdue'
}

export default function SubmitAssignment() {
  const { assignmentId } = useParams()
  const router = useRouter()
  const { userProfile } = useAuth()
  const [assignment, setAssignment] = React.useState<Assignment | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState(false)
  
  // Form state
  const [submissionUrl, setSubmissionUrl] = React.useState("")
  const [submissionText, setSubmissionText] = React.useState("")
  const [files, setFiles] = React.useState<FileList | null>(null)

  // Mock data - replace with actual API call
  React.useEffect(() => {
    const mockAssignment: Assignment = {
      id: parseInt(assignmentId as string),
      title: "Build a React Todo App",
      description: "Create a fully functional todo application using React hooks and local storage",
      course: { 
        id: 1, 
        title: "Complete Web Development Bootcamp"
      },
      due_date: "2024-12-25T23:59:59Z",
      max_grade: 100,
      status: "pending"
    }

    setTimeout(() => {
      setAssignment(mockAssignment)
      setLoading(false)
    }, 1000)
  }, [assignmentId])

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
    
    if (diffDays < 0) return { text: "Overdue", color: "text-critical" }
    if (diffDays === 0) return { text: "Due today", color: "text-error" }
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-warning" }
    if (diffDays <= 3) return { text: `Due in ${diffDays} days`, color: "text-warning" }
    return { text: `Due in ${diffDays} days`, color: "text-success" }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!submissionUrl && !submissionText && !files) {
      toast.error("Please provide at least one form of submission")
      return
    }

    setSubmitting(true)

    try {
      // Mock API call - replace with actual submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Here you would make the actual API call to submit the assignment
      // const response = await api.post('/assignments/submit', {
      //   assignment_id: assignment?.id,
      //   user_id: userProfile?.id,
      //   submission_url: submissionUrl,
      //   submission_text: submissionText,
      //   files: files
      // })

      toast.success("Assignment submitted successfully!")
      router.push(`/student/assignments/${assignmentId}`)
      
    } catch (error) {
      console.error('Error submitting assignment:', error)
      toast.error("Failed to submit assignment. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="flex h-screen bg-background">
          <StudentSidebar 
            
            
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentHeader 
              title="Submit Assignment"
              subtitle="Loading assignment information..."
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
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
            
            
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentHeader 
              title="Assignment Not Found"
              subtitle="The assignment you're looking for doesn't exist"
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <Card className="max-w-2xl mx-auto">
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

  if (assignment.status !== 'pending') {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="flex h-screen bg-background">
          <StudentSidebar 
            
            
          />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <StudentHeader 
              title="Assignment Already Submitted"
              subtitle="This assignment has already been submitted"
            />
            
            <main className="flex-1 overflow-y-auto p-6">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Assignment already submitted</h3>
                  <p className="text-muted-foreground mb-4">
                    You have already submitted this assignment. You can view your submission details.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button variant="outline" asChild>
                      <Link href="/student/assignments">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Assignments
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/student/assignments/${assignmentId}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  const dueInfo = getDaysUntilDue(assignment.due_date)

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          
          
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Submit Assignment"
            subtitle="Submit your completed assignment"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Back Button */}
              <Button variant="ghost" asChild>
                <Link href={`/student/assignments/${assignmentId}`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Assignment
                </Link>
              </Button>

              {/* Assignment Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {assignment.course.title}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span className={dueInfo.color}>{dueInfo.text}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Due Date Warning */}
              {dueInfo.color === "text-error" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This assignment is {dueInfo.text.toLowerCase()}. Late submissions may be penalized.
                  </AlertDescription>
                </Alert>
              )}

              {/* Submission Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Work</CardTitle>
                  <CardDescription>
                    Choose one or more submission methods below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* URL Submission */}
                    <div className="space-y-2">
                      <Label htmlFor="submission-url" className="flex items-center">
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Submission URL
                      </Label>
                      <Input
                        id="submission-url"
                        type="url"
                        placeholder="https://github.com/username/project or https://your-demo.netlify.app"
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Link to your GitHub repository, live demo, or other online submission
                      </p>
                    </div>

                    {/* Text Submission */}
                    <div className="space-y-2">
                      <Label htmlFor="submission-text" className="flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Written Submission
                      </Label>
                      <Textarea
                        id="submission-text"
                        placeholder="Enter your written response, code snippets, or additional notes here..."
                        value={submissionText}
                        onChange={(e) => setSubmissionText(e.target.value)}
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use this area for written responses, code snippets, or additional explanations
                      </p>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="file-upload" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        File Upload
                      </Label>
                      <Input
                        id="file-upload"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        accept=".pdf,.doc,.docx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif"
                      />
                      <p className="text-xs text-muted-foreground">
                        Upload documents, images, or compressed files (PDF, DOC, TXT, ZIP, images)
                      </p>
                      {files && files.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Selected files:</p>
                          <ul className="text-sm text-muted-foreground">
                            {Array.from(files).map((file, index) => (
                              <li key={index}>• {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Submission Guidelines */}
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Submission Guidelines:</strong>
                        <ul className="mt-2 text-sm space-y-1">
                          <li>• Ensure all required components are included</li>
                          <li>• Double-check that links are working and accessible</li>
                          <li>• Include clear documentation or README files</li>
                          <li>• Test your submission before submitting</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-3">
                      <Button type="button" variant="outline" asChild>
                        <Link href={`/student/assignments/${assignmentId}`}>
                          Cancel
                        </Link>
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitting || (!submissionUrl && !submissionText && !files)}
                      >
                        {submitting ? (
                          <>
                            <Upload className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Submit Assignment
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Assignment Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Due Date:</span>
                    <span className="text-sm font-medium">{formatDate(assignment.due_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Max Grade:</span>
                    <span className="text-sm font-medium">{assignment.max_grade} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Course:</span>
                    <span className="text-sm font-medium">{assignment.course.title}</span>
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