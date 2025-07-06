import { api } from './api'

export interface Quiz {
  id: number
  course_id: number
  title: string
  description?: string
  time_limit?: number
  passing_score?: number
  created_at?: string
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question_text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correct_answer: string
  points: number
  order: number
}

export interface QuizSubmission {
  id: number
  user_id: number
  quiz_id: number
  answers: Record<string, string>
  score: number
  submitted_at: string
  time_taken: number
}

export interface Assignment {
  id: number
  course_id: number
  title: string
  description: string
  due_date: string
  max_points: number
  created_at?: string
}

export interface AssignmentSubmission {
  id: number
  assignment_id: number
  user_id: number
  submission_url?: string
  submission_text?: string
  files?: string[]
  grade?: number
  feedback?: string
  submitted_at: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const assessmentApi = {
  // Quiz Management
  createQuiz: async (quizData: Omit<Quiz, 'id' | 'created_at'>): Promise<ApiResponse<Quiz>> => {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  getQuizzesByCourse: async (courseId: number): Promise<ApiResponse<Quiz[]>> => {
    const response = await api.get(`/quizzes/course/${courseId}`)
    return response.data
  },

  getQuizById: async (quizId: number): Promise<ApiResponse<Quiz>> => {
    const response = await api.get(`/quizzes/${quizId}`)
    return response.data
  },

  updateQuiz: async (quizId: number, quizData: Partial<Quiz>): Promise<ApiResponse<Quiz>> => {
    const response = await api.put(`/quizzes/${quizId}`, quizData)
    return response.data
  },

  deleteQuiz: async (quizId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/quizzes/${quizId}`)
    return response.data
  },

  // Quiz Questions
  addQuizQuestion: async (questionData: Omit<QuizQuestion, 'id'>): Promise<ApiResponse<QuizQuestion>> => {
    const response = await api.post('/quizzes/questions', questionData)
    return response.data
  },

  getQuizQuestions: async (quizId: number): Promise<ApiResponse<QuizQuestion[]>> => {
    const response = await api.get(`/quizzes/${quizId}/questions`)
    return response.data
  },

  updateQuizQuestion: async (questionId: number, questionData: Partial<QuizQuestion>): Promise<ApiResponse<QuizQuestion>> => {
    const response = await api.put(`/quizzes/questions/${questionId}`, questionData)
    return response.data
  },

  deleteQuizQuestion: async (questionId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/quizzes/questions/${questionId}`)
    return response.data
  },

  reorderQuestions: async (quizId: number, questionIds: number[]): Promise<ApiResponse<void>> => {
    const response = await api.put(`/quizzes/${quizId}/questions/reorder`, { questionIds })
    return response.data
  },

  // Quiz Submissions
  submitQuiz: async (quizId: number, submissionData: {
    user_id: number
    answers: Record<string, string>
    time_taken: number
  }): Promise<ApiResponse<QuizSubmission>> => {
    const response = await api.post(`/quizzes/${quizId}/submit`, submissionData)
    return response.data
  },

  getQuizSubmissions: async (quizId: number): Promise<ApiResponse<QuizSubmission[]>> => {
    const response = await api.get(`/quizzes/${quizId}/submissions`)
    return response.data
  },

  getUserQuizSubmission: async (quizId: number, userId: number): Promise<ApiResponse<QuizSubmission>> => {
    const response = await api.get(`/quizzes/${quizId}/submissions/user/${userId}`)
    return response.data
  },

  // Assignment Management
  createAssignment: async (assignmentData: Omit<Assignment, 'id' | 'created_at'>): Promise<ApiResponse<Assignment>> => {
    const response = await api.post('/assignments', assignmentData)
    return response.data
  },

  getAssignmentsByCourse: async (courseId: number): Promise<ApiResponse<Assignment[]>> => {
    const response = await api.get(`/assignments/course/${courseId}`)
    return response.data
  },

  getAssignmentById: async (assignmentId: number): Promise<ApiResponse<Assignment>> => {
    const response = await api.get(`/assignments/${assignmentId}`)
    return response.data
  },

  updateAssignment: async (assignmentId: number, assignmentData: Partial<Assignment>): Promise<ApiResponse<Assignment>> => {
    const response = await api.put(`/assignments/${assignmentId}`, assignmentData)
    return response.data
  },

  deleteAssignment: async (assignmentId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/assignments/${assignmentId}`)
    return response.data
  },

  // Assignment Submissions
  submitAssignment: async (submissionData: Omit<AssignmentSubmission, 'id' | 'submitted_at' | 'grade' | 'feedback'>): Promise<ApiResponse<AssignmentSubmission>> => {
    const response = await api.post('/assignments/submit', submissionData)
    return response.data
  },

  getAssignmentSubmissions: async (assignmentId: number): Promise<ApiResponse<AssignmentSubmission[]>> => {
    const response = await api.get(`/assignments/${assignmentId}/submissions`)
    return response.data
  },

  getUserAssignmentSubmission: async (assignmentId: number, userId: number): Promise<ApiResponse<AssignmentSubmission>> => {
    const response = await api.get(`/assignments/${assignmentId}/submissions/user/${userId}`)
    return response.data
  },

  gradeAssignment: async (submissionId: number, gradeData: {
    grade: number
    feedback?: string
  }): Promise<ApiResponse<AssignmentSubmission>> => {
    const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradeData)
    return response.data
  },

  // File Upload
  uploadAssignmentFile: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/assignments/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}