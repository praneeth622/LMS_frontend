"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  Trophy, 
  Download, 
  Share2, 
  Eye, 
  Calendar, 
  BookOpen,
  Star,
  Award,
  Medal,
  Search,
  Filter,
  ExternalLink,
  Copy,
  Check
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { StudentSidebar } from '@/components/student/sidebar'
import { StudentHeader } from '@/components/student/header'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from '@/contexts/auth-context'
import { toast } from "sonner"
import Link from "next/link"

interface Certificate {
  id: number
  course: {
    id: number
    title: string
    instructor: string
    category: string
    level: 'beginner' | 'intermediate' | 'advanced'
  }
  issued_date: string
  certificate_url: string
  verification_code: string
  grade: number
  completion_time: number // in hours
  skills: string[]
  type: 'completion' | 'achievement' | 'excellence'
}

export default function StudentCertificates() {
  const { userProfile } = useAuth()
  const [certificates, setCertificates] = React.useState<Certificate[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [typeFilter, setTypeFilter] = React.useState("all")
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null)

  // Mock data - replace with actual API calls
  React.useEffect(() => {
    const mockCertificates: Certificate[] = [
      {
        id: 1,
        course: {
          id: 1,
          title: "Complete Web Development Bootcamp",
          instructor: "John Smith",
          category: "Programming",
          level: "intermediate"
        },
        issued_date: "2024-12-15T10:00:00Z",
        certificate_url: "https://example.com/certificates/cert-001.pdf",
        verification_code: "WDB-2024-001-ABC123",
        grade: 92,
        completion_time: 120,
        skills: ["HTML", "CSS", "JavaScript", "React", "Node.js"],
        type: "excellence"
      },
      {
        id: 2,
        course: {
          id: 2,
          title: "JavaScript Fundamentals",
          instructor: "Sarah Johnson",
          category: "Programming",
          level: "beginner"
        },
        issued_date: "2024-11-20T14:30:00Z",
        certificate_url: "https://example.com/certificates/cert-002.pdf",
        verification_code: "JSF-2024-002-DEF456",
        grade: 88,
        completion_time: 40,
        skills: ["JavaScript", "ES6", "DOM Manipulation", "Async Programming"],
        type: "completion"
      },
      {
        id: 3,
        course: {
          id: 3,
          title: "UI/UX Design Principles",
          instructor: "Mike Chen",
          category: "Design",
          level: "intermediate"
        },
        issued_date: "2024-10-10T16:45:00Z",
        certificate_url: "https://example.com/certificates/cert-003.pdf",
        verification_code: "UXD-2024-003-GHI789",
        grade: 95,
        completion_time: 60,
        skills: ["User Research", "Wireframing", "Prototyping", "Figma", "Design Systems"],
        type: "achievement"
      }
    ]

    setTimeout(() => {
      setCertificates(mockCertificates)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredCertificates = certificates.filter(certificate => {
    const matchesSearch = certificate.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         certificate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = categoryFilter === "all" || certificate.course.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesType = typeFilter === "all" || certificate.type === typeFilter
    
    return matchesSearch && matchesCategory && matchesType
  })

  const getCertificateIcon = (type: string) => {
    switch (type) {
      case 'excellence': return Trophy
      case 'achievement': return Award
      case 'completion': return Medal
      default: return Trophy
    }
  }

  const getCertificateColor = (type: string) => {
    switch (type) {
      case 'excellence': return 'text-yellow-600 bg-yellow-100'
      case 'achievement': return 'text-purple-600 bg-purple-100'
      case 'completion': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'beginner': return <Badge variant="secondary">Beginner</Badge>
      case 'intermediate': return <Badge variant="default">Intermediate</Badge>
      case 'advanced': return <Badge variant="destructive">Advanced</Badge>
      default: return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDownload = async (certificate: Certificate) => {
    try {
      // Mock download - replace with actual download logic
      const link = document.createElement('a')
      link.href = certificate.certificate_url
      link.download = `${certificate.course.title.replace(/\s+/g, '_')}_Certificate.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Certificate downloaded successfully!")
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error("Failed to download certificate")
    }
  }

  const handleShare = async (certificate: Certificate) => {
    const shareData = {
      title: `${certificate.course.title} Certificate`,
      text: `I've completed ${certificate.course.title} and earned a certificate!`,
      url: `${window.location.origin}/certificates/verify/${certificate.verification_code}`
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(shareData.url)
        toast.success("Certificate link copied to clipboard!")
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
      toast.error("Failed to share certificate")
    }
  }

  const handleCopyVerificationCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      toast.success("Verification code copied!")
      
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error('Error copying code:', error)
      toast.error("Failed to copy verification code")
    }
  }

  const getUniqueCategories = () => {
    const categories = certificates.reduce((acc, cert) => {
      if (!acc.includes(cert.course.category)) {
        acc.push(cert.course.category)
      }
      return acc
    }, [] as string[])
    return categories
  }

  const getCertificateStats = () => {
    const total = certificates.length
    const excellence = certificates.filter(c => c.type === 'excellence').length
    const avgGrade = certificates.reduce((acc, c) => acc + c.grade, 0) / (certificates.length || 1)
    const totalHours = certificates.reduce((acc, c) => acc + c.completion_time, 0)
    
    return { total, excellence, avgGrade: Math.round(avgGrade), totalHours }
  }

  const stats = getCertificateStats()

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="flex h-screen bg-background">
        <StudentSidebar 
          
          
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <StudentHeader 
            title="Certificates"
            subtitle="View and manage your earned certificates"
          />
          
          <main className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Certificates</p>
                        <p className="text-2xl font-bold">{stats.total}</p>
                      </div>
                      <Trophy className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Excellence Awards</p>
                        <p className="text-2xl font-bold text-yellow-600">{stats.excellence}</p>
                      </div>
                      <Award className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Average Grade</p>
                        <p className="text-2xl font-bold text-green-600">{stats.avgGrade}%</p>
                      </div>
                      <Star className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Learning Hours</p>
                        <p className="text-2xl font-bold text-blue-600">{stats.totalHours}h</p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search certificates..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {getUniqueCategories().map(category => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full sm:w-[150px]">
                        <SelectValue placeholder="Filter by type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="completion">Completion</SelectItem>
                        <SelectItem value="achievement">Achievement</SelectItem>
                        <SelectItem value="excellence">Excellence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Certificates Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-muted rounded-full"></div>
                            <div className="flex-1 space-y-2">
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-3 bg-muted rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="h-20 bg-muted rounded"></div>
                          <div className="flex space-x-2">
                            <div className="h-8 bg-muted rounded w-20"></div>
                            <div className="h-8 bg-muted rounded w-20"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : filteredCertificates.length === 0 ? (
                  <div className="col-span-full">
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No certificates found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || categoryFilter !== "all" || typeFilter !== "all" 
                            ? "Try adjusting your filters" 
                            : "Complete courses to earn certificates"}
                        </p>
                        <Button asChild>
                          <Link href="/student/courses">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Browse Courses
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  filteredCertificates.map((certificate, index) => {
                    const CertificateIcon = getCertificateIcon(certificate.type)
                    const iconColorClass = getCertificateColor(certificate.type)
                    
                    return (
                      <motion.div
                        key={certificate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-3 rounded-full ${iconColorClass}`}>
                                  <CertificateIcon className="h-6 w-6" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{certificate.course.title}</CardTitle>
                                  <CardDescription>
                                    by {certificate.course.instructor} • {certificate.course.category}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getLevelBadge(certificate.course.level)}
                                <Badge variant="outline" className="capitalize">
                                  {certificate.type}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            {/* Certificate Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Issued Date</p>
                                <p className="font-medium">{formatDate(certificate.issued_date)}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Grade</p>
                                <p className="font-medium text-green-600">{certificate.grade}%</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Completion Time</p>
                                <p className="font-medium">{certificate.completion_time} hours</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Verification</p>
                                <div className="flex items-center space-x-1">
                                  <code className="text-xs bg-muted px-1 py-0.5 rounded">
                                    {certificate.verification_code.slice(0, 8)}...
                                  </code>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleCopyVerificationCode(certificate.verification_code)}
                                    className="h-6 w-6 p-0"
                                  >
                                    {copiedCode === certificate.verification_code ? (
                                      <Check className="h-3 w-3 text-green-600" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>

                            {/* Skills */}
                            <div>
                              <p className="text-sm text-muted-foreground mb-2">Skills Acquired</p>
                              <div className="flex flex-wrap gap-1">
                                {certificate.skills.map((skill, skillIndex) => (
                                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex space-x-2">
                                <Button size="sm" onClick={() => handleDownload(certificate)}>
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleShare(certificate)}>
                                  <Share2 className="h-4 w-4 mr-1" />
                                  Share
                                </Button>
                              </div>
                              
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Eye className="h-4 w-4 mr-1" />
                                    Preview
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Certificate Preview</DialogTitle>
                                    <DialogDescription>
                                      {certificate.course.title} - {certificate.course.instructor}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center">
                                      <div className="text-center space-y-2">
                                        <CertificateIcon className="h-12 w-12 mx-auto text-primary" />
                                        <p className="text-lg font-semibold">Certificate of {certificate.type}</p>
                                        <p className="text-sm text-muted-foreground">
                                          This is a preview. Download the full certificate for the complete design.
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex justify-between">
                                      <Button onClick={() => handleDownload(certificate)}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Full Certificate
                                      </Button>
                                      <Button variant="outline" asChild>
                                        <a href={certificate.certificate_url} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="h-4 w-4 mr-2" />
                                          View Original
                                        </a>
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}