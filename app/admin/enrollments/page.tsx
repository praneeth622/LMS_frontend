"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Mail
} from "lucide-react"
import { AdminHeader } from '@/components/admin/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
import { Checkbox } from "@/components/ui/checkbox"
import { adminApiExtended, Enrollment, User, Course } from '@/lib/admin-api-extended'
import { toast } from "react-hot-toast"
import { format } from "date-fns"

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = React.useState<Enrollment[]>([])
  const [users, setUsers] = React.useState<User[]>([])
  const [courses, setCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState<string>("all")
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all")
  const [selectedEnrollments, setSelectedEnrollments] = React.useState<number[]>([])
  const [showCreateDialog, setShowCreateDialog] = React.useState(false)
  const [showProgressDialog, setShowProgressDialog] = React.useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = React.useState<Enrollment | null>(null)
  const [formData, setFormData] = React.useState({
    user_id: "",
    course_id: "",
    progress: 0
  })

  React.useEffect(() => {
    fetchEnrollments()
    fetchUsers()
    fetchCourses()
  }, [])

  const fetchEnrollments = async () => {
    try {
      setLoading(true)
      const response = await adminApiExtended.getAllEnrollments()
      if (response.success) {
        setEnrollments(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch enrollments')
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

  const fetchCourses = async () => {
    try {
      const response = await adminApiExtended.getAllCourses()
      if (response.success) {
        setCourses(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleCreateEnrollment = async () => {
    try {
      const response = await adminApiExtended.createEnrollment({
        user_id: parseInt(formData.user_id),
        course_id: parseInt(formData.course_id)
      })
      if (response.success) {
        toast.success('Enrollment created successfully')
        setShowCreateDialog(false)
        setFormData({ user_id: "", course_id: "", progress: 0 })
        fetchEnrollments()
      }
    } catch (error) {
      toast.error('Failed to create enrollment')
    }
  }

  const handleUpdateProgress = async () => {
    if (!selectedEnrollment) return
    
    try {
      const response = await adminApiExtended.updateEnrollmentProgress({
        user_id: selectedEnrollment.user_id,
        course_id: selectedEnrollment.course_id,
        progress: formData.progress
      })
      if (response.success) {
        toast.success('Progress updated successfully')
        setShowProgressDialog(false)
        setSelectedEnrollment(null)
        fetchEnrollments()
      }
    } catch (error) {
      toast.error('Failed to update progress')
    }
  }

  const openProgressDialog = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setFormData({
      user_id: enrollment.user_id.toString(),
      course_id: enrollment.course_id.toString(),
      progress: enrollment.progress
    })
    setShowProgressDialog(true)
  }

  const filteredEnrollments = enrollments.filter(enrollment => {
    const user = users.find(u => u.id === enrollment.user_id)
    const course = courses.find(c => c.id === enrollment.course_id)
    
    const matchesSearch = 
      user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course?.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCourse = selectedCourse === "all" || enrollment.course_id.toString() === selectedCourse
    
    let matchesStatus = true
    if (selectedStatus !== "all") {
      if (selectedStatus === "completed" && enrollment.progress < 100) matchesStatus = false
      if (selectedStatus === "in-progress" && (enrollment.progress === 0 || enrollment.progress === 100)) matchesStatus = false
      if (selectedStatus === "not-started" && enrollment.progress > 0) matchesStatus = false
    }
    
    return matchesSearch && matchesCourse && matchesStatus
  })

  const getProgressStatus = (progress: number) => {
    if (progress === 0) return { label: "Not Started", variant: "secondary" as const, icon: <Clock className="h-3 w-3" /> }
    if (progress < 100) return { label: "In Progress", variant: "default" as const, icon: <AlertCircle className="h-3 w-3" /> }
    return { label: "Completed", variant: "default" as const, icon: <CheckCircle className="h-3 w-3" /> }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200"
    if (progress < 50) return "bg-red-500"
    if (progress < 80) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user?.name || 'Unknown User'
  }

  const getUserEmail = (userId: number) => {
    const user = users.find(u => u.id === userId)
    return user?.email || 'unknown@email.com'
  }

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    return course?.title || 'Unknown Course'
  }

  const handleSelectEnrollment = (enrollmentId: number) => {
    setSelectedEnrollments(prev => 
      prev.includes(enrollmentId) 
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    )
  }

  const handleSelectAll = () => {
    if (selectedEnrollments.length === filteredEnrollments.length) {
      setSelectedEnrollments([])
    } else {
      setSelectedEnrollments(filteredEnrollments.map(enrollment => enrollment.id))
    }
  }

  const completedEnrollments = enrollments.filter(e => e.progress === 100).length
  const inProgressEnrollments = enrollments.filter(e => e.progress > 0 && e.progress < 100).length
  const notStartedEnrollments = enrollments.filter(e => e.progress === 0).length

  return (
    <>
      <AdminHeader 
        title="Enrollment Management"
        subtitle="Manage student enrollments and track progress"
      />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Enrollments</p>
                    <p className="text-2xl font-bold">{enrollments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{completedEnrollments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                    <p className="text-2xl font-bold">{inProgressEnrollments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-gray-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Not Started</p>
                    <p className="text-2xl font-bold">{notStartedEnrollments}</p>
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
                  <CardTitle>Enrollments</CardTitle>
                  <CardDescription>
                    Manage all student enrollments and track their progress
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Enrollment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Enrollment</DialogTitle>
                        <DialogDescription>
                          Enroll a student in a course
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="user">Student</Label>
                          <Select
                            value={formData.user_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a student" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.filter(user => user.role_id === 3).map((user) => (
                                <SelectItem key={user.id} value={user.id.toString()}>
                                  {user.name} ({user.email})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="course">Course</Label>
                          <Select
                            value={formData.course_id}
                            onValueChange={(value) => setFormData(prev => ({ ...prev, course_id: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {courses.filter(course => course.status === 'published').map((course) => (
                                <SelectItem key={course.id} value={course.id.toString()}>
                                  {course.title}
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
                        <Button onClick={handleCreateEnrollment}>
                          Create Enrollment
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
                    placeholder="Search enrollments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by course" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
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
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedEnrollments.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-muted rounded-lg flex items-center justify-between"
                >
                  <span className="text-sm font-medium">
                    {selectedEnrollments.length} enrollment(s) selected
                  </span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Reminder
                    </Button>
                    <Button variant="outline" size="sm">
                      <Award className="h-4 w-4 mr-2" />
                      Generate Certificates
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Enrollments Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedEnrollments.length === filteredEnrollments.length && filteredEnrollments.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Enrolled</TableHead>
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
                                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                                <div className="space-y-2">
                                  <div className="w-32 h-4 bg-muted rounded animate-pulse" />
                                  <div className="w-48 h-3 bg-muted rounded animate-pulse" />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        filteredEnrollments.map((enrollment) => {
                          const progressStatus = getProgressStatus(enrollment.progress)
                          return (
                            <motion.tr
                              key={enrollment.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="group"
                            >
                              <TableCell>
                                <Checkbox
                                  checked={selectedEnrollments.includes(enrollment.id)}
                                  onCheckedChange={() => handleSelectEnrollment(enrollment.id)}
                                />
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-3">
                                  <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${getUserName(enrollment.user_id)}`} />
                                    <AvatarFallback>
                                      {getUserName(enrollment.user_id).split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{getUserName(enrollment.user_id)}</p>
                                    <p className="text-sm text-muted-foreground">{getUserEmail(enrollment.user_id)}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">{getCourseName(enrollment.course_id)}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">{enrollment.progress.toFixed(1)}%</span>
                                  </div>
                                  <Progress 
                                    value={enrollment.progress} 
                                    className="h-2"
                                  />
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={progressStatus.variant} className="flex items-center gap-1 w-fit">
                                  {progressStatus.icon}
                                  {progressStatus.label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(enrollment.enrolled_at), 'MMM dd, yyyy')}
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
                                    <DropdownMenuItem onClick={() => openProgressDialog(enrollment)}>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Update Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {enrollment.progress === 100 && (
                                      <DropdownMenuItem>
                                        <Award className="h-4 w-4 mr-2" />
                                        Generate Certificate
                                      </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Remove Enrollment
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

      {/* Update Progress Dialog */}
      <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Progress</DialogTitle>
            <DialogDescription>
              Update the enrollment progress for this student
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <div className="space-y-2">
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData(prev => ({ ...prev, progress: parseFloat(e.target.value) || 0 }))}
                />
                <Progress value={formData.progress} className="h-2" />
              </div>
            </div>
            {selectedEnrollment && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">
                  Student: {getUserName(selectedEnrollment.user_id)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Course: {getCourseName(selectedEnrollment.course_id)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProgressDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProgress}>
              Update Progress
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}