"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  TrendingUp, 
  Clock, 
  Trophy, 
  Target,
  BookOpen,
  Award,
  Calendar,
  BarChart3,
  Filter,
  Flame
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/analytics/date-range-picker"
import { ExportButton } from "@/components/analytics/export-utils"
import { 
  ProgressRing,
  LearningProgressChart,
  GradeDistributionChart,
  LearningTimeChart,
  AchievementBadge
} from "@/components/analytics/chart-components"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

// Mock data for student analytics
const learningProgressData = [
  { name: 'Week 1', progress: 20 },
  { name: 'Week 2', progress: 35 },
  { name: 'Week 3', progress: 45 },
  { name: 'Week 4', progress: 60 },
  { name: 'Week 5', progress: 75 },
  { name: 'Week 6', progress: 85 },
  { name: 'Week 7', progress: 95 },
]

const gradeDistributionData = [
  { grade: 'A+', count: 8 },
  { grade: 'A', count: 12 },
  { grade: 'B+', count: 15 },
  { grade: 'B', count: 10 },
  { grade: 'C+', count: 5 },
  { grade: 'C', count: 2 },
]

const learningTimeData = [
  { day: 'Mon', hours: 2.5 },
  { day: 'Tue', hours: 3.2 },
  { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 4.1 },
  { day: 'Fri', hours: 2.9 },
  { day: 'Sat', hours: 5.2 },
  { day: 'Sun', hours: 3.8 },
]

const quizScoresData = [
  { name: 'Quiz 1', score: 85 },
  { name: 'Quiz 2', score: 92 },
  { name: 'Quiz 3', score: 78 },
  { name: 'Quiz 4', score: 95 },
  { name: 'Quiz 5', score: 88 },
  { name: 'Quiz 6', score: 91 },
]

