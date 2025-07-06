import { api } from './api'

export interface User {
  id: number
  name: string
  email: string
  role_id: number
  created_at: string
  is_deleted: boolean
}

export interface Organization {
  id: number
  name: string
  type: string
  created_at?: string
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

export const adminApi = {
  // Users
  getAllUsers: async (): Promise<ApiResponse<User[]>> => {
    const response = await api.get('/users')
    return response.data
  },

  createUser: async (userData: Omit<User, 'id' | 'created_at' | 'is_deleted'>): Promise<ApiResponse<User>> => {
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

  // Organizations
  getAllOrganizations: async (): Promise<ApiResponse<Organization[]>> => {
    const response = await api.get('/organizations')
    return response.data
  },

  createOrganization: async (orgData: Omit<Organization, 'id' | 'created_at'>): Promise<ApiResponse<Organization>> => {
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

  // Audit Logs
  getAuditLogs: async (page = 1, limit = 10): Promise<ApiResponse<AuditLog[]>> => {
    const response = await api.get(`/audit-logs?page=${page}&limit=${limit}`)
    return response.data
  },

  // System Health
  getSystemHealth: async (): Promise<ApiResponse<SystemHealth>> => {
    const response = await api.get('/health')
    return response.data
  },
}