"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Heart, 
  Reply, 
  CheckCircle, 
  MoreHorizontal,
  Edit,
  Trash2,
  Flag,
  Award,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { Comment } from "@/lib/discussion-api"
import { useAuth } from "@/contexts/auth-context"
import { MarkdownEditor } from "./markdown-editor"
import dynamic from "next/dynamic"

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

interface CommentThreadProps {
  comments: Comment[]
  onReply: (parentId: number, content: string) => void
  onEdit: (id: number, content: string) => void
  onDelete: (id: number) => void
  onLike: (id: number) => void
  onMarkSolution: (id: number) => void
  level?: number
  maxLevel?: number
}

export function CommentThread({
  comments,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onMarkSolution,
  level = 0,
  maxLevel = 3
}: CommentThreadProps) {
  const { userProfile } = useAuth()
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null)
  const [editingComment, setEditingComment] = React.useState<number | null>(null)
  const [replyContent, setReplyContent] = React.useState("")
  const [editContent, setEditContent] = React.useState("")

  const handleReply = (parentId: number) => {
    if (replyContent.trim()) {
      onReply(parentId, replyContent)
      setReplyContent("")
      setReplyingTo(null)
    }
  }

  const handleEdit = (commentId: number) => {
    if (editContent.trim()) {
      onEdit(commentId, editContent)
      setEditContent("")
      setEditingComment(null)
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.comment_text)
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'text-critical'
      case 'instructor':
        return 'text-info'
      default:
        return 'text-muted-foreground'
    }
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${level > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}
        >
          <div className="group">
            <div className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                <AvatarFallback>
                  {comment.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-foreground">{comment.user.name}</span>
                  <span className={`text-xs ${getRoleColor(comment.user.role)}`}>
                    {comment.user.role}
                  </span>
                  {comment.user.reputation > 100 && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">{comment.user.reputation}</span>
                    </div>
                  )}
                  {comment.is_solution && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Solution
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                
                {editingComment === comment.id ? (
                  <div className="space-y-3">
                    <MarkdownEditor
                      value={editContent}
                      onChange={setEditContent}
                      placeholder="Edit your comment..."
                      minHeight={100}
                      showPreview={false}
                      allowFileUpload={false}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleEdit(comment.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingComment(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert mb-3">
                    <ReactMarkdown>{comment.comment_text}</ReactMarkdown>
                  </div>
                )}
                
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLike(comment.id)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {comment.likes}
                  </Button>
                  
                  {level < maxLevel && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                      className="text-muted-foreground"
                    >
                      <Reply className="h-4 w-4 mr-1" />
                      Reply
                    </Button>
                  )}
                  
                  {userProfile?.role_id === 1 || userProfile?.role_id === 2 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarkSolution(comment.id)}
                      className="text-muted-foreground hover:text-green-500"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {comment.is_solution ? 'Unmark' : 'Mark as Solution'}
                    </Button>
                  ) : null}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {userProfile?.id === comment.user_id && (
                        <>
                          <DropdownMenuItem onClick={() => startEdit(comment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onDelete(comment.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <AnimatePresence>
                  {replyingTo === comment.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-3"
                    >
                      <MarkdownEditor
                        value={replyContent}
                        onChange={setReplyContent}
                        placeholder="Write your reply..."
                        minHeight={100}
                        showPreview={false}
                        allowFileUpload={false}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => handleReply(comment.id)}>
                          Reply
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4">
              <CommentThread
                comments={comment.replies}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                onLike={onLike}
                onMarkSolution={onMarkSolution}
                level={level + 1}
                maxLevel={maxLevel}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}