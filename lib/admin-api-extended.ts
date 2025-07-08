import { api } from './api'

// Extended interfaces for all admin operations
export interface User {
  id: number
  name: string
  email: string
  role_id: number
  created_at: string
  is_deleted: boolean
  role?: Role
}

export interface Role {
  id: number
  name: string
}

export interface Organization {
  id: number
  name: string
  type: string
  created_at?: string
  users?: User[]
}

export interface Course {
  id: number
  title: string
  description?: string
  price?: number
  category?: string
  status: 'draft' | 'published' | 'archived'
  created_by: number
  created_at: string
  instructor?: User
  sections?: Section[]
  enrollments_count?: number
}

export interface Section {
  id: number
  course_id: number
  title: string
  section_order: number
  lectures?: Lecture[]
}

export interface Lecture {
  id: number
  section_id: number
  title: string
  video_url?: string
  duration?: number
  resources?: Resource[]
}

export interface Resource {
  id: number
  lecture_id: number
  title: string
  type: string
  url: string
}

export interface Enrollment {
  id: number
  user_id: number
  course_id: number
  progress: number
  enrolled_at: string
  completed_at?: string
  user?: User
  course?: Course
}

export interface Quiz {
  id: number
  course_id: number
  title: string
  questions?: QuizQuestion[]
  submissions?: QuizSubmission[]
}

export interface QuizQuestion {
  id: number
  quiz_id: number
  question_text: string
  type: 'multiple_choice' | 'true_false' | 'short_answer'
  options?: string[]
  correct_answer: string
}

export interface QuizSubmission {
  id: number
  quiz_id: number
  user_id: number
  answers: Record<string, string>
  score?: number
  submitted_at: string
}

export interface Assignment {
  id: number
  course_id: number
  title: string
  description?: string
  due_date?: string
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
}

export interface Discussion {
  id: number
  course_id: number
  lecture_id?: number
  user_id: number
  title: string
  content: string
  created_at: string
  comments?: Comment[]
  user?: User
}

export interface Comment {
  id: number
  discussion_id: number
  user_id: number
  comment_text: string
  created_at: string
  user?: User
}

export interface Notification {
  id: number
  user_id: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}

export interface AuditLog {
  id: number
  user_id: number
  action_type: string
  table_name: string
  record_id: number
  action_details: {
    url: string
    method: string
  }
  timestamp: string
  user?: User
}

export interface SystemHealth {
  status: string
  timestamp: string
  uptime: number
  database: string
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface DashboardStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  totalOrganizations: number
  activeUsers: number
  recentActivity: AuditLog[]
}

