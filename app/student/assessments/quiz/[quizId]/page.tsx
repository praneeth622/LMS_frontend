"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Flag,
  Eye,
  EyeOff
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { QuizTimer } from '@/components/assessment/quiz-timer'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "react-hot-toast"
import { assessmentApi, Quiz, QuizQuestion } from '@/lib/assessment-api'
import { useAuth } from '@/contexts/auth-context'

export default function TakeQuizPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = parseInt(params.quizId as string)
  const { userProfile } = useAuth()

  const [quiz, setQuiz] = React.useState<Quiz | null>(null)
  const [questions, setQuestions] = React.useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = React.useState<Set<number>>(new Set())
  const [loading, setLoading] = React.useState(true)
  const [quizStarted, setQuizStarted] = React.useState(false)
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)
  const [startTime, setStartTime] = React.useState<Date | null>(null)
  const [showQuestionList, setShowQuestionList] = React.useState(false)

  React.useEffect(() => {
    if (quizId) {
      fetchQuizData()
    }
  }, [quizId])

  const fetchQuizData = async () => {
    try {
      setLoading(true)
      
      // Mock quiz data
      const mockQuiz: Quiz = {
        id: quizId,
        course_id: 1,
        title: "JavaScript Fundamentals Quiz",
        description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
        time_limit: 1800, // 30 minutes
        passing_score: 70,
        created_at: new Date().toISOString()
      }
      
      const mockQuestions: QuizQuestion[] = [
        {
          id: 1,
          quiz_id: quizId,
          question_text: "What does 'var' keyword do in JavaScript?",
          type: "multiple_choice",
          options: [
            "Declares a variable",
            "Creates a function",
            "Defines a constant",
            "Imports a module"
          ],
          correct_answer: "Declares a variable",
          points: 2,
        },
        {
          id: 2,
          quiz_id: quizId,
          question_text: "JavaScript is a compiled language.",
          type: "true_false",
          options: ["True", "False"],
          correct_answer: "false",
          points: 1,
        },
        {
          id: 3,
          quiz_id: quizId,
          question_text: "What method is used to add an element to the end of an array?",
          type: "short_answer",
          correct_answer: "push",
          points: 2,
        },
        {
          id: 4,
          quiz_id: quizId,
          question_text: "Which of the following is NOT a JavaScript data type?",
          type: "multiple_choice",
          options: [
            "String",
            "Boolean",
            "Integer",
            "Undefined"
          ],
          correct_answer: "Integer",
          points: 2,
        }
      ]

      setQuiz(mockQuiz)
      setQuestions(mockQuestions)
    } catch (error) {
      console.error('Error fetching quiz data:', error)
      toast.error('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setStartTime(new Date())
  }

  const handleTimeUp = () => {
    toast.error('Time is up! Submitting quiz automatically.')
    submitQuiz()
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
    setShowQuestionList(false)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!userProfile?.id || !startTime) return

    try {
      setSubmitting(true)
      const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      
      const response = await assessmentApi.submitQuiz(quizId, userProfile.id, answers)
      if (response.success) {
        setQuizCompleted(true)
        toast.success('Quiz submitted successfully!')
        router.push(`/student/assessments/quiz/${quizId}/results`)
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
      setShowSubmitDialog(false)
    }
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getQuestionStatus = (index: number) => {
    const question = questions[index]
    const isAnswered = answers[question.id] !== undefined
    const isFlagged = flaggedQuestions.has(index)
    const isCurrent = index === currentQuestionIndex

    if (isCurrent) return 'current'
    if (isAnswered && isFlagged) return 'answered-flagged'
    if (isAnswered) return 'answered'
    if (isFlagged) return 'flagged'
    return 'unanswered'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-primary text-primary-foreground'
      case 'answered':
        return 'bg-green-500 text-white'
      case 'flagged':
        return 'bg-yellow-500 text-white'
      case 'answered-flagged':
        return 'bg-orange-500 text-white'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!quiz || questions.length === 0) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Quiz Not Found</CardTitle>
              <CardDescription>
                The quiz you're looking for doesn't exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/student/assessments">Back to Assessments</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  if (!quizStarted) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription className="text-lg">
                {quiz.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 border rounded-lg">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{Math.floor((quiz.time_limit || 0) / 60)}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{questions.length}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="p-4 border rounded-lg">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{quiz.passing_score}%</div>
                  <div className="text-sm text-muted-foreground">To Pass</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Instructions:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• You have {Math.floor((quiz.time_limit || 0) / 60)} minutes to complete this quiz</li>
                  <li>• You can navigate between questions and change your answers</li>
                  <li>• Flag questions you want to review later</li>
                  <li>• Make sure to submit before time runs out</li>
                  <li>• You need {quiz.passing_score}% to pass this quiz</li>
                </ul>
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" asChild className="flex-1">
                  <a href="/student/assessments">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </a>
                </Button>
                <Button onClick={startQuiz} className="flex-1">
                  Start Quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="min-h-screen bg-background">
        {/* Timer */}
        <QuizTimer
          timeLimit={quiz.time_limit || 1800}
          onTimeUp={handleTimeUp}
          isActive={quizStarted && !quizCompleted}
        />

        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{quiz.title}</h1>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowQuestionList(!showQuestionList)}
                >
                  {showQuestionList ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  Questions
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSubmitDialog(true)}
                >
                  Submit Quiz
                </Button>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{getAnsweredCount()}/{questions.length} answered</span>
              </div>
              <Progress value={(getAnsweredCount() / questions.length) * 100} className="h-2" />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Question Navigation Sidebar */}
            <AnimatePresence>
              {showQuestionList && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="lg:col-span-1"
                >
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2">
                        {questions.map((_, index) => {
                          const status = getQuestionStatus(index)
                          return (
                            <button
                              key={index}
                              onClick={() => goToQuestion(index)}
                              className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${getStatusColor(status)}`}
                            >
                              {index + 1}
                              {flaggedQuestions.has(index) && (
                                <Flag className="h-3 w-3 absolute -top-1 -right-1" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                      
                      <div className="mt-4 space-y-2 text-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span>Answered</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                          <span>Flagged</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-muted rounded"></div>
                          <span>Not answered</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Question Area */}
            <div className={showQuestionList ? "lg:col-span-3" : "lg:col-span-4"}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">
                              Question {currentQuestionIndex + 1}
                            </Badge>
                            <Badge>
                              {currentQuestion.points} point{currentQuestion.points !== 1 ? 's' : ''}
                            </Badge>
                            {currentQuestion.type === 'multiple_choice' && (
                              <Badge variant="secondary">Multiple Choice</Badge>
                            )}
                            {currentQuestion.type === 'true_false' && (
                              <Badge variant="secondary">True/False</Badge>
                            )}
                            {currentQuestion.type === 'short_answer' && (
                              <Badge variant="secondary">Short Answer</Badge>
                            )}
                          </div>
                          <CardTitle className="text-xl">
                            {currentQuestion.question_text}
                          </CardTitle>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleFlag(currentQuestionIndex)}
                          className={flaggedQuestions.has(currentQuestionIndex) ? 'text-yellow-600' : ''}
                        >
                          <Flag className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Answer Options */}
                      {currentQuestion.type === 'multiple_choice' && (
                        <RadioGroup
                          value={answers[currentQuestion.id] || ""}
                          onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        >
                          <div className="space-y-3">
                            {currentQuestion.options?.map((option : string, index : number) => (
                              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value={option} id={`option-${index}`} />
                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + index)}.
                                  </span>
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                      
                      {currentQuestion.type === 'true_false' && (
                        <RadioGroup
                          value={answers[currentQuestion.id] || ""}
                          onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value="true" id="true" />
                              <Label htmlFor="true" className="flex-1 cursor-pointer">True</Label>
                            </div>
                            <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                              <RadioGroupItem value="false" id="false" />
                              <Label htmlFor="false" className="flex-1 cursor-pointer">False</Label>
                            </div>
                          </div>
                        </RadioGroup>
                      )}
                      
                      {currentQuestion.type === 'short_answer' && (
                        <div className="space-y-2">
                          <Label htmlFor="answer">Your Answer</Label>
                          <Textarea
                            id="answer"
                            value={answers[currentQuestion.id] || ""}
                            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                            placeholder="Type your answer here..."
                            rows={4}
                          />
                        </div>
                      )}
                      
                      {/* Navigation */}
                      <div className="flex items-center justify-between pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={previousQuestion}
                          disabled={currentQuestionIndex === 0}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Previous
                        </Button>
                        
                        <div className="text-sm text-muted-foreground">
                          {currentQuestionIndex + 1} of {questions.length}
                        </div>
                        
                        {currentQuestionIndex === questions.length - 1 ? (
                          <Button onClick={() => setShowSubmitDialog(true)}>
                            Submit Quiz
                          </Button>
                        ) : (
                          <Button onClick={nextQuestion}>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Submit Confirmation Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Quiz</DialogTitle>
              <DialogDescription>
                Are you sure you want to submit your quiz? You won't be able to change your answers after submission.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{getAnsweredCount()}</div>
                  <div className="text-sm text-muted-foreground">Answered</div>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{questions.length - getAnsweredCount()}</div>
                  <div className="text-sm text-muted-foreground">Unanswered</div>
                </div>
              </div>
              
              {questions.length - getAnsweredCount() > 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    You have {questions.length - getAnsweredCount()} unanswered question(s). 
                    These will be marked as incorrect.
                  </p>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
                Continue Quiz
              </Button>
              <Button onClick={submitQuiz} disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}