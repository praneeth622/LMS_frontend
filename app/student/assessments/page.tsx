"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Clock, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Play,
  Upload,
  Eye
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { assessmentApi, Quiz, Assignment } from '@/lib/assessment-api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

export default function StudentAssessmentsPage() {
  const [quizzes, setQuizzes] = React.useState<Quiz[]>([])
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [loading, setLoading] = React.useState(true)
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Completed Quizzes",
      value: "8",
      change: "2 this week",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Pending Assignments",
      value: "3",
      change: "Due this week",
      changeType: "negative" as const,
      icon: AlertTriangle,
      color: "bg-orange-500"
    },
    {
      title: "Average Score",
      value: "87%",
      change: "+5% improvement",
      changeType: "positive" as const,
      icon: Target,
      color: "bg-blue-500"
    },
    {
      title: "Certificates Earned",
      value: "2",
      change: "1 this month",
      changeType: "positive" as const,
      icon: Award,
      color: "bg-purple-500"
    }
  ]

  React.useEffect(() => {
    fetchAssessments()
  }, [])

  const fetchAssessments = async () => {
    try {
      setLoading(true)
      
      // Mock data for demonstration
      setQuizzes([
        {
          id: 1,
          course_id: 1,
          title: "JavaScript Fundamentals Quiz",
          description: "Test your knowledge of JavaScript basics",
          time_limit: 1800,
          passing_score: 70,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          title: "React Components Quiz",
          description: "Quiz on React component concepts",
          time_limit: 2400,
          passing_score: 75,
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ])

      setAssignments([
        {
          id: 1,
          course_id: 1,
          title: "Build a Todo App",
          description: "Create a fully functional todo application using React",
          due_date: "2025-02-15",
          max_points: 100,
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          course_id: 1,
          title: "Portfolio Website",
          description: "Design and develop a personal portfolio website",
          due_date: "2025-02-28",
          max_points: 150,
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ])

    } catch (error) {
      console.error('Error fetching assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusBadge = (daysUntilDue: number) => {
    if (daysUntilDue < 0) {
      return <Badge variant="destructive">Overdue</Badge>
    } else if (daysUntilDue <= 3) {
      return <Badge variant="destructive">Due Soon</Badge>
    } else if (daysUntilDue <= 7) {
      return <Badge className="bg-yellow-500 text-white">Due This Week</Badge>
    } else {
      return <Badge variant="outline">Upcoming</Badge>
    }
  }

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex min-h-screen bg-background">
        <StudentSidebar
          
          
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            title="Assessments"
            subtitle="Take quizzes and submit assignments to test your knowledge"
          />
          <main className="flex-1 overflow-y-auto">
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
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                          </CardTitle>
                          <div className={`p-2 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-4 w-4 text-white" />
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-foreground mb-1">
                            {stat.value}
                          </div>
                          <p className={`text-xs ${
                            stat.changeType === 'positive' ? 'text-green-600' : 
                            stat.changeType === 'negative' ? 'text-red-600' : 'text-muted-foreground'
                          }`}>
                            {stat.change}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Assessments Tabs */}
                <Tabs defaultValue="quizzes" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="quizzes">Quizzes ({quizzes.length})</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments ({assignments.length})</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="quizzes" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <Card key={i} className="animate-pulse">
                            <CardHeader>
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="h-3 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        quizzes.map((quiz, index) => (
                          <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card className="h-full hover:shadow-lg transition-shadow group">
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                      {quiz.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2">
                                      {quiz.description}
                                    </CardDescription>
                                  </div>
                                  <Badge variant="outline" className="ml-2">
                                    Quiz
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{formatTime(quiz.time_limit || 0)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Target className="h-4 w-4" />
                                      <span>{quiz.passing_score}% to pass</span>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                      <span>Your best score</span>
                                      <span className="font-medium">
                                        {Math.floor(Math.random() * 30) + 70}%
                                      </span>
                                    </div>
                                    <Progress value={Math.floor(Math.random() * 30) + 70} className="h-2" />
                                  </div>
                                  
                                  <div className="flex space-x-2">
                                    <Button asChild className="flex-1">
                                      <Link href={`/student/assessments/quiz/${quiz.id}`}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Take Quiz
                                      </Link>
                                    </Button>
                                    <Button variant="outline" size="icon" asChild>
                                      <Link href={`/student/assessments/quiz/${quiz.id}/results`}>
                                        <Eye className="h-4 w-4" />
                                      </Link>
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="assignments" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <Card key={i} className="animate-pulse">
                            <CardHeader>
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                <div className="h-3 bg-muted rounded"></div>
                                <div className="h-3 bg-muted rounded w-2/3"></div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        assignments.map((assignment, index) => {
                          const daysUntilDue = assignment.due_date ? getDaysUntilDue(assignment.due_date) : 0
                          
                          return (
                            <motion.div
                              key={assignment.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                              <Card className="h-full hover:shadow-lg transition-shadow group">
                                <CardHeader>
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                                        {assignment.title}
                                      </CardTitle>
                                      <CardDescription className="mt-2">
                                        {assignment.description}
                                      </CardDescription>
                                    </div>
                                    {getStatusBadge(daysUntilDue)}
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                      <div className="flex items-center space-x-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Due {assignment.due_date ? format(new Date(assignment.due_date), "MMM dd") : "TBD"}</span>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Target className="h-4 w-4" />
                                        <span>{assignment.max_points} points</span>
                                      </div>
                                    </div>
                                    
                                    <div className="text-sm">
                                      <span className="text-muted-foreground">Status: </span>
                                      <span className="font-medium text-orange-600">Not Submitted</span>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                      <Button asChild className="flex-1">
                                        <Link href={`/student/assessments/assignment/${assignment.id}`}>
                                          <Upload className="mr-2 h-4 w-4" />
                                          Submit
                                        </Link>
                                      </Button>
                                      <Button variant="outline" size="icon" asChild>
                                        <Link href={`/student/assessments/assignment/${assignment.id}/details`}>
                                          <Eye className="h-4 w-4" />
                                        </Link>
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })
                      )}
                    </div>
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