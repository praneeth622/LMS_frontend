"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Search, Filter, SortAsc, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface DiscussionFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  filters: {
    type?: string[]
    status?: string[]
    course_id?: number
    lecture_id?: number
  }
  onFiltersChange: (filters: any) => void
  courses?: Array<{ id: number; title: string }>
  lectures?: Array<{ id: number; title: string }>
}

export function DiscussionFilters({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  courses = [],
  lectures = []
}: DiscussionFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const discussionTypes = [
    { value: 'question', label: 'Questions' },
    { value: 'discussion', label: 'Discussions' },
    { value: 'announcement', label: 'Announcements' }
  ]

  const statusOptions = [
    { value: 'solved', label: 'Solved' },
    { value: 'unsolved', label: 'Unsolved' },
    { value: 'pinned', label: 'Pinned' }
  ]

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'unanswered', label: 'Unanswered' },
    { value: 'oldest', label: 'Oldest' }
  ]

  const updateFilter = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: string, value: string) => {
    const currentArray = filters[key as keyof typeof filters] as string[] || []
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value]
    updateFilter(key, newArray.length > 0 ? newArray : undefined)
  }

  const clearFilters = () => {
    onFiltersChange({})
    onSearchChange("")
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.type?.length) count += filters.type.length
    if (filters.status?.length) count += filters.status.length
    if (filters.course_id) count += 1
    if (filters.lecture_id) count += 1
    return count
  }

  return (
    <div className="space-y-4">
      {/* Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-40">
              <SortAsc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Discussions</SheetTitle>
                <SheetDescription>
                  Narrow down discussions by type, status, and course
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-6 mt-6">
                {/* Discussion Types */}
                <div>
                  <Label className="text-base font-medium">Discussion Type</Label>
                  <div className="space-y-2 mt-2">
                    {discussionTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={filters.type?.includes(type.value) || false}
                          onCheckedChange={() => toggleArrayFilter('type', type.value)}
                        />
                        <Label htmlFor={type.value} className="text-sm">
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status */}
                <div>
                  <Label className="text-base font-medium">Status</Label>
                  <div className="space-y-2 mt-2">
                    {statusOptions.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={status.value}
                          checked={filters.status?.includes(status.value) || false}
                          onCheckedChange={() => toggleArrayFilter('status', status.value)}
                        />
                        <Label htmlFor={status.value} className="text-sm">
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Course Filter */}
                {courses.length > 0 && (
                  <div>
                    <Label className="text-base font-medium">Course</Label>
                    <Select
                      value={filters.course_id?.toString() || ""}
                      onValueChange={(value) => updateFilter('course_id', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All courses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All courses</SelectItem>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Lecture Filter */}
                {lectures.length > 0 && filters.course_id && (
                  <div>
                    <Label className="text-base font-medium">Lecture</Label>
                    <Select
                      value={filters.lecture_id?.toString() || ""}
                      onValueChange={(value) => updateFilter('lecture_id', value ? parseInt(value) : undefined)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="All lectures" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All lectures</SelectItem>
                        {lectures.map((lecture) => (
                          <SelectItem key={lecture.id} value={lecture.id.toString()}>
                            {lecture.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Clear Filters */}
                {getActiveFiltersCount() > 0 && (
                  <Button variant="outline" onClick={clearFilters} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="flex flex-wrap gap-2"
        >
          {filters.type?.map((type) => (
            <Badge key={type} variant="secondary" className="cursor-pointer" onClick={() => toggleArrayFilter('type', type)}>
              {discussionTypes.find(t => t.value === type)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="cursor-pointer" onClick={() => toggleArrayFilter('status', status)}>
              {statusOptions.find(s => s.value === status)?.label}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          ))}
          {filters.course_id && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => updateFilter('course_id', undefined)}>
              {courses.find(c => c.id === filters.course_id)?.title}
              <X className="h-3 w-3 ml-1" />
            </Badge>
          )}
        </motion.div>
      )}
    </div>
  )
}