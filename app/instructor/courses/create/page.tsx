"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye } from "lucide-react"
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

const categories = [
  "Programming",
  "Web Development",
  "Mobile Development",
  "Data Science",
  "Machine Learning",
  "Design",
  "Business",
  "Marketing",
  "Photography",
  "Music",
  "Language",
  "Other"
]

export default function CreateCoursePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    category: '',
    price: '',
    status: 'draft' as 'draft' | 'published'
  })
  
  const router = useRouter()
  const { userProfile } = useAuth()

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
      toast.error('Course title is required')
      return
    }

    try {
      setLoading(true)
      
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        created_by: userProfile.id,
        status: formData.status
      }

      const response = await instructorApi.createCourse(courseData)
      
      if (response.success) {
        toast.success('Course created successfully!')
        router.push('/instructor/courses')
      } else {
        toast.error(response.message || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    setFormData(prev => ({ ...prev, status: 'draft' }))
    // The form submission will handle the actual save
    setTimeout(() => {
      const form = document.getElementById('course-form') as HTMLFormElement
      form?.requestSubmit()
    }, 0)
  }

  const handlePublish = async () => {
    setFormData(prev => ({ ...prev, status: 'published' }))
    // The form submission will handle the actual save
    setTimeout(() => {
      const form = document.getElementById('course-form') as HTMLFormElement
      form?.requestSubmit()
    }, 0)
  }

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Create New Course"
            subtitle="Build and publish your course content"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Back Button */}
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/instructor/courses">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Courses
                  </Link>
                </Button>
              </div>

              {/* Course Creation Form */}
              <form id="course-form" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Information</CardTitle>
                        <CardDescription>
                          Provide basic information about your course
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Course Title *</Label>
                          <Input
                            id="title"
                            placeholder="Enter course title"
                            value={formData.title}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe what students will learn in this course"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={formData.category}
                              onValueChange={(value) => handleInputChange('category', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="price">Price ($)</Label>
                            <Input
                              id="price"
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={formData.price}
                              onChange={(e) => handleInputChange('price', e.target.value)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Publish</CardTitle>
                        <CardDescription>
                          Save your course or publish it for students
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleSaveAsDraft}
                          disabled={loading}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save as Draft
                        </Button>
                        
                        <Button
                          type="button"
                          className="w-full"
                          onClick={handlePublish}
                          disabled={loading || !formData.title.trim()}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Publish Course
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Course Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          Status: <span className="font-medium capitalize">{formData.status}</span>
                        </div>
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