"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Star,
  Award,
  Clock,
  Calendar,
  Zap,
  Target,
  BarChart,
  PieChart,
  Sparkles
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { PremiumLayout, PremiumSection, PremiumGrid } from '@/components/ui/premium-layout'
import { 
  PremiumStatsCard, 
  GlassCard, 
  AnimatedProgress,
  FeatureCard,
  MetricCard
} from '@/components/ui/premium-components'
import { PremiumAreaChart, PremiumBarChart } from '@/components/ui/premium-charts'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'

// Mock data for charts
const weeklyProgressData = [
  { name: "Mon", value: 3 },
  { name: "Tue", value: 5 },
  { name: "Wed", value: 2 },
  { name: "Thu", value: 7 },
  { name: "Fri", value: 4 },
  { name: "Sat", value: 6 },
  { name: "Sun", value: 8 }
]

const courseCompletionData = [
  { name: "Web Dev", value: 85 },
  { name: "Python", value: 65 },
  { name: "Data Science", value: 40 },
  { name: "UI/UX", value: 92 },
  { name: "Mobile Dev", value: 30 }
]

const upcomingCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    instructor: "Sarah Johnson",
    date: "Tomorrow, 10:00 AM",
    progress: 45,
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 2,
    title: "Data Visualization Masterclass",
    instructor: "Michael Chen",
    date: "Wed, 2:30 PM",
    progress: 20,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    instructor: "Alex Rivera",
    date: "Fri, 1:00 PM",
    progress: 10,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
  }
]

const achievements = [
  {
    id: 1,
    title: "Fast Learner",
    description: "Completed 5 courses in one month",
    icon: Zap,
    earned: true
  },
  {
    id: 2,
    title: "Perfect Score",
    description: "Scored 100% on a final exam",
    icon: Target,
    earned: true
  },
  {
    id: 3,
    title: "Course Creator",
    description: "Created your first course",
    icon: Sparkles,
    earned: false
  }
]

export default function StudentPremiumDashboard() {
  const { user, userProfile } = useAuth()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <PremiumLayout role="student">
        {/* Welcome Section */}
        <PremiumSection>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back, {userProfile?.name || 'Student'}!
              </h1>
              <p className="text-muted-foreground">
                Track your progress and continue your learning journey
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Schedule</span>
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Continue Learning</span>
              </Button>
            </div>
          </div>
        </PremiumSection>

        {/* Stats Cards */}
        <PremiumSection>
          <PremiumGrid columns={4}>
            <PremiumStatsCard
              title="Courses Enrolled"
              value="12"
              change="+3 this month"
              trend="up"
              icon={BookOpen}
              gradient="primary"
            />
            <PremiumStatsCard
              title="Hours Learned"
              value="87"
              change="+12 this week"
              trend="up"
              icon={Clock}
              gradient="primary"
            />
            <PremiumStatsCard
              title="Certificates"
              value="5"
              change="2 pending"
              trend="neutral"
              icon={Award}
              gradient="primary"
            />
            <PremiumStatsCard
              title="Average Score"
              value="92%"
              change="+5% improvement"
              trend="up"
              icon={Target}
              gradient="primary"
            />
          </PremiumGrid>
        </PremiumSection>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Learning Progress - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Activity Chart */}
            <PremiumAreaChart
              title="Weekly Learning Activity"
              description="Your learning hours over the past week"
              data={weeklyProgressData}
              role="student"
            />
            
            {/* Course Completion */}
            <PremiumBarChart
              title="Course Completion"
              description="Your progress across active courses"
              data={courseCompletionData}
              role="student"
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <GlassCard>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20 border-4 border-background dark:border-border shadow-md">
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback className="gradient-primary text-white text-xl font-bold">
                    {userProfile?.name?.split(' ').map(n => n[0]).join('') || 'S'}
                  </AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-xl font-bold">{userProfile?.name || 'Student'}</h3>
                <p className="text-sm text-muted-foreground">Web Development Track</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20">
                    Beginner
                  </Badge>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20">
                    Frontend
                  </Badge>
                </div>
                
                <div className="mt-6 w-full">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Level Progress</span>
                    <span className="text-sm text-muted-foreground">65%</span>
                  </div>
                  <AnimatedProgress value={65} color="primary" />
                </div>
                
                <Button className="mt-6 w-full bg-primary hover:bg-primary/90 text-white">
                  View Profile
                </Button>
              </div>
            </GlassCard>
            
            {/* Upcoming Classes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Upcoming Classes</h3>
              <div className="space-y-3">
                {upcomingCourses.map((course) => (
                  <div 
                    key={course.id}
                    className="bg-card dark:bg-card border border-border rounded-xl p-3 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">{course.instructor}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3 text-primary" />
                          <span className="text-xs">{course.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={cn(
                      "border rounded-xl p-3 flex items-center gap-3",
                      achievement.earned 
                        ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30" 
                        : "bg-muted/50 border-border"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      achievement.earned ? "gradient-primary" : "bg-muted"
                    )}>
                      <achievement.icon className={cn(
                        "h-5 w-5",
                        achievement.earned ? "text-white" : "text-muted-foreground"
                      )} />
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </PremiumLayout>
    </ProtectedRoute>
  )
}
