import { api } from './api'

export interface Quiz {
  id: number
  course_id: number
  title: string
  description?: string
  time_limit?: number
  passing_score?: number
  created_at?: string
  questions?: QuizQuestion[]
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question_text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: any
  correct_answer: string
  points?: number
}

export interface Assignment {
  id: number
  course_id: number
  title: string
  description: string
  due_date?: string
  max_points?: number
  created_at?: string
  submissions?: AssignmentSubmission[]
}

export interface AssignmentSubmission {
  id: number
  assignment_id: number
  user_id: number
  submission_url: string
  grade?: number
  submitted_at: string
  graded_at?: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const assessmentApi = {
  // Quizzes
  createQuiz: async (quizData: Omit<Quiz, 'id' | 'created_at' | 'questions'>): Promise<ApiResponse<Quiz>> => {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  getQuiz: async (id: number): Promise<ApiResponse<Quiz>> => {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },

  updateQuiz: async (id: number, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
    const response = await api.put(`/quizzes/${id}`, quizData)
    return response.data
  },

  deleteQuiz: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/quizzes/${id}`)
    return response.data
  },

  getQuizQuestions: async (quizId: number): Promise<ApiResponse<QuizQuestion[]>> => {
    const response = await api.get(`/quizzes/${quizId}/questions`)
    return response.data
  },

  addQuizQuestion: async (questionData: Omit<QuizQuestion, 'id'>): Promise<ApiResponse<QuizQuestion>> => {
    const response = await api.post('/quizzes/questions', questionData)
    return response.data
  },

  submitQuiz: async (quizId: number, userId: number, answers: Record<string, string>): Promise<ApiResponse<any>> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, {
      user_id: userId,
      quiz_id: quizId,
      answers
    })
    return response.data
  },

  // Assignments
  createAssignment: async (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'submissions'>): Promise<ApiResponse<Assignment>> => {
    const response = await api.post('/assignments', assignmentData)
    return response.data
  },

  getAssignment: async (id: number): Promise<ApiResponse<Assignment>> => {
    const response = await api.get(`/assignments/${id}`)
    return response.data
  },

  updateAssignment: async (id: number, assignmentData: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    const response = await api.put(`/assignments/${id}`, assignmentData)
    return response.data
  },

  deleteAssignment: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/assignments/${id}`)
    return response.data
  },

  submitAssignment: async (assignmentId: number, userId: number, submissionUrl: string): Promise<ApiResponse<AssignmentSubmission>> => {
    const response = await api.post('/assignments/submit', {
      assignment_id: assignmentId,
      user_id: userId,
      submission_url: submissionUrl
    })
    return response.data
  },

  gradeAssignment: async (submissionId: number, grade: number): Promise<ApiResponse<void>> => {
    const response = await api.put('/assignments/grade', {
      submission_id: submissionId,
      grade
    })
    return response.data
  },

  getAssignmentSubmissions: async (assignmentId: number): Promise<ApiResponse<AssignmentSubmission[]>> => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`)
    return response.data
  }
}