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
import { motion } from "framer-motion"
import {
  GripVertical,
  Plus,
  Trash2,
  Edit,
  Copy
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { QuizQuestion } from '@/lib/assessment-api'

interface DragDropQuestionsProps {
  questions: QuizQuestion[]
  onQuestionsChange: (questions: QuizQuestion[]) => void
  onEditQuestion: (question: QuizQuestion) => void
  onDeleteQuestion: (questionId: number) => void
}

export function DragDropQuestions({ 
  questions, 
  onQuestionsChange, 
  onEditQuestion, 
  onDeleteQuestion 
}: DragDropQuestionsProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id)
      const newIndex = questions.findIndex(q => q.id === over?.id)
      
      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
        ...q,
        order: index + 1
      }))
      
      onQuestionsChange(reorderedQuestions)
    }
  }

  const duplicateQuestion = (question: QuizQuestion) => {
    const newQuestion: QuizQuestion = {
      ...question,
      id: Date.now(), // Temporary ID
      question_text: `${question.question_text} (Copy)`,
    }
    onQuestionsChange([...questions, newQuestion])
  }

  const getQuestionTypeColor = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'bg-blue-100 text-blue-800'
      case 'true_false':
        return 'bg-green-100 text-green-800'
      case 'short_answer':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'multiple_choice':
        return 'Multiple Choice'
      case 'true_false':
        return 'True/False'
      case 'short_answer':
        return 'Short Answer'
      default:
        return type
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Quiz Questions ({questions.length})</h3>
        <p className="text-sm text-muted-foreground">
          Drag and drop to reorder questions
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {questions.map((question, index) => (
              <SortableQuestion
                key={question.id}
                question={question}
                index={index}
                onEdit={() => onEditQuestion(question)}
                onDelete={() => onDeleteQuestion(question.id)}
                onDuplicate={() => duplicateQuestion(question)}
                getQuestionTypeColor={getQuestionTypeColor}
                getQuestionTypeLabel={getQuestionTypeLabel}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {questions.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No questions added yet</p>
          <p className="text-sm text-muted-foreground">Add questions to start building your quiz</p>
        </div>
      )}
    </div>
  )
}

function SortableQuestion({
  question,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  getQuestionTypeColor,
  getQuestionTypeLabel
}: {
  question: QuizQuestion
  index: number
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
  getQuestionTypeColor: (type: string) => string
  getQuestionTypeLabel: (type: string) => string
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${isDragging ? 'opacity-50' : ''}`}
    >
      <Card className="group hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            
            <Badge variant="outline" className="text-xs">
              Q{index + 1}
            </Badge>
            
            <Badge className={getQuestionTypeColor(question.type)}>
              {getQuestionTypeLabel(question.type)}
            </Badge>
            
            <div className="flex-1" />
            
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={onDuplicate}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="font-medium">{question.question_text}</p>
            
            {question.type === 'multiple_choice' && question.options && (
                <div className="space-y-2">
                {question.options.map((option: string, optionIndex: number) => (
                  <div 
                  key={optionIndex} 
                  className={`p-2 rounded border text-sm ${
                    option === question.correct_answer 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-muted/50'
                  }`}
                  >
                  <span className="font-medium mr-2">{String.fromCharCode(65 + optionIndex)}.</span>
                  {option}
                  {option === question.correct_answer && (
                    <Badge variant="outline" className="ml-2 text-xs bg-green-100 text-green-800">
                    Correct
                    </Badge>
                  )}
                  </div>
                ))}
                </div>
            )}
            
            {question.type === 'true_false' && (
              <div className="flex space-x-2">
                <Badge variant={question.correct_answer === 'true' ? 'default' : 'outline'}>
                  True {question.correct_answer === 'true' && '✓'}
                </Badge>
                <Badge variant={question.correct_answer === 'false' ? 'default' : 'outline'}>
                  False {question.correct_answer === 'false' && '✓'}
                </Badge>
              </div>
            )}
            
            {question.type === 'short_answer' && (
              <div className="p-2 bg-muted/50 rounded border">
                <span className="text-sm text-muted-foreground">Expected answer: </span>
                <span className="text-sm font-medium">{question.correct_answer}</span>
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Points: {question.points}</span>
              <span>Question {index + 1}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}