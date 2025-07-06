"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "Tech Corp",
    image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "EduFlow transformed my career! The courses are incredibly well-structured and the instructors are world-class. I landed my dream job within 3 months of completing the program.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "UX Designer",
    company: "Design Studio",
    image: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "The design courses on EduFlow are outstanding. The practical projects and real-world applications helped me build a portfolio that impressed employers.",
    rating: 5
  },
  {
    name: "Emily Davis",
    role: "Marketing Manager",
    company: "StartupCo",
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "I've tried many online learning platforms, but EduFlow stands out. The interactive content and community support made learning enjoyable and effective.",
    rating: 5
  },
  {
    name: "David Wilson",
    role: "Data Scientist",
    company: "Analytics Inc",
    image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "The data science track exceeded my expectations. The hands-on projects and expert guidance helped me transition from finance to tech successfully.",
    rating: 5
  },
  {
    name: "Lisa Thompson",
    role: "Product Manager",
    company: "Innovation Labs",
    image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "EduFlow's business courses provided me with the strategic thinking and leadership skills I needed to advance in my career. Highly recommended!",
    rating: 5
  },
  {
    name: "Alex Rodriguez",
    role: "Frontend Developer",
    company: "WebTech",
    image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150",
    content: "The coding bootcamp was intensive but incredibly rewarding. The curriculum is up-to-date with industry standards and the support is phenomenal.",
    rating: 5
  }
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            What Our <span className="text-primary">Students Say</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful learners who have transformed their careers with EduFlow.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <Card className="border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8 md:p-12">
              <div className="flex items-center justify-center mb-6">
                <Quote className="h-8 w-8 text-primary/50" />
              </div>
              <blockquote className="text-lg md:text-xl text-center text-muted-foreground leading-relaxed mb-8">
                "{testimonials[currentIndex].content}"
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                  <AvatarFallback>{testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-semibold text-foreground">{testimonials[currentIndex].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role} at {testimonials[currentIndex].company}</p>
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center space-x-2 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-primary' : 'bg-primary/20'
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/30 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground leading-relaxed mb-6">
                    "{testimonial.content}"
                  </blockquote>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}