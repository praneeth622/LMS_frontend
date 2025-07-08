"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, 
  Save, 
  MessageSquare,
  Users,
  BookOpen
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

export default function CreateDiscussionPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [courses, setCourses] = React.useState<any[]>([])
  
  const router = useRouter()
  const { userProfile } = useAuth()

  const [formData, setFormData] = React.useState({
    title: '',
    content: '',
    course_id: '',
    lecture_id: '',
    category: 'general'
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userProfile?.id) {
      toast.error('User profile not found')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Discussion title is required')
      return
    }

    if (!formData.content.trim()) {
      toast.error('Discussion content is required')
      return
    }

    if (!formData.course_id) {
      toast.error('Please select a course')
      return
    }

    try {
      setLoading(true)
      
      const discussionData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        course_id: parseInt(formData.course_id),
        user_id: userProfile.id,
        lecture_id: formData.lecture_id ? parseInt(formData.lecture_id) : undefined
      }

      const response = await instructorApi.createDiscussion(discussionData)
      
      if (response.success) {
        toast.success('Discussion created successfully!')
        router.push('/instructor/discussions')
      } else {
        toast.error(response.message || 'Failed to create discussion')
      }
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Failed to create discussion')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'general', label: 'General Discussion' },
    { value: 'question', label: 'Question & Answer' },
    { value: 'announcement', label: 'Announcement' },
    { value: 'assignment', label: 'Assignment Help' },
    { value: 'technical', label: 'Technical Support' }
  ]

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Start Discussion"
            subtitle="Create a new discussion topic for your students"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Back Button */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/instructor/discussions">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Discussions
                  </Link>
                </Button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Discussion Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Discussion Details</CardTitle>
                        <CardDescription>
                          Provide information about your discussion topic
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Discussion Title *</Label>
                          <Input
                            id="title"
                            placeholder="Enter discussion title"
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
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={formData.category}
                            onValueChange={(value) => handleInputChange('category', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                  {category.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="content">Discussion Content *</Label>
                          <Textarea
                            id="content"
                            placeholder="Start the discussion with your thoughts, questions, or announcements..."
                            rows={8}
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                            required
                          />
                          <p className="text-sm text-muted-foreground">
                            Be clear and engaging to encourage student participation.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Discussion Guidelines */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Discussion Guidelines</CardTitle>
                        <CardDescription>
                          Tips for creating engaging discussions
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            <p className="font-medium">Ask open-ended questions</p>
                            <p className="text-sm text-muted-foreground">
                              Encourage students to share their thoughts and experiences
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            <p className="font-medium">Provide context</p>
                            <p className="text-sm text-muted-foreground">
                              Give background information to help students understand the topic
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            <p className="font-medium">Set expectations</p>
                            <p className="text-sm text-muted-foreground">
                              Let students know what kind of responses you're looking for
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                          <div>
                            <p className="font-medium">Be responsive</p>
                            <p className="text-sm text-muted-foreground">
                              Engage with student responses to keep the discussion active
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Publish Discussion</CardTitle>
                        <CardDescription>
                          Start the discussion for your students
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={loading}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Start Discussion
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Discussion Summary</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {formData.category.replace('_', ' ')} discussion
                          </span>
                        </div>
                        
                        {formData.course_id && (
                          <div className="flex items-center space-x-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {courses.find(c => c.id.toString() === formData.course_id)?.title || 'Selected course'}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            All enrolled students can participate
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Moderation Tools</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground space-y-2">
                        <p>After creating the discussion, you can:</p>
                        <ul className="space-y-1 ml-4">
                          <li>• Pin important discussions</li>
                          <li>• Lock discussions when needed</li>
                          <li>• Moderate student responses</li>
                          <li>• Reply to student questions</li>
                        </ul>
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