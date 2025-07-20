"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign,
  MessageSquare,
  Award,
  BarChart3,
  PieChart
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/analytics/date-range-picker"
import { ExportButton } from "@/components/analytics/export-utils"
import { 
  ProgressRing,
  EnrollmentTrendsChart,
  GradeDistributionChart,
  CoursePopularityChart,
  LearningTimeChart
} from "@/components/analytics/chart-components"
import { DateRange } from "react-day-picker"
import { addDays } from "date-fns"

// Mock data for instructor analytics
const enrollmentTrendsData = [
  { month: 'Jan', enrollments: 45, completions: 32 },
  { month: 'Feb', enrollments: 52, completions: 38 },
  { month: 'Mar', enrollments: 48, completions: 35 },
  { month: 'Apr', enrollments: 61, completions: 45 },
  { month: 'May', enrollments: 55, completions: 42 },
  { month: 'Jun', enrollments: 67, completions: 50 },
]

const coursePopularityData = [
  { name: 'React Fundamentals', value: 35 },
  { name: 'JavaScript Advanced', value: 25 },
  { name: 'CSS Grid & Flexbox', value: 20 },
  { name: 'Node.js Backend', value: 15 },
  { name: 'TypeScript Basics', value: 5 },
]

const gradeDistributionData = [
  { grade: 'A+', count: 45 },
  { grade: 'A', count: 67 },
  { grade: 'B+', count: 89 },
  { grade: 'B', count: 56 },
  { grade: 'C+', count: 23 },
  { grade: 'C', count: 12 },
]

const revenueData = [
  { month: 'Jan', revenue: 4500 },
  { month: 'Feb', revenue: 5200 },
  { month: 'Mar', revenue: 4800 },
  { month: 'Apr', revenue: 6100 },
  { month: 'May', revenue: 5500 },
  { month: 'Jun', revenue: 6700 },
]

