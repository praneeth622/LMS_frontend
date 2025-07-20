"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  Users,
  Building2,
  Activity,
  FileText,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  GraduationCap,
  Bell
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SimpleThemeToggle } from "@/components/ui/theme-toggle"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  {
    name: "Overview",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Organizations",
    href: "/admin/organizations",
    icon: Building2,
  },
  {
    name: "Course Management",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    name: "Enrollments",
    href: "/admin/enrollments",
    icon: GraduationCap,
  },
  {
    name: "Notifications",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    name: "System Health",
    href: "/admin/health",
    icon: Activity,
  },
  {
    name: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileText,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

interface AdminSidebarProps {
  // Removed collapsed and onToggle props since sidebar is now hover-only
}

export function AdminSidebar({}: AdminSidebarProps = {}) {
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()
  const [isHovered, setIsHovered] = React.useState(false)
  
  // Sidebar is collapsed by default and expands only on hover
  const isExpanded = isHovered

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "h-screen flex flex-col shadow-lg",
        isExpanded ? "bg-background border-r border-border" : "sidebar-compressed"
      )}
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
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
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <LayoutDashboard className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg text-foreground">Admin Panel</span>
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
                  <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2 overflow-hidden scrollbar-hide">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ 
                  x: isExpanded ? 4 : 0,
                  scale: !isExpanded ? 1.02 : 1
                }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "flex items-center gap-3 rounded-xl transition-all duration-200 group relative",
                  isExpanded 
                    ? cn(
                        "px-4 py-3",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                      )
                    : cn(
                        "nav-item-compressed",
                        isActive && "active"
                      )
                )}
              >
                {/* Icon with enhanced styling for compressed state */}
                {isExpanded ? (
                  <item.icon className={cn(
                    "h-5 w-5 flex-shrink-0 transition-all duration-200",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                  )} />
                ) : (
                  <item.icon className="nav-icon-compressed" />
                )}
                
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
                
                {/* Enhanced tooltip for compressed state */}
                {!isExpanded && (
                  <div className="sidebar-tooltip">
                    {item.name}
                  </div>
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className={cn(
        isExpanded ? "p-4 border-t border-border bg-muted/30" : "user-profile-compressed"
      )}>
        <div className={cn(
          "flex items-center transition-all duration-200",
          isExpanded ? "gap-3" : "flex-col gap-2"
        )}>
          <div className={cn(
            "bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-sm border-2 border-background flex-shrink-0",
            isExpanded ? "w-10 h-10" : "user-avatar-compressed"
          )}>
            <span className="text-sm font-semibold text-primary-foreground">
              {userProfile?.name?.charAt(0) || 'A'}
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
                  {userProfile?.name || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  Administrator
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <div className={cn(
            "flex items-center",
            isExpanded ? "gap-1" : "flex-col gap-1"
          )}>
            <div className={cn(
              isExpanded ? "" : "control-button-compressed"
            )}>
              <SimpleThemeToggle />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              className={cn(
                "rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors group",
                isExpanded ? "h-9 w-9" : "control-button-compressed"
              )}
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