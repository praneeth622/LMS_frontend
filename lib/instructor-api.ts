import { api } from './api'

export interface Course {
  id: number
  title: string
  description: string
  price: number
  category: string
  created_by: number
  status: 'draft' | 'published' | 'archived'
  created_at?: string
  updated_at?: string
}

export interface Section {
  id: number
  course_id: number
  title: string
  section_order: number
  created_at?: string
}

export interface Lecture {
  id: number
  section_id: number
  title: string
  video_url?: string
  duration?: number
  content?: string
  lecture_order?: number
  created_at?: string
}

export interface Resource {
  id: number
  lecture_id: number
  type: 'pdf' | 'video' | 'image' | 'document' | 'link'
  url: string
  title?: string
  description?: string
}

export interface Quiz {
  id: number
  course_id: number
  title: string
  description?: string
  questions: QuizQuestion[]
  time_limit?: number
  passing_score?: number
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correct_answer: string
  points: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export const instructorApi = {
  // Courses
  createCourse: async (courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Course>> => {
    const response = await api.post('/courses', courseData)
    return response.data
  },

  getCoursesByInstructor: async (instructorId: number): Promise<ApiResponse<Course[]>> => {
    const response = await api.get(`/courses/instructor/${instructorId}`)
    return response.data
  },

  updateCourse: async (id: number, courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    const response = await api.put(`/courses/${id}`, courseData)
    return response.data
  },

  deleteCourse: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },

  // Sections
  createSection: async (sectionData: Omit<Section, 'id' | 'created_at'>): Promise<ApiResponse<Section>> => {
    const response = await api.post('/sections', sectionData)
    return response.data
  },

  getSectionsByCourse: async (courseId: number): Promise<ApiResponse<Section[]>> => {
    const response = await api.get(`/sections/course/${courseId}`)
    return response.data
  },

  updateSection: async (id: number, sectionData: Partial<Section>): Promise<ApiResponse<Section>> => {
    const response = await api.put(`/sections/${id}`, sectionData)
    return response.data
  },

  deleteSection: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/sections/${id}`)
    return response.data
  },

  // Lectures
  createLecture: async (lectureData: Omit<Lecture, 'id' | 'created_at'>): Promise<ApiResponse<Lecture>> => {
    const response = await api.post('/lectures', lectureData)
    return response.data
  },

  getLecturesBySection: async (sectionId: number): Promise<ApiResponse<Lecture[]>> => {
    const response = await api.get(`/lectures/section/${sectionId}`)
    return response.data
  },

  updateLecture: async (id: number, lectureData: Partial<Lecture>): Promise<ApiResponse<Lecture>> => {
    const response = await api.put(`/lectures/${id}`, lectureData)
    return response.data
  },

  deleteLecture: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/lectures/${id}`)
    return response.data
  },

  // Resources
  createResource: async (resourceData: Omit<Resource, 'id'>): Promise<ApiResponse<Resource>> => {
    const response = await api.post('/resources', resourceData)
    return response.data
  },

  getResourcesByLecture: async (lectureId: number): Promise<ApiResponse<Resource[]>> => {
    const response = await api.get(`/resources/lecture/${lectureId}`)
    return response.data
  },

  updateResource: async (id: number, resourceData: Partial<Resource>): Promise<ApiResponse<Resource>> => {
    const response = await api.put(`/resources/${id}`, resourceData)
    return response.data
  },

  deleteResource: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/resources/${id}`)
    return response.data
  },

  // File Upload
  uploadFile: async (file: File, type: 'video' | 'document' | 'image'): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
}