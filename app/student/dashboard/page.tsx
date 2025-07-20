"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  TrendingUp,
  Calendar,
  Star,
  Users,
  Play,
  Target,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/contexts/auth-context'

// Mock data for demonstration
const enrolledCourses = [
  {
    id: 1,
    title: "Advanced React Development",
    instructor: "Sarah Wilson",
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    nextLesson: "State Management with Redux",
    thumbnail: "/course-thumbnails/react.jpg"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    instructor: "Dr. James Chen",
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    nextLesson: "Neural Networks Introduction",
    thumbnail: "/course-thumbnails/ml.jpg"
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    instructor: "Maria Garcia",
    progress: 90,
    totalLessons: 16,
    completedLessons: 14,
    nextLesson: "Prototyping Best Practices",
    thumbnail: "/course-thumbnails/design.jpg"
  }
]

const upcomingAssignments = [
  {
    id: 1,
    title: "React Component Library",
    course: "Advanced React Development",
    dueDate: "2024-01-15",
    status: "In Progress"
  },
  {
    id: 2,
    title: "ML Model Analysis",
    course: "Machine Learning Fundamentals",
    dueDate: "2024-01-18",
    status: "Not Started"
  },
  {
    id: 3,
    title: "Design System Documentation",
    course: "UI/UX Design Principles",
    dueDate: "2024-01-20",
    status: "Under Review"
  }
]

const achievements = [
  {
    id: 1,
    title: "Quick Learner",
    description: "Completed 5 courses in a month",
    icon: Trophy,
    color: "text-yellow-500"
  },
  {
    id: 2,
    title: "Perfect Attendance",
    description: "100% attendance for 30 days",
    icon: Calendar,
    color: "text-green-500"
  },
  {
    id: 3,
    title: "Top Performer",
    description: "Top 10% in class rankings",
    icon: Star,
    color: "text-blue-500"
  }
]

export default function StudentDashboard() {
  const { userProfile } = useAuth()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/8 to-background">
        <main className="p-8 lg:p-12">
          <div className="max-w-7xl mx-auto space-y-12">
            {/* Enhanced Student Header Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-white bg-gradient-to-br from-primary via-primary/90 to-blue-600 shadow-2xl"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-white/10 opacity-50" />
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

              {/* Content */}
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                  <div className="flex items-center gap-8">
                    <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
                      <span className="text-white font-bold text-4xl">
                        {userProfile?.name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                        Welcome back, {userProfile?.name || 'Student'}! 🎓
                      </h1>
                      <p className="text-white/90 text-2xl leading-relaxed">
                        Ready to continue your learning journey and achieve your goals?
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 w-full lg:w-auto">
                    <Button variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 flex-1 lg:flex-none px-8 py-4 text-lg">
                      <Calendar className="h-6 w-6 mr-3" />
                      Schedule
                    </Button>
                    <Button className="bg-white text-primary hover:bg-white/90 font-semibold flex-1 lg:flex-none px-8 py-4 text-lg">
                      Browse Courses
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="student-stat-card enhanced-card"
              >
                <div className="p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center icon-container transition-transform duration-300 shadow-xl">
                      <BookOpen className="h-10 w-10 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground leading-tight stat-value transition-transform duration-300">3</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl text-foreground stat-title transition-colors duration-300">Enrolled Courses</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">Active learning paths</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="student-stat-card enhanced-card"
              >
                <div className="p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center icon-container transition-transform duration-300 shadow-xl">
                      <Trophy className="h-10 w-10 text-green-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground leading-tight stat-value transition-transform duration-300">12</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl text-foreground stat-title transition-colors duration-300">Completed</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">Courses finished</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="student-stat-card enhanced-card"
              >
                <div className="p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-yellow-500/10 flex items-center justify-center icon-container transition-transform duration-300 shadow-xl">
                      <Clock className="h-10 w-10 text-yellow-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground leading-tight stat-value transition-transform duration-300">24h</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl text-foreground stat-title transition-colors duration-300">Study Time</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">This week</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="student-stat-card enhanced-card"
              >
                <div className="p-10">
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-blue-500/10 flex items-center justify-center icon-container transition-transform duration-300 shadow-xl">
                      <TrendingUp className="h-10 w-10 text-blue-500" />
                    </div>
                    <div className="text-right">
                      <div className="text-4xl lg:text-5xl font-bold text-foreground leading-tight stat-value transition-transform duration-300">87%</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-semibold text-xl text-foreground stat-title transition-colors duration-300">Average Score</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">All assessments</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Continue Learning Section - Takes 2 columns */}
              <motion.div 
                className="lg:col-span-2 space-y-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        Continue Learning
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        View all courses
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="student-course-item p-6 rounded-3xl hover:bg-muted/30 transition-all duration-300 border border-transparent hover:border-border/50">
                        <div className="flex items-start space-x-6">
                          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 course-icon transition-transform duration-300">
                            <BookOpen className="h-10 w-10 text-primary" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-xl text-foreground course-title transition-colors">{course.title}</h4>
                                <p className="text-muted-foreground text-lg">by {course.instructor}</p>
                              </div>
                              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                                {course.progress}% Complete
                              </Badge>
                            </div>
                            <div className="space-y-3">
                              <div className="w-full bg-muted rounded-full h-3">
                                <div 
                                  className="bg-primary h-3 rounded-full transition-all duration-500" 
                                  style={{ width: `${course.progress}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{course.completedLessons} of {course.totalLessons} lessons</span>
                                <span>Next: {course.nextLesson}</span>
                              </div>
                            </div>
                            <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                              <Play className="h-5 w-5 mr-3" />
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Sidebar with Assignments and Achievements */}
              <motion.div 
                className="space-y-10"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                {/* Upcoming Assignments */}
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <CardTitle className="text-2xl font-semibold text-foreground flex items-center gap-3">
                      <Target className="h-7 w-7 text-primary" />
                      Upcoming Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">{assignment.title}</h4>
                          <p className="text-sm text-muted-foreground">{assignment.course}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Due: {assignment.dueDate}</span>
                            <Badge 
                              variant={assignment.status === 'In Progress' ? 'default' : 
                                     assignment.status === 'Under Review' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {assignment.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 via-yellow-50/50 to-background rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 dark:from-yellow-950/20 dark:via-yellow-950/10">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Award className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-foreground mb-4">
                          Recent Achievements
                        </h3>
                        <div className="space-y-4">
                          {achievements.slice(0, 2).map((achievement) => (
                            <div key={achievement.id} className="flex items-center gap-4 p-3 bg-white/50 rounded-xl dark:bg-black/20">
                              <achievement.icon className={`h-6 w-6 ${achievement.color}`} />
                              <div className="text-left">
                                <h4 className="font-semibold text-sm">{achievement.title}</h4>
                                <p className="text-xs text-muted-foreground">{achievement.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        View All Achievements
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
