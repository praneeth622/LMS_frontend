"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownEditor } from "@/components/discussion/markdown-editor"
import { toast } from "react-hot-toast"
import { discussionApi } from "@/lib/discussion-api"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import dynamic from "next/dynamic"

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

export default function CreateDiscussionPage() {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [type, setType] = React.useState<'question' | 'discussion' | 'announcement'>('question')
  const [courseId, setCourseId] = React.useState<string>("")
  const [lectureId, setLectureId] = React.useState<string>("")
  const [loading, setLoading] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write')
  
  const { userProfile } = useAuth()
  const router = useRouter()

  // Mock courses and lectures data
  const courses = [
    { id: 1, title: "React Fundamentals" },
    { id: 2, title: "Advanced JavaScript" },
    { id: 3, title: "CSS Grid & Flexbox" }
  ]

  const lectures = [
    { id: 1, title: "Introduction to React", course_id: 1 },
    { id: 2, title: "Components and Props", course_id: 1 },
    { id: 3, title: "ES6 Features", course_id: 2 },
    { id: 4, title: "Async/Await", course_id: 2 }
  ]

  const filteredLectures = lectures.filter(lecture => 
    courseId ? lecture.course_id === parseInt(courseId) : false
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!userProfile?.id) {
      toast.error('You must be logged in to create a discussion')
      return
    }

    try {
      setLoading(true)
      
      const discussionData = {
        title: title.trim(),
        content: content.trim(),
        type,
        user_id: userProfile.id,
        course_id: courseId ? parseInt(courseId) : undefined,
        lecture_id: lectureId ? parseInt(lectureId) : undefined
      }

      const response = await discussionApi.createDiscussion(discussionData)
      
      if (response.success) {
        toast.success('Discussion created successfully!')
        router.push(`/discussions/${response.data.id}`)
      }
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Failed to create discussion')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDraft = () => {
    // Save to localStorage as draft
    const draft = {
      title,
      content,
      type,
      courseId,
      lectureId,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('discussion_draft', JSON.stringify(draft))
    toast.success('Draft saved!')
  }

  // Load draft on component mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('discussion_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setTitle(draft.title || '')
        setContent(draft.content || '')
        setType(draft.type || 'question')
        setCourseId(draft.courseId || '')
        setLectureId(draft.lectureId || '')
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  return (
    <ProtectedRoute allowedRoles={[1, 2, 3]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" asChild>
                  <Link href="/discussions">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Discussions
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Create Discussion</h1>
                  <p className="text-muted-foreground">Share your thoughts with the community</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Discussion'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Discussion Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Details</CardTitle>
                  <CardDescription>
                    Provide basic information about your discussion
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Discussion Type</Label>
                      <Select value={type} onValueChange={(value: any) => setType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          {userProfile?.role_id === 1 || userProfile?.role_id === 2 ? (
                            <SelectItem value="announcement">Announcement</SelectItem>
                          ) : null}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="course">Course (Optional)</Label>
                      <Select value={courseId} onValueChange={setCourseId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific course</SelectItem>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {courseId && (
                    <div className="space-y-2">
                      <Label htmlFor="lecture">Lecture (Optional)</Label>
                      <Select value={lectureId} onValueChange={setLectureId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select lecture" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">No specific lecture</SelectItem>
                          {filteredLectures.map((lecture) => (
                            <SelectItem key={lecture.id} value={lecture.id.toString()}>
                              {lecture.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a descriptive title for your discussion"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                  <CardDescription>
                    Write your discussion content using Markdown formatting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="write">Write</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="write" className="mt-4">
                      <MarkdownEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Write your discussion content here... You can use Markdown formatting!"
                        minHeight={300}
                        showPreview={false}
                      />
                    </TabsContent>
                    
                    <TabsContent value="preview" className="mt-4">
                      <div className="min-h-[300px] p-6 border rounded-lg bg-muted/30">
                        {content ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown>{content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-muted-foreground italic">Nothing to preview yet. Start writing in the Write tab!</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Be respectful and constructive in your discussions</p>
                    <p>• Search existing discussions before creating a new one</p>
                    <p>• Use clear, descriptive titles</p>
                    <p>• Include relevant details and context</p>
                    <p>• Tag your discussion with the appropriate course/lecture if applicable</p>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}