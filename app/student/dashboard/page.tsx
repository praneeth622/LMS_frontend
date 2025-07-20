"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Users,
  TrendingUp,
  Plus,
  Star,
  Target,
  Calendar,
  Award,
  Clock,
  Trophy,
  MessageSquare,
  FileText
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import {
  MetricCard
} from '@/components/ui/premium-components'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { useAuth } from '@/contexts/auth-context'

export default function StudentDashboard() {
  const { userProfile } = useAuth()

  const recentCourses = [
    {
      id: 1,
      title: "React Fundamentals",
      instructor: "Dr. Sarah Wilson",
      progress: 75,
      status: "in-progress",
      nextLesson: "Hooks and State Management",
      dueDate: "2 days",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Advanced JavaScript",
      instructor: "Prof. Michael Chen",
      progress: 45,
      status: "in-progress",
      nextLesson: "Async/Await Patterns",
      dueDate: "5 days",
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Node.js Masterclass",
      instructor: "Emily Rodriguez",
      progress: 90,
      status: "near-completion",
      nextLesson: "Final Project Submission",
      dueDate: "1 day",
      thumbnail: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?w=100&h=100&fit=crop&crop=center"
    }
  ]

  const upcomingAssignments = [
    {
      id: 1,
      title: "React Component Project",
      course: "React Fundamentals",
      dueDate: "Tomorrow",
      priority: "high",
      status: "pending"
    },
    {
      id: 2,
      title: "JavaScript Quiz",
      course: "Advanced JavaScript",
      dueDate: "3 days",
      priority: "medium",
      status: "pending"
    },
    {
      id: 3,
      title: "Final Portfolio",
      course: "Node.js Masterclass",
      dueDate: "1 week",
      priority: "high",
      status: "in-progress"
    }
  ]

  const recentAchievements = [
    {
      id: 1,
      title: "React Expert",
      description: "Completed advanced React concepts",
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      id: 2,
      title: "Quick Learner",
      description: "Finished 3 lessons in one day",
      icon: Clock,
      color: "text-blue-500"
    },
    {
      id: 3,
      title: "Collaborative Spirit",
      description: "Helped 5 classmates in discussions",
      icon: Users,
      color: "text-green-500"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-gradient-to-br from-background via-muted/8 to-background">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Dashboard"
            subtitle={`Welcome back, ${userProfile?.name || 'Student'}! Ready to continue your learning journey?`}
          />
          
          <main className="flex-1 overflow-y-auto p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
              {/* Enhanced Premium Header Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl p-12 lg:p-16 text-white bg-gradient-to-br from-primary via-primary/90 to-accent shadow-2xl"
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
                          Ready to unlock your potential and achieve your learning goals?
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

              {/* Enhanced Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <MetricCard
                    title="Enrolled Courses"
                    value="8"
                    subtitle="Active learning paths"
                    icon={BookOpen}
                    trend={{ value: "+2", direction: "up" }}
                    gradient="primary"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <MetricCard
                    title="Completion Rate"
                    value="78%"
                    subtitle="Average course progress"
                    icon={Target}
                    trend={{ value: "+12%", direction: "up" }}
                    gradient="primary"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <MetricCard
                    title="Study Streak"
                    value="15"
                    subtitle="Days of continuous learning"
                    icon={TrendingUp}
                    trend={{ value: "+3", direction: "up" }}
                    gradient="primary"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <MetricCard
                    title="Achievements"
                    value="24"
                    subtitle="Badges earned"
                    icon={Award}
                    trend={{ value: "+4", direction: "up" }}
                    gradient="primary"
                  />
                </motion.div>
              </div>

              {/* Enhanced Community Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-10"
              >
                {/* Enhanced Study Groups */}
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        Study Groups
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        See all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-8 p-8">
                    {["React Study Circle", "JavaScript Mastermind"].map((group, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg">
                          <Users className="h-8 w-8 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{group}</h4>
                          <p className="text-sm text-muted-foreground">{5 + index} members active</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full">
                          <Plus className="h-6 w-6" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Enhanced Quick Actions */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-10">
                    <div className="text-center space-y-8">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="h-10 w-10 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-foreground mb-4">
                          Daily Learning Goal
                        </h3>
                        <p className="text-muted-foreground leading-relaxed mb-6">
                          You're 75% towards your daily goal of 2 hours
                        </p>
                        <div className="w-full bg-muted rounded-full h-3 mb-4">
                          <div className="bg-gradient-to-r from-primary to-accent h-3 rounded-full w-3/4"></div>
                        </div>
                      </div>
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                        Continue Learning
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Recent Achievements */}
                <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-semibold text-foreground">
                        Recent Achievements
                      </CardTitle>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        View all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 p-8">
                    {recentAchievements.slice(0, 2).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-muted/30 transition-colors">
                        <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center ${achievement.color}`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Enhanced Main Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Enhanced Continue Learning */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
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
                      {recentCourses.slice(0, 2).map((course) => (
                        <div key={course.id} className="p-6 rounded-2xl border border-border/50 hover:bg-muted/30 transition-all duration-300">
                          <div className="flex items-start space-x-4">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-foreground truncate mb-2">{course.title}</h4>
                              <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">Progress</span>
                                  <span className="font-medium text-foreground">{course.progress}%</span>
                                </div>
                                <Progress value={course.progress} className="h-2" />
                                <div className="flex items-center justify-between">
                                  <Badge 
                                    variant={course.status === 'near-completion' ? 'default' : 'secondary'} 
                                    className="text-xs font-medium"
                                  >
                                    {course.status === 'near-completion' ? 'Almost Done!' : 'In Progress'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">Due in {course.dueDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Enhanced Upcoming Assignments */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card className="border-0 shadow-lg bg-card rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-8 bg-gradient-to-r from-muted/20 to-muted/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold text-foreground">
                          Upcoming Assignments
                        </CardTitle>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          View all
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-8">
                      {upcomingAssignments.slice(0, 3).map((assignment) => (
                        <div key={assignment.id} className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-muted/30 transition-all duration-300">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <FileText className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground text-sm truncate">{assignment.title}</h4>
                            <p className="text-xs text-muted-foreground">{assignment.course}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant={assignment.priority === 'high' ? 'destructive' : 'secondary'} 
                                className="text-xs"
                              >
                                {assignment.priority}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Due {assignment.dueDate}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Calendar className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
