"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Target,
  Calendar,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  MessageSquare,
  User,
  ClipboardList,
  Award
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
    badge: "3",
  },
  {
    name: "Progress",
    href: "/student/progress",
    icon: Target,
    badge: null,
  },
  {
    name: "Assignments",
    href: "/student/assignments",
    icon: ClipboardList,
    badge: "2",
  },
  {
    name: "Discussions",
    href: "/student/discussions",
    icon: MessageSquare,
    badge: null,
  },
  {
    name: "Analytics",
    href: "/student/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    name: "Certificates",
    href: "/student/certificates",
    icon: Award,
    badge: null,
  },
  {
    name: "Calendar",
    href: "/student/calendar",
    icon: Calendar,
    badge: null,
  },
  {
    name: "Profile",
    href: "/student/profile",
    icon: User,
    badge: null,
  },
]

interface StudentSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function StudentSidebar({ collapsed, onToggle }: StudentSidebarProps) {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()
  const [isHovered, setIsHovered] = React.useState(false)
  
  // Determine if sidebar should be expanded (either manually toggled open or hovered)
  const isExpanded = !collapsed || isHovered

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen flex flex-col shadow-lg",
        isExpanded ? "bg-background border-r border-border" : "sidebar-compressed"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className={cn(
        "p-4 border-b border-border",
        !isExpanded && "p-3"
      )}>
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg text-foreground">EduFlow</span>
                  <span className="text-xs text-muted-foreground">Student Portal</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full"
              >
                <div className="brand-logo-compressed">
                  <GraduationCap className="h-6 w-6 text-primary-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        {!isExpanded && (
          <div className="mt-3 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="control-button-compressed expand-button"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 scrollbar-hide overflow-hidden hover:overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{
                  x: isExpanded ? 2 : 0,
                  scale: !isExpanded ? 1.08 : 1.02
                }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
                  isExpanded ? "px-3 py-3" : "p-3 justify-center",
                  isActive
                    ? "gradient-primary text-white shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {/* Icon container with improved positioning for collapsed state */}
                <div className={cn(
                  "flex items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                  !isExpanded && "w-12 h-12 bg-background/10 border border-border/30 shadow-sm",
                  isActive && !isExpanded && "bg-primary/15 border-primary/30 shadow-md",
                  !isActive && !isExpanded && "hover:bg-muted/60 hover:border-border/50 hover:shadow-sm"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-200",
                    isActive && !isExpanded ? "text-primary" : isActive ? "text-white" : "text-muted-foreground group-hover:text-primary",
                    !isExpanded && "h-6 w-6"
                  )} />
                </div>
                
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between flex-1"
                    >
                      <span className="font-medium text-sm truncate">
                        {item.name}
                      </span>
                      {item.badge && (
                        <span className={cn(
                          "px-2 py-1 text-xs font-bold rounded-full flex-shrink-0 ml-2",
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-primary text-white"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active indicator */}
                {isActive && isExpanded && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}

                {/* Enhanced tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg border border-border flex items-center gap-2">
                    {item.name}
                    {item.badge && (
                      <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                  </div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border bg-card">
        <div className={cn(
          "flex items-center transition-all duration-200",
          isExpanded ? "gap-3" : "flex-col gap-2"
        )}>
          <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback className="gradient-primary text-white font-bold">
              {userProfile?.name?.charAt(0) || 'S'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-foreground truncate">
                  {userProfile?.name || 'Student'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Level 2 • Beginner
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={cn(
            "flex items-center",
            isExpanded ? "gap-1" : "flex-col gap-1"
          )}>
            <SimpleThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-3 space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress to Level 3</span>
                <span className="text-primary font-medium">65%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="gradient-primary h-2 rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}