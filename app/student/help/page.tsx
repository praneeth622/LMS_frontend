"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone,
  FileText,
  Video,
  Users,
  ChevronRight,
  ExternalLink,
  Download,
  Clock,
  CheckCircle
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { useAuth } from '@/contexts/auth-context'
import Link from "next/link"

interface FAQItem {
  id: number
  question: string
  answer: string
  category: string
  helpful: number
}

interface SupportArticle {
  id: number
  title: string
  description: string
  category: string
  readTime: number
  url: string
}

interface ContactOption {
  id: number
  title: string
  description: string
  icon: any
  action: string
  available: boolean
  responseTime: string
}

export default function StudentHelp() {
  const { userProfile } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("all")

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, navigate to the 'My Courses' section, browse available courses, and click the 'Enroll' button on the course you're interested in. Some courses may require payment or prerequisites.",
      category: "enrollment",
      helpful: 45
    },
    {
      id: 2,
      question: "How do I submit an assignment?",
      answer: "Go to the 'Assignments' section, find your assignment, and click 'Submit'. You can upload files, paste URLs, or write text directly. Make sure to submit before the deadline.",
      category: "assignments",
      helpful: 38
    },
    {
      id: 3,
      question: "Can I download my certificates?",
      answer: "Yes! Visit the 'Certificates' section to view and download all your earned certificates. You can also share them on social media or include verification codes.",
      category: "certificates",
      helpful: 52
    },
    {
      id: 4,
      question: "How do I reset my password?",
      answer: "Click on 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password.",
      category: "account",
      helpful: 29
    },
    {
      id: 5,
      question: "How do I track my progress?",
      answer: "Your progress is automatically tracked as you complete lectures, assignments, and quizzes. Check the 'Progress' section or your dashboard for detailed analytics.",
      category: "progress",
      helpful: 41
    },
    {
      id: 6,
      question: "Can I access courses offline?",
      answer: "Currently, courses require an internet connection. However, you can download course materials and certificates for offline viewing.",
      category: "technical",
      helpful: 33
    }
  ]

  const supportArticles: SupportArticle[] = [
    {
      id: 1,
      title: "Getting Started Guide",
      description: "Complete guide for new students to navigate the platform",
      category: "getting-started",
      readTime: 5,
      url: "/help/getting-started"
    },
    {
      id: 2,
      title: "Assignment Submission Best Practices",
      description: "Tips for successful assignment submissions and avoiding common mistakes",
      category: "assignments",
      readTime: 3,
      url: "/help/assignment-tips"
    },
    {
      id: 3,
      title: "Understanding Your Progress Dashboard",
      description: "Learn how to interpret your learning analytics and progress metrics",
      category: "progress",
      readTime: 4,
      url: "/help/progress-dashboard"
    },
    {
      id: 4,
      title: "Troubleshooting Video Playback",
      description: "Solutions for common video and audio playback issues",
      category: "technical",
      readTime: 2,
      url: "/help/video-troubleshooting"
    }
  ]

  const contactOptions: ContactOption[] = [
    {
      id: 1,
      title: "Live Chat",
      description: "Get instant help from our support team",
      icon: MessageSquare,
      action: "Start Chat",
      available: true,
      responseTime: "Usually responds in a few minutes"
    },
    {
      id: 2,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      icon: Mail,
      action: "Send Email",
      available: true,
      responseTime: "Usually responds within 24 hours"
    },
    {
      id: 3,
      title: "Phone Support",
      description: "Speak directly with a support representative",
      icon: Phone,
      action: "Call Now",
      available: false,
      responseTime: "Available Mon-Fri 9AM-5PM EST"
    },
    {
      id: 4,
      title: "Community Forum",
      description: "Ask questions and get help from other students",
      icon: Users,
      action: "Visit Forum",
      available: true,
      responseTime: "Community-driven responses"
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "enrollment", label: "Enrollment" },
    { value: "assignments", label: "Assignments" },
    { value: "certificates", label: "Certificates" },
    { value: "account", label: "Account" },
    { value: "progress", label: "Progress" },
    { value: "technical", label: "Technical" }
  ]

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Help & Support"
            subtitle="Find answers and get help when you need it"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Search Section */}
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h1 className="text-2xl font-bold mb-2">How can we help you?</h1>
                  <p className="text-muted-foreground mb-6">
                    Search our knowledge base or browse categories below
                  </p>
                  <div className="max-w-md mx-auto">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for help..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="faq" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="faq">FAQ</TabsTrigger>
                  <TabsTrigger value="guides">Guides</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                </TabsList>

                {/* FAQ Tab */}
                <TabsContent value="faq" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>
                        Find quick answers to common questions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Category Filter */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {categories.map((category) => (
                          <Button
                            key={category.value}
                            variant={selectedCategory === category.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category.value)}
                          >
                            {category.label}
                          </Button>
                        ))}
                      </div>

                      {/* FAQ Accordion */}
                      <Accordion type="single" collapsible className="space-y-2">
                        {filteredFAQs.map((faq) => (
                          <AccordionItem key={faq.id} value={faq.id.toString()}>
                            <AccordionTrigger className="text-left">
                              <div className="flex items-center justify-between w-full mr-4">
                                <span>{faq.question}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {faq.helpful} helpful
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-2">
                                <p className="text-muted-foreground mb-4">{faq.answer}</p>
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm text-muted-foreground">Was this helpful?</span>
                                  <Button size="sm" variant="outline">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Yes
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    No
                                  </Button>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {filteredFAQs.length === 0 && (
                        <div className="text-center py-8">
                          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-foreground mb-2">No FAQs found</h3>
                          <p className="text-muted-foreground">
                            Try adjusting your search or category filter
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Guides Tab */}
                <TabsContent value="guides" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {supportArticles.map((article) => (
                      <Card key={article.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{article.title}</CardTitle>
                              <CardDescription className="mt-2">
                                {article.description}
                              </CardDescription>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {article.readTime} min read
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={article.url}>
                              <BookOpen className="mr-2 h-4 w-4" />
                              Read Guide
                              <ChevronRight className="ml-auto h-4 w-4" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Video Tutorials</CardTitle>
                      <CardDescription>
                        Watch step-by-step video guides
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Platform Overview</p>
                            <p className="text-xs text-muted-foreground">5:30</p>
                          </div>
                        </div>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Submitting Assignments</p>
                            <p className="text-xs text-muted-foreground">3:45</p>
                          </div>
                        </div>
                        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm font-medium">Using Discussions</p>
                            <p className="text-xs text-muted-foreground">4:20</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Contact Tab */}
                <TabsContent value="contact" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contactOptions.map((option) => (
                      <Card key={option.id} className={`${!option.available ? 'opacity-60' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <option.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{option.title}</CardTitle>
                              <CardDescription>{option.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {option.responseTime}
                            </div>
                            <Button 
                              className="w-full" 
                              disabled={!option.available}
                              variant={option.available ? "default" : "outline"}
                            >
                              {option.action}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Before You Contact Us</CardTitle>
                      <CardDescription>
                        Help us help you better by providing these details
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">For Technical Issues:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Your browser and version</li>
                            <li>• Operating system</li>
                            <li>• Steps to reproduce the issue</li>
                            <li>�� Error messages (if any)</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">For Course Issues:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Course name and section</li>
                            <li>• Assignment or quiz details</li>
                            <li>• Your student ID</li>
                            <li>• Screenshots (if applicable)</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Resources Tab */}
                <TabsContent value="resources" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Download className="mr-2 h-5 w-5" />
                          Downloads
                        </CardTitle>
                        <CardDescription>
                          Useful files and resources
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Student Handbook (PDF)
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Quick Reference Guide
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <FileText className="mr-2 h-4 w-4" />
                          Keyboard Shortcuts
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <ExternalLink className="mr-2 h-5 w-5" />
                          External Links
                        </CardTitle>
                        <CardDescription>
                          Helpful external resources
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href="https://status.example.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            System Status
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href="https://blog.example.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Learning Blog
                          </a>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <a href="https://community.example.com" target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Community Forum
                          </a>
                        </Button>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="mr-2 h-5 w-5" />
                          Community
                        </CardTitle>
                        <CardDescription>
                          Connect with other students
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/student/discussions">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Discussion Forums
                          </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="mr-2 h-4 w-4" />
                          Study Groups
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Peer Support
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>System Requirements</CardTitle>
                      <CardDescription>
                        Minimum requirements for the best learning experience
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Supported Browsers</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span>Chrome</span>
                              <Badge variant="outline">v90+</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Firefox</span>
                              <Badge variant="outline">v88+</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Safari</span>
                              <Badge variant="outline">v14+</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span>Edge</span>
                              <Badge variant="outline">v90+</Badge>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-3">Technical Requirements</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Stable internet connection (5+ Mbps recommended)</li>
                            <li>• JavaScript enabled</li>
                            <li>• Cookies enabled</li>
                            <li>• Audio/video playback support</li>
                            <li>• PDF viewer for course materials</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}