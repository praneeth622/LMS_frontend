"use client"

import * as React from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from "framer-motion"
import {
  GripVertical,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Play,
  FileText,
  Edit,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Lecture {
  id: string
  title: string
  type: 'video' | 'text' | 'quiz' | 'assignment'
  duration?: number
  content?: string
}

interface Section {
  id: string
  title: string
  lectures: Lecture[]
  isOpen?: boolean
}

interface DragDropCourseBuilderProps {
  sections: Section[]
  onSectionsChange: (sections: Section[]) => void
}

export function DragDropCourseBuilder({ sections, onSectionsChange }: DragDropCourseBuilderProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: "New Section",
      lectures: [],
      isOpen: true
    }
    onSectionsChange([...sections, newSection])
  }

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId ? { ...section, ...updates } : section
    )
    onSectionsChange(updatedSections)
  }

  const deleteSection = (sectionId: string) => {
    const updatedSections = sections.filter(section => section.id !== sectionId)
    onSectionsChange(updatedSections)
  }

  const addLecture = (sectionId: string) => {
    const newLecture: Lecture = {
      id: `lecture-${Date.now()}`,
      title: "New Lecture",
      type: 'video',
      duration: 0
    }
    
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? { ...section, lectures: [...section.lectures, newLecture] }
        : section
    )
    onSectionsChange(updatedSections)
  }

  const updateLecture = (sectionId: string, lectureId: string, updates: Partial<Lecture>) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.map(lecture =>
              lecture.id === lectureId ? { ...lecture, ...updates } : lecture
            )
          }
        : section
    )
    onSectionsChange(updatedSections)
  }

  const deleteLecture = (sectionId: string, lectureId: string) => {
    const updatedSections = sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lectures: section.lectures.filter(lecture => lecture.id !== lectureId)
          }
        : section
    )
    onSectionsChange(updatedSections)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id)
      const newIndex = sections.findIndex(section => section.id === over?.id)
      
      onSectionsChange(arrayMove(sections, oldIndex, newIndex))
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Course Structure</h3>
        <Button onClick={addSection}>
          <Plus className="mr-2 h-4 w-4" />
          Add Section
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SortableSection
                key={section.id}
                section={section}
                index={index}
                onUpdate={(updates) => updateSection(section.id, updates)}
                onDelete={() => deleteSection(section.id)}
                onAddLecture={() => addLecture(section.id)}
                onUpdateLecture={(lectureId, updates) => updateLecture(section.id, lectureId, updates)}
                onDeleteLecture={(lectureId) => deleteLecture(section.id, lectureId)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {sections.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No sections yet. Start building your course structure.</p>
          <Button onClick={addSection}>
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Section
          </Button>
        </div>
      )}
    </div>
  )
}

function SortableSection({
  section,
  index,
  onUpdate,
  onDelete,
  onAddLecture,
  onUpdateLecture,
  onDeleteLecture
}: {
  section: Section
  index: number
  onUpdate: (updates: Partial<Section>) => void
  onDelete: () => void
  onAddLecture: () => void
  onUpdateLecture: (lectureId: string, updates: Partial<Lecture>) => void
  onDeleteLecture: (lectureId: string) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: section.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const totalDuration = section.lectures.reduce((total, lecture) => total + (lecture.duration || 0), 0)

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <Badge variant="outline">Section {index + 1}</Badge>
            
            <Input
              value={section.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="flex-1 border-none bg-transparent p-0 text-lg font-semibold focus-visible:ring-0"
              placeholder="Section title"
            />
            
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{Math.floor(totalDuration / 60)}m</span>
            </div>
            
            <Collapsible open={section.isOpen} onOpenChange={(isOpen) => onUpdate({ isOpen })}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {section.isOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
            
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <Collapsible open={section.isOpen} onOpenChange={(isOpen) => onUpdate({ isOpen })}>
          <CollapsibleContent>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {section.lectures.map((lecture, lectureIndex) => (
                  <LectureItem
                    key={lecture.id}
                    lecture={lecture}
                    index={lectureIndex}
                    onUpdate={(updates) => onUpdateLecture(lecture.id, updates)}
                    onDelete={() => onDeleteLecture(lecture.id)}
                  />
                ))}
                
                <Button
                  variant="outline"
                  onClick={onAddLecture}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Lecture
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  )
}

function LectureItem({
  lecture,
  index,
  onUpdate,
  onDelete
}: {
  lecture: Lecture
  index: number
  onUpdate: (updates: Partial<Lecture>) => void
  onDelete: () => void
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800'
      case 'text':
        return 'bg-green-100 text-green-800'
      case 'quiz':
        return 'bg-purple-100 text-purple-800'
      case 'assignment':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 border rounded-lg bg-muted/30">
      <Badge variant="outline" className="text-xs">
        {index + 1}
      </Badge>
      
      <div className="flex items-center space-x-2">
        {getTypeIcon(lecture.type)}
        <Badge className={getTypeColor(lecture.type)}>
          {lecture.type}
        </Badge>
      </div>
      
      <span className="flex-1 font-medium">{lecture.title}</span>
      
      {lecture.duration && (
        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>{lecture.duration}m</span>
        </div>
      )}
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lecture</DialogTitle>
            <DialogDescription>
              Update lecture information and content
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={lecture.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                placeholder="Lecture title"
              />
            </div>
            <div className="space-y-2">
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={lecture.duration || 0}
                onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={lecture.content || ''}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder="Lecture description or notes"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}