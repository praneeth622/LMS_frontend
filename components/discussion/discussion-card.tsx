"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  Pin, 
  CheckCircle, 
  Clock,
  User,
  Award,
  MoreHorizontal,
  Edit,
  Trash2,
  Flag
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { Discussion } from "@/lib/discussion-api"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

interface DiscussionCardProps {
  discussion: Discussion
  onLike?: (id: number) => void
  onPin?: (id: number) => void
  onSolve?: (id: number) => void
  onEdit?: (discussion: Discussion) => void
  onDelete?: (id: number) => void
  showCourse?: boolean
  compact?: boolean
}

export function DiscussionCard({
  discussion,
  onLike,
  onPin,
  onSolve,
  onEdit,
  onDelete,
  showCourse = true,
  compact = false
}: DiscussionCardProps) {
  const { userProfile } = useAuth()
  const isOwner = userProfile?.id === discussion.user_id
  const canModerate = userProfile?.role_id === 1 || userProfile?.role_id === 2 // Admin or Instructor

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className={compact ? "pb-2" : "pb-3"}>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={discussion.user.avatar} alt={discussion.user.name} />
                <AvatarFallback>
                  {discussion.user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-foreground">{discussion.user.name}</span>
                  <span className={`text-xs ${getRoleColor(discussion.user.role)}`}>
                    {discussion.user.role}
                  </span>
                  {discussion.user.reputation > 100 && (
                    <div className="flex items-center space-x-1">
                      <Award className="h-3 w-3 text-yellow-500" />
                      <span className="text-xs text-muted-foreground">{discussion.user.reputation}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}</span>
                  {showCourse && discussion.course && (
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
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Badge className={getTypeColor(discussion.type)}>
                  {discussion.type}
                </Badge>
                {discussion.is_pinned && (
                  <Pin className="h-4 w-4 text-orange-500" />
                )}
                {discussion.is_solved && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              {(isOwner || canModerate) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isOwner && (
                      <>
                        <DropdownMenuItem onClick={() => onEdit?.(discussion)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete?.(discussion.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {canModerate && (
                      <>
                        <DropdownMenuItem onClick={() => onPin?.(discussion.id)}>
                          <Pin className="mr-2 h-4 w-4" />
                          {discussion.is_pinned ? 'Unpin' : 'Pin'}
                        </DropdownMenuItem>
                        {discussion.type === 'question' && (
                          <DropdownMenuItem onClick={() => onSolve?.(discussion.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {discussion.is_solved ? 'Mark Unsolved' : 'Mark Solved'}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem>
                      <Flag className="mr-2 h-4 w-4" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className={compact ? "pt-0" : ""}>
          <Link href={`/discussions/${discussion.id}`} className="block group-hover:text-primary transition-colors">
            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
              {discussion.title}
            </h3>
            {!compact && (
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {discussion.content.replace(/[#*`]/g, '').substring(0, 200)}...
              </p>
            )}
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{discussion.comments_count}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>{discussion.likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{discussion.views}</span>
              </div>
            </div>
            
            {discussion.latest_comment && (
              <div className="text-xs text-muted-foreground">
                Last reply by {discussion.latest_comment.user.name} {formatDistanceToNow(new Date(discussion.latest_comment.created_at), { addSuffix: true })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}