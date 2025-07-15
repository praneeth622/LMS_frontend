"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  Plus,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  FileText
} from "lucide-react"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  {
    name: "Dashboard",
    href: "/instructor/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Courses",
    href: "/instructor/courses",
    icon: BookOpen,
  },
  {
    name: "Create Course",
    href: "/instructor/courses/create",
    icon: Plus,
  },
  {
    name: "Students",
    href: "/instructor/students",
    icon: Users,
  },
  {
    name: "Assessments",
    href: "/instructor/assessments",
    icon: FileText,
  },
  {
    name: "Analytics",
    href: "/instructor/analytics",
    icon: BarChart3,
  },
  {
    name: "Discussions",
    href: "/instructor/discussions",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/instructor/settings",
    icon: Settings,
  },
]

interface InstructorSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function InstructorSidebar({ collapsed, onToggle }: InstructorSidebarProps) {
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
      className="bg-background border-r border-border h-screen flex flex-col shadow-sm"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
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
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-foreground">Instructor</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center w-full"
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <GraduationCap className="h-5 w-5 text-primary-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {isExpanded && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-9 w-9 rounded-lg hover:bg-accent transition-colors flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
        {!isExpanded && (
          <div className="mt-2 flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-8 w-8 rounded-lg hover:bg-accent transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                  x: isExpanded ? 4 : 0,
                  scale: !isExpanded ? 1.08 : 1
                }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
                  isExpanded ? "px-4 py-3" : "p-3 justify-center",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                )}
              >
                {/* Icon container with improved positioning for collapsed state */}
                <div className={cn(
                  "flex items-center justify-center rounded-lg transition-all duration-200 shrink-0",
                  !isExpanded && "w-12 h-12 bg-background/10 border border-border/30 shadow-sm",
                  isActive && !isExpanded && "bg-primary/15 border-primary/30 shadow-md",
                  !isActive && !isExpanded && "hover:bg-accent/60 hover:border-border/50 hover:shadow-sm"
                )}>
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-200",
                    isActive && !isExpanded ? "text-primary" : isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
                    !isExpanded && "h-6 w-6"
                  )} />
                </div>
                
                <AnimatePresence mode="wait">
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm truncate"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {/* Enhanced tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground text-sm rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 whitespace-nowrap z-50 shadow-lg border border-border">
                    {item.name}
                    <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-2 h-2 bg-popover border-l border-t border-border rotate-45"></div>
                  </div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className={cn(
          "flex items-center transition-all duration-200",
          isExpanded ? "gap-3" : "flex-col gap-2"
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm border-2 border-background flex-shrink-0">
            <span className="text-sm font-semibold text-primary-foreground">
              {userProfile?.name?.charAt(0) || 'I'}
            </span>
          </div>
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
                  {userProfile?.name || 'Instructor'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Instructor Dashboard
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
              className="h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}