"use client"

import * as React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'

const categories = [
  "General Discussion",
  "Course Questions",
  "Technical Support",
  "Project Feedback",
  "Study Groups",
  "Announcements"
]

interface DiscussionFormData {
  title: string
  content: string
  category: string
  pinned: boolean
  allowComments: boolean
}

export default function CreateDiscussionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<DiscussionFormData>({
    title: '',
    content: '',
    category: '',
    pinned: false,
    allowComments: true
  })

  const handleInputChange = (field: keyof DiscussionFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Submit discussion logic
      console.log('Creating discussion:', formData)
      // router.push('/instructor/discussions')
    } catch (error) {
      console.error('Error creating discussion:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAsDraft = async () => {
    setLoading(true)
    try {
      // Save as draft logic
      console.log('Saving draft:', formData)
    } catch (error) {
      console.error('Error saving draft:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={['instructor']}>
      <div className="flex h-screen bg-gray-50">
        <InstructorSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Create Discussion"
            subtitle="Start a new discussion topic for your students"
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

              {/* Discussion Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
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
                          <Label htmlFor="content">Content</Label>
                          <Textarea
                            id="content"
                            placeholder="Write your discussion content here..."
                            rows={8}
                            value={formData.content}
                            onChange={(e) => handleInputChange('content', e.target.value)}
                          />
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
                          Save your discussion or publish it for students
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
                          type="submit"
                          className="w-full"
                          disabled={loading || !formData.title.trim()}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Publish Discussion
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Discussion Settings</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="pinned">Pin Discussion</Label>
                          <input
                            type="checkbox"
                            id="pinned"
                            checked={formData.pinned}
                            onChange={(e) => handleInputChange('pinned', e.target.checked)}
                            className="rounded"
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <Label htmlFor="allowComments">Allow Comments</Label>
                          <input
                            type="checkbox"
                            id="allowComments"
                            checked={formData.allowComments}
                            onChange={(e) => handleInputChange('allowComments', e.target.checked)}
                            className="rounded"
                          />
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
