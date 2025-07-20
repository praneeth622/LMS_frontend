"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Trophy,
  Calendar,
  AlertCircle,
  Info,
  Filter,
  Search,
  MoreVertical,
  Trash2,
  Eye
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

interface Notification {
  id: number
  title: string
  message: string
  type: 'course' | 'assignment' | 'discussion' | 'achievement' | 'system' | 'reminder'
  priority: 'low' | 'medium' | 'high'
  read: boolean
  created_at: string
  action_url?: string
  metadata?: {
    course_id?: number
    assignment_id?: number
    discussion_id?: number
  }
}

export default function StudentNotifications() {
  const { userProfile } = useAuth()
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [selectedNotifications, setSelectedNotifications] = React.useState<number[]>([])

  // Mock data - replace with actual API calls
  React.useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Assignment Posted",
        message: "A new assignment 'Build a React Todo App' has been posted in Complete Web Development Bootcamp",
        type: "assignment",
        priority: "high",
        read: false,
        created_at: "2024-12-20T10:30:00Z",
        action_url: "/student/assignments/1",
        metadata: { course_id: 1, assignment_id: 1 }
      },
      {
        id: 2,
        title: "Assignment Due Tomorrow",
        message: "Your assignment 'CSS Grid Layout Project' is due tomorrow at 11:59 PM",
        type: "reminder",
        priority: "high",
        read: false,
        created_at: "2024-12-19T09:00:00Z",
        action_url: "/student/assignments/2",
        metadata: { assignment_id: 2 }
      },
      {
        id: 3,
        title: "New Discussion Reply",
        message: "John Smith replied to your discussion 'Question about React Hooks'",
        type: "discussion",
        priority: "medium",
        read: false,
        created_at: "2024-12-19T15:45:00Z",
        action_url: "/student/discussions/5",
        metadata: { discussion_id: 5 }
      },
      {
        id: 4,
        title: "Course Progress Milestone",
        message: "Congratulations! You've completed 75% of Advanced JavaScript Concepts",
        type: "achievement",
        priority: "medium",
        read: true,
        created_at: "2024-12-18T14:20:00Z",
        action_url: "/student/courses/2",
        metadata: { course_id: 2 }
      },
      {
        id: 5,
        title: "New Course Available",
        message: "A new course 'UI/UX Design Fundamentals' is now available for enrollment",
        type: "course",
        priority: "low",
        read: true,
        created_at: "2024-12-17T11:00:00Z",
        action_url: "/student/courses"
      },
      {
        id: 6,
        title: "Assignment Graded",
        message: "Your assignment 'JavaScript Algorithm Challenge' has been graded. Score: 85/100",
        type: "assignment",
        priority: "medium",
        read: true,
        created_at: "2024-12-16T16:30:00Z",
        action_url: "/student/assignments/3",
        metadata: { assignment_id: 3 }
      },
      {
        id: 7,
        title: "System Maintenance",
        message: "Scheduled maintenance will occur on Dec 22, 2024 from 2:00 AM to 4:00 AM EST",
        type: "system",
        priority: "low",
        read: true,
        created_at: "2024-12-15T10:00:00Z"
      }
    ]

    setTimeout(() => {
      setNotifications(mockNotifications)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || notification.type === typeFilter
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "read" && notification.read) ||
                         (statusFilter === "unread" && !notification.read)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course': return BookOpen
      case 'assignment': return FileText
      case 'discussion': return MessageSquare
      case 'achievement': return Trophy
      case 'reminder': return Calendar
      case 'system': return Info
      default: return Bell
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'text-red-600'
    if (priority === 'medium') return 'text-yellow-600'
    
    switch (type) {
      case 'course': return 'text-blue-600'
      case 'assignment': return 'text-purple-600'
      case 'discussion': return 'text-green-600'
      case 'achievement': return 'text-yellow-600'
      case 'reminder': return 'text-orange-600'
      case 'system': return 'text-gray-600'
      default: return 'text-blue-600'
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">High</Badge>
      case 'medium': return <Badge variant="secondary">Medium</Badge>
      case 'low': return <Badge variant="outline">Low</Badge>
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const handleMarkAsRead = async (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    )
    // TODO: Make API call to mark as read
  }

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
    // TODO: Make API call to mark all as read
  }

  const handleDeleteNotification = async (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    )
    // TODO: Make API call to delete notification
  }

  const handleBulkAction = async (action: 'read' | 'delete') => {
    if (action === 'read') {
      setNotifications(prev => 
        prev.map(notification => 
          selectedNotifications.includes(notification.id)
            ? { ...notification, read: true }
            : notification
        )
      )
    } else if (action === 'delete') {
      setNotifications(prev => 
        prev.filter(notification => !selectedNotifications.includes(notification.id))
      )
    }
    setSelectedNotifications([])
    // TODO: Make API calls for bulk actions
  }

  const handleSelectNotification = (notificationId: number, checked: boolean) => {
    if (checked) {
      setSelectedNotifications(prev => [...prev, notificationId])
    } else {
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const getNotificationStats = () => {
    const total = notifications.length
    const unread = notifications.filter(n => !n.read).length
    const high = notifications.filter(n => n.priority === 'high').length
    
    return { total, unread, high }
  }

  const stats = getNotificationStats()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Notifications"
            subtitle="Stay updated with your learning activities"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Unread</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.unread}</p>
                      </div>
                      <BellRing className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">High Priority</p>
                        <p className="text-2xl font-bold text-red-600">{stats.high}</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions Bar */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search notifications..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="course">Course</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="discussion">Discussion</SelectItem>
                          <SelectItem value="achievement">Achievement</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="unread">Unread</SelectItem>
                          <SelectItem value="read">Read</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {selectedNotifications.length > 0 && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleBulkAction('read')}>
                            <Check className="h-4 w-4 mr-1" />
                            Mark Read
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleBulkAction('delete')}>
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </>
                      )}
                      <Button size="sm" onClick={handleMarkAllAsRead}>
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark All Read
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Notifications</CardTitle>
                    {filteredNotifications.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedNotifications.length === filteredNotifications.length}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm text-muted-foreground">Select All</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="flex items-start space-x-4 p-4 border rounded-lg">
                            <div className="w-10 h-10 bg-muted rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : filteredNotifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No notifications found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || typeFilter !== "all" || statusFilter !== "all" 
                            ? "Try adjusting your filters" 
                            : "You're all caught up!"}
                        </p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification, index) => {
                        const NotificationIcon = getNotificationIcon(notification.type)
                        const iconColor = getNotificationColor(notification.type, notification.priority)
                        
                        return (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            className={`flex items-start space-x-4 p-4 border rounded-lg transition-all duration-200 hover:shadow-md ${
                              !notification.read ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox
                              checked={selectedNotifications.includes(notification.id)}
                              onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                            />
                            
                            <div className={`p-2 rounded-full ${!notification.read ? 'bg-blue-100' : 'bg-muted'}`}>
                              <NotificationIcon className={`h-5 w-5 ${iconColor}`} />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                    {getPriorityBadge(notification.priority)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(notification.created_at)}
                                    </span>
                                    {notification.action_url && (
                                      <Button size="sm" variant="ghost" asChild>
                                        <Link href={notification.action_url}>
                                          <Eye className="h-3 w-3 mr-1" />
                                          View
                                        </Link>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                                
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {!notification.read && (
                                      <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                        <Check className="h-4 w-4 mr-2" />
                                        Mark as read
                                      </DropdownMenuItem>
                                    )}
                                    {notification.action_url && (
                                      <DropdownMenuItem asChild>
                                        <Link href={notification.action_url}>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View details
                                        </Link>
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteNotification(notification.id)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })
                    )}
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