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
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Course Analytics"
            subtitle="Track your teaching performance and student engagement"
          />
          
          <main className="flex-1 overflow-y-auto p-6" id="instructor-analytics">
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
                  <p className="text-muted-foreground">
                    Comprehensive insights into your teaching performance
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <DateRangePicker date={dateRange} onDateChange={setDateRange} />
                  <ExportButton 
                    data={enrollmentTrendsData} 
                    filename="instructor-analytics"
                    elementId="instructor-analytics"
                  />
                </div>
              </div>

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
                            <p className="text-2xl font-bold text-foreground">
                              {stat.value}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              {stat.change}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-primary/10">
                            <stat.icon className="h-6 w-6 text-primary" />
                          </div>
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
                  <TabsTrigger value="students">Students</TabsTrigger>
                  <TabsTrigger value="courses">Courses</TabsTrigger>
                  <TabsTrigger value="revenue">Revenue</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnrollmentTrendsChart
                      title="Enrollment Trends"
                      description="Student enrollments vs completions"
                      data={enrollmentTrendsData}
                      loading={loading}
                    />
                    <CoursePopularityChart
                      title="Course Popularity"
                      description="Distribution of student enrollments"
                      data={coursePopularityData}
                      loading={loading}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Course Performance</CardTitle>
                        <CardDescription>
                          Completion rates and student engagement
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
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
                              className="p-4 border rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-medium">{course.name}</h4>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">
                                    {course.students} students
                                  </span>
                                  <span className="text-sm font-medium">
                                    ⭐ {course.rating}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="flex-1">
                                  <div className="flex items-center justify-between text-sm mb-1">
                                    <span>Completion Rate</span>
                                    <span>{course.completion}%</span>
                                  </div>
                                  <div className="w-full bg-muted rounded-full h-2">
                                    <motion.div
                                      className="h-2 rounded-full bg-green-500"
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
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Stats</CardTitle>
                        <CardDescription>
                          Key performance indicators
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
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
                </TabsContent>
                
                <TabsContent value="students" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GradeDistributionChart
                      title="Grade Distribution"
                      description="Student performance across all courses"
                      data={gradeDistributionData}
                      loading={loading}
                    />
                    <Card>
                      <CardHeader>
                        <CardTitle>Student Engagement</CardTitle>
                        <CardDescription>
                          Discussion and interaction metrics
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Discussion Posts</span>
                            <span className="font-medium">1,234</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Questions Asked</span>
                            <span className="font-medium">456</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Peer Interactions</span>
                            <span className="font-medium">789</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Average Response Time</span>
                            <span className="font-medium">2.4 hours</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="courses" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <CoursePopularityChart
                      title="Course Enrollment Distribution"
                      description="Student distribution across your courses"
                      data={coursePopularityData}
                      loading={loading}
                    />
                    <Card>
                      <CardHeader>
                        <CardTitle>Course Metrics</CardTitle>
                        <CardDescription>
                          Performance metrics for your courses
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">12</div>
                            <p className="text-sm text-muted-foreground">Total Courses</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">8</div>
                            <p className="text-sm text-muted-foreground">Published</p>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold text-foreground mb-2">4</div>
                            <p className="text-sm text-muted-foreground">In Draft</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="revenue" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <EnrollmentTrendsChart
                      title="Revenue Trends"
                      description="Monthly revenue from course sales"
                      data={revenueData}
                      loading={loading}
                    />
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Breakdown</CardTitle>
                        <CardDescription>
                          Revenue analysis and projections
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">This Month</span>
                            <span className="font-medium text-green-600">$6,700</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Last Month</span>
                            <span className="font-medium">$5,500</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Growth Rate</span>
                            <span className="font-medium text-green-600">+21.8%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Projected Next Month</span>
                            <span className="font-medium">$7,200</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}