"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { CourseWizard } from '@/components/instructor/course-wizard'
import { instructorApi } from '@/lib/instructor-api'
import { useAuth } from '@/contexts/auth-context'
import { toast } from "react-hot-toast"

export default function CreateCoursePage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const { userProfile } = useAuth()
  const router = useRouter()

  const handleCourseComplete = async (courseData: any) => {
    try {
      if (!userProfile?.id) {
        toast.error('User profile not found')
        return
      }

      const response = await instructorApi.createCourse({
        title: courseData.title,
        description: courseData.description,
        category: courseData.category,
        price: courseData.price,
        status: courseData.status,
        created_by: userProfile.id
      })

      if (response.success) {
        toast.success('Course created successfully!')
        router.push('/instructor/courses')
      } else {
        toast.error('Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course')
    }
  }

  const handleCancel = () => {
    router.push('/instructor/courses')
  }

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Create New Course"
            subtitle="Build your course step by step with our guided wizard"
          />
          
          <main className="flex-1 overflow-y-auto">
            <CourseWizard
              onComplete={handleCourseComplete}
              onCancel={handleCancel}
            />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}