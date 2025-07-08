"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Video,
  AlertCircle,
  Filter,
  List,
  Grid3X3
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

interface CalendarEvent {
  id: number
  title: string
  description?: string
  type: 'assignment' | 'quiz' | 'lecture' | 'discussion' | 'meeting' | 'deadline'
  start_time: string
  end_time?: string
  course?: {
    id: number
    title: string
    color: string
  }
  location?: string
  url?: string
  priority: 'low' | 'medium' | 'high'
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed'
}

export default function StudentCalendar() {
  const { userProfile } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [events, setEvents] = React.useState<CalendarEvent[]>([])
  const [loading, setLoading] = React.useState(true)
  const [currentDate, setCurrentDate] = React.useState(new Date())
  const [viewMode, setViewMode] = React.useState<'month' | 'week' | 'day' | 'list'>('month')
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEvent | null>(null)

  // Mock data - replace with actual API calls
  React.useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: 1,
        title: "React Todo App Assignment Due",
        description: "Submit your React todo application with all required features",
        type: "assignment",
        start_time: "2024-12-25T23:59:00Z",
        course: { id: 1, title: "Complete Web Development Bootcamp", color: "#3b82f6" },
        priority: "high",
        status: "upcoming",
        url: "/student/assignments/1"
      },
      {
        id: 2,
        title: "JavaScript Fundamentals Quiz",
        description: "Quiz covering ES6 features, async programming, and DOM manipulation",
        type: "quiz",
        start_time: "2024-12-22T14:00:00Z",
        end_time: "2024-12-22T15:30:00Z",
        course: { id: 2, title: "Advanced JavaScript Concepts", color: "#10b981" },
        priority: "medium",
        status: "upcoming",
        url: "/student/assessments/quiz/2"
      },
      {
        id: 3,
        title: "Live Coding Session: React Hooks",
        description: "Interactive session covering useState, useEffect, and custom hooks",
        type: "lecture",
        start_time: "2024-12-21T16:00:00Z",
        end_time: "2024-12-21T17:30:00Z",
        course: { id: 1, title: "Complete Web Development Bootcamp", color: "#3b82f6" },
        location: "Virtual Classroom",
        priority: "medium",
        status: "upcoming",
        url: "/student/learn/1"
      },
      {
        id: 4,
        title: "Discussion: Best Practices in Web Development",
        description: "Share your experiences and learn from peers about web development best practices",
        type: "discussion",
        start_time: "2024-12-23T10:00:00Z",
        course: { id: 1, title: "Complete Web Development Bootcamp", color: "#3b82f6" },
        priority: "low",
        status: "upcoming",
        url: "/student/discussions"
      },
      {
        id: 5,
        title: "CSS Grid Layout Project Deadline",
        description: "Final submission deadline for the CSS Grid layout project",
        type: "deadline",
        start_time: "2024-12-20T23:59:00Z",
        course: { id: 1, title: "Complete Web Development Bootcamp", color: "#3b82f6" },
        priority: "high",
        status: "completed"
      },
      {
        id: 6,
        title: "One-on-One Mentoring Session",
        description: "Personal mentoring session to discuss progress and career goals",
        type: "meeting",
        start_time: "2024-12-24T15:00:00Z",
        end_time: "2024-12-24T16:00:00Z",
        location: "Zoom Meeting",
        priority: "medium",
        status: "upcoming"
      }
    ]

    setTimeout(() => {
      setEvents(mockEvents)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredEvents = events.filter(event => {
    if (typeFilter === "all") return true
    return event.type === typeFilter
  })

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'assignment': return FileText
      case 'quiz': return BookOpen
      case 'lecture': return Video
      case 'discussion': return MessageSquare
      case 'meeting': return Users
      case 'deadline': return AlertCircle
      default: return CalendarIcon
    }
  }

  const getEventColor = (type: string, priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-800 border-red-200'
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    
    switch (type) {
      case 'assignment': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'quiz': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'lecture': return 'bg-green-100 text-green-800 border-green-200'
      case 'discussion': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'meeting': return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': return <Badge variant="default">Upcoming</Badge>
      case 'ongoing': return <Badge variant="secondary">Ongoing</Badge>
      case 'completed': return <Badge variant="outline">Completed</Badge>
      case 'missed': return <Badge variant="destructive">Missed</Badge>
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUpcomingEvents = () => {
    const now = new Date()
    return events
      .filter(event => new Date(event.start_time) > now)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, 5)
  }

  const getTodayEvents = () => {
    const today = new Date()
    const todayStr = today.toDateString()
    
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.toDateString() === todayStr
    })
  }

  const getEventStats = () => {
    const total = events.length
    const upcoming = events.filter(e => e.status === 'upcoming').length
    const completed = events.filter(e => e.status === 'completed').length
    const highPriority = events.filter(e => e.priority === 'high' && e.status === 'upcoming').length
    
    return { total, upcoming, completed, highPriority }
  }

  const stats = getEventStats()
  const upcomingEvents = getUpcomingEvents()
  const todayEvents = getTodayEvents()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Calendar"
            subtitle="Manage your schedule and upcoming events"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Events</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">High Priority</p>
                        <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Calendar Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <h3 className="text-lg font-semibold">
                          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <Button size="sm" variant="outline">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button size="sm" variant="outline">
                        Today
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Events</SelectItem>
                          <SelectItem value="assignment">Assignments</SelectItem>
                          <SelectItem value="quiz">Quizzes</SelectItem>
                          <SelectItem value="lecture">Lectures</SelectItem>
                          <SelectItem value="discussion">Discussions</SelectItem>
                          <SelectItem value="meeting">Meetings</SelectItem>
                          <SelectItem value="deadline">Deadlines</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
                        <TabsList>
                          <TabsTrigger value="month">Month</TabsTrigger>
                          <TabsTrigger value="week">Week</TabsTrigger>
                          <TabsTrigger value="day">Day</TabsTrigger>
                          <TabsTrigger value="list">List</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar/Events List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {viewMode === 'list' ? 'All Events' : 'Calendar View'}
                      </CardTitle>
                      <CardDescription>
                        {viewMode === 'list' 
                          ? 'List of all your scheduled events'
                          : 'Visual calendar representation of your events'
                        }
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {viewMode === 'list' ? (
                        <div className="space-y-3">
                          {loading ? (
                            [...Array(5)].map((_, i) => (
                              <div key={i} className="animate-pulse">
                                <div className="flex items-center space-x-4 p-4 border rounded-lg">
                                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-3 bg-muted rounded w-1/2"></div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : filteredEvents.length === 0 ? (
                            <div className="text-center py-8">
                              <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-foreground mb-2">No events found</h3>
                              <p className="text-muted-foreground">
                                {typeFilter !== "all" 
                                  ? "Try changing the filter to see more events" 
                                  : "Your calendar is empty"}
                              </p>
                            </div>
                          ) : (
                            filteredEvents.map((event, index) => {
                              const EventIcon = getEventIcon(event.type)
                              const colorClass = getEventColor(event.type, event.priority)
                              
                              return (
                                <motion.div
                                  key={event.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: index * 0.05 }}
                                  className={`p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${colorClass}`}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  <div className="flex items-start space-x-4">
                                    <div className="p-2 bg-white/50 rounded-lg">
                                      <EventIcon className="h-5 w-5" />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h4 className="font-medium text-sm mb-1">{event.title}</h4>
                                          {event.description && (
                                            <p className="text-xs opacity-80 mb-2 line-clamp-2">
                                              {event.description}
                                            </p>
                                          )}
                                          <div className="flex items-center space-x-4 text-xs opacity-80">
                                            <div className="flex items-center">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {formatTime(event.start_time)}
                                              {event.end_time && ` - ${formatTime(event.end_time)}`}
                                            </div>
                                            {event.location && (
                                              <div className="flex items-center">
                                                <MapPin className="h-3 w-3 mr-1" />
                                                {event.location}
                                              </div>
                                            )}
                                          </div>
                                          {event.course && (
                                            <p className="text-xs opacity-80 mt-1">
                                              {event.course.title}
                                            </p>
                                          )}
                                        </div>
                                        
                                        <div className="flex flex-col items-end space-y-1">
                                          {getStatusBadge(event.status)}
                                          <p className="text-xs opacity-80">
                                            {formatDate(event.start_time)}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )
                            })
                          )}
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-muted/20 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Grid3X3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium text-foreground mb-2">Calendar View</p>
                            <p className="text-sm text-muted-foreground">
                              Calendar grid view coming soon. Use List view to see all events.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Today's Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Today's Events</CardTitle>
                      <CardDescription>
                        {todayEvents.length} event{todayEvents.length !== 1 ? 's' : ''} scheduled for today
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {todayEvents.length === 0 ? (
                          <div className="text-center py-4">
                            <CalendarIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No events today</p>
                          </div>
                        ) : (
                          todayEvents.map((event) => {
                            const EventIcon = getEventIcon(event.type)
                            
                            return (
                              <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                                <EventIcon className="h-4 w-4 text-muted-foreground" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(event.start_time)}
                                  </p>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Upcoming Events */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Upcoming Events</CardTitle>
                      <CardDescription>
                        Next 5 upcoming events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {upcomingEvents.length === 0 ? (
                          <div className="text-center py-4">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">No upcoming events</p>
                          </div>
                        ) : (
                          upcomingEvents.map((event) => {
                            const EventIcon = getEventIcon(event.type)
                            
                            return (
                              <div key={event.id} className="flex items-start space-x-3 p-2 hover:bg-muted rounded-lg cursor-pointer">
                                <EventIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{event.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDate(event.start_time)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatTime(event.start_time)}
                                  </p>
                                </div>
                                {event.priority === 'high' && (
                                  <AlertCircle className="h-3 w-3 text-red-500" />
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/courses">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Courses
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/assignments">
                          <FileText className="mr-2 h-4 w-4" />
                          View Assignments
                        </Link>
                      </Button>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <Link href="/student/assessments">
                          <BookOpen className="mr-2 h-4 w-4" />
                          View Assessments
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Event Details Dialog */}
              <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                <DialogContent>
                  {selectedEvent && (
                    <>
                      <DialogHeader>
                        <DialogTitle>{selectedEvent.title}</DialogTitle>
                        <DialogDescription>
                          {selectedEvent.course?.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        {selectedEvent.description && (
                          <div>
                            <h4 className="font-medium mb-2">Description</h4>
                            <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{formatDate(selectedEvent.start_time)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground">
                              {formatTime(selectedEvent.start_time)}
                              {selectedEvent.end_time && ` - ${formatTime(selectedEvent.end_time)}`}
                            </p>
                          </div>
                          {selectedEvent.location && (
                            <div>
                              <p className="font-medium">Location</p>
                              <p className="text-muted-foreground">{selectedEvent.location}</p>
                            </div>
                          )}
                          <div>
                            <p className="font-medium">Priority</p>
                            <p className="text-muted-foreground capitalize">{selectedEvent.priority}</p>
                          </div>
                        </div>
                        
                        {selectedEvent.url && (
                          <div className="flex justify-end">
                            <Button asChild>
                              <Link href={selectedEvent.url}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}