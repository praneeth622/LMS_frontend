"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Plus, Search, Filter, MessageSquare, Clock, User, ChevronRight } from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

// Mock data for discussions
const discussions = [
  {
    id: 1,
    title: "Question about React Hooks",
    content: "I'm having trouble understanding useEffect. Can someone explain when to use it?",
    type: "question",
    author: "John Doe",
    course: "React Fundamentals",
    replies: 5,
    lastActivity: "2 hours ago",
    isAnswered: false
  },
  {
    id: 2,
    title: "Assignment 3 Clarification",
    content: "Could someone clarify the requirements for the final project?",
    type: "question",
    author: "Jane Smith",
    course: "Advanced JavaScript",
    replies: 12,
    lastActivity: "4 hours ago",
    isAnswered: true
  },
  {
    id: 3,
    title: "Study Group for Midterm",
    content: "Anyone interested in forming a study group for the upcoming midterm exam?",
    type: "discussion",
    author: "Mike Johnson",
    course: "CSS Grid & Flexbox",
    replies: 8,
    lastActivity: "1 day ago",
    isAnswered: false
  },
  {
    id: 4,
    title: "Course Update: New Resources Added",
    content: "We've added new video tutorials and practice exercises to the course.",
    type: "announcement",
    author: "Prof. Wilson",
    course: "React Fundamentals",
    replies: 3,
    lastActivity: "2 days ago",
    isAnswered: false
  }
]

const courses = [
  { id: 1, title: "React Fundamentals" },
  { id: 2, title: "Advanced JavaScript" },
  { id: 3, title: "CSS Grid & Flexbox" }
]

export default function StudentDiscussionsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState("all")
  const [selectedType, setSelectedType] = React.useState("all")

  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCourse = selectedCourse === "all" || discussion.course === selectedCourse
    const matchesType = selectedType === "all" || discussion.type === selectedType
    
    return matchesSearch && matchesCourse && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case "question":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "discussion":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "announcement":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader title="Discussions" />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Discussions</h1>
                  <p className="text-muted-foreground">
                    Engage with your classmates and instructors
                  </p>
                </div>
                <Button asChild>
                  <Link href="/student/discussions/create">
                    <Plus className="mr-2 h-4 w-4" />
                    New Discussion
                  </Link>
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search discussions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.title}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="question">Questions</SelectItem>
                        <SelectItem value="discussion">Discussions</SelectItem>
                        <SelectItem value="announcement">Announcements</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Discussions List */}
              <div className="space-y-4">
                {filteredDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <Badge className={getTypeColor(discussion.type)}>
                                {discussion.type.charAt(0).toUpperCase() + discussion.type.slice(1)}
                              </Badge>
                              {discussion.isAnswered && (
                                <Badge variant="outline" className="text-green-600 border-green-600">
                                  Answered
                                </Badge>
                              )}
                            </div>
                            
                            <div>
                              <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                <Link href={`/student/discussions/${discussion.id}`}>
                                  {discussion.title}
                                </Link>
                              </h3>
                              <p className="text-muted-foreground mt-1 line-clamp-2">
                                {discussion.content}
                              </p>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {discussion.author}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {discussion.replies} replies
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {discussion.lastActivity}
                              </div>
                              <Badge variant="secondary">
                                {discussion.course}
                              </Badge>
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/student/discussions/${discussion.id}`}>
                              <ChevronRight className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredDiscussions.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No discussions found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search criteria or start a new discussion.
                    </p>
                    <Button asChild>
                      <Link href="/student/discussions/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Start New Discussion
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}