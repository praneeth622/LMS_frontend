"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface InstructorHeaderProps {
  title: string
  subtitle?: string
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}

export function InstructorHeader({ 
  title, 
  subtitle, 
  searchPlaceholder = "Search...",
  onSearch 
}: InstructorHeaderProps) {
  const [searchQuery, setSearchQuery] = React.useState("")

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-b border-[#E8EAED] px-8 py-6 shadow-sm"
      style={{ 
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        height: '4rem'
      }}
    >
      <div className="flex items-center justify-between h-full">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-[#6B7280] mt-1 text-sm font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 w-80 h-10 border-[#E8EAED] rounded-lg bg-white text-sm font-medium placeholder:text-[#9CA3AF] focus:border-[#FF4B4B] focus:ring-2 focus:ring-[#FF4B4B] focus:ring-opacity-20 transition-all"
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-10 w-10 rounded-lg hover:bg-[#F1F3F4] transition-colors"
              >
                <Bell className="h-5 w-5 text-[#6B7280]" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#FF4B4B] text-white border-2 border-white rounded-full font-semibold"
                >
                  2
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-white border-[#E8EAED] rounded-xl shadow-lg p-0"
            >
              <div className="p-4">
                <h4 className="font-semibold mb-3 text-[#1F2937]">Notifications</h4>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8EAED]">
                    <p className="text-sm font-semibold text-[#1F2937]">New student enrolled</p>
                    <p className="text-xs text-[#6B7280] mt-1">Sarah joined your React course</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F8F9FA] border border-[#E8EAED]">
                    <p className="text-sm font-semibold text-[#1F2937]">Course review submitted</p>
                    <p className="text-xs text-[#6B7280] mt-1">5-star review for JavaScript Basics</p>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-[#E8EAED]" />
              <DropdownMenuItem className="p-4 text-sm font-medium text-[#FF4B4B] hover:bg-[#F8F9FA] cursor-pointer">
                <span>View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-10 w-10 rounded-lg hover:bg-[#F1F3F4] transition-colors"
          >
            <Settings className="h-5 w-5 text-[#6B7280]" />
          </Button>
        </div>
      </div>
    </motion.header>
  )
}