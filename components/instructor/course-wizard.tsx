"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload,
  Plus,
  Trash2,
  GripVertical,
  Play,
  FileText,
  Link as LinkIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "react-hot-toast"
import { RichTextEditor } from "./rich-text-editor"
import { DragDropCourseBuilder } from "./drag-drop-course-builder"
import { FileUpload } from "./file-upload"

const steps = [
  { id: 1, title: "Basic Information", description: "Course title, description, and category" },
  { id: 2, title: "Course Structure", description: "Sections and lectures organization" },
  { id: 3, title: "Content Upload", description: "Videos, documents, and resources" },
  { id: 4, title: "Assessments", description: "Quizzes and assignments" },
  { id: 5, title: "Settings & Publish", description: "Price, visibility, and publication" },
]

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

interface CourseWizardProps {
  onComplete: (courseData: any) => void
  onCancel: () => void
}

export function CourseWizard({ onComplete, onCancel }: CourseWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1)
  const [courseData, setCourseData] = React.useState({
    title: "",
    description: "",
    category: "",
    price: 0,
    status: "draft",
    sections: [] as any[],
    assessments: [] as any[],
    settings: {
      visibility: "public",
      enrollment: "open",
      certificate: true
    }
  })

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    onComplete(courseData)
  }

  const updateCourseData = (field: string, value: any) => {
    setCourseData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInformationStep courseData={courseData} updateCourseData={updateCourseData} />
      case 2:
        return <CourseStructureStep courseData={courseData} updateCourseData={updateCourseData} />
      case 3:
        return <ContentUploadStep courseData={courseData} updateCourseData={updateCourseData} />
      case 4:
        return <AssessmentsStep courseData={courseData} updateCourseData={updateCourseData} />
      case 5:
        return <SettingsStep courseData={courseData} updateCourseData={updateCourseData} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep > step.id 
                  ? 'bg-primary border-primary text-primary-foreground'
                  : currentStep === step.id
                  ? 'border-primary text-primary'
                  : 'border-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          {renderStepContent()}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          {currentStep === steps.length ? (
            <Button onClick={handleComplete}>
              Create Course
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Step Components
function BasicInformationStep({ courseData, updateCourseData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
        <CardDescription>
          Provide basic information about your course
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title</Label>
          <Input
            id="title"
            value={courseData.title}
            onChange={(e) => updateCourseData('title', e.target.value)}
            placeholder="Enter course title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={courseData.category} onValueChange={(value) => updateCourseData('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <RichTextEditor
            value={courseData.description}
            onChange={(value) => updateCourseData('description', value)}
            placeholder="Describe your course..."
          />
        </div>
      </CardContent>
    </Card>
  )
}

function CourseStructureStep({ courseData, updateCourseData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Structure</CardTitle>
        <CardDescription>
          Organize your course into sections and lectures
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropCourseBuilder
          sections={courseData.sections}
          onSectionsChange={(sections) => updateCourseData('sections', sections)}
        />
      </CardContent>
    </Card>
  )
}

function ContentUploadStep({ courseData, updateCourseData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Upload</CardTitle>
        <CardDescription>
          Upload videos, documents, and other resources
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <FileUpload
            accept="video/*"
            multiple
            onUpload={(files) => {
              toast.success(`${files.length} video(s) uploaded successfully`)
            }}
            title="Upload Videos"
            description="Upload course videos (MP4, MOV, AVI)"
          />
          
          <Separator />
          
          <FileUpload
            accept=".pdf,.doc,.docx,.ppt,.pptx"
            multiple
            onUpload={(files) => {
              toast.success(`${files.length} document(s) uploaded successfully`)
            }}
            title="Upload Documents"
            description="Upload course materials (PDF, DOC, PPT)"
          />
          
          <Separator />
          
          <FileUpload
            accept="image/*"
            multiple
            onUpload={(files) => {
              toast.success(`${files.length} image(s) uploaded successfully`)
            }}
            title="Upload Images"
            description="Upload course images and graphics"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function AssessmentsStep({ courseData, updateCourseData }: any) {
  const [assessments, setAssessments] = React.useState(courseData.assessments || [])

  const addAssessment = () => {
    const newAssessment = {
      id: Date.now(),
      title: "",
      type: "quiz",
      questions: []
    }
    const updated = [...assessments, newAssessment]
    setAssessments(updated)
    updateCourseData('assessments', updated)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessments</CardTitle>
        <CardDescription>
          Create quizzes and assignments for your course
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment: any, index: number) => (
            <div key={assessment.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Input
                  placeholder="Assessment title"
                  value={assessment.title}
                  onChange={(e) => {
                    const updated = [...assessments]
                    updated[index].title = e.target.value
                    setAssessments(updated)
                    updateCourseData('assessments', updated)
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const updated = assessments.filter((_: any, i: number) => i !== index)
                    setAssessments(updated)
                    updateCourseData('assessments', updated)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <Select
                value={assessment.type}
                onValueChange={(value) => {
                  const updated = [...assessments]
                  updated[index].type = value
                  setAssessments(updated)
                  updateCourseData('assessments', updated)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <Button onClick={addAssessment} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function SettingsStep({ courseData, updateCourseData }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
        <CardDescription>
          Configure pricing, visibility, and publication settings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={courseData.price}
            onChange={(e) => updateCourseData('price', parseFloat(e.target.value) || 0)}
            placeholder="0.00"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Visibility</Label>
          <Select 
            value={courseData.settings.visibility} 
            onValueChange={(value) => updateCourseData('settings', { ...courseData.settings, visibility: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="unlisted">Unlisted</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Enrollment</Label>
          <Select 
            value={courseData.settings.enrollment} 
            onValueChange={(value) => updateCourseData('settings', { ...courseData.settings, enrollment: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open Enrollment</SelectItem>
              <SelectItem value="approval">Requires Approval</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="certificate"
            checked={courseData.settings.certificate}
            onChange={(e) => updateCourseData('settings', { ...courseData.settings, certificate: e.target.checked })}
          />
          <Label htmlFor="certificate">Provide completion certificate</Label>
        </div>
      </CardContent>
    </Card>
  )
}