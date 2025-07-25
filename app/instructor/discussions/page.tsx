"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ColumnDef } from "@tanstack/react-table"
import { 
  MoreHorizontal, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MessageSquare,
  Pin,
  Lock,
  Users
} from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/admin/data-table"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { InstructorSidebar } from '@/components/instructor/sidebar'
import { InstructorHeader } from '@/components/instructor/header'

interface Discussion {
  id: string
  title: string
  content: string
  category: string
  status: 'active' | 'closed'
  pinned: boolean
  locked: boolean
  replies_count: number
  created_at: string
  updated_at: string
  user: {
    name: string
    avatar?: string
  }
}

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDiscussions()
  }, [])

  const fetchDiscussions = async () => {
    try {
      // Mock data for now
      const mockDiscussions: Discussion[] = [
        {
          id: "1",
          title: "Welcome to React Basics Course",
          content: "Let's discuss the fundamentals of React development",
          category: "General Discussion",
          status: "active",
          pinned: true,
          locked: false,
          replies_count: 12,
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-20T15:30:00Z",
          user: {
            name: "John Instructor"
          }
        },
        {
          id: "2",
          title: "Assignment 1 - Component Creation",
          content: "Questions and help for the first assignment",
          category: "Course Questions",
          status: "active",
          pinned: false,
          locked: false,
          replies_count: 8,
          created_at: "2024-02-01T09:00:00Z",
          updated_at: "2024-02-01T09:00:00Z",
          user: {
            name: "Jane Student"
          }
        }
      ]
      setDiscussions(mockDiscussions)
    } catch (error) {
      console.error('Error fetching discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDiscussion = async (discussionId: string) => {
    try {
      // Delete discussion logic
      setDiscussions(prev => prev.filter(discussion => discussion.id !== discussionId))
    } catch (error) {
      console.error('Error deleting discussion:', error)
    }
  }

  const columns: ColumnDef<Discussion>[] = [
    {
      accessorKey: "title",
      header: "Discussion",
      cell: ({ row }) => {
        const discussion = row.original
        return (
          <div className="flex items-start space-x-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-sm truncate">{discussion.title}</h4>
                {discussion.pinned && <Pin className="h-4 w-4 text-orange-500" />}
                {discussion.locked && <Lock className="h-4 w-4 text-red-500" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">
                by {discussion.user?.name || 'Unknown User'}
              </p>
              <p className="text-sm text-muted-foreground truncate mt-1">
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
        const status = row.getValue<string>("status")
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
        const date = new Date(row.getValue("created_at"))
        return format(date, "MMM dd, yyyy")
      },
    },
    {
      accessorKey: "updated_at",
      header: "Last Reply",
      cell: ({ row }) => {
        const date = new Date(row.getValue("updated_at"))
        return format(date, "MMM dd, yyyy")
      },
    },
    {
      id: "actions",
      enableHiding: false,
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
                  View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/instructor/discussions/${discussion.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDeleteDiscussion(discussion.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const totalReplies = discussions.reduce((sum, discussion) => sum + discussion.replies_count, 0)
  const activeDiscussions = discussions.filter(discussion => discussion.status === 'active').length
  const pinnedDiscussions = discussions.filter(discussion => discussion.pinned).length

  return (
    <ProtectedRoute allowedRoles={['instructor']}>
      <div className="flex h-screen bg-gray-50">
        <InstructorSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <InstructorHeader 
            title="Discussions"
            subtitle="Manage course discussions and student engagement"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Discussions</p>
                        <p className="text-2xl font-bold">{discussions.length}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold">{activeDiscussions}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Replies</p>
                        <p className="text-2xl font-bold">{totalReplies}</p>
                      </div>
                      <MessageSquare className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Pinned</p>
                        <p className="text-2xl font-bold">{pinnedDiscussions}</p>
                      </div>
                      <Pin className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Discussions Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle>Discussion Management</CardTitle>
                    <CardDescription>
                      Create and manage course discussions
                    </CardDescription>
                  </div>
                  <Button asChild>
                    <Link href="/instructor/discussions/create">
                      <Plus className="mr-2 h-4 w-4" />
                      New Discussion
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  <DataTable columns={columns} data={discussions} />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}