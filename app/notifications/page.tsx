"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Bell, 
  Check, 
  CheckCheck, 
  X, 
  Filter,
  Search,
  Settings,
  Trash2,
  Archive,
  Clock,
  Award,
  MessageSquare,
  BookOpen,
  AlertTriangle
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { NotificationPreferencesPanel } from "@/components/notifications/notification-preferences"
import { formatDistanceToNow } from "date-fns"
import { notificationApi, Notification } from "@/lib/notification-api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = React.useState<Notification[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState("all")
  const [selectedNotifications, setSelectedNotifications] = React.useState<number[]>([])
  const [isPreferencesOpen, setIsPreferencesOpen] = React.useState(false)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)
  
  const { userProfile } = useAuth()

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchNotifications()
    }
  }, [userProfile?.id, currentPage])

  React.useEffect(() => {
    filterNotifications()
  }, [notifications, searchQuery, filterType])

  const fetchNotifications = async () => {
    if (!userProfile?.id) return
    
    try {
      setLoading(true)
      const response = await notificationApi.getUserNotifications(userProfile.id, currentPage, 20)
      
      if (response.success) {
        setNotifications(response.data)
        if (response.meta) {
          setTotalPages(response.meta.totalPages)
        }
      } else {
        // Mock data fallback
        const mockNotifications: Notification[] = [
          {
            id: 1,
            user_id: userProfile.id,
            type: 'grade_notification',
            title: 'Assignment Graded',
            message: 'Your React Fundamentals assignment has been graded. You scored 95/100! Great work on implementing the component lifecycle methods.',
            read_flag: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 2,
            user_id: userProfile.id,
            type: 'discussion_reply',
            title: 'New Reply to Your Question',
            message: 'John Instructor replied to your question about React hooks in the "React Fundamentals" discussion.',
            read_flag: false,
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 3,
            user_id: userProfile.id,
            type: 'assignment_deadline',
            title: 'Assignment Due Soon',
            message: 'Your JavaScript Fundamentals assignment "Build a Calculator" is due in 2 days. Don\'t forget to submit!',
            read_flag: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 4,
            user_id: userProfile.id,
            type: 'certificate_generated',
            title: 'Certificate Ready for Download',
            message: 'Congratulations! Your completion certificate for "Web Development Basics" is ready for download.',
            read_flag: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: 5,
            user_id: userProfile.id,
            type: 'course_enrollment',
            title: 'Successfully Enrolled',
            message: 'You have been successfully enrolled in "Advanced JavaScript Concepts". Welcome to the course!',
            read_flag: true,
            created_at: new Date(Date.now() - 259200000).toISOString(),
            updated_at: new Date(Date.now() - 259200000).toISOString()
          },
          {
            id: 6,
            user_id: userProfile.id,
            type: 'system_announcement',
            title: 'Platform Maintenance Scheduled',
            message: 'We will be performing scheduled maintenance on Sunday, January 14th from 2:00 AM to 4:00 AM EST. The platform may be temporarily unavailable.',
            read_flag: true,
            created_at: new Date(Date.now() - 345600000).toISOString(),
            updated_at: new Date(Date.now() - 345600000).toISOString()
          }
        ]
        setNotifications(mockNotifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      toast.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  const filterNotifications = () => {
    let filtered = notifications

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      if (filterType === 'unread') {
        filtered = filtered.filter(notification => !notification.read_flag)
      } else if (filterType === 'read') {
        filtered = filtered.filter(notification => notification.read_flag)
      } else {
        filtered = filtered.filter(notification => notification.type === filterType)
      }
    }

    setFilteredNotifications(filtered)
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId)
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read_flag: true } : n
      ))
      
      toast.success('Marked as read')
    } catch (error) {
      console.error('Error marking as read:', error)
      toast.error('Failed to mark as read')
    }
  }

  const markAllAsRead = async () => {
    if (!userProfile?.id) return
    
    try {
      await notificationApi.markAllAsRead(userProfile.id)
      
      setNotifications(prev => prev.map(n => ({ ...n, read_flag: true })))
      
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Error marking all as read:', error)
      toast.error('Failed to mark all as read')
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      await notificationApi.deleteNotification(notificationId)
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      setSelectedNotifications(prev => prev.filter(id => id !== notificationId))
      
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const deleteSelected = async () => {
    try {
      await Promise.all(selectedNotifications.map(id => notificationApi.deleteNotification(id)))
      
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)))
      setSelectedNotifications([])
      
      toast.success(`${selectedNotifications.length} notifications deleted`)
    } catch (error) {
      console.error('Error deleting notifications:', error)
      toast.error('Failed to delete notifications')
    }
  }

  const toggleSelection = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const selectAll = () => {
    setSelectedNotifications(filteredNotifications.map(n => n.id))
  }

  const clearSelection = () => {
    setSelectedNotifications([])
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'grade_notification':
        return <Award className="h-5 w-5 text-yellow-500" />
      case 'discussion_reply':
        return <MessageSquare className="h-5 w-5 text-blue-500" />
      case 'assignment_deadline':
        return <Clock className="h-5 w-5 text-orange-500" />
      case 'course_enrollment':
        return <BookOpen className="h-5 w-5 text-green-500" />
      case 'certificate_generated':
        return <Award className="h-5 w-5 text-purple-500" />
      case 'system_announcement':
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'grade_notification':
        return 'border-l-yellow-500'
      case 'discussion_reply':
        return 'border-l-blue-500'
      case 'assignment_deadline':
        return 'border-l-orange-500'
      case 'course_enrollment':
        return 'border-l-green-500'
      case 'certificate_generated':
        return 'border-l-purple-500'
      case 'system_announcement':
        return 'border-l-red-500'
      default:
        return 'border-l-muted'
    }
  }

  const unreadCount = notifications.filter(n => !n.read_flag).length

  return (
    <ProtectedRoute allowedRoles={[1, 2, 3]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
                <p className="text-muted-foreground mt-1">
                  Stay updated with your learning progress and activities
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {unreadCount > 0 && (
                  <Button onClick={markAllAsRead}>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark All Read ({unreadCount})
                  </Button>
                )}
                
                <Dialog open={isPreferencesOpen} onOpenChange={setIsPreferencesOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Settings className="mr-2 h-4 w-4" />
                      Preferences
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Notification Preferences</DialogTitle>
                      <DialogDescription>
                        Customize how you receive notifications
                      </DialogDescription>
                    </DialogHeader>
                    <NotificationPreferencesPanel onClose={() => setIsPreferencesOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Notifications</SelectItem>
                      <SelectItem value="unread">Unread</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="grade_notification">Grades</SelectItem>
                      <SelectItem value="discussion_reply">Discussions</SelectItem>
                      <SelectItem value="assignment_deadline">Assignments</SelectItem>
                      <SelectItem value="course_enrollment">Courses</SelectItem>
                      <SelectItem value="certificate_generated">Certificates</SelectItem>
                      <SelectItem value="system_announcement">Announcements</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedNotifications.length > 0 && (
                  <div className="flex items-center justify-between mt-4 p-3 bg-muted rounded-lg">
                    <span className="text-sm">
                      {selectedNotifications.length} notification{selectedNotifications.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={clearSelection}>
                        Clear
                      </Button>
                      <Button size="sm" variant="destructive" onClick={deleteSelected}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Card className={`border-l-4 ${getNotificationColor(notification.type)} ${
                      !notification.read_flag ? 'bg-primary/5' : ''
                    } hover:shadow-md transition-shadow`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          <Checkbox
                            checked={selectedNotifications.includes(notification.id)}
                            onCheckedChange={() => toggleSelection(notification.id)}
                            className="mt-1"
                          />
                          
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className={`text-sm font-medium ${
                                  !notification.read_flag ? 'text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                  {!notification.read_flag && (
                                    <Badge className="ml-2 h-5 w-5 p-0 bg-primary">
                                      <span className="sr-only">Unread</span>
                                    </Badge>
                                  )}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                </p>
                              </div>
                              
                              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                {!notification.read_flag && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => markAsRead(notification.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => deleteNotification(notification.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      {searchQuery || filterType !== 'all' ? 'No matching notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchQuery || filterType !== 'all' 
                        ? 'Try adjusting your search or filters'
                        : 'You\'ll see notifications here when you have new activity'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}