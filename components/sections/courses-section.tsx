"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Code, 
  Palette, 
  BarChart, 
  Camera, 
  Music, 
  Globe,
  ArrowRight,
  Clock,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const categories = [
  {
    icon: Code,
    title: "Programming & Development",
    description: "Master the latest technologies and frameworks",
    courses: 45,
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Design & Creative",
    description: "Unleash your creativity with professional design tools",
    courses: 32,
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: BarChart,
    title: "Business & Marketing",
    description: "Build your business acumen and marketing skills",
    courses: 28,
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: Camera,
    title: "Photography & Video",
    description: "Capture and create stunning visual content",
    courses: 24,
    color: "from-orange-500 to-red-500"
  },
  {
    icon: Music,
    title: "Music & Audio",
    description: "Learn music production and audio engineering",
    courses: 18,
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Globe,
    title: "Languages & Culture",
    description: "Explore new languages and cultural perspectives",
    courses: 35,
    color: "from-teal-500 to-cyan-500"
  }
]

const featuredCourses = [
  {
    title: "Complete Web Development Bootcamp",
    instructor: "Dr. Sarah Johnson",
    duration: "40 hours",
    students: "12,453",
    rating: 4.9,
    price: "$89",
    image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    title: "UI/UX Design Masterclass",
    instructor: "Mike Chen",
    duration: "25 hours",
    students: "8,291",
    rating: 4.8,
    price: "$79",
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    title: "Digital Marketing Strategy",
    instructor: "Emma Williams",
    duration: "15 hours",
    students: "15,672",
    rating: 4.7,
    price: "$69",
    image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
]

export function CoursesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Explore <span className="text-primary">Course Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover courses across various disciplines and skill levels to advance your career.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${category.color} rounded-full mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {category.description}
                  </CardDescription>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {category.courses} Courses
                  </Badge>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Featured Courses */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Featured Courses
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join thousands of students in our most popular and highly-rated courses.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-primary text-primary-foreground">
                      {course.price}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">by {course.instructor}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm font-medium">{course.rating}</span>
                    </div>
                    <Button size="sm" variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      View Course
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Button size="lg" asChild>
            <Link href="/courses">
              View All Courses
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}