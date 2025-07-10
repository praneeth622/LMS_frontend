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

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white border-r border-[#E8EAED] h-screen flex flex-col shadow-sm"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
    >
      {/* Header */}
      <div className="p-6 border-b border-[#E8EAED]">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#FF4B4B] rounded-xl flex items-center justify-center shadow-sm">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="font-semibold text-xl text-[#1F2937]">Instructor</span>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-10 w-10 rounded-lg hover:bg-[#F1F3F4] transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5 text-[#6B7280]" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-[#6B7280]" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href}>
              <motion.div
                whileHover={{ 
                  x: collapsed ? 0 : 4,
                  backgroundColor: isActive ? "#FF4B4B" : "#F8F9FA"
                }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group",
                  isActive
                    ? "bg-[#FF4B4B] text-white shadow-md"
                    : "text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F9FA]"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0 transition-colors",
                  isActive ? "text-white" : "text-[#6B7280] group-hover:text-[#FF4B4B]"
                )} />
                <AnimatePresence mode="wait">
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium text-sm"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="p-6 border-t border-[#E8EAED] bg-[#F8F9FA]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#FF4B4B] to-[#FF6B6B] rounded-full flex items-center justify-center shadow-sm border-2 border-white">
            <span className="text-sm font-semibold text-white">
              {userProfile?.name?.charAt(0) || 'I'}
            </span>
          </div>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-semibold text-[#1F2937] truncate">
                  {userProfile?.name || 'Instructor'}
                </p>
                <p className="text-xs text-[#6B7280] truncate">
                  Instructor Dashboard
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-9 w-9 rounded-lg text-[#6B7280] hover:text-[#FF4B4B] hover:bg-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}