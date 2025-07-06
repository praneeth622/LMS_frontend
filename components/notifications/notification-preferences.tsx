"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Bell, 
  Mail, 
  Smartphone, 
  BookOpen, 
  Clock, 
  MessageSquare,
  Award,
  Megaphone,
  Save,
  Volume2,
  VolumeX
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { notificationApi, NotificationPreferences } from "@/lib/notification-api"
import { useAuth } from "@/contexts/auth-context"

interface NotificationPreferencesProps {
  onClose?: () => void
}

export function NotificationPreferencesPanel({ onClose }: NotificationPreferencesProps) {
  const [preferences, setPreferences] = React.useState<NotificationPreferences>({
    user_id: 0,
    email_notifications: true,
    push_notifications: true,
    course_updates: true,
    assignment_reminders: true,
    discussion_notifications: true,
    grade_notifications: true,
    system_announcements: true,
    digest_frequency: 'immediate'
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const [pushSupported, setPushSupported] = React.useState(false)
  
  const { userProfile } = useAuth()

  React.useEffect(() => {
    if (userProfile?.id) {
      fetchPreferences()
      checkPushSupport()
    }
  }, [userProfile?.id])

  const fetchPreferences = async () => {
    if (!userProfile?.id) return
    
    try {
      setLoading(true)
      const response = await notificationApi.getPreferences(userProfile.id)
      if (response.success) {
        setPreferences(response.data)
      }
    } catch (error) {
      console.error('Error fetching preferences:', error)
      // Use default preferences if API fails
    } finally {
      setLoading(false)
    }
  }

  const checkPushSupport = () => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setPushSupported(true)
    }
  }

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!userProfile?.id) return
    
    try {
      setSaving(true)
      const response = await notificationApi.updatePreferences(userProfile.id, preferences)
      
      if (response.success) {
        toast.success('Preferences saved successfully!')
        onClose?.()
      }
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Failed to save preferences')
    } finally {
      setSaving(false)
    }
  }

  const requestPushPermission = async () => {
    if (!pushSupported) return
    
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        updatePreference('push_notifications', true)
        toast.success('Push notifications enabled!')
        
        // Register service worker and subscribe to push notifications
        if ('serviceWorker' in navigator) {
          const registration = await navigator.serviceWorker.ready
          // Here you would typically subscribe to push notifications
          // and send the subscription to your server
        }
      } else {
        updatePreference('push_notifications', false)
        toast.error('Push notifications denied')
      }
    } catch (error) {
      console.error('Error requesting push permission:', error)
      toast.error('Failed to enable push notifications')
    }
  }

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Play a notification sound
      const audio = new Audio('/notification-sound.mp3')
      audio.play().catch(() => {
        // Fallback for browsers that don't allow audio without user interaction
        console.log('Could not play notification sound')
      })
    }
  }

  const testNotification = () => {
    if (preferences.push_notifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'This is a test notification from EduFlow!',
        icon: '/favicon.ico'
      })
    }
    
    playNotificationSound()
    toast.success('Test notification sent!')
  }

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notification Preferences</h2>
          <p className="text-muted-foreground">Customize how you receive notifications</p>
        </div>
        <Button onClick={testNotification} variant="outline">
          Test Notification
        </Button>
      </div>

      {/* Delivery Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Delivery Methods
          </CardTitle>
          <CardDescription>
            Choose how you want to receive notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch
              id="email-notifications"
              checked={preferences.email_notifications}
              onCheckedChange={(checked) => updatePreference('email_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  {pushSupported ? 'Receive browser push notifications' : 'Not supported in this browser'}
                </p>
              </div>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences.push_notifications}
              onCheckedChange={(checked) => {
                if (checked && pushSupported) {
                  requestPushPermission()
                } else {
                  updatePreference('push_notifications', checked)
                }
              }}
              disabled={!pushSupported}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {soundEnabled ? (
                <Volume2 className="h-5 w-5 text-muted-foreground" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="sound-notifications" className="text-base">Sound Notifications</Label>
                <p className="text-sm text-muted-foreground">Play sound for new notifications</p>
              </div>
            </div>
            <Switch
              id="sound-notifications"
              checked={soundEnabled}
              onCheckedChange={setSoundEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>
            Choose which types of notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <Label htmlFor="course-updates" className="text-base">Course Updates</Label>
                <p className="text-sm text-muted-foreground">New lectures, materials, and announcements</p>
              </div>
            </div>
            <Switch
              id="course-updates"
              checked={preferences.course_updates}
              onCheckedChange={(checked) => updatePreference('course_updates', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <Label htmlFor="assignment-reminders" className="text-base">Assignment Reminders</Label>
                <p className="text-sm text-muted-foreground">Deadlines and submission reminders</p>
              </div>
            </div>
            <Switch
              id="assignment-reminders"
              checked={preferences.assignment_reminders}
              onCheckedChange={(checked) => updatePreference('assignment_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <Label htmlFor="discussion-notifications" className="text-base">Discussion Notifications</Label>
                <p className="text-sm text-muted-foreground">Replies to your posts and mentions</p>
              </div>
            </div>
            <Switch
              id="discussion-notifications"
              checked={preferences.discussion_notifications}
              onCheckedChange={(checked) => updatePreference('discussion_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <Label htmlFor="grade-notifications" className="text-base">Grade Notifications</Label>
                <p className="text-sm text-muted-foreground">Assignment grades and feedback</p>
              </div>
            </div>
            <Switch
              id="grade-notifications"
              checked={preferences.grade_notifications}
              onCheckedChange={(checked) => updatePreference('grade_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Megaphone className="h-5 w-5 text-purple-500" />
              <div>
                <Label htmlFor="system-announcements" className="text-base">System Announcements</Label>
                <p className="text-sm text-muted-foreground">Important platform updates and news</p>
              </div>
            </div>
            <Switch
              id="system-announcements"
              checked={preferences.system_announcements}
              onCheckedChange={(checked) => updatePreference('system_announcements', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Email Digest */}
      <Card>
        <CardHeader>
          <CardTitle>Email Digest</CardTitle>
          <CardDescription>
            How often would you like to receive email summaries?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={preferences.digest_frequency}
            onValueChange={(value: any) => updatePreference('digest_frequency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="daily">Daily Digest</SelectItem>
              <SelectItem value="weekly">Weekly Digest</SelectItem>
              <SelectItem value="never">Never</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mr-2"
              >
                <Save className="h-4 w-4" />
              </motion.div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </>
          )}
        </Button>
      </div>
    </div>
  )
}