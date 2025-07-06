"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { notificationApi, Notification } from '@/lib/notification-api'
import { useAuth } from '@/contexts/auth-context'
import { ToastNotification, useToastNotifications } from '@/components/notifications/toast-notifications'

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  refreshNotifications: () => Promise<void>
  markAsRead: (notificationId: number) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: number) => Promise<void>
  showToast: (toast: Omit<ToastNotification, 'id'>) => void
  toastNotifications: ToastNotification[]
  removeToast: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const { userProfile } = useAuth()
  const { notifications: toastNotifications, addNotification: showToast, removeNotification: removeToast } = useToastNotifications()

  const refreshNotifications = async () => {
    if (!userProfile?.id) return

    try {
      setLoading(true)
      const [notificationsResponse, unreadResponse] = await Promise.all([
        notificationApi.getUserNotifications(userProfile.id, 1, 10),
        notificationApi.getUnreadCount(userProfile.id)
      ])

      if (notificationsResponse.success) {
        setNotifications(notificationsResponse.data)
      }

      if (unreadResponse.success) {
        setUnreadCount(unreadResponse.data.unread_count)
      }
    } catch (error) {
      console.error('Error refreshing notifications:', error)
    } finally {
      setLoading(false)
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
      throw error
    }
  }

  const markAllAsRead = async () => {
    if (!userProfile?.id) return

    try {
      await notificationApi.markAllAsRead(userProfile.id)
      
      setNotifications(prev => prev.map(n => ({ ...n, read_flag: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }

  const deleteNotification = async (notificationId: number) => {
    try {
      await notificationApi.deleteNotification(notificationId)
      
      const deletedNotification = notifications.find(n => n.id === notificationId)
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      
      if (deletedNotification && !deletedNotification.read_flag) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      throw error
    }
  }

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (userProfile?.id) {
      refreshNotifications()
      
      const interval = setInterval(() => {
        refreshNotifications()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [userProfile?.id])

  // Show toast for new notifications
  useEffect(() => {
    const previousUnreadCount = unreadCount
    
    if (previousUnreadCount > 0 && unreadCount > previousUnreadCount) {
      const newNotifications = notifications.filter(n => !n.read_flag).slice(0, unreadCount - previousUnreadCount)
      
      newNotifications.forEach(notification => {
        showToast({
          type: 'info',
          title: notification.title,
          message: notification.message,
          duration: 5000
        })
      })
    }
  }, [unreadCount, notifications])

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      showToast,
      toastNotifications,
      removeToast
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}