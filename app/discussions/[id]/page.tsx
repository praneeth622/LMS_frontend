"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Heart, 
  Eye, 
  MessageSquare, 
  Pin, 
  CheckCircle,
  Share2,
  Bookmark,
  Flag,
  Award,
  Clock
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CommentThread } from "@/components/discussion/comment-thread"
import { MarkdownEditor } from "@/components/discussion/markdown-editor"
import { toast } from "react-hot-toast"
import { discussionApi, Discussion, Comment } from "@/lib/discussion-api"
import { useAuth } from "@/contexts/auth-context"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import dynamic from "next/dynamic"

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

export default function DiscussionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const discussionId = parseInt(params.id as string)
  const { userProfile } = useAuth()

  const [discussion, setDiscussion] = React.useState<Discussion | null>(null)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [newComment, setNewComment] = React.useState("")
  const [submittingComment, setSubmittingComment] = React.useState(false)

  React.useEffect(() => {
    if (discussionId) {
      fetchDiscussion()
      fetchComments()
    }
  }, [discussionId])

  const fetchDiscussion = async () => {
    try {
      // Mock discussion data
      const mockDiscussion: Discussion = {
        id: discussionId,
        course_id: 1,
        lecture_id: 1,
        user_id: 3,
        title: "How to properly use React hooks?",
        content: `I'm having trouble understanding when to use \`useEffect\` vs \`useLayoutEffect\`. Can someone explain the difference?

Here's what I understand so far:

## useEffect
- Runs after the DOM has been updated
- Good for most side effects
- Non-blocking

## useLayoutEffect  
- Runs synchronously after all DOM mutations
- Blocks visual updates
- Good for measuring DOM elements

But I'm still confused about when exactly to use each one. Can someone provide some practical examples?

**Example code:**
\`\`\`javascript
function MyComponent() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // When should I use this?
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return <div>{count}</div>;
}
\`\`\`

Any help would be appreciated!`,
        type: "question",
        is_pinned: false,
        is_solved: false,
        views: 45,
        likes: 12,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date(Date.now() - 3600000).toISOString(),
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
        comments_count: 3
      }
      
      setDiscussion(mockDiscussion)
    } catch (error) {
      console.error('Error fetching discussion:', error)
      toast.error('Failed to load discussion')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      // Mock comments data
      const mockComments: Comment[] = [
        {
          id: 1,
          discussion_id: discussionId,
          user_id: 2,
          comment_text: `Great question! The key difference is timing and blocking behavior.

**useEffect** is perfect for most scenarios:
- API calls
- Setting up subscriptions
- Updating document title
- Cleanup operations

**useLayoutEffect** should be used when you need to:
- Measure DOM elements
- Make DOM mutations that users should not see
- Synchronously re-render based on DOM measurements

Here's a practical example:

\`\`\`javascript
function Tooltip({ children }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef();
  
  useLayoutEffect(() => {
    // This needs to run before the browser paints
    const rect = ref.current.getBoundingClientRect();
    setPosition({ x: rect.left, y: rect.top });
  }, []);
  
  return <div ref={ref}>{children}</div>;
}
\`\`\`

Hope this helps!`,
          is_solution: true,
          likes: 8,
          created_at: new Date(Date.now() - 1800000).toISOString(),
          updated_at: new Date(Date.now() - 1800000).toISOString(),
          user: {
            id: 2,
            name: "John Instructor",
            avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
            reputation: 850,
            role: "Instructor"
          },
          replies: [
            {
              id: 2,
              discussion_id: discussionId,
              user_id: 3,
              parent_id: 1,
              comment_text: "Thank you so much! This explanation really helps. The tooltip example makes it crystal clear.",
              is_solution: false,
              likes: 2,
              created_at: new Date(Date.now() - 900000).toISOString(),
              updated_at: new Date(Date.now() - 900000).toISOString(),
              user: {
                id: 3,
                name: "Alice Student",
                avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
                reputation: 150,
                role: "Student"
              }
            }
          ]
        },
        {
          id: 3,
          discussion_id: discussionId,
          user_id: 4,
          comment_text: "I'd also add that `useLayoutEffect` can hurt performance if overused since it blocks painting. Only use it when you really need synchronous execution.",
          is_solution: false,
          likes: 5,
          created_at: new Date(Date.now() - 600000).toISOString(),
          updated_at: new Date(Date.now() - 600000).toISOString(),
          user: {
            id: 4,
            name: "Sarah Expert",
            avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
            reputation: 420,
            role: "Student"
          }
        }
      ]
      
      setComments(mockComments)
    } catch (error) {
      console.error('Error fetching comments:', error)
      toast.error('Failed to load comments')
    }
  }

  const handleLike = async () => {
    if (!userProfile?.id || !discussion) return
    
    try {
      await discussionApi.addReaction({
        target_id: discussion.id,
        target_type: 'discussion',
        type: 'like',
        user_id: userProfile.id
      })
      
      setDiscussion(prev => prev ? { ...prev, likes: prev.likes + 1 } : null)
      toast.success('Liked!')
    } catch (error) {
      console.error('Error liking discussion:', error)
      toast.error('Failed to like discussion')
    }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !userProfile?.id) return
    
    try {
      setSubmittingComment(true)
      
      const response = await discussionApi.createComment({
        discussion_id: discussionId,
        user_id: userProfile.id,
        comment_text: newComment.trim()
      })
      
      if (response.success) {
        // Add the new comment to the list
        const newCommentData: Comment = {
          ...response.data,
          user: {
            id: userProfile.id,
            name: userProfile.name,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`,
            reputation: 0,
            role: userProfile.role_id === 1 ? 'Admin' : userProfile.role_id === 2 ? 'Instructor' : 'Student'
          }
        }
        
        setComments(prev => [...prev, newCommentData])
        setNewComment("")
        toast.success('Comment posted!')
        
        // Update discussion comment count
        setDiscussion(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null)
      }
    } catch (error) {
      console.error('Error posting comment:', error)
      toast.error('Failed to post comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleCommentReply = async (parentId: number, content: string) => {
    if (!userProfile?.id) return
    
    try {
      const response = await discussionApi.createComment({
        discussion_id: discussionId,
        user_id: userProfile.id,
        parent_id: parentId,
        comment_text: content
      })
      
      if (response.success) {
        // Add reply to the parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [
                ...(comment.replies || []),
                {
                  ...response.data,
                  user: {
                    id: userProfile.id,
                    name: userProfile.name,
                    avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${userProfile.name}`,
                    reputation: 0,
                    role: userProfile.role_id === 1 ? 'Admin' : userProfile.role_id === 2 ? 'Instructor' : 'Student'
                  }
                }
              ]
            }
          }
          return comment
        }))
        
        toast.success('Reply posted!')
      }
    } catch (error) {
      console.error('Error posting reply:', error)
      toast.error('Failed to post reply')
    }
  }

  const handleCommentEdit = async (commentId: number, content: string) => {
    try {
      await discussionApi.updateComment(commentId, { comment_text: content })
      
      // Update comment in state
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, comment_text: content }
          : comment
      ))
      
      toast.success('Comment updated!')
    } catch (error) {
      console.error('Error updating comment:', error)
      toast.error('Failed to update comment')
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    try {
      await discussionApi.deleteComment(commentId)
      
      setComments(prev => prev.filter(comment => comment.id !== commentId))
      toast.success('Comment deleted!')
    } catch (error) {
      console.error('Error deleting comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const handleCommentLike = async (commentId: number) => {
    if (!userProfile?.id) return
    
    try {
      await discussionApi.addReaction({
        target_id: commentId,
        target_type: 'comment',
        type: 'like',
        user_id: userProfile.id
      })
      
      // Update comment likes in state
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ))
      
      toast.success('Liked!')
    } catch (error) {
      console.error('Error liking comment:', error)
      toast.error('Failed to like comment')
    }
  }

  const handleMarkSolution = async (commentId: number) => {
    try {
      await discussionApi.markCommentAsSolution(commentId)
      
      // Update comment solution status
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, is_solution: !comment.is_solution }
          : comment
      ))
      
      toast.success('Solution status updated!')
    } catch (error) {
      console.error('Error updating solution status:', error)
      toast.error('Failed to update solution status')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-red-600'
      case 'instructor':
        return 'text-blue-600'
      default:
        return 'text-muted-foreground'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'question':
        return 'bg-blue-100 text-blue-800'
      case 'discussion':
        return 'bg-green-100 text-green-800'
      case 'announcement':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[1, 2, 3]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  if (!discussion) {
    return (
      <ProtectedRoute allowedRoles={[1, 2, 3]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Discussion not found</h2>
            <Button asChild>
              <Link href="/discussions">Back to Discussions</Link>
            </Button>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={[1, 2, 3]}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link href="/discussions">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Discussions
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Discussion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
                        <AvatarFallback>
                          {discussion.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold text-lg">{discussion.user.name}</span>
                          <span className={`text-sm ${getRoleColor(discussion.user.role)}`}>
                            {discussion.user.role}
                          </span>
                          {discussion.user.reputation > 100 && (
                            <div className="flex items-center space-x-1">
                              <Award className="h-4 w-4 text-yellow-500" />
                              <span className="text-sm text-muted-foreground">{discussion.user.reputation}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                          </div>
                          {discussion.course && (
                            <>
                              <span>•</span>
                              <span>{discussion.course.title}</span>
                            </>
                          )}
                          {discussion.lecture && (
                            <>
                              <span>•</span>
                              <span>{discussion.lecture.title}</span>
                            </>
                          )}
                        </div>
                        
                        <h1 className="text-2xl font-bold text-foreground mb-4">
                          {discussion.title}
                        </h1>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge className={getTypeColor(discussion.type)}>
                        {discussion.type}
                      </Badge>
                      {discussion.is_pinned && (
                        <Pin className="h-5 w-5 text-orange-500" />
                      )}
                      {discussion.is_solved && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="prose prose-lg max-w-none dark:prose-invert mb-6">
                    <ReactMarkdown>{discussion.content}</ReactMarkdown>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button
                        variant="ghost"
                        onClick={handleLike}
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Heart className="h-5 w-5 mr-2" />
                        {discussion.likes}
                      </Button>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <MessageSquare className="h-5 w-5" />
                        <span>{discussion.comments_count}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Eye className="h-5 w-5" />
                        <span>{discussion.views}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Comments */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h2 className="text-xl font-semibold">
                  {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h2>
              </CardHeader>
              <CardContent>
                {comments.length > 0 ? (
                  <CommentThread
                    comments={comments}
                    onReply={handleCommentReply}
                    onEdit={handleCommentEdit}
                    onDelete={handleCommentDelete}
                    onLike={handleCommentLike}
                    onMarkSolution={handleMarkSolution}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add Comment */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <h3 className="text-lg font-semibold">Add a Comment</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <MarkdownEditor
                    value={newComment}
                    onChange={setNewComment}
                    placeholder="Share your thoughts, ask questions, or provide helpful answers..."
                    minHeight={150}
                    showPreview={false}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCommentSubmit} 
                      disabled={!newComment.trim() || submittingComment}
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}