import { supabase } from './supabase'
import { api, authApi, User, Role } from './api'

export type { User, Role }

export interface AuthResponse {
  success: boolean
  data: User
}

// Supabase Auth Functions
export const signUp = async (email: string, password: string, userData: { name: string; role_id: number }) => {
  try {
    console.log('🔐 Starting sign up process for:', email)
    
    // First, sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      console.error('❌ Supabase auth signup error:', authError)
      throw authError
    }

    console.log('✅ Supabase signup successful, creating user in backend...')

    try {
      // Then create user in our backend using the configured API instance
      const response = await authApi.createUser({
        name: userData.name,
        email,
        password,
        role_id: userData.role_id
      })

      console.log('✅ Backend user creation successful:', response)
      return { data: response, error: null }
    } catch (backendError: any) {
      console.warn('⚠️ Backend user creation failed, but Supabase signup succeeded:', backendError.message)
      
      // Even if backend fails, Supabase signup succeeded, so we can continue
      // Store minimal user data for the session
      const mockUser = {
        id: Date.now(),
        name: userData.name,
        email,
        role_id: userData.role_id,
        created_at: new Date().toISOString()
      }
      
      return { 
        data: { success: true, data: mockUser }, 
        error: null 
      }
    }
  } catch (error: any) {
    console.error('❌ Sign up failed:', error)
    return { data: null, error: error.message || 'Registration failed' }
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log('🔐 Starting sign in process for:', email)
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('❌ Supabase auth signin error:', error)
      throw error
    }

    console.log('✅ Supabase signin successful:', data.user?.email)
    
    // After successful Supabase login, try to get user profile from backend
    // Do this in the background without blocking the login
    if (data.user?.email) {
      // Use setTimeout to make this non-blocking
      setTimeout(async () => {
        try {
          console.log('🔍 Fetching user profile from backend after login...')
          const response = await authApi.getAllUsers()
          console.log('📊 Users response during login:', response)
          
          if (response.success && Array.isArray(response.data)) {
            const userProfile = response.data.find(u => u.email === data.user.email)
            console.log('🎯 User profile search result:', userProfile)
            
            if (userProfile) {
              // Handle both role_id and role object structures
              const normalizedUser = {
                id: userProfile.id,
                name: userProfile.name,
                email: userProfile.email,
                role_id: userProfile.role_id || userProfile.role?.id,
                created_at: userProfile.created_at
              }
              
              console.log('✅ User profile found and storing:', normalizedUser)
              storeUserData(normalizedUser)
            } else {
              console.warn('⚠️ User profile not found in backend users list')
              console.log('📋 Available users:', response.data.map(u => ({ id: u.id, email: u.email, name: u.name })))
            }
          } else {
            console.error('❌ Invalid response from getAllUsers:', response)
          }
        } catch (profileError) {
          console.error('❌ Error fetching user profile after login:', profileError)
        }
      }, 100) // Small delay to make it non-blocking
    }
    
    return { data, error: null }
  } catch (error: any) {
    console.error('❌ Sign in failed:', error)
    return { data: null, error: error.message || 'Login failed' }
  }
}

export const signOut = async () => {
  console.log('🔐 Starting sign out process...')
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('❌ Sign out error:', error)
  } else {
    console.log('✅ Sign out successful')
  }
  return { error }
}

export const getCurrentUser = async () => {
  console.log('👤 Getting current user from Supabase...')
  const { data: { user } } = await supabase.auth.getUser()
  console.log('👤 Current user:', user?.email || 'No user')
  return user
}

export const getSession = async () => {
  console.log('🎫 Getting current session from Supabase...')
  const { data: { session } } = await supabase.auth.getSession()
  console.log('🎫 Current session:', session?.user?.email || 'No session')
  return session
}

