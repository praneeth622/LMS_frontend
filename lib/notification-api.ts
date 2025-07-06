import { api } from './api'

export interface Notification {
  id: number
  user_id: number
  type: 'course_enrollment' | 'assignment_deadline' | 'quiz_available' | 'grade_notification' | 'discussion_reply' | 'certificate_generated' | 'system_announcement'
  title: string
  message: string
  data?: any
  read_flag: boolean
  created_at: string
  updated_at: string
}

export interface NotificationPreferences {
  user_id: number
  email_notifications: boolean
  push_notifications: boolean
  course_updates: boolean
  assignment_reminders: boolean
  discussion_notifications: boolean
  grade_notifications: boolean
  system_announcements: boolean
  digest_frequency: 'immediate' | 'daily' | 'weekly' | 'never'
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export const notificationApi = {
  // Get user notifications
  getUserNotifications: async (userId: number, page = 1, limit = 20): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get(`/notifications/user/${userId}?page=${page}&limit=${limit}`)
    return response.data
  },

  // Get unread count
  getUnreadCount: async (userId: number): Promise<ApiResponse<{ unread_count: number }>> => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`)
    return response.data
  },

  // Mark notification as read
  markAsRead: async (notificationId: number): Promise<ApiResponse<Notification>> => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await api.put(`/notifications/user/${userId}/read-all`)
    return response.data
  },

  // Create notification (for testing)
  createNotification: async (notificationData: {
    user_id: number
    type: string
    title: string
    message: string
    data?: any
  }): Promise<ApiResponse<Notification>> => {
    const response = await api.post('/notifications', notificationData)
    return response.data
  },

  // Delete notification
  deleteNotification: async (notificationId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/notifications/${notificationId}`)
    return response.data
  },

  // Get notification preferences
  getPreferences: async (userId: number): Promise<ApiResponse<NotificationPreferences>> => {
    const response = await api.get(`/notifications/user/${userId}/preferences`)
    return response.data
  },

  // Update notification preferences
  updatePreferences: async (userId: number, preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> => {
    const response = await api.put(`/notifications/user/${userId}/preferences`, preferences)
    return response.data
  },

  // Subscribe to push notifications
  subscribeToPush: async (userId: number, subscription: any): Promise<ApiResponse<void>> => {
    const response = await api.post(`/notifications/user/${userId}/push-subscribe`, { subscription })
    return response.data
  },

  // Unsubscribe from push notifications
  unsubscribeFromPush: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/notifications/user/${userId}/push-subscribe`)
    return response.data
  },
}