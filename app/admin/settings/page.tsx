"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Palette, 
  Type, 
  Monitor, 
  Sun, 
  Moon, 
  Save,
  RotateCcw,
  Bell,
  Shield,
  Database,
  Mail
} from "lucide-react"
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { toast } from "react-hot-toast"

const fontOptions = [
  { value: "inter", label: "Inter", className: "font-sans" },
  { value: "roboto", label: "Roboto", className: "font-mono" },
  { value: "poppins", label: "Poppins", className: "font-serif" },
  { value: "opensans", label: "Open Sans", className: "font-sans" },
  { value: "lato", label: "Lato", className: "font-sans" },
  { value: "montserrat", label: "Montserrat", className: "font-sans" },
]

const themeColors = [
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "purple", label: "Purple", color: "bg-purple-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "pink", label: "Pink", color: "bg-pink-500" },
]

export default function AdminSettings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [settings, setSettings] = React.useState({
    font: "inter",
    themeColor: "blue",
    notifications: {
      email: true,
      push: true,
      desktop: false,
      marketing: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
    system: {
      autoBackup: true,
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
    }
  })
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('admin-settings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      // Save to localStorage (in a real app, this would be an API call)
      localStorage.setItem('admin-settings', JSON.stringify(settings))
      
      // Apply font changes
      document.documentElement.style.setProperty('--font-family', settings.font)
      
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  const handleResetSettings = () => {
    setSettings({
      font: "inter",
      themeColor: "blue",
      notifications: {
        email: true,
        push: true,
        desktop: false,
        marketing: false,
      },
      security: {
        twoFactor: false,
        sessionTimeout: "30",
        passwordExpiry: "90",
      },
      system: {
        autoBackup: true,
        maintenanceMode: false,
        debugMode: false,
        cacheEnabled: true,
      }
    })
    toast.success('Settings reset to defaults')
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <AdminHeader 
        title="Settings"
        subtitle="Manage your admin panel preferences and system configuration"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Theme Mode */}
                <div className="space-y-2">
                  <Label>Theme Mode</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Font Selection */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Font Family
                  </Label>
                  <Select
                    value={settings.font}
                    onValueChange={(value) => setSettings(prev => ({ ...prev, font: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value}>
                          <span className={font.className}>{font.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Theme Color */}
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 flex-wrap">
                    {themeColors.map((color) => (
                      <Button
                        key={color.value}
                        variant={settings.themeColor === color.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSettings(prev => ({ ...prev, themeColor: color.value }))}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-3 h-3 rounded-full ${color.color}`} />
                        {color.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, email: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in browser
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, push: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Desktop Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show desktop notifications
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.desktop}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, desktop: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketing}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        notifications: { ...prev.notifications, marketing: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
                <CardDescription>
                  Manage security and authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.security.twoFactor ? "default" : "secondary"}>
                      {settings.security.twoFactor ? "Enabled" : "Disabled"}
                    </Badge>
                    <Switch
                      checked={settings.security.twoFactor}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked }
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, sessionTimeout: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Password Expiry (days)</Label>
                  <Select
                    value={settings.security.passwordExpiry}
                    onValueChange={(value) => 
                      setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, passwordExpiry: value }
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and maintenance options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Backup</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable automatic daily backups
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.autoBackup}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, autoBackup: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Put the system in maintenance mode
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={settings.system.maintenanceMode ? "destructive" : "secondary"}>
                      {settings.system.maintenanceMode ? "Active" : "Inactive"}
                    </Badge>
                    <Switch
                      checked={settings.system.maintenanceMode}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          system: { ...prev.system, maintenanceMode: checked }
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Debug Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable debug logging and error details
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.debugMode}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, debugMode: checked }
                      }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cache Enabled</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable application caching for better performance
                    </p>
                  </div>
                  <Switch
                    checked={settings.system.cacheEnabled}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        system: { ...prev.system, cacheEnabled: checked }
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="flex gap-4 justify-end"
          >
            <Button
              variant="outline"
              onClick={handleResetSettings}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  )
}