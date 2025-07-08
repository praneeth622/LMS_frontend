"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  Plus, 
  MoreHorizontal, 
  MessageSquare, 
  Users,
  Clock,
  Pin,
  Lock,
  Eye,
  Reply
} from "lucide-react"
import { format } from "date-fns"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'
import { DataTable } from '@/components/admin/data-table'
import { StatsCards } from '@/components/admin/stats-cards'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "react-hot-toast"
import { instructorApi, Discussion } from '@/lib/instructor-api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

interface DiscussionWithMeta extends Discussion {
  status?: string
  pinned?: boolean
  locked?: boolean
  replies_count?: number
  last_reply_at?: string
}

export default function InstructorDiscussionsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [discussions, setDiscussions] = React.useState<DiscussionWithMeta[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState("")
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Total Discussions",
      value: discussions.length.toString(),
      change: "+5 this week",
      changeType: "positive" as const,
      icon: MessageSquare,
      color: "bg-blue-500"
    },
    {
      title: "Active Discussions",
      value: discussions.filter(d => d.status === 'active').length.toString(),
      change: "+3 new today",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Pending Replies",
      value: "8",
      change: "2 urgent",
      changeType: "neutral" as const,
      icon: Reply,
      color: "bg-orange-500"
    },
    {
      title: "Avg. Response Time",
      value: "2.5h",
      change: "-30min improvement",
      changeType: "positive" as const,
      icon: Clock,
      color: "bg-purple-500"
    }
  ]

  React.useEffect(() => {
    fetchDiscussions()
  }, [userProfile])

  const fetchDiscussions = async () => {
    try {
      setLoading(true)
      
      if (!userProfile?.id) {
        setDiscussions([])
        return
      }

      // Get all courses by instructor first
      const coursesResponse = await instructorApi.getCoursesByInstructor(userProfile.id)
      
      if (coursesResponse.success && coursesResponse.data.length > 0) {
        // Get discussions for all instructor's courses
        const allDiscussions: DiscussionWithMeta[] = []
        
        for (const course of coursesResponse.data) {
          try {
            const discussionsResponse = await instructorApi.getDiscussionsByCourse(course.id)
            if (discussionsResponse.success) {
              // Add course info and mock metadata to each discussion
              const discussionsWithMeta = discussionsResponse.data.map(discussion => ({
                ...discussion,
                course: course,
                status: 'active',
                pinned: Math.random() > 0.8,
                locked: Math.random() > 0.9,
                replies_count: Math.floor(Math.random() * 20),
                last_reply_at: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString()
              }))
              allDiscussions.push(...discussionsWithMeta)
            }
          } catch (error) {
            console.error(`Error fetching discussions for course ${course.id}:`, error)
          }
        }
        
        setDiscussions(allDiscussions)
        console.log('Discussions loaded successfully:', allDiscussions.length)
      } else {
        setDiscussions([])
        toast.success('No courses found. Create courses to see discussions.')
      }
    } catch (error) {
      console.error('Error fetching discussions:', error)
      toast.error('Failed to load discussions')
      setDiscussions([])
    } finally {
      setLoading(false)
    }
  }

  const handlePinDiscussion = async (discussionId: number) => {
    try {
      // Mock implementation - in real app, call API
      setDiscussions(prev => prev.map(d => 
        d.id === discussionId ? { ...d, pinned: !d.pinned } : d
      ))
      toast.success('Discussion pinned successfully')
    } catch (error) {
      console.error('Error pinning discussion:', error)
      toast.error('Failed to pin discussion')
    }
  }

  const handleLockDiscussion = async (discussionId: number) => {
    try {
      // Mock implementation - in real app, call API
      setDiscussions(prev => prev.map(d => 
        d.id === discussionId ? { ...d, locked: !d.locked } : d
      ))
      toast.success('Discussion locked successfully')
    } catch (error) {
      console.error('Error locking discussion:', error)
      toast.error('Failed to lock discussion')
    }
  }

  const columns: ColumnDef<DiscussionWithMeta>[] = [
    {
      accessorKey: "title",
      header: "Discussion",
      cell: ({ row }) => {
        const discussion = row.original
        return (
          <div className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {discussion.user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="font-medium truncate">{discussion.title}</p>
                {discussion.pinned && <Pin className="h-4 w-4 text-orange-500" />}
                {discussion.locked && <Lock className="h-4 w-4 text-red-500" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                by {discussion.user?.name || 'Unknown User'}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {discussion.content}
              </p>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status || 'active'
        return (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "replies_count",
      header: "Replies",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.replies_count || 0}</span>
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = row.getValue<string>("created_at")
        return date ? format(new Date(date), "MMM dd, yyyy") : "N/A"
      },
    },
    {
      accessorKey: "last_reply_at",
      header: "Last Reply",
      cell: ({ row }) => {
        const date = row.original.last_reply_at
        return date ? format(new Date(date), "MMM dd, HH:mm") : "No replies"
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const discussion = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/discussions/${discussion.id}`}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Discussion
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/discussions/${discussion.id}/reply`}>
                  <Reply className="mr-2 h-4 w-4" />
                  Reply
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlePinDiscussion(discussion.id)}>
                <Pin className="mr-2 h-4 w-4" />
                {discussion.pinned ? 'Unpin' : 'Pin'} Discussion
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLockDiscussion(discussion.id)}>
                <Lock className="mr-2 h-4 w-4" />
                {discussion.locked ? 'Unlock' : 'Lock'} Discussion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredDiscussions = discussions.filter(discussion =>
    discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    discussion.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ProtectedRoute allowedRoles={[2]}>
      <div className="flex h-screen bg-background">
        <InstructorSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Discussions"
            subtitle="Manage course discussions and student interactions"
            searchPlaceholder="Search discussions..."
            onSearch={setSearchQuery}
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <StatsCards stats={stats} loading={loading} />

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Discussion Management</CardTitle>
                  <CardDescription>
                    Engage with students and moderate discussions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button asChild className="h-auto p-4 flex-col space-y-2">
                      <Link href="/instructor/discussions/create">
                        <Plus className="h-6 w-6" />
                        <span>Start Discussion</span>
                      </Link>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <MessageSquare className="h-6 w-6" />
                      <span>View All Replies</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                      <Users className="h-6 w-6" />
                      <span>Student Activity</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Discussions Table */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">All Discussions</h2>
                    <p className="text-sm text-muted-foreground">
                      {filteredDiscussions.length} discussions found
                    </p>
                  </div>
                  
                  <Button asChild>
                    <Link href="/instructor/discussions/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Start Discussion
                    </Link>
                  </Button>
                </div>

                <DataTable
                  columns={columns}
                  data={filteredDiscussions}
                  searchKey="title"
                  searchPlaceholder="Search discussions..."
                  loading={loading}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}