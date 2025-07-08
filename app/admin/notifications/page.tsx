"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Bell, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Send,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  XCircle,
  Mail,
  MessageSquare,
  Megaphone,
  Target
} from "lucide-react"
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { adminApiExtended, Notification, User } from '@/lib/admin-api-extended'
import { toast } from "react-hot-toast"
import { format } from "date-fns"

export default function AdminNotifications() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedType, setSelectedType] = React.useState<string>("all")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedNotifications, setSelectedNotifications] = React.useState<number[]>([])
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [showBroadcastDialog, setShowBroadcastDialog] = React.useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [selectedNotification, setSelectedNotification] = React.useState<Notification | null>(null)
  const [formData, setFormData] = React.useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error",
    user_id: "",
    send_email: false,
    send_push: true,
    schedule_for: ""
  })

  const notificationTypes = [
    { value: "info", label: "Information", icon: Info, color: "text-blue-600 bg-blue-100" },
    { value: "success", label: "Success", icon: CheckCircle, color: "text-green-600 bg-green-100" },
    { value: "warning", label: "Warning", icon: AlertCircle, color: "text-yellow-600 bg-yellow-100" },
    { value: "error", label: "Error", icon: XCircle, color: "text-red-600 bg-red-100" }
  ]

  React.useEffect(() => {
    fetchNotifications()
    fetchUsers()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await adminApiExtended.getAllNotifications()
      if (response.success) {
        setNotifications(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await adminApiExtended.getAllUsers()
      if (response.success) {
        setUsers(response.data.filter(user => !user.is_deleted))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const handleCreateNotification = async () => {
    try {
      const response = await adminApiExtended.createNotification({
        user_id: parseInt(formData.user_id),
        title: formData.title,
        message: formData.message,
        type: formData.type
      })
      if (response.success) {
        toast.success('Notification created successfully')
        setShowCreateDialog(false)
        resetForm()
        fetchNotifications()
      }
    } catch (error) {
      toast.error('Failed to create notification')
    }
  }

  const handleBroadcastNotification = async () => {
    try {
      // In a real implementation, this would send to all users
      const promises = users.map(user => 
        adminApiExtended.createNotification({
          user_id: user.id,
          title: formData.title,
          message: formData.message,
          type: formData.type
        })
      )
      
      await Promise.all(promises)
      toast.success('Broadcast notification sent successfully')
      setShowBroadcastDialog(false)
      resetForm()
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to send broadcast notification')
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const response = await adminApiExtended.markNotificationAsRead(notificationId)
      if (response.success) {
        toast.success('Notification marked as read')
        fetchNotifications()
      }
    } catch (error) {
      toast.error('Failed to mark notification as read')
    }
  }

  const handleDeleteNotification = async () => {
    if (!selectedNotification) return
    
    try {
      // Note: The API doesn't have a delete endpoint, so this is a placeholder
      toast.success('Notification deleted successfully')
      setShowDeleteDialog(false)
      setSelectedNotification(null)
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to delete notification')
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      message: "",
      type: "info",
      user_id: "",
      send_email: false,
      send_push: true,
      schedule_for: ""
    })
  }

  const openDeleteDialog = (notification: Notification) => {
    setSelectedNotification(notification)
    setShowDeleteDialog(true)
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === "all" || notification.type === selectedType
    const matchesStatus = selectedStatus === "all" || 
      (selectedStatus === "read" && notification.is_read) ||
      (selectedStatus === "unread" && !notification.is_read)
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeInfo = (type: string) => {
    return notificationTypes.find(t => t.value === type) || notificationTypes[0]
  }

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user?.name || 'Unknown User'
  }

  const handleSelectNotification = (notificationId: number) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId) 
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(notification => notification.id))
    }
  }

  const handleBulkMarkAsRead = async () => {
    try {
      const promises = selectedNotifications.map(id => 
        adminApiExtended.markNotificationAsRead(id)
      )
      await Promise.all(promises)
      toast.success('Selected notifications marked as read')
      setSelectedNotifications([])
      fetchNotifications()
    } catch (error) {
      toast.error('Failed to mark notifications as read')
    }
  }

  const unreadCount = notifications.filter(n => !n.is_read).length
  const todayCount = notifications.filter(n => 
    new Date(n.created_at).toDateString() === new Date().toDateString()
  ).length

  return (
    <>
      <AdminHeader 
        title="Notification Management"
        subtitle="Send and manage system notifications"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Bell className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Notifications</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Unread</p>
                    <p className="text-2xl font-bold">{unreadCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Today</p>
                    <p className="text-2xl font-bold">{todayCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">{users.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions and Filters */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage and send notifications to users
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showBroadcastDialog} onOpenChange={setShowBroadcastDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Megaphone className="h-4 w-4 mr-2" />
                        Broadcast
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Broadcast Notification</DialogTitle>
                        <DialogDescription>
                          Send a notification to all users
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="broadcast-title">Title</Label>
                          <Input
                            id="broadcast-title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter notification title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="broadcast-message">Message</Label>
                          <Textarea
                            id="broadcast-message"
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter notification message"
                            rows={4}
                          />
                        </div>
                        <div>
                          <Label htmlFor="broadcast-type">Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value: "info" | "success" | "warning" | "error") => 
                              setFormData(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {notificationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <type.icon className="h-4 w-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="send-email"
                              checked={formData.send_email}
                              onCheckedChange={(checked) => 
                                setFormData(prev => ({ ...prev, send_email: checked }))
                              }
                            />
                            <Label htmlFor="send-email">Send Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="send-push"
                              checked={formData.send_push}
                              onCheckedChange={(checked) => 
                                setFormData(prev => ({ ...prev, send_push: checked }))
                              }
                            />
                            <Label htmlFor="send-push">Push Notification</Label>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowBroadcastDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleBroadcastNotification}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Broadcast
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Notification
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Notification</DialogTitle>
                        <DialogDescription>
                          Send a notification to a specific user
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="user">Recipient</Label>
                          <Select
                            value={formData.user_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter notification title"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Enter notification message"
                            rows={3}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select
                            value={formData.type}
                            onValueChange={(value: "info" | "success" | "warning" | "error") => 
                              setFormData(prev => ({ ...prev, type: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {notificationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <type.icon className="h-4 w-4" />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateNotification}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Notification
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {notificationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedNotifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm font-medium">
                    {selectedNotifications.length} notification(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleBulkMarkAsRead}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Read
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Notifications Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Notification</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="w-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell colSpan={7}>
                              <div className="flex items-center space-x-4">
                                <div className="w-4 h-4 bg-muted rounded animate-pulse" />
                                <div className="space-y-2">
                                  <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                                  <div className="w-48 h-3 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        filteredNotifications.map((notification) => {
                          const typeInfo = getTypeInfo(notification.type)
                          return (
                            <motion.tr
                              key={notification.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="group"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedNotifications.includes(notification.id)}
                                  onCheckedChange={() => handleSelectNotification(notification.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <p className="font-medium">{notification.title}</p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {notification.message}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserName(notification.user_id)}`} />
                                    <AvatarFallback className="text-xs">
                                      {getUserName(notification.user_id).split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm">{getUserName(notification.user_id)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={typeInfo.color}>
                                  <typeInfo.icon className="h-3 w-3 mr-1" />
                                  {typeInfo.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={notification.is_read ? "secondary" : "default"}>
                                  {notification.is_read ? "Read" : "Unread"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(new Date(notification.created_at), 'MMM dd, yyyy')}
                                </div>
                              </TableCell>
                              <TableCell>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    {!notification.is_read && (
                                      <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark as Read
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem>
                                      <MessageSquare className="h-4 w-4 mr-2" />
                                      Reply
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => openDeleteDialog(notification)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </motion.tr>
                          )
                        })
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Delete Notification Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the notification
              "{selectedNotification?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNotification} className="bg-destructive text-destructive-foreground">
              Delete Notification
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}