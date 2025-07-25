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
      color: "bg-emerald-500"
    },
    {
      title: "Consistent Learner",
      description: "Learn for 7 days straight",
      icon: <Flame className="h-5 w-5" />,
      earned: true,
      color: "bg-blue-500"
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
      <div className="flex h-screen bg-gradient-to-br from-background via-muted/8 to-background">
        <StudentSidebar
          
          
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            title="Learning Analytics"
            subtitle="Track your progress and achievements with detailed insights"
          />
          <main className="flex-1 overflow-y-auto page-section" id="analytics-dashboard">
            <div className="content-container-enhanced">
              <div className="section-content">
                {/* Header Section with Actions */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Analytics Dashboard</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Track your learning journey and measure your progress with comprehensive insights
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6 w-full lg:w-auto">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <ExportButton 
                      data={learningProgressData} 
                      filename="student-analytics"
                      elementId="analytics-dashboard"
                    />
                  </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="enhanced-card stats-card-enhanced border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/95">
                        <CardContent className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div 
                                className="p-3 rounded-xl icon-container transition-transform duration-200 shadow-sm"
                                style={{ backgroundColor: `${stat.color}15`, border: `1px solid ${stat.color}25` }}
                              >
                                <stat.icon 
                                  className="h-6 w-6 transition-transform duration-200" 
                                  style={{ color: stat.color }}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-muted-foreground stat-title">
                                  {stat.title}
                                </p>
                                <div className="flex items-baseline space-x-2">
                                  <p className="text-3xl font-bold text-foreground stat-value">
                                    {stat.value}
                                  </p>
                                  {stat.total && (
                                    <span className="text-lg text-muted-foreground">/ {stat.total}</span>
                                  )}
                                </div>
                                {stat.percentage && (
                                  <div className="mt-2">
                                    <div className="w-full bg-muted/50 rounded-full h-2">
                                      <div 
                                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                                        style={{ width: `${stat.percentage}%` }}
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-950/10">
                            <TrendingUp className="h-4 w-4 text-emerald-600" />
                            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                              {stat.change}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Enhanced Analytics Tabs */}
                <Tabs defaultValue="overview" className="space-y-8">
                  <div className="flex items-center justify-center">
                    <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-muted/30 rounded-2xl p-3 h-auto">
                      <TabsTrigger value="overview" className="rounded-xl py-4 text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="progress" className="rounded-xl py-4 text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Progress
                      </TabsTrigger>
                      <TabsTrigger value="performance" className="rounded-xl py-4 text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Performance
                      </TabsTrigger>
                      <TabsTrigger value="achievements" className="rounded-xl py-4 text-lg font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Achievements
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="overview" className="space-y-8 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <LearningProgressChart
                          title="Learning Progress"
                          description="Your weekly learning progress"
                          data={learningProgressData}
                          loading={loading}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <LearningTimeChart
                          title="Daily Learning Time"
                          description="Hours spent learning each day"
                          data={learningTimeData}
                          loading={loading}
                        />
                      </motion.div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <motion.div 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold flex items-center">
                              <BookOpen className="mr-3 h-6 w-6 text-primary" />
                              Course Progress
                            </CardTitle>
                            <CardDescription className="text-base">
                              Your progress in enrolled courses
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-8">
                            <div className="space-y-6">
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
                                  className="space-y-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-foreground">
                                      {course.name}
                                    </span>
                                    <span className="text-sm text-muted-foreground font-medium">
                                      {course.progress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-3">
                                    <motion.div
                                      className="h-3 rounded-full"
                                      style={{ backgroundColor: course.color }}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${course.progress}%` }}
                                      transition={{ duration: 1, delay: index * 0.2 }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold">
                              Learning Goals
                            </CardTitle>
                            <CardDescription className="text-base">
                              Your monthly targets
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-8 pb-8">
                            <div className="text-center">
                              <ProgressRing
                                value={75}
                                size={120}
                                strokeWidth={8}
                                color="#0088FE"
                                label="Courses"
                                sublabel="3 of 4 completed"
                              />
                            </div>
                            <div className="text-center">
                              <ProgressRing
                                value={60}
                                size={120}
                                strokeWidth={8}
                                color="#00C49F"
                                label="Hours"
                                sublabel="120 of 200 hours"
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="progress" className="space-y-8 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <LearningProgressChart
                          title="Weekly Progress Trend"
                          description="Your learning progress over time"
                          data={learningProgressData}
                          loading={loading}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                          <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold flex items-center">
                              <Trophy className="mr-3 h-6 w-6 text-primary" />
                              Learning Milestones
                            </CardTitle>
                            <CardDescription className="text-base">
                              Key achievements in your learning journey
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="pb-8">
                            <div className="space-y-6">
                              {[
                                { milestone: "First Course Completed", date: "Jan 15, 2024", achieved: true },
                                { milestone: "50 Hours of Learning", date: "Feb 10, 2024", achieved: true },
                                { milestone: "5 Courses Completed", date: "Mar 5, 2024", achieved: true },
                                { milestone: "100 Hours of Learning", date: "Apr 1, 2024", achieved: false },
                                { milestone: "10 Courses Completed", date: "May 15, 2024", achieved: false },
                              ].map((item, index) => (
                                <motion.div 
                                  key={index} 
                                  className="flex items-center space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                  <div className={`w-4 h-4 rounded-full ${
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
                                    <Badge className="bg-green-100 text-green-800 border-green-200">
                                      Completed
                                    </Badge>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="performance" className="space-y-8 mt-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                      >
                        <GradeDistributionChart
                          title="Grade Distribution"
                          description="Your quiz and assignment grades"
                          data={gradeDistributionData}
                          loading={loading}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                      >
                        <LearningProgressChart
                          title="Quiz Scores Over Time"
                          description="Your quiz performance trend"
                          data={quizScoresData}
                          loading={loading}
                        />
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold flex items-center">
                            <BarChart3 className="mr-3 h-6 w-6 text-primary" />
                            Performance Insights
                          </CardTitle>
                          <CardDescription className="text-base">
                            Analysis of your learning performance
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                              <div className="text-4xl font-bold text-green-600 mb-2">87%</div>
                              <p className="text-sm text-green-700 dark:text-green-400 font-medium">Average Quiz Score</p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
                              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Assignment Completion</p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                              <div className="text-4xl font-bold text-purple-600 mb-2">15</div>
                              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Day Learning Streak</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                  
                  <TabsContent value="achievements" className="space-y-8 mt-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold flex items-center">
                            <Award className="mr-3 h-6 w-6 text-primary" />
                            Achievement Gallery
                          </CardTitle>
                          <CardDescription className="text-base">
                            Your learning achievements and progress toward new badges
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {achievements.map((achievement, index) => (
                              <motion.div
                                key={achievement.title}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="transform transition-all duration-200"
                              >
                                <AchievementBadge {...achievement} />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/10">
                        <CardHeader className="pb-6">
                          <CardTitle className="text-xl font-semibold flex items-center">
                            <Target className="mr-3 h-6 w-6 text-primary" />
                            Achievement Statistics
                          </CardTitle>
                          <CardDescription className="text-base">
                            Your achievement progress overview
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-8">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="text-center">
                              <ProgressRing
                                value={50}
                                size={100}
                                strokeWidth={8}
                                color="#0088FE"
                                label="Earned"
                                sublabel="3 of 6 badges"
                              />
                            </div>
                            <div className="text-center p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
                              <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">Badges Earned</p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                              <div className="text-3xl font-bold text-green-600 mb-2">3</div>
                              <p className="text-sm text-green-700 dark:text-green-400 font-medium">In Progress</p>
                            </div>
                            <div className="text-center p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                              <div className="text-3xl font-bold text-purple-600 mb-2">67%</div>
                              <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">Completion Rate</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
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