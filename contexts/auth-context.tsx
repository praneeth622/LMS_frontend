"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User, getCurrentUser, getSession, getUserProfile, storeUserData, clearUserData } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface AuthContextType {
  user: SupabaseUser | null
  userProfile: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshProfile = async () => {
    console.log('🔄 AuthContext: refreshProfile called')
    console.log('👤 Current user state:', user?.email || 'No user')
    
    if (user?.email) {
      console.log('📡 Fetching profile for user:', user.email)
      const profile = await getUserProfile(user.email)
      console.log('📋 Profile fetch result:', profile ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role_id: profile.role_id
      } : 'null')
      setUserProfile(profile)
    } else {
      console.log('⚠️ No user email available, skipping profile fetch')
    }
  }

  const handleSignOut = async () => {
    try {
      console.log('🚪 AuthContext: Starting sign out process...')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      console.log('🧹 Clearing user state and stored data...')
      setUser(null)
      setUserProfile(null)
      clearUserData()
      toast.success('Signed out successfully')
      router.push('/')
    } catch (error: any) {
      console.error('❌ Sign out error:', error)
      toast.error(error.message || 'Error signing out')
    }
  }

  useEffect(() => {
    console.log('🚀 AuthContext: Initializing auth state...')
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Getting initial session and user...')
        const session = await getSession()
        const currentUser = await getCurrentUser()
        
        console.log('📊 Initial auth state:', {
          hasSession: !!session,
          hasUser: !!currentUser,
          userEmail: currentUser?.email || 'No email'
        })
        
        setUser(currentUser)
        
        if (currentUser?.email) {
          console.log('👤 User found, fetching profile...')
          const profile = await getUserProfile(currentUser.email)
          console.log('📋 Initial profile result:', profile ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role_id: profile.role_id
          } : 'null')
          setUserProfile(profile)
          
          // Store user data if we got a profile
          if (profile) {
            storeUserData(profile)
          }
        } else {
          console.log('⚠️ No user found in initial session')
          clearUserData()
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error)
        clearUserData()
      } finally {
        console.log('✅ Auth initialization complete, setting loading to false')
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    console.log('👂 Setting up auth state change listener...')
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth state change event:', event)
        console.log('📊 New session state:', {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email || 'No email'
        })
        
        setUser(session?.user ?? null)
        
        if (session?.user?.email) {
          console.log('👤 Auth change: User found, fetching profile...')
          const profile = await getUserProfile(session.user.email)
          console.log('📋 Auth change profile result:', profile ? {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role_id: profile.role_id
          } : 'null')
          setUserProfile(profile)
          
          // Store user data if we got a profile
          if (profile) {
            storeUserData(profile)
          }
        } else {
          console.log('⚠️ Auth change: No user, clearing profile and stored data')
          setUserProfile(null)
          clearUserData()
        }
        
        console.log('✅ Auth state change processing complete, setting loading to false')
        setLoading(false)
      }
    )

    return () => {
      console.log('🧹 Cleaning up auth state change listener')
      subscription.unsubscribe()
    }
  }, [])

  // Log state changes for debugging
  useEffect(() => {
    console.log('📊 AuthContext state update:', {
      hasUser: !!user,
      userEmail: user?.email || 'No email',
      hasUserProfile: !!userProfile,
      userProfileRoleId: userProfile?.role_id || 'No role',
      loading
    })
  }, [user, userProfile, loading])

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signOut: handleSignOut,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}