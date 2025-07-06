"use client"

import * as React from "react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { motion } from "framer-motion"
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Star, 
  Clock, 
  Users, 
  BookOpen,
  ShoppingCart,
  Heart,
  Play,
  DollarSign
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"
import { studentApi, Course } from '@/lib/student-api'
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

const categories = [
  "Programming & Development",
  "Design & Creative",
  "Business & Marketing",
  "Photography & Video",
  "Music & Audio",
  "Languages & Culture",
  "Health & Fitness",
  "Personal Development"
]

const levels = ["beginner", "intermediate", "advanced"]

export default function StudentCoursesPage() {
  const [courses, setCourses] = React.useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(true)
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = React.useState<string[]>([])
  const [priceRange, setPriceRange] = React.useState([0, 500])
  const [sortBy, setSortBy] = React.useState("popularity")
  const [cart, setCart] = React.useState<number[]>([])
  const [wishlist, setWishlist] = React.useState<number[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  
  const { userProfile } = useAuth()

  React.useEffect(() => {
    fetchCourses()
  }, [])

  React.useEffect(() => {
    filterCourses()
  }, [courses, searchQuery, selectedCategories, selectedLevels, priceRange, sortBy])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      const response = await studentApi.getAllCourses()
      if (response.success) {
        // Add mock data for missing fields
        const coursesWithMockData = response.data.map(course => ({
          ...course,
          thumbnail: `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=400`,
          duration: Math.floor(Math.random() * 40) + 10,
          rating: 4.0 + Math.random() * 1,
          students_count: Math.floor(Math.random() * 10000) + 100,
          level: levels[Math.floor(Math.random() * levels.length)] as 'beginner' | 'intermediate' | 'advanced'
        }))
        setCourses(coursesWithMockData)
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
      // Mock data fallback
      setCourses([
        {
          id: 1,
          title: "Complete Web Development Bootcamp",
          description: "Learn HTML, CSS, JavaScript, React, Node.js and more",
          price: 149.99,
          category: "Programming & Development",
          status: "published",
          creator: { id: 2, name: "John Smith" },
          thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400",
          duration: 40,
          rating: 4.8,
          students_count: 12453,
          level: "beginner"
        },
        {
          id: 2,
          title: "Advanced React Development",
          description: "Master React hooks, context, and advanced patterns",
          price: 199.99,
          category: "Programming & Development",
          status: "published",
          creator: { id: 3, name: "Sarah Johnson" },
          thumbnail: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400",
          duration: 25,
          rating: 4.9,
          students_count: 8291,
          level: "advanced"
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        selectedCategories.includes(course.category)
      )
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course =>
        course.level && selectedLevels.includes(course.level)
      )
    }

    // Price filter
    filtered = filtered.filter(course =>
      course.price >= priceRange[0] && course.price <= priceRange[1]
    )

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        filtered.sort((a, b) => b.id - a.id)
        break
      default: // popularity
        filtered.sort((a, b) => (b.students_count || 0) - (a.students_count || 0))
    }

    setFilteredCourses(filtered)
  }

  const toggleCart = (courseId: number) => {
    setCart(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
    toast.success(cart.includes(courseId) ? 'Removed from cart' : 'Added to cart')
  }

  const toggleWishlist = (courseId: number) => {
    setWishlist(prev => 
      prev.includes(courseId) 
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
    toast.success(wishlist.includes(courseId) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleEnroll = async (courseId: number) => {
    if (!userProfile?.id) {
      toast.error('Please log in to enroll')
      return
    }

    try {
      const response = await studentApi.enrollInCourse(userProfile.id, courseId)
      if (response.success) {
        toast.success('Successfully enrolled in course!')
      }
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error('Failed to enroll in course')
    }
  }

  const CourseCard = ({ course }: { course: Course }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              size="icon"
              variant={wishlist.includes(course.id) ? "default" : "secondary"}
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={() => toggleWishlist(course.id)}
            >
              <Heart className={`h-4 w-4 ${wishlist.includes(course.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
          <div className="absolute bottom-4 left-4">
            <Badge className="bg-primary text-primary-foreground">
              ${course.price}
            </Badge>
          </div>
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{course.rating?.toFixed(1)}</span>
            </div>
          </div>
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {course.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">by {course.creator.name}</p>
        </CardHeader>
        
        <CardContent>
          <CardDescription className="line-clamp-2 mb-4">
            {course.description}
          </CardDescription>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}h</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.students_count?.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              className="flex-1"
              onClick={() => handleEnroll(course.id)}
            >
              <Play className="mr-2 h-4 w-4" />
              Enroll Now
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleCart(course.id)}
              className={cart.includes(course.id) ? 'bg-primary text-primary-foreground' : ''}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  const CourseListItem = ({ course }: { course: Course }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group"
    >
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex space-x-6">
            <div className="relative flex-shrink-0">
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className="w-32 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
              />
              <Button
                size="icon"
                variant={wishlist.includes(course.id) ? "default" : "secondary"}
                className="absolute -top-2 -right-2 h-6 w-6"
                onClick={() => toggleWishlist(course.id)}
              >
                <Heart className={`h-3 w-3 ${wishlist.includes(course.id) ? 'fill-current' : ''}`} />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">by {course.creator.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">${course.price}</div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm">{course.rating?.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {course.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <Badge variant="outline">{course.level}</Badge>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}h</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students_count?.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button onClick={() => handleEnroll(course.id)}>
                    <Play className="mr-2 h-4 w-4" />
                    Enroll Now
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleCart(course.id)}
                    className={cart.includes(course.id) ? 'bg-primary text-primary-foreground' : ''}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex min-h-screen bg-background">
        <StudentSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader
            title="Course Catalog"
            subtitle="Discover and enroll in amazing courses"
            searchPlaceholder="Search courses..."
            onSearch={setSearchQuery}
          />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto px-4 py-8">
              {/* Search and Filters */}
              <div className="flex flex-col lg:flex-row gap-6 mb-8">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('grid')}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Courses</SheetTitle>
                        <SheetDescription>
                          Narrow down your search with these filters
                        </SheetDescription>
                      </SheetHeader>
                      
                      <div className="space-y-6 mt-6">
                        {/* Categories */}
                        <div>
                          <h4 className="font-medium mb-3">Categories</h4>
                          <div className="space-y-2">
                            {categories.map((category) => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox
                                  id={category}
                                  checked={selectedCategories.includes(category)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedCategories([...selectedCategories, category])
                                    } else {
                                      setSelectedCategories(selectedCategories.filter(c => c !== category))
                                    }
                                  }}
                                />
                                <label htmlFor={category} className="text-sm">
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Levels */}
                        <div>
                          <h4 className="font-medium mb-3">Level</h4>
                          <div className="space-y-2">
                            {levels.map((level) => (
                              <div key={level} className="flex items-center space-x-2">
                                <Checkbox
                                  id={level}
                                  checked={selectedLevels.includes(level)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLevels([...selectedLevels, level])
                                    } else {
                                      setSelectedLevels(selectedLevels.filter(l => l !== level))
                                    }
                                  }}
                                />
                                <label htmlFor={level} className="text-sm capitalize">
                                  {level}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Price Range */}
                        <div>
                          <h4 className="font-medium mb-3">Price Range</h4>
                          <div className="space-y-4">
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={500}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                              <span>${priceRange[0]}</span>
                              <span>${priceRange[1]}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Results */}
              <div className="mb-6">
                <p className="text-muted-foreground">
                  {filteredCourses.length} courses found
                </p>
              </div>

              {/* Course Grid/List */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-48 bg-muted"></div>
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
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-6"
                }>
                  {filteredCourses.map((course) => (
                    viewMode === 'grid' 
                      ? <CourseCard key={course.id} course={course} />
                      : <CourseListItem key={course.id} course={course} />
                  ))}
                </div>
              )}

              {filteredCourses.length === 0 && !loading && (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No courses found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}