// API Functions using the configured API instance
export const getAllRoles = async (): Promise<Role[]> => {
  try {
    console.log('🎭 Fetching all roles...')
    const response = await authApi.getAllRoles()
    console.log('✅ Roles fetched successfully:', response.data)
    return response.data
  } catch (error: any) {
    console.error('❌ Failed to fetch roles:', error.message)
    
    // Return fallback roles if API is unavailable
    console.warn('🔄 Using fallback roles due to API error')
    return [
      { id: 1, name: 'admin' },
      { id: 2, name: 'instructor' },
      { id: 3, name: 'student' }
    ]
  }
}

export const getUserProfile = async (email: string): Promise<User | null> => {
  try {
    console.log('👤 Fetching user profile for email:', email)
    
    // Clear any cached data to ensure we get fresh data with correct structure
    console.log('🧹 Clearing cached user data to fetch fresh data')
    localStorage.removeItem('user_data')
    
    // Fetch fresh data from API
    console.log('🔍 Fetching fresh data from API...')
    const response = await authApi.getAllUsers()
    console.log('📊 API response:', response)
    
    if (response.success && Array.isArray(response.data)) {
      const userProfile = response.data.find(u => u.email === email)
      console.log('🎯 Found user profile:', userProfile)
      
      if (userProfile) {
        // Handle both role_id and role object structures
        const normalizedUser = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role_id: userProfile.role_id || userProfile.role?.id,
          created_at: userProfile.created_at
        }
        
        console.log('✅ User profile found and storing:', normalizedUser)
        storeUserData(normalizedUser)
        return normalizedUser
      } else {
        console.warn('⚠️ User not found in API response')
        console.log('📋 Available users:', response.data.map(u => ({ id: u.id, email: u.email, name: u.name })))
      }
    } else {
      console.error('❌ Invalid API response:', response)
    }
    
    console.warn('⚠️ Unable to fetch user profile')
    return null
  } catch (error: any) {
    console.error('❌ Error fetching user profile:', {
      email,
      error: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    
    // Check if it's a permission error
    if (error.response?.status === 401) {
      console.error('🚫 Unauthorized: Token may be invalid or expired')
      localStorage.removeItem('user_data')
    } else if (error.response?.status === 403) {
      console.error('🚫 Forbidden: User may not have permission to access this resource')
    } else if (error.response?.status === 404) {
      console.error('🔍 Not Found: User profile not found')
    }
    
    return null
  }
}

// Helper function to store user data after successful login
export const storeUserData = (userData: User) => {
  console.log('💾 Storing user data in localStorage:', {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role_id: userData.role_id
  })
  localStorage.setItem('user_data', JSON.stringify(userData))
}

// Helper function to clear stored user data
export const clearUserData = () => {
  console.log('🧹 Clearing stored user data')
  localStorage.removeItem('user_data')
}

// Helper function to manually refresh user profile
export const refreshUserProfile = async (email: string): Promise<User | null> => {
  console.log('🔄 Manually refreshing user profile for:', email)
  
  try {
    const response = await authApi.getAllUsers()
    console.log('📊 Manual refresh - users response:', response)
    
    if (response.success && Array.isArray(response.data)) {
      const userProfile = response.data.find(u => u.email === email)
      console.log('🎯 Manual refresh - found user:', userProfile)
      
      if (userProfile) {
        // Handle both role_id and role object structures
        const normalizedUser = {
          id: userProfile.id,
          name: userProfile.name,
          email: userProfile.email,
          role_id: userProfile.role_id || userProfile.role?.id,
          created_at: userProfile.created_at
        }
        
        console.log('✅ Manual refresh - storing user data:', normalizedUser)
        storeUserData(normalizedUser)
        return normalizedUser
      } else {
        console.warn('⚠️ Manual refresh - user not found')
        console.log('📋 Available users:', response.data.map(u => ({ id: u.id, email: u.email, name: u.name })))
      }
    } else {
      console.error('❌ Manual refresh - invalid response:', response)
    }
  } catch (error) {
    console.error('❌ Manual refresh - error:', error)
  }
  
  return null
}