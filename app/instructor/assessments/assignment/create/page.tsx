"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  FileText,
  Clock,
  Users
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"
import { instructorApi } from '@/lib/instructor-api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

export default function CreateAssignmentPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [courses, setCourses] = React.useState<any[]>([])
  
  const router = useRouter()
  const { userProfile } = useAuth()

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    instructions: '',
    max_points: '100',
    submission_type: 'file',
    allow_late_submissions: true
  })

  // Fetch instructor's courses
  React.useEffect(() => {
    const fetchCourses = async () => {
      if (!userProfile?.id) return
      
      try {
        const response = await instructorApi.getCoursesByInstructor(userProfile.id)
        if (response.success) {
          setCourses(response.data)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [userProfile])

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Assignment title is required')
      return
    }

    if (!formData.course_id) {
      toast.error('Please select a course')
      return
    }

    if (!formData.due_date) {
      toast.error('Due date is required')
      return
    }

    try {
      setLoading(true)
      
      const assignmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        course_id: parseInt(formData.course_id),
        due_date: formData.due_date
      }

      const response = await instructorApi.createAssignment(assignmentData)
      
      if (response.success) {
        toast.success('Assignment created successfully!')
        router.push('/instructor/assessments')
      } else {
        toast.error(response.message || 'Failed to create assignment')
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
      toast.error('Failed to create assignment')
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Create Assignment"
            subtitle="Create a new assignment for your students"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Back Button */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/instructor/assessments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Assessments
                  </Link>
                </Button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Assignment Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Assignment Information</CardTitle>
                        <CardDescription>
                          Basic information about your assignment
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Assignment Title *</Label>
                          <Input
                            id="title"
                            placeholder="Enter assignment title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="course">Course *</Label>
                          <Select
                            value={formData.course_id}
                            onValueChange={(value) => handleInputChange('course_id', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.title}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Brief description of the assignment"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date *</Label>
                            <Input
                              id="dueDate"
                              type="datetime-local"
                              min={today}
                              value={formData.due_date}
                              onChange={(e) => handleInputChange('due_date', e.target.value)}
                              required
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="maxPoints">Maximum Points</Label>
                            <Input
                              id="maxPoints"
                              type="number"
                              min="1"
                              value={formData.max_points}
                              onChange={(e) => handleInputChange('max_points', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Assignment Instructions */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Instructions</CardTitle>
                        <CardDescription>
                          Detailed instructions for students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor="instructions">Assignment Instructions</Label>
                          <Textarea
                            id="instructions"
                            placeholder="Provide detailed instructions for students on how to complete this assignment..."
                            rows={8}
                            value={formData.instructions}
                            onChange={(e) => handleInputChange('instructions', e.target.value)}
                          />
                          <p className="text-sm text-muted-foreground">
                            Include requirements, format, submission guidelines, and grading criteria.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Submission Settings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Submission Settings</CardTitle>
                        <CardDescription>
                          Configure how students will submit their work
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="submissionType">Submission Type</Label>
                          <Select
                            value={formData.submission_type}
                            onValueChange={(value) => handleInputChange('submission_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="file">File Upload</SelectItem>
                              <SelectItem value="text">Text Entry</SelectItem>
                              <SelectItem value="url">URL/Link</SelectItem>
                              <SelectItem value="both">File Upload & Text</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="allowLate"
                            checked={formData.allow_late_submissions}
                            onChange={(e) => handleInputChange('allow_late_submissions', e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor="allowLate">Allow late submissions</Label>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assignment Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formData.submission_type.replace('_', ' ')} submission
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formData.max_points} points maximum
                          </span>
                        </div>

                        {formData.due_date && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              Due {new Date(formData.due_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formData.allow_late_submissions ? 'Late submissions allowed' : 'No late submissions'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Publish Assignment</CardTitle>
                        <CardDescription>
                          Create and publish your assignment
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Create Assignment
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Tips</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>• Be clear and specific in your instructions</p>
                        <p>• Include grading criteria and rubrics</p>
                        <p>• Set realistic deadlines</p>
                        <p>• Provide examples when helpful</p>
                        <p>• Consider file format requirements</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}