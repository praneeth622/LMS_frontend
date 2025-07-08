"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Camera,
  Bell,
  Shield,
  Globe,
  Eye,
  EyeOff,
  Key,
  Download,
  Trash2,
  AlertCircle
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from '@/contexts/auth-context'
import { toast } from "sonner"

interface UserProfile {
  id: number
  name: string
  email: string
  phone?: string
  bio?: string
  location?: string
  timezone: string
  language: string
  avatar?: string
  date_joined: string
  last_login: string
}

interface NotificationSettings {
  email_notifications: boolean
  push_notifications: boolean
  course_updates: boolean
  assignment_reminders: boolean
  discussion_replies: boolean
  achievement_notifications: boolean
  marketing_emails: boolean
}

interface PrivacySettings {
  profile_visibility: 'public' | 'private' | 'students_only'
  show_progress: boolean
  show_achievements: boolean
  show_activity: boolean
}

export default function StudentProfile() {
  const { userProfile, refreshProfile } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [editingProfile, setEditingProfile] = React.useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Profile form state
  const [profileData, setProfileData] = React.useState<UserProfile>({
    id: userProfile?.id || 0,
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: '',
    bio: '',
    location: '',
    timezone: 'America/New_York',
    language: 'en',
    date_joined: '2024-01-15T10:00:00Z',
    last_login: '2024-12-20T15:30:00Z'
  })

  // Password form state
  const [passwordData, setPasswordData] = React.useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })

  // Settings state
  const [notificationSettings, setNotificationSettings] = React.useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    course_updates: true,
    assignment_reminders: true,
    discussion_replies: true,
    achievement_notifications: true,
    marketing_emails: false
  })

  const [privacySettings, setPrivacySettings] = React.useState<PrivacySettings>({
    profile_visibility: 'students_only',
    show_progress: true,
    show_achievements: true,
    show_activity: false
  })

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call - replace with actual update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Refresh the profile to get updated data
      await refreshProfile()

      toast.success("Profile updated successfully!")
      setEditingProfile(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New passwords don't match")
      return
    }

    if (passwordData.new_password.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      // Mock API call - replace with actual password update
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Password updated successfully!")
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error("Failed to update password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationSettingsUpdate = async (key: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
    
    try {
      // Mock API call - replace with actual settings update
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Notification settings updated!")
    } catch (error) {
      console.error('Error updating notification settings:', error)
      toast.error("Failed to update settings")
    }
  }

  const handlePrivacySettingsUpdate = async (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
    
    try {
      // Mock API call - replace with actual settings update
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success("Privacy settings updated!")
    } catch (error) {
      console.error('Error updating privacy settings:', error)
      toast.error("Failed to update settings")
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    try {
      // Mock file upload - replace with actual upload
      const formData = new FormData()
      formData.append('avatar', file)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Avatar updated successfully!")
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast.error("Failed to upload avatar")
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return
    }

    try {
      // Mock API call - replace with actual account deletion
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Account deletion request submitted")
    } catch (error) {
      console.error('Error deleting account:', error)
      toast.error("Failed to delete account")
    }
  }

  const handleExportData = async () => {
    try {
      // Mock data export - replace with actual export
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success("Data export started. You'll receive an email when ready.")
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error("Failed to export data")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Profile & Settings"
            subtitle="Manage your account and preferences"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  <TabsTrigger value="privacy">Privacy</TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Update your personal information and preferences
                          </CardDescription>
                        </div>
                        {!editingProfile ? (
                          <Button onClick={() => setEditingProfile(true)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Profile
                          </Button>
                        ) : (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={() => setEditingProfile(false)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </Button>
                            <Button 
                              onClick={handleProfileUpdate}
                              disabled={loading}
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        {/* Avatar Section */}
                        <div className="flex items-center space-x-6">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={profileData.avatar} />
                            <AvatarFallback className="text-lg">
                              {profileData.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          {editingProfile && (
                            <div>
                              <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex items-center space-x-2 text-sm text-primary hover:underline">
                                  <Camera className="h-4 w-4" />
                                  <span>Change Avatar</span>
                                </div>
                              </Label>
                              <Input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarUpload}
                                className="hidden"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG or GIF. Max size 5MB.
                              </p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={profileData.name}
                              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                              disabled={!editingProfile}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              disabled={!editingProfile}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={profileData.phone || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              disabled={!editingProfile}
                              placeholder="(555) 123-4567"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profileData.location || ''}
                              onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                              disabled={!editingProfile}
                              placeholder="City, Country"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="timezone">Timezone</Label>
                            <Select 
                              value={profileData.timezone} 
                              onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}
                              disabled={!editingProfile}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                                <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                                <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                                <SelectItem value="Europe/London">London (GMT)</SelectItem>
                                <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                                <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="language">Language</Label>
                            <Select 
                              value={profileData.language} 
                              onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}
                              disabled={!editingProfile}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="zh">Chinese</SelectItem>
                                <SelectItem value="ja">Japanese</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Bio */}
                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            value={profileData.bio || ''}
                            onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                            disabled={!editingProfile}
                            placeholder="Tell us about yourself..."
                            rows={4}
                          />
                        </div>

                        {/* Account Info */}
                        <Separator />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                            <p className="text-sm">{formatDate(profileData.date_joined)}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                            <p className="text-sm">{formatDate(profileData.last_login)}</p>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Change Password</CardTitle>
                      <CardDescription>
                        Update your password to keep your account secure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="current-password"
                              type={showCurrentPassword ? "text" : "password"}
                              value={passwordData.current_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                              {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <div className="relative">
                            <Input
                              id="new-password"
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.new_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirm-password"
                              type={showConfirmPassword ? "text" : "password"}
                              value={passwordData.confirm_password}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                              required
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        <Button type="submit" disabled={loading}>
                          <Key className="h-4 w-4 mr-2" />
                          Update Password
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Account Security</CardTitle>
                      <CardDescription>
                        Additional security options for your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                        </div>
                        <Button variant="outline">
                          <Shield className="h-4 w-4 mr-2" />
                          Enable 2FA
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Login Sessions</p>
                          <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                        </div>
                        <Button variant="outline">
                          View Sessions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Choose how you want to be notified about activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            checked={notificationSettings.email_notifications}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('email_notifications', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                          </div>
                          <Switch
                            checked={notificationSettings.push_notifications}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('push_notifications', checked)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Course Updates</p>
                            <p className="text-sm text-muted-foreground">New lectures, materials, and announcements</p>
                          </div>
                          <Switch
                            checked={notificationSettings.course_updates}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('course_updates', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Assignment Reminders</p>
                            <p className="text-sm text-muted-foreground">Due date reminders and grade notifications</p>
                          </div>
                          <Switch
                            checked={notificationSettings.assignment_reminders}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('assignment_reminders', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Discussion Replies</p>
                            <p className="text-sm text-muted-foreground">Replies to your discussions and comments</p>
                          </div>
                          <Switch
                            checked={notificationSettings.discussion_replies}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('discussion_replies', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Achievement Notifications</p>
                            <p className="text-sm text-muted-foreground">Certificates, badges, and milestones</p>
                          </div>
                          <Switch
                            checked={notificationSettings.achievement_notifications}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('achievement_notifications', checked)}
                          />
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">Course recommendations and promotions</p>
                          </div>
                          <Switch
                            checked={notificationSettings.marketing_emails}
                            onCheckedChange={(checked) => handleNotificationSettingsUpdate('marketing_emails', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Privacy Tab */}
                <TabsContent value="privacy" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                      <CardDescription>
                        Control who can see your information and activity
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Visibility</Label>
                          <Select 
                            value={privacySettings.profile_visibility} 
                            onValueChange={(value: 'public' | 'private' | 'students_only') => 
                              handlePrivacySettingsUpdate('profile_visibility', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public - Anyone can see</SelectItem>
                              <SelectItem value="students_only">Students Only - Only other students</SelectItem>
                              <SelectItem value="private">Private - Only you</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Learning Progress</p>
                            <p className="text-sm text-muted-foreground">Display your course completion progress</p>
                          </div>
                          <Switch
                            checked={privacySettings.show_progress}
                            onCheckedChange={(checked) => handlePrivacySettingsUpdate('show_progress', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Achievements</p>
                            <p className="text-sm text-muted-foreground">Display your certificates and badges</p>
                          </div>
                          <Switch
                            checked={privacySettings.show_achievements}
                            onCheckedChange={(checked) => handlePrivacySettingsUpdate('show_achievements', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Show Activity</p>
                            <p className="text-sm text-muted-foreground">Display your recent learning activity</p>
                          </div>
                          <Switch
                            checked={privacySettings.show_activity}
                            onCheckedChange={(checked) => handlePrivacySettingsUpdate('show_activity', checked)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Data Management</CardTitle>
                      <CardDescription>
                        Manage your personal data and account
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Export Data</p>
                          <p className="text-sm text-muted-foreground">Download a copy of your data</p>
                        </div>
                        <Button variant="outline" onClick={handleExportData}>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-red-600">Delete Account</p>
                          <p className="text-sm text-muted-foreground">Permanently delete your account and data</p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Account deletion is permanent and cannot be undone. All your progress, certificates, and data will be lost.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}