export const adminApiExtended = {
  // Dashboard
  getDashboardStats: async (): Promise<ApiResponse<DashboardStats>> => {
    try {
      const [users, courses, enrollments, organizations, auditLogs] = await Promise.all([
        api.get('/users'),
        api.get('/courses'),
        api.get('/enrollments'),
        api.get('/organizations'),
        api.get('/audit-logs?limit=10')
      ])

      const stats: DashboardStats = {
        totalUsers: users.data.data?.length || 0,
        totalCourses: courses.data.data?.length || 0,
        totalEnrollments: enrollments.data.data?.length || 0,
        totalOrganizations: organizations.data.data?.length || 0,
        activeUsers: users.data.data?.filter((u: User) => !u.is_deleted).length || 0,
        recentActivity: auditLogs.data.data || []
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      return { success: false, data: {} as DashboardStats }
    }
  },

  // Users Management
  getAllUsers: async (page = 1, limit = 10): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/users?page=${page}&limit=${limit}`)
    return response.data
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  createUser: async (userData: {
    name: string
    email: string
    password: string
    role_id?: number
  }): Promise<ApiResponse<User>> => {
    const response = await api.post('/users', userData)
    return response.data
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await api.put(`/users/${id}`, userData)
    return response.data
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  assignRole: async (userId: number, roleId: number): Promise<ApiResponse<void>> => {
    const response = await api.post('/users/assign-role', { user_id: userId, role_id: roleId })
    return response.data
  },

  // Roles Management
  getAllRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await api.get('/users/roles/all')
    return response.data
  },

  createRole: async (roleData: { name: string }): Promise<ApiResponse<Role>> => {
    const response = await api.post('/users/roles', roleData)
    return response.data
  },

  // Organizations Management
  getAllOrganizations: async (): Promise<ApiResponse<Organization[]>> => {
    const response = await api.get('/organizations')
    return response.data
  },

  getOrganizationById: async (id: number): Promise<ApiResponse<Organization>> => {
    const response = await api.get(`/organizations/${id}`)
    return response.data
  },

  createOrganization: async (orgData: {
    name: string
    type: string
  }): Promise<ApiResponse<Organization>> => {
    const response = await api.post('/organizations', orgData)
    return response.data
  },

  updateOrganization: async (id: number, orgData: Partial<Organization>): Promise<ApiResponse<Organization>> => {
    const response = await api.put(`/organizations/${id}`, orgData)
    return response.data
  },

  deleteOrganization: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/organizations/${id}`)
    return response.data
  },

  getOrganizationUsers: async (id: number): Promise<ApiResponse<User[]>> => {
    const response = await api.get(`/organizations/${id}/users`)
    return response.data
  },

  addUserToOrganization: async (orgId: number, userId: number): Promise<ApiResponse<void>> => {
    const response = await api.post(`/organizations/${orgId}/users`, { user_id: userId })
    return response.data
  },

  removeUserFromOrganization: async (orgId: number, userId: number): Promise<ApiResponse<void>> => {
    const response = await api.delete(`/organizations/${orgId}/users/${userId}`)
    return response.data
  },

  // Courses Management
  getAllCourses: async (): Promise<ApiResponse<Course[]>> => {
    const response = await api.get('/courses')
    return response.data
  },

  getCourseById: async (id: number): Promise<ApiResponse<Course>> => {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  createCourse: async (courseData: {
    title: string
    description?: string
    price?: number
    category?: string
    created_by: number
    status?: string
  }): Promise<ApiResponse<Course>> => {
    const response = await api.post('/courses', courseData)
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

  getCourseSections: async (courseId: number): Promise<ApiResponse<Section[]>> => {
    const response = await api.get(`/courses/${courseId}/sections`)
    return response.data
  },

  addInstructorToCourse: async (courseId: number, userId: number): Promise<ApiResponse<void>> => {
    const response = await api.post(`/courses/${courseId}/instructors/${userId}`)
    return response.data
  },

  // Sections Management
  createSection: async (sectionData: {
    course_id: number
    title: string
    section_order?: number
  }): Promise<ApiResponse<Section>> => {
    const response = await api.post('/sections', sectionData)
    return response.data
  },

  getSectionLectures: async (sectionId: number): Promise<ApiResponse<Lecture[]>> => {
    const response = await api.get(`/sections/${sectionId}/lectures`)
    return response.data
  },

  // Lectures Management
  createLecture: async (lectureData: {
    section_id: number
    title: string
    video_url?: string
    duration?: number
  }): Promise<ApiResponse<Lecture>> => {
    const response = await api.post('/lectures', lectureData)
    return response.data
  },

  addResourceToLecture: async (lectureId: number, resourceData: {
    title: string
    type: string
    url: string
  }): Promise<ApiResponse<Resource>> => {
    const response = await api.post(`/lectures/${lectureId}/resources`, resourceData)
    return response.data
  },

  // Enrollments Management
  getAllEnrollments: async (): Promise<ApiResponse<Enrollment[]>> => {
    const response = await api.get('/enrollments')
    return response.data
  },

  createEnrollment: async (enrollmentData: {
    user_id: number
    course_id: number
  }): Promise<ApiResponse<Enrollment>> => {
    const response = await api.post('/enrollments', enrollmentData)
    return response.data
  },

  updateEnrollmentProgress: async (progressData: {
    user_id: number
    course_id: number
    progress: number
  }): Promise<ApiResponse<void>> => {
    const response = await api.put('/enrollments/progress', progressData)
    return response.data
  },

  getUserEnrollments: async (userId: number): Promise<ApiResponse<Enrollment[]>> => {
    const response = await api.get(`/enrollments/user/${userId}`)
    return response.data
  },

  getCourseEnrollments: async (courseId: number): Promise<ApiResponse<Enrollment[]>> => {
    const response = await api.get(`/enrollments/course/${courseId}`)
    return response.data
  },

  getUserCertificates: async (userId: number): Promise<ApiResponse<any[]>> => {
    const response = await api.get(`/enrollments/certificates/${userId}`)
    return response.data
  },

  // Quizzes Management
  getAllQuizzes: async (): Promise<ApiResponse<Quiz[]>> => {
    const response = await api.get('/quizzes')
    return response.data
  },

  createQuiz: async (quizData: {
    course_id: number
    title: string
  }): Promise<ApiResponse<Quiz>> => {
    const response = await api.post('/quizzes', quizData)
    return response.data
  },

  getQuizById: async (id: number): Promise<ApiResponse<Quiz>> => {
    const response = await api.get(`/quizzes/${id}`)
    return response.data
  },

  getQuizQuestions: async (quizId: number): Promise<ApiResponse<QuizQuestion[]>> => {
    const response = await api.get(`/quizzes/${quizId}/questions`)
    return response.data
  },

  addQuestionToQuiz: async (questionData: {
    quiz_id: number
    question_text: string
    type: string
    options?: string[]
    correct_answer: string
  }): Promise<ApiResponse<QuizQuestion>> => {
    const response = await api.post('/quizzes/questions', questionData)
    return response.data
  },

  submitQuiz: async (submissionData: {
    user_id: number
    quiz_id: number
    answers: Record<string, string>
  }): Promise<ApiResponse<QuizSubmission>> => {
    const response = await api.post(`/quizzes/${submissionData.quiz_id}/submit`, submissionData)
    return response.data
  },

  // Assignments Management
  getAllAssignments: async (): Promise<ApiResponse<Assignment[]>> => {
    const response = await api.get('/assignments')
    return response.data
  },

  createAssignment: async (assignmentData: {
    course_id: number
    title: string
    description?: string
    due_date?: string
  }): Promise<ApiResponse<Assignment>> => {
    const response = await api.post('/assignments', assignmentData)
    return response.data
  },

  getAssignmentById: async (id: number): Promise<ApiResponse<Assignment>> => {
    const response = await api.get(`/assignments/${id}`)
    return response.data
  },

  submitAssignment: async (submissionData: {
    assignment_id: number
    user_id: number
    submission_url: string
  }): Promise<ApiResponse<AssignmentSubmission>> => {
    const response = await api.post('/assignments/submit', submissionData)
    return response.data
  },

  gradeAssignment: async (gradeData: {
    submission_id: number
    grade: number
  }): Promise<ApiResponse<void>> => {
    const response = await api.put('/assignments/grade', gradeData)
    return response.data
  },

  // Discussions Management
  getAllDiscussions: async (courseId?: number): Promise<ApiResponse<Discussion[]>> => {
    const url = courseId ? `/discussions?course_id=${courseId}` : '/discussions'
    const response = await api.get(url)
    return response.data
  },

  createDiscussion: async (discussionData: {
    course_id: number
    lecture_id?: number
    user_id: number
    title: string
    content: string
  }): Promise<ApiResponse<Discussion>> => {
    const response = await api.post('/discussions', discussionData)
    return response.data
  },

  getDiscussionById: async (id: number): Promise<ApiResponse<Discussion>> => {
    const response = await api.get(`/discussions/${id}`)
    return response.data
  },

  getDiscussionsByCourse: async (courseId: number): Promise<ApiResponse<Discussion[]>> => {
    const response = await api.get(`/discussions/course/${courseId}`)
    return response.data
  },

  // Comments Management
  createComment: async (commentData: {
    discussion_id: number
    user_id: number
    comment_text: string
  }): Promise<ApiResponse<Comment>> => {
    const response = await api.post('/comments', commentData)
    return response.data
  },

  getCommentsByDiscussion: async (discussionId: number): Promise<ApiResponse<Comment[]>> => {
    const response = await api.get(`/comments/discussion/${discussionId}`)
    return response.data
  },

  // Notifications Management
  getAllNotifications: async (userId?: number): Promise<ApiResponse<Notification[]>> => {
    const url = userId ? `/notifications?user_id=${userId}` : '/notifications'
    const response = await api.get(url)
    return response.data
  },

  getUserNotifications: async (userId: number): Promise<ApiResponse<Notification[]>> => {
    const response = await api.get(`/notifications/user/${userId}`)
    return response.data
  },

  getUnreadCount: async (userId: number): Promise<ApiResponse<{ count: number }>> => {
    const response = await api.get(`/notifications/user/${userId}/unread-count`)
    return response.data
  },

  markNotificationAsRead: async (id: number): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/${id}/read`)
    return response.data
  },

  markAllNotificationsAsRead: async (userId: number): Promise<ApiResponse<void>> => {
    const response = await api.put(`/notifications/user/${userId}/read-all`)
    return response.data
  },

  createNotification: async (notificationData: {
    user_id: number
    title: string
    message: string
    type: string
  }): Promise<ApiResponse<Notification>> => {
    const response = await api.post('/notifications', notificationData)
    return response.data
  },

  // Audit Logs
  getAuditLogs: async (page = 1, limit = 10, filters?: {
    table?: string
    action?: string
  }): Promise<ApiResponse<AuditLog[]>> => {
    let url = `/audit-logs?page=${page}&limit=${limit}`
    if (filters?.table) url += `&table=${filters.table}`
    if (filters?.action) url += `&action=${filters.action}`
    
    const response = await api.get(url)
    return response.data
  },

  getAuditLogsByUser: async (userId: number, page = 1, limit = 10): Promise<ApiResponse<AuditLog[]>> => {
    const response = await api.get(`/audit-logs/user/${userId}?page=${page}&limit=${limit}`)
    return response.data
  },

  getAuditLogsByTable: async (tableName: string, page = 1, limit = 10): Promise<ApiResponse<AuditLog[]>> => {
    const response = await api.get(`/audit-logs/table/${tableName}?page=${page}&limit=${limit}`)
    return response.data
  },

  getAuditStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/audit-logs/stats')
    return response.data
  },

  // System Health
  getSystemHealth: async (): Promise<ApiResponse<SystemHealth>> => {
    const response = await api.get('/health')
    return response.data
  },

  getDatabaseHealth: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/health/db')
    return response.data
  },
}