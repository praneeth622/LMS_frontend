import { api } from './api'

export interface Course {
  id: number
  title: string
  description: string
  price: number
  category: string
  status: 'draft' | 'published' | 'archived'
  creator: {
    id: number
    name: string
  }
  thumbnail?: string
  duration?: number
  rating?: number
  students_count?: number
  level?: 'beginner' | 'intermediate' | 'advanced'
}

export interface Enrollment {
  course_id: number
  progress: number
  enrollment_date: string
  course: {
    title: string
    description: string
    thumbnail?: string
  }
}

export interface Certificate {
  id: number
  course_id: number
  issued_on: string
  cert_url: string
  course: {
    title: string
  }
}

export interface Lecture {
  id: number
  title: string
  video_url: string
  duration: number
  description?: string
  order: number
}

export interface Section {
  id: number
  title: string
  lectures: Lecture[]
  order: number
}

export interface CourseContent {
  sections: Section[]
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const studentApi = {
  // Courses
  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses')
    return response.data
  },

  getCourseById: async (id: number): Promise<ApiResponse<Course>> => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  getCourseContent: async (id: number): Promise<ApiResponse<CourseContent>> => {
    const response = await api.get(`/courses/${id}/content`)
    return response.data
  },

  // Enrollments
  enrollInCourse: async (userId: number, courseId: number): Promise<ApiResponse<Enrollment>> => {
    const response = await api.post('/enrollments', {
      user_id: userId,
      course_id: courseId
    })
    return response.data
  },

  updateProgress: async (userId: number, courseId: number, progress: number): Promise<ApiResponse<Enrollment>> => {
    const response = await api.put('/enrollments/progress', {
      user_id: userId,
      course_id: courseId,
      progress
    })
    return response.data
  },

  getUserEnrollments: async (userId: number): Promise<ApiResponse<Enrollment[]>> => {
    const response = await api.get(`/enrollments/user/${userId}`)
    return response.data
  },

  // Certificates
  getUserCertificates: async (userId: number): Promise<ApiResponse<Certificate[]>> => {
    const response = await api.get(`/certificates/${userId}`)
    return response.data
  },

  // Bookmarks and Notes (mock implementation)
  saveBookmark: async (userId: number, lectureId: number, timestamp: number): Promise<ApiResponse<any>> => {
    // Mock implementation - would need actual API endpoint
    return {
      success: true,
      data: { userId, lectureId, timestamp }
    }
  },

  saveNote: async (userId: number, lectureId: number, timestamp: number, note: string): Promise<ApiResponse<any>> => {
    // Mock implementation - would need actual API endpoint
    return {
      success: true,
      data: { userId, lectureId, timestamp, note }
    }
  },
}