"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Save, Eye } from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
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
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import dynamic from "next/dynamic"

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

export default function CreateStudentDiscussionPage() {
  const [title, setTitle] = React.useState("")
  const [content, setContent] = React.useState("")
  const [type, setType] = React.useState<'question' | 'discussion'>('question')
  const [courseId, setCourseId] = React.useState<string>("none")
  const [lectureId, setLectureId] = React.useState<string>("none")
  const [submitting, setSubmitting] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write')
  
  const { userProfile, user, loading } = useAuth()
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
    courseId && courseId !== "none" ? lecture.course_id === parseInt(courseId) : false
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (loading) {
      toast.error('Please wait while we verify your authentication...')
      return
    }
    
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!userProfile?.id) {
      if (!user?.email) {
        toast.error('You must be logged in to create a discussion.')
        router.push('/login')
        return
      } else {
        toast.error('Your session data is incomplete. Please sign out and sign in again to continue.')
        return
      }
    }

    try {
      setSubmitting(true)
      
      const discussionData = {
        title: title.trim(),
        content: content.trim(),
        type,
        user_id: userProfile.id,
        course_id: courseId && courseId !== "none" ? parseInt(courseId) : undefined,
        lecture_id: lectureId && lectureId !== "none" ? parseInt(lectureId) : undefined
      }

      // TODO: Replace with actual API call
      console.log('Creating discussion:', discussionData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Discussion created successfully!')
      router.push('/student/discussions')
    } catch (error) {
      console.error('Error creating discussion:', error)
      toast.error('Failed to create discussion')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    const draft = {
      title,
      content,
      type,
      courseId,
      lectureId,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('student_discussion_draft', JSON.stringify(draft))
    toast.success('Draft saved!')
  }

  // Load draft on component mount
  React.useEffect(() => {
    const savedDraft = localStorage.getItem('student_discussion_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        setTitle(draft.title || '')
        setContent(draft.content || '')
        setType(draft.type || 'question')
        setCourseId(draft.courseId || 'none')
        setLectureId(draft.lectureId || 'none')
      } catch (error) {
        console.error('Error loading draft:', error)
      }
    }
  }, [])

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar
          
          
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader title="Create Discussion" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" asChild>
                    <Link href="/student/discussions">
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
                  <Button onClick={handleSubmit} disabled={submitting || loading || (!!user && !userProfile) || !title.trim() || !content.trim()}>
                    {loading ? 'Verifying...' : submitting ? 'Creating...' : (user && !userProfile) ? 'Session Invalid' : 'Create Discussion'}
                  </Button>
                </div>
              </div>

              {user && !userProfile && !loading && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                        Session Data Missing
                      </h3>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Your session data is incomplete. Please{' '}
                        <button 
                          onClick={() => router.push('/login')}
                          className="underline hover:no-underline"
                        >
                          sign out and sign in again
                        </button>{' '}
                        to continue.
                      </p>
                    </div>
                  </div>
                </div>
              )}

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
                            <SelectItem value="none">No specific course</SelectItem>
                            {courses.map((course) => (
                              <SelectItem key={course.id} value={course.id.toString()}>
                                {course.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {courseId && courseId !== "none" && (
                      <div className="space-y-2">
                        <Label htmlFor="lecture">Lecture (Optional)</Label>
                        <Select value={lectureId} onValueChange={setLectureId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lecture" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No specific lecture</SelectItem>
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
      </div>
    </ProtectedRoute>
  )
}