export default function InstructorAnalyticsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })
  const [loading, setLoading] = React.useState(false)

  const stats = [
    {
      title: "Total Students",
      value: "1,234",
      change: "+23 new this month",
      changeType: "positive" as const,
      icon: Users,
      color: "#0088FE"
    },
    {
      title: "Course Completion Rate",
      value: "87%",
      change: "+5% from last month",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "#00C49F"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "Across all courses",
      changeType: "positive" as const,
      icon: Award,
      color: "#FFBB28"
    },
    {
      title: "Monthly Revenue",
      value: "$6,700",
      change: "+18% from last month",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "#FF8042"
    }
  ]

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-gradient-to-br from-background via-muted/8 to-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Course Analytics"
            subtitle="Track your teaching performance and student engagement with detailed insights"
          />
          
          <main className="flex-1 overflow-y-auto page-section" id="instructor-analytics">
            <div className="content-container-enhanced">
              <div className="section-content">
                {/* Enhanced Header Actions */}
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                  <div>
                    <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">Analytics Dashboard</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Comprehensive insights into your teaching performance and student success
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6 w-full lg:w-auto">
                    <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                    <ExportButton 
                      data={enrollmentTrendsData} 
                      filename="instructor-analytics"
                      elementId="instructor-analytics"
                    />
                  </div>
                </div>

                {/* Enhanced Stats Cards */}
                <div className="grid-layout-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="enhanced-card analytics-card">
                        <CardContent className="p-10">
                          <div className="flex items-start justify-between">
                            <div className="space-y-4">
                              <p className="text-lg font-medium text-muted-foreground">
                                {stat.title}
                              </p>
                              <p className="text-4xl lg:text-5xl font-bold text-foreground stat-value">
                                {stat.value}
                              </p>
                              <p className="text-sm text-green-600 font-medium">
                                {stat.change}
                              </p>
                            </div>
                            <div className="icon-container p-5 rounded-3xl bg-primary/10 transition-all duration-300">
                              <stat.icon className="h-10 w-10 text-primary" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

              {/* Enhanced Analytics Tabs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Tabs defaultValue="overview" className="space-y-10">
                  <TabsList className="grid w-full grid-cols-4 bg-muted/30 rounded-2xl p-3 h-auto">
                    <TabsTrigger value="overview" className="rounded-xl py-4 text-lg font-medium">Overview</TabsTrigger>
                    <TabsTrigger value="students" className="rounded-xl py-4 text-lg font-medium">Students</TabsTrigger>
                    <TabsTrigger value="courses" className="rounded-xl py-4 text-lg font-medium">Courses</TabsTrigger>
                    <TabsTrigger value="revenue" className="rounded-xl py-4 text-lg font-medium">Revenue</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="section-content">
                      <div className="grid-layout-2">
                        <motion.div
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="enhanced-card"
                        >
                          <EnrollmentTrendsChart
                            title="Enrollment Trends"
                            description="Student enrollments vs course completions over time"
                            data={enrollmentTrendsData}
                            loading={loading}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="enhanced-card"
                        >
                          <CoursePopularityChart
                            title="Course Popularity"
                            description="Distribution of student enrollments across courses"
                            data={coursePopularityData}
                            loading={loading}
                          />
                        </motion.div>
                      </div>
                    
                    <div className="grid-layout-3">
                      <Card className="lg:col-span-2 enhanced-card">
                        <CardHeader className="pb-8">
                          <CardTitle className="text-2xl">Course Performance</CardTitle>
                          <CardDescription className="text-lg">
                            Completion rates and student engagement
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            {[
                              { name: "React Fundamentals", students: 234, completion: 92, rating: 4.9 },
                              { name: "JavaScript Advanced", students: 189, completion: 85, rating: 4.7 },
                              { name: "CSS Grid & Flexbox", students: 156, completion: 88, rating: 4.8 },
                              { name: "Node.js Backend", students: 98, completion: 79, rating: 4.6 },
                            ].map((course, index) => (
                              <motion.div
                                key={course.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="p-6 border rounded-2xl hover:bg-muted/20 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-lg">{course.name}</h4>
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-muted-foreground">
                                      {course.students} students
                                    </span>
                                    <span className="text-sm font-medium">
                                      ⭐ {course.rating}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between text-sm mb-2">
                                      <span>Completion Rate</span>
                                      <span className="font-semibold">{course.completion}%</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-3">
                                      <motion.div
                                        className="h-3 rounded-full bg-green-500"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${course.completion}%` }}
                                        transition={{ duration: 1, delay: index * 0.2 }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    
                      <Card className="enhanced-card">
                        <CardHeader className="pb-8">
                          <CardTitle className="text-2xl">Quick Stats</CardTitle>
                          <CardDescription className="text-lg">
                            Key performance indicators
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 p-8">
                          <div className="text-center">
                            <ProgressRing
                              value={87}
                              size={100}
                              color="#0088FE"
                              label="Completion"
                              sublabel="Average rate"
                            />
                          </div>
                          <div className="text-center">
                            <ProgressRing
                              value={96}
                              size={100}
                              color="#00C49F"
                              label="Satisfaction"
                              sublabel="Student rating"
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="students" className="space-y-10">
                  <div className="section-content">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="enhanced-card">
                        <GradeDistributionChart
                          title="Grade Distribution"
                          description="Student performance across all courses"
                          data={gradeDistributionData}
                          loading={loading}
                        />
                      </div>
                      <Card className="enhanced-card">
                        <CardHeader className="pb-8">
                          <CardTitle className="text-2xl">Student Engagement</CardTitle>
                          <CardDescription className="text-lg">
                            Discussion and interaction metrics
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                              <span className="text-lg font-medium">Discussion Posts</span>
                              <span className="text-xl font-bold text-primary">1,234</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                              <span className="text-lg font-medium">Questions Asked</span>
                              <span className="text-xl font-bold text-primary">456</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                              <span className="text-lg font-medium">Peer Interactions</span>
                              <span className="text-xl font-bold text-primary">789</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                              <span className="text-lg font-medium">Average Response Time</span>
                              <span className="text-xl font-bold text-primary">2.4 hours</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="courses" className="space-y-10">
                  <div className="section-content">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="enhanced-card">
                        <CoursePopularityChart
                          title="Course Enrollment Distribution"
                          description="Student distribution across your courses"
                          data={coursePopularityData}
                          loading={loading}
                        />
                      </div>
                      <Card className="enhanced-card">
                        <CardHeader className="pb-8">
                          <CardTitle className="text-2xl">Course Metrics</CardTitle>
                          <CardDescription className="text-lg">
                            Performance metrics for your courses
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="space-y-8">
                            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                              <div className="text-4xl font-bold text-foreground mb-3">12</div>
                              <p className="text-lg text-muted-foreground font-medium">Total Courses</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-green-500/5">
                              <div className="text-4xl font-bold text-foreground mb-3">8</div>
                              <p className="text-lg text-muted-foreground font-medium">Published</p>
                            </div>
                            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
                              <div className="text-4xl font-bold text-foreground mb-3">4</div>
                              <p className="text-lg text-muted-foreground font-medium">In Draft</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="revenue" className="space-y-10">
                  <div className="section-content">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="enhanced-card">
                        <EnrollmentTrendsChart
                          title="Revenue Trends"
                          description="Monthly revenue from course sales"
                          data={revenueData}
                          loading={loading}
                        />
                      </div>
                      <Card className="enhanced-card">
                        <CardHeader className="pb-8">
                          <CardTitle className="text-2xl">Revenue Breakdown</CardTitle>
                          <CardDescription className="text-lg">
                            Revenue analysis and projections
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-950/10">
                              <span className="text-lg font-medium">This Month</span>
                              <span className="text-xl font-bold text-green-600">$6,700</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20">
                              <span className="text-lg font-medium">Last Month</span>
                              <span className="text-xl font-bold">$5,500</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-950/10">
                              <span className="text-lg font-medium">Growth Rate</span>
                              <span className="text-xl font-bold text-green-600">+21.8%</span>
                            </div>
                            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-950/10">
                              <span className="text-lg font-medium">Projected Next Month</span>
                              <span className="text-xl font-bold text-blue-600">$7,200</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}