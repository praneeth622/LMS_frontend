import { api } from './api'

export interface Discussion {
  id: number
  course_id?: number
  lecture_id?: number
  user_id: number
  title: string
  content: string
  type: 'question' | 'discussion' | 'announcement'
  is_pinned: boolean
  is_solved: boolean
  views: number
  likes: number
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    avatar?: string
    reputation: number
    role: string
  }
  course?: {
    id: number
    title: string
  }
  lecture?: {
    id: number
    title: string
  }
  comments_count: number
  latest_comment?: {
    id: number
    user: {
      name: string
    }
    created_at: string
  }
}

export interface Comment {
  id: number
  discussion_id: number
  user_id: number
  parent_id?: number
  comment_text: string
  is_solution: boolean
  likes: number
  created_at: string
  updated_at: string
  user: {
    id: number
    name: string
    avatar?: string
    reputation: number
    role: string
  }
  replies?: Comment[]
}

export interface Reaction {
  id: number
  user_id: number
  target_id: number
  target_type: 'discussion' | 'comment'
  type: 'like' | 'helpful' | 'love' | 'laugh'
  created_at: string
}

export interface UserReputation {
  user_id: number
  total_points: number
  discussions_created: number
  comments_posted: number
  solutions_provided: number
  likes_received: number
  badges: Badge[]
}

export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  color: string
  earned_at?: string
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

export const discussionApi = {
  // Discussions
  createDiscussion: async (discussionData: {
    course_id?: number
    lecture_id?: number
    user_id: number
    title: string
    content: string
    type?: 'question' | 'discussion' | 'announcement'
  }): Promise<ApiResponse<Discussion>> => {
    try {
      const response = await api.post('/discussions', discussionData)
      return response.data
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: {
          id: Date.now(),
          ...discussionData,
          type: discussionData.type || 'question',
          is_pinned: false,
          is_solved: false,
          views: 0,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: discussionData.user_id,
            name: "Current User",
            reputation: 0,
            role: "Student"
          },
          comments_count: 0
        }
      }
    }
  },

  getDiscussions: async (params: {
    course_id?: number
    lecture_id?: number
    type?: string
    search?: string
    sort?: 'latest' | 'popular' | 'unanswered'
    page?: number
    limit?: number
  }): Promise<ApiResponse<Discussion[]>> => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString())
        }
      })
      
      const response = await api.get(`/discussions?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      // Return empty array for development
      return {
        success: true,
        data: []
      }
    }
  },

  getDiscussionById: async (id: number): Promise<ApiResponse<Discussion>> => {
    try {
      const response = await api.get(`/discussions/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateDiscussion: async (id: number, data: Partial<Discussion>): Promise<ApiResponse<Discussion>> => {
    try {
      const response = await api.put(`/discussions/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteDiscussion: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/discussions/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  pinDiscussion: async (id: number): Promise<ApiResponse<Discussion>> => {
    try {
      const response = await api.post(`/discussions/${id}/pin`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  markAsSolved: async (id: number): Promise<ApiResponse<Discussion>> => {
    try {
      const response = await api.post(`/discussions/${id}/solve`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Comments
  getComments: async (discussionId: number): Promise<ApiResponse<Comment[]>> => {
    try {
      const response = await api.get(`/discussions/${discussionId}/comments`)
      return response.data
    } catch (error) {
      // Return empty array for development
      return {
        success: true,
        data: []
      }
    }
  },

  createComment: async (commentData: {
    discussion_id: number
    user_id: number
    parent_id?: number
    comment_text: string
  }): Promise<ApiResponse<Comment>> => {
    try {
      const response = await api.post('/comments', commentData)
      return response.data
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: {
          id: Date.now(),
          ...commentData,
          is_solution: false,
          likes: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: commentData.user_id,
            name: "Current User",
            reputation: 0,
            role: "Student"
          }
        }
      }
    }
  },

  updateComment: async (id: number, data: { comment_text: string }): Promise<ApiResponse<Comment>> => {
    try {
      const response = await api.put(`/comments/${id}`, data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  deleteComment: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/comments/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  markCommentAsSolution: async (id: number): Promise<ApiResponse<Comment>> => {
    try {
      const response = await api.post(`/comments/${id}/solution`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Reactions
  addReaction: async (reactionData: {
    target_id: number
    target_type: 'discussion' | 'comment'
    type: 'like' | 'helpful' | 'love' | 'laugh'
    user_id: number
  }): Promise<ApiResponse<Reaction>> => {
    try {
      const response = await api.post('/reactions', reactionData)
      return response.data
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: {
          id: Date.now(),
          ...reactionData,
          created_at: new Date().toISOString()
        }
      }
    }
  },

  removeReaction: async (id: number): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete(`/reactions/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getReactions: async (targetId: number, targetType: 'discussion' | 'comment'): Promise<ApiResponse<Reaction[]>> => {
    try {
      const response = await api.get(`/reactions?target_id=${targetId}&target_type=${targetType}`)
      return response.data
    } catch (error) {
      return {
        success: true,
        data: []
      }
    }
  },

  // User Reputation
  getUserReputation: async (userId: number): Promise<ApiResponse<UserReputation>> => {
    try {
      const response = await api.get(`/users/${userId}/reputation`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getLeaderboard: async (limit = 10): Promise<ApiResponse<UserReputation[]>> => {
    try {
      const response = await api.get(`/users/leaderboard?limit=${limit}`)
      return response.data
    } catch (error) {
      return {
        success: true,
        data: []
      }
    }
  },

  // Search
  searchDiscussions: async (query: string, filters?: {
    course_id?: number
    type?: string
  }): Promise<ApiResponse<Discussion[]>> => {
    try {
      const params = new URLSearchParams({ q: query })
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString())
          }
        })
      }
      
      const response = await api.get(`/discussions/search?${params.toString()}`)
      return response.data
    } catch (error) {
      return {
        success: true,
        data: []
      }
    }
  },

  // File Upload
  uploadAttachment: async (file: File): Promise<ApiResponse<{ url: string; filename: string }>> => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post('/discussions/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      // Mock response for development
      return {
        success: true,
        data: {
          url: URL.createObjectURL(file),
          filename: file.name
        }
      }
    }
  },
}