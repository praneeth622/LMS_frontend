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
    title: "Python for Data Science",
    instructor: "Dr. Michael Chen",
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    nextLesson: "Pandas DataFrames",
    thumbnail: "/course-thumbnails/python.jpg"
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    instructor: "Jessica Martinez",
    progress: 90,
    totalLessons: 18,
    completedLessons: 16,
    nextLesson: "Prototyping",
    thumbnail: "/course-thumbnails/ux.jpg"
  }
]

const upcomingAssignments = [
  {
    id: 1,
    title: "React Component Optimization",
    course: "Advanced React Development",
    dueDate: "2024-01-15",
    status: "pending"
  },
  {
    id: 2,
    title: "Data Visualization Project",
    course: "Python for Data Science",
    dueDate: "2024-01-18",
    status: "in-progress"
  },
  {
    id: 3,
    title: "User Research Report",
    course: "UI/UX Design Fundamentals",
    dueDate: "2024-01-20",
    status: "pending"
  }
]

const achievements = [
  {
    id: 1,
    title: "First Course Completed",
    description: "Completed your first course",
    icon: Trophy,
    earned: true,
    color: "bg-success"
  },
  {
    id: 2,
    title: "Week Streak",
    description: "7 days of continuous learning",
    icon: Target,
    earned: true,
    color: "bg-primary"
  },
  {
    id: 3,
    title: "Perfect Score",
    description: "Score 100% on an assignment",
    icon: Award,
    earned: false,
    color: "bg-warning"
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
              className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-white bg-gradient-to-br from-primary via-primary/90 to-violet-600 shadow-2xl"
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
                      <div className="flex items-center gap-4 mt-6">
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                          <BookOpen className="h-4 w-4 mr-2" />
                          3 Active Courses
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                          <Target className="h-4 w-4 mr-2" />
                          Level 2 Student
                        </Badge>
                      </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors duration-300">8</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">Enrolled</h3>
                    <p className="text-sm text-muted-foreground">Active courses</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Trophy className="h-8 w-8 text-success" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground leading-tight group-hover:text-success transition-colors duration-300">12</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-success transition-colors duration-300">Completed</h3>
                    <p className="text-sm text-muted-foreground">Courses finished</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-warning/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Clock className="h-8 w-8 text-warning" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground leading-tight group-hover:text-warning transition-colors duration-300">24h</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-warning transition-colors duration-300">Study Time</h3>
                    <p className="text-sm text-muted-foreground">This week</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="enhanced-card border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95 group"
              >
                <div className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-info/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                      <Star className="h-8 w-8 text-info" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-foreground leading-tight group-hover:text-info transition-colors duration-300">4.8</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-info transition-colors duration-300">Average</h3>
                    <p className="text-sm text-muted-foreground">Course rating</p>
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
                    <CardTitle className="text-3xl font-bold text-foreground flex items-center">
                      <BookOpen className="h-8 w-8 mr-4 text-primary" />
                      Continue Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    {enrolledCourses.map((course) => (
                      <div key={course.id} className="group">
                        <div className="p-8 rounded-2xl border border-border/60 bg-gradient-to-r from-background to-muted/10 hover:from-muted/20 hover:to-muted/20 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                          <div className="flex items-start gap-8">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
                              <BookOpen className="h-12 w-12 text-primary" />
                            </div>
                            <div className="flex-1 space-y-4">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-semibold text-xl text-foreground course-title transition-colors group-hover:text-primary">{course.title}</h4>
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
                    <CardTitle className="text-xl font-bold text-foreground flex items-center">
                      <Target className="h-7 w-7 text-primary mr-3" />
                      Upcoming Assignments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {upcomingAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-6 rounded-xl border border-border/60 bg-gradient-to-r from-background to-muted/5 hover:from-muted/10 hover:to-muted/10 transition-all duration-300">
                        <h4 className="font-semibold text-foreground mb-2">{assignment.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{assignment.course}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Due: {assignment.dueDate}</span>
                          <Badge variant={assignment.status === 'pending' ? 'destructive' : 'default'} className="text-xs">
                            {assignment.status === 'pending' ? 'Pending' : 'In Progress'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Achievements */}
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <CardTitle className="text-xl font-bold text-foreground flex items-center">
                      <Award className="h-7 w-7 text-primary mr-3" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {achievements.map((achievement) => (
                      <div key={achievement.id} className={`p-6 rounded-xl border transition-all duration-300 ${
                        achievement.earned 
                          ? 'border-primary/30 bg-primary/5 hover:bg-primary/10' 
                          : 'border-border/60 bg-muted/20 hover:bg-muted/30'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            achievement.earned ? achievement.color : 'bg-muted'
                          }`}>
                            <achievement.icon className="h-10 w-10 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            {achievement.earned && (
                              <Badge variant="default" className="mt-2 bg-success text-white">Earned</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
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
