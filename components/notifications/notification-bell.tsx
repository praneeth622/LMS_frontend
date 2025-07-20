"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  X, 
  Settings,
  Clock,
  User,
  BookOpen,
  Award,
  MessageSquare,
  AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { notificationApi, Notification } from "@/lib/notification-api"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "react-hot-toast"
import Link from "next/link"

interface NotificationBellProps {
  onPreferencesClick?: () => void
}

export function NotificationBell({ onPreferencesClick }: NotificationBellProps) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = React.useState(0)
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { userProfile } = useAuth()

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchNotifications()
      fetchUnreadCount()
      
      // Set up polling for real-time updates
      const interval = setInterval(() => {
        fetchUnreadCount()
        if (isOpen) {
          fetchNotifications()
        }
      }, 30000) // Poll every 30 seconds
      
      return () => clearInterval(interval)
    }
  }, [userProfile?.id, isOpen])

  const fetchNotifications = async () => {
    if (!userProfile?.id) return
    
    try {
      setLoading(true)
      const response = await notificationApi.getUserNotifications(userProfile.id, 1, 10)
      if (response.success) {
        setNotifications(response.data)
      } else {
        // Mock data fallback
        setNotifications([
          {
            id: 1,
            user_id: userProfile.id,
            type: 'grade_notification',
            title: 'Assignment Graded',
            message: 'Your React Fundamentals assignment has been graded. You scored 95/100!',
            read_flag: false,
            created_at: new Date(Date.now() - 3600000).toISOString(),
            updated_at: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: 2,
            user_id: userProfile.id,
            type: 'discussion_reply',
            title: 'New Reply',
            message: 'John Instructor replied to your question about React hooks.',
            read_flag: false,
            created_at: new Date(Date.now() - 7200000).toISOString(),
            updated_at: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: 3,
            user_id: userProfile.id,
            type: 'assignment_deadline',
            title: 'Assignment Due Soon',
            message: 'Your JavaScript Fundamentals assignment is due in 2 days.',
            read_flag: true,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            updated_at: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: 4,
            user_id: userProfile.id,
            type: 'certificate_generated',
            title: 'Certificate Ready',
            message: 'Your completion certificate for Web Development Basics is ready for download.',
            read_flag: true,
            created_at: new Date(Date.now() - 172800000).toISOString(),
            updated_at: new Date(Date.now() - 172800000).toISOString()
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    if (!userProfile?.id) return
    
    try {
      const response = await notificationApi.getUnreadCount(userProfile.id)
      if (response.success) {
        setUnreadCount(response.data.unread_count)
      } else {
        // Mock unread count
        const mockUnreadCount = notifications.filter(n => !n.read_flag).length
        setUnreadCount(mockUnreadCount)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
      // Fallback to counting unread notifications locally
      const localUnreadCount = notifications.filter(n => !n.read_flag).length
      setUnreadCount(localUnreadCount)
    }
  }

  const markAsRead = async (notificationId: number) => {
    try {
      await notificationApi.markAsRead(notificationId)
      
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, read_flag: true } : n
      ))
      
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!userProfile?.id) return
    
    try {
      await notificationApi.markAllAsRead(userProfile.id)
      
      setNotifications(prev => prev.map(n => ({ ...n, read_flag: true })))
      setUnreadCount(0)
      
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
      
      // Update unread count if the deleted notification was unread
      const deletedNotification = notifications.find(n => n.id === notificationId)
      if (deletedNotification && !deletedNotification.read_flag) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
      
      toast.success('Notification deleted')
    } catch (error) {
      console.error('Error deleting notification:', error)
      toast.error('Failed to delete notification')
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'grade_notification':
        return <Award className="h-4 w-4 text-yellow-500" />
      case 'discussion_reply':
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case 'assignment_deadline':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'course_enrollment':
        return <BookOpen className="h-4 w-4 text-green-500" />
      case 'certificate_generated':
        return <Award className="h-4 w-4 text-purple-500" />
      case 'system_announcement':
        return <AlertTriangle className="h-4 w-4 text-critical" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <motion.div
            animate={unreadCount > 0 ? { rotate: [0, 15, -15, 0] } : {}}
            transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
          >
            {unreadCount > 0 ? (
              <BellRing className="h-5 w-5" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
          </motion.div>
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1"
              >
                <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={onPreferencesClick}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <ScrollArea className="h-96">
          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-start space-x-3 p-3">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 hover:bg-muted/50 transition-colors border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.read_flag ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read_flag ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read_flag && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <>
            <Separator />
            <div className="p-3">
              <Button variant="ghost" className="w-full text-sm" asChild>
                <Link href="/notifications">View all notifications</Link>
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}