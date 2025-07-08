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
  questions?: QuizQuestion[]
  time_limit?: number
  passing_score?: number
  created_at?: string
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
  description?: string
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

export interface Discussion {
  id: number
  course_id: number
  lecture_id?: number
  user_id: number
  title: string
  content: string
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
  comments?: Comment[]
}

export interface Comment {
  id: number
  discussion_id: number
  user_id: number
  comment_text: string
  created_at: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  progress: number
  enrolled_at: string
  completed_at?: string
  user?: {
    id: number
    name: string
    email: string
  }
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
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
    try {
      console.log('🔍 Fetching courses from API for instructor:', instructorId)
      
      // Since there's no specific endpoint for instructor courses, get all courses and filter
      const response = await api.get('/courses')
      console.log('📡 Raw API response:', response)
      console.log('📊 Response data:', response.data)
      
      // Check if response has the expected structure
      if (response.data && response.data.success && response.data.data) {
        const allCourses = response.data.data
        console.log('📚 All courses from API:', allCourses)
        console.log('🔍 Looking for courses created by instructor ID:', instructorId)
        
        // Log each course's created_by field for debugging
        allCourses.forEach((course: any, index: number) => {
          console.log(`Course ${index + 1}: "${course.title}" created_by: ${course.created_by} (type: ${typeof course.created_by})`)
        })
        
        const filteredCourses = allCourses.filter((course: any) => {
          // Handle both string and number comparison
          const courseCreatedBy = typeof course.created_by === 'string' ? parseInt(course.created_by) : course.created_by
          const instructorIdNum = typeof instructorId === 'string' ? parseInt(instructorId) : instructorId
          return courseCreatedBy === instructorIdNum
        })
        console.log('🎯 Filtered courses for instructor:', filteredCourses)
        
        return {
          success: true,
          data: filteredCourses
        }
      } else if (response.data && Array.isArray(response.data)) {
        // Handle case where API returns array directly
        console.log('📚 API returned array directly:', response.data)
        const filteredCourses = response.data.filter((course: any) => {
          const courseCreatedBy = typeof course.created_by === 'string' ? parseInt(course.created_by) : course.created_by
          const instructorIdNum = typeof instructorId === 'string' ? parseInt(instructorId) : instructorId
          return courseCreatedBy === instructorIdNum
        })
        return {
          success: true,
          data: filteredCourses
        }
      } else {
        console.error('❌ Unexpected API response structure:', response.data)
        return {
          success: false,
          data: [],
          message: 'Unexpected API response structure'
        }
      }
    } catch (error: any) {
      console.error('❌ API call failed:', error)
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      })
      
      return {
        success: false,
        data: [],
        message: error.message || 'Failed to fetch courses'
      }
    }
  },

  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses')
    return response.data
  },

  updateCourse: async (id: number, courseData: Partial<Course>): Promise<ApiResponse<Course>> => {
    const response = await api.patch(`/courses/${id}`, courseData)
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

  // Quizzes
  createQuiz: async (quizData: Omit<Quiz, 'id' | 'created_at' | 'questions'>): Promise<ApiResponse<Quiz>> => {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  getQuiz: async (id: number): Promise<ApiResponse<Quiz>> => {
    const response = await api.get(`/quizzes/${id}`)
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

  // Assignments
  createAssignment: async (assignmentData: Omit<Assignment, 'id' | 'created_at' | 'submissions'>): Promise<ApiResponse<Assignment>> => {
    const response = await api.post('/assignments', assignmentData)
    return response.data
  },

  getAssignment: async (id: number): Promise<ApiResponse<Assignment>> => {
    const response = await api.get(`/assignments/${id}`)
    return response.data
  },

  gradeAssignment: async (submissionId: number, grade: number): Promise<ApiResponse<void>> => {
    const response = await api.put('/assignments/grade', {
      submission_id: submissionId,
      grade
    })
    return response.data
  },

  // Discussions
  createDiscussion: async (discussionData: Omit<Discussion, 'id' | 'created_at' | 'user' | 'comments'>): Promise<ApiResponse<Discussion>> => {
    const response = await api.post('/discussions', discussionData)
    return response.data
  },

  getDiscussionsByCourse: async (courseId: number): Promise<ApiResponse<Discussion[]>> => {
    const response = await api.get(`/discussions/course/${courseId}`)
    return response.data
  },

  getDiscussion: async (id: number): Promise<ApiResponse<Discussion>> => {
    const response = await api.get(`/discussions/${id}`)
    return response.data
  },

  // Comments
  createComment: async (commentData: Omit<Comment, 'id' | 'created_at' | 'user'>): Promise<ApiResponse<Comment>> => {
    const response = await api.post('/comments', commentData)
    return response.data
  },

  getCommentsByDiscussion: async (discussionId: number): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/comments/discussion/${discussionId}`)
    return response.data
  },

  // Enrollments
  getCourseEnrollments: async (courseId: number): Promise<ApiResponse<Enrollment[]>> => {
    const response = await api.get(`/enrollments/course/${courseId}`)
    return response.data
  },

  // Notifications
  getNotifications: async (userId: number): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get(`/notifications/user/${userId}`)
    return response.data
  },

  markNotificationAsRead: async (notificationId: number): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/${notificationId}/read`)
    return response.data
  },

  markAllNotificationsAsRead: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/user/${userId}/read-all`)
    return response.data
  },

  getUnreadNotificationCount: async (userId: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`)
    return response.data
  },
}