export default function StudentAnalyticsPage() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [loading, setLoading] = React.useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  const stats = [
    {
      title: "Courses Completed",
      value: "8",
      total: "12",
      percentage: 67,
      change: "+2 this month",
      changeType: "positive" as const,
      icon: BookOpen,
      color: "#0088FE"
    },
    {
      title: "Learning Hours",
      value: "156",
      change: "+24 this week",
      changeType: "positive" as const,
      icon: Clock,
      color: "#00C49F"
    },
    {
      title: "Average Score",
      value: "87%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: Target,
      color: "#FFBB28"
    },
    {
      title: "Learning Streak",
      value: "15",
      change: "days in a row",
      changeType: "positive" as const,
      icon: Flame,
      color: "#FF8042"
    }
  ]

  const achievements = [
    {
      title: "First Course",
      description: "Complete your first course",
      icon: <BookOpen className="h-5 w-5" />,
      earned: true,
      color: "bg-blue-500"
    },
    {
      title: "Quiz Master",
      description: "Score 90+ on 5 quizzes",
      icon: <Trophy className="h-5 w-5" />,
      earned: true,
      color: "bg-yellow-500"
    },
    {
      title: "Consistent Learner",
      description: "Learn for 7 days straight",
      icon: <Flame className="h-5 w-5" />,
      earned: true,
      color: "bg-orange-500"
    },
    {
      title: "Speed Learner",
      description: "Complete a course in under 2 weeks",
      icon: <TrendingUp className="h-5 w-5" />,
      earned: false,
      progress: 75,
      color: "bg-green-500"
    },
    {
      title: "Perfect Score",
      description: "Get 100% on any quiz",
      icon: <Award className="h-5 w-5" />,
      earned: false,
      progress: 45,
      color: "bg-purple-500"
    },
    {
      title: "Course Collector",
      description: "Enroll in 10 courses",
      icon: <BookOpen className="h-5 w-5" />,
      earned: false,
      progress: 80,
      color: "bg-indigo-500"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex min-h-screen bg-background">
        <StudentSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            title="Learning Analytics"
            subtitle="Track your progress and achievements"
          />
          <main className="flex-1 overflow-y-auto" id="analytics-dashboard">
            <div className="container mx-auto px-4 py-8">
              <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                              </p>
                              <div className="flex items-baseline space-x-2">
                                <p className="text-2xl font-bold text-foreground">
                                  {stat.value}
                                </p>
                                {stat.total && (
                                  <p className="text-sm text-muted-foreground">
                                    / {stat.total}
                                  </p>
                                )}
                              </div>
                              <p className="text-xs text-green-600 mt-1">
                                {stat.change}
                              </p>
                            </div>
                            {stat.percentage ? (
                              <ProgressRing
                                value={stat.percentage}
                                size={60}
                                strokeWidth={4}
                                color={stat.color}
                              />
                            ) : (
                              <div className="p-3 rounded-lg bg-primary/10">
                                <stat.icon className="h-6 w-6 text-primary" />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Analytics Tabs */}
                <Tabs defaultValue="overview" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="progress">Progress</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <LearningProgressChart
                        title="Learning Progress"
                        description="Your weekly learning progress"
                        data={learningProgressData}
                        loading={loading}
                      />
                      <LearningTimeChart
                        title="Daily Learning Time"
                        description="Hours spent learning each day"
                        data={learningTimeData}
                        loading={loading}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-2">
                        <CardHeader>
                          <CardTitle>Course Progress</CardTitle>
                          <CardDescription>
                            Your progress in enrolled courses
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { name: "React Fundamentals", progress: 85, color: "#0088FE" },
                              { name: "JavaScript Advanced", progress: 60, color: "#00C49F" },
                              { name: "CSS Grid & Flexbox", progress: 95, color: "#FFBB28" },
                              { name: "Node.js Backend", progress: 30, color: "#FF8042" },
                            ].map((course, index) => (
                              <motion.div
                                key={course.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex items-center space-x-4"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">{course.name}</span>
                                    <span className="text-sm text-muted-foreground">{course.progress}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <motion.div
                                      className="h-2 rounded-full"
                                      style={{ backgroundColor: course.color }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${course.progress}%` }}
                                      transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Learning Goals</CardTitle>
                          <CardDescription>
                            Your monthly targets
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="text-center">
                            <ProgressRing
                              value={75}
                              size={100}
                              color="#0088FE"
                              label="Courses"
                              sublabel="3 of 4 completed"
                            />
                          </div>
                          <div className="text-center">
                            <ProgressRing
                              value={60}
                              size={100}
                              color="#00C49F"
                              label="Hours"
                              sublabel="120 of 200 hours"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="progress" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <LearningProgressChart
                        title="Weekly Progress Trend"
                        description="Your learning progress over time"
                        data={learningProgressData}
                        loading={loading}
                      />
                      <Card>
                        <CardHeader>
                          <CardTitle>Learning Milestones</CardTitle>
                          <CardDescription>
                            Key achievements in your learning journey
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {[
                              { milestone: "First Course Completed", date: "Jan 15, 2024", achieved: true },
                              { milestone: "50 Hours of Learning", date: "Feb 10, 2024", achieved: true },
                              { milestone: "5 Courses Completed", date: "Mar 5, 2024", achieved: true },
                              { milestone: "100 Hours of Learning", date: "Apr 1, 2024", achieved: false },
                              { milestone: "10 Courses Completed", date: "May 15, 2024", achieved: false },
                            ].map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  item.achieved ? 'bg-green-500' : 'bg-muted-foreground/30'
                                }`} />
                                <div className="flex-1">
                                  <p className={`text-sm font-medium ${
                                    item.achieved ? 'text-foreground' : 'text-muted-foreground'
                                  }`}>
                                    {item.milestone}
                                  </p>
                                  <p className="text-xs text-muted-foreground">{item.date}</p>
                                </div>
                                {item.achieved && (
                                  <Badge className="bg-green-100 text-green-800">
                                    Completed
                                  </Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <GradeDistributionChart
                        title="Grade Distribution"
                        description="Your quiz and assignment grades"
                        data={gradeDistributionData}
                        loading={loading}
                      />
                      <LearningProgressChart
                        title="Quiz Scores Over Time"
                        description="Your quiz performance trend"
                        data={quizScoresData}
                        loading={loading}
                      />
                    </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Insights</CardTitle>
                        <CardDescription>
                          Analysis of your learning performance
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                            <p className="text-sm text-muted-foreground">Average Quiz Score</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                            <p className="text-sm text-muted-foreground">Assignment Completion</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
                            <p className="text-sm text-muted-foreground">Day Learning Streak</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Achievement Gallery</CardTitle>
                        <CardDescription>
                          Your learning achievements and progress toward new badges
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {achievements.map((achievement, index) => (
                            <motion.div
                              key={achievement.title}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                              <AchievementBadge {...achievement} />
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Achievement Statistics</CardTitle>
                        <CardDescription>
                          Your achievement progress overview
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <ProgressRing
                              value={50}
                              size={80}
                              color="#0088FE"
                              label="Earned"
                              sublabel="3 of 6 badges"
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground mb-2">3</div>
                            <p className="text-sm text-muted-foreground">Badges Earned</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground mb-2">3</div>
                            <p className="text-sm text-muted-foreground">In Progress</p>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground mb-2">67%</div>
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}