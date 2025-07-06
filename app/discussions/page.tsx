"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  Award,
  Zap
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiscussionCard } from "@/components/discussion/discussion-card"
import { DiscussionFilters } from "@/components/discussion/discussion-filters"
import { toast } from "react-hot-toast"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

// Mock discussion data
const mockDiscussions = [
  {
    id: 1,
    course_id: 1,
    lecture_id: 1,
    user_id: 3,
    title: "How to properly use React hooks?",
    content: "I'm having trouble understanding when to use useEffect vs useLayoutEffect. Can someone explain the difference?",
    type: "question" as const,
    is_pinned: false,
    is_solved: false,
    views: 45,
    likes: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
      id: 3,
      name: "Alice Student",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      reputation: 150,
      role: "Student"
    },
    course: {
      id: 1,
      title: "React Fundamentals"
    },
    lecture: {
      id: 1,
      title: "Introduction to Hooks"
    },
    comments_count: 8,
    latest_comment: {
      id: 1,
      user: {
        name: "John Instructor"
      },
      created_at: new Date(Date.now() - 3600000).toISOString()
    }
  },
  {
    id: 2,
    user_id: 4,
    title: "Best practices for CSS Grid layout",
    content: "What are some best practices when working with CSS Grid? I want to make sure I'm following modern standards.",
    type: "discussion" as const,
    is_pinned: true,
    is_solved: false,
    views: 123,
    likes: 28,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    user: {
      id: 4,
      name: "Bob Designer",
      avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      reputation: 320,
      role: "Student"
    },
    comments_count: 15,
    latest_comment: {
      id: 2,
      user: {
        name: "Sarah Expert"
      },
      created_at: new Date(Date.now() - 7200000).toISOString()
    }
  },
  {
    id: 3,
    course_id: 2,
    user_id: 2,
    title: "New course announcement: Advanced JavaScript",
    content: "We're excited to announce our new Advanced JavaScript course covering ES6+, async/await, and modern frameworks!",
    type: "announcement" as const,
    is_pinned: true,
    is_solved: false,
    views: 567,
    likes: 89,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    user: {
      id: 2,
      name: "Jane Instructor",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      reputation: 1250,
      role: "Instructor"
    },
    course: {
      id: 2,
      title: "Advanced JavaScript"
    },
    comments_count: 23,
    latest_comment: {
      id: 3,
      user: {
        name: "Mike Student"
      },
      created_at: new Date(Date.now() - 14400000).toISOString()
    }
  }
]

export default function DiscussionsPage() {
  const [discussions, setDiscussions] = React.useState(mockDiscussions)
  const [loading, setLoading] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState("latest")
  const [filters, setFilters] = React.useState<any>({})
  const [activeTab, setActiveTab] = React.useState("all")
  const { userProfile } = useAuth()

  const stats = [
    {
      title: "Total Discussions",
      value: "1,234",
      change: "+12% this week",
      changeType: "positive" as const,
      icon: MessageSquare,
      color: "bg-blue-500"
    },
    {
      title: "Active Users",
      value: "456",
      change: "+8% this week",
      changeType: "positive" as const,
      icon: Users,
      color: "bg-green-500"
    },
    {
      title: "Questions Solved",
      value: "89%",
      change: "+5% this week",
      changeType: "positive" as const,
      icon: Award,
      color: "bg-yellow-500"
    },
    {
      title: "Response Time",
      value: "2.4h",
      change: "-15% faster",
      changeType: "positive" as const,
      icon: Zap,
      color: "bg-purple-500"
    }
  ]

  const handleLike = async (id: number) => {
    try {
      if (!userProfile?.id) return
      
      // Update local state
      setDiscussions(prev => prev.map(d => 
        d.id === id ? { ...d, likes: d.likes + 1 } : d
      ))
      
      toast.success('Liked!')
    } catch (error) {
      console.error('Error liking discussion:', error)
      toast.error('Failed to like discussion')
    }
  }

  const handlePin = async (id: number) => {
    try {
      setDiscussions(prev => prev.map(d => 
        d.id === id ? { ...d, is_pinned: !d.is_pinned } : d
      ))
      
      toast.success('Discussion updated!')
    } catch (error) {
      console.error('Error pinning discussion:', error)
      toast.error('Failed to update discussion')
    }
  }

  const handleSolve = async (id: number) => {
    try {
      setDiscussions(prev => prev.map(d => 
        d.id === id ? { ...d, is_solved: !d.is_solved } : d
      ))
      
      toast.success('Discussion updated!')
    } catch (error) {
      console.error('Error updating discussion:', error)
      toast.error('Failed to update discussion')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      setDiscussions(prev => prev.filter(d => d.id !== id))
      toast.success('Discussion deleted!')
    } catch (error) {
      console.error('Error deleting discussion:', error)
      toast.error('Failed to delete discussion')
    }
  }

  const filteredDiscussions = discussions.filter(discussion => {
    if (activeTab !== 'all' && discussion.type !== activeTab) return false
    if (searchQuery && !discussion.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <ProtectedRoute allowedRoles={[1, 2, 3]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Community Discussions</h1>
                <p className="text-muted-foreground mt-1">
                  Connect, learn, and share knowledge with the community
                </p>
              </div>
              
              <Button asChild>
                <Link href="/discussions/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Start Discussion
                </Link>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div className={`p-2 rounded-lg ${stat.color}`}>
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </div>
                      <p className="text-xs text-green-600">
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Filters */}
            <DiscussionFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filters={filters}
              onFiltersChange={setFilters}
            />

            {/* Discussion Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Discussions</TabsTrigger>
                <TabsTrigger value="question">Questions</TabsTrigger>
                <TabsTrigger value="discussion">Discussions</TabsTrigger>
                <TabsTrigger value="announcement">Announcements</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-6 mt-6">
                {loading ? (
                  <div className="grid grid-cols-1 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-3 bg-muted rounded"></div>
                            <div className="h-3 bg-muted rounded w-2/3"></div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filteredDiscussions.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredDiscussions.map((discussion) => (
                      <DiscussionCard
                        key={discussion.id}
                        discussion={discussion}
                        onLike={handleLike}
                        onPin={handlePin}
                        onSolve={handleSolve}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No discussions found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery ? 'Try adjusting your search or filters' : 'Be the first to start a discussion!'}
                    </p>
                    <Button asChild>
                      <Link href="/discussions/create">
                        <Plus className="mr-2 h-4 w-4" />
                        Start Discussion
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}