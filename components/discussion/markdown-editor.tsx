"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { 
  Bold, 
  Italic, 
  Link, 
  Code, 
  List, 
  ListOrdered, 
  Quote, 
  Image,
  Eye,
  EyeOff,
  Upload,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-hot-toast"
import { discussionApi } from "@/lib/discussion-api"

// Dynamically import ReactMarkdown to avoid SSR issues
const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false })

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  showPreview?: boolean
  allowFileUpload?: boolean
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder = "Write your message...",
  minHeight = 200,
  showPreview = true,
  allowFileUpload = true
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = React.useState<'write' | 'preview'>('write')
  const [uploadedFiles, setUploadedFiles] = React.useState<Array<{ url: string; filename: string }>>([])
  const [uploading, setUploading] = React.useState(false)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const insertMarkdown = (before: string, after: string = '', placeholder: string = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const textToInsert = selectedText || placeholder
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end)
    
    onChange(newText)
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + textToInsert.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(file => discussionApi.uploadAttachment(file))
      const results = await Promise.all(uploadPromises)
      
      const newFiles = results.map(result => result.data)
      setUploadedFiles(prev => [...prev, ...newFiles])
      
      // Insert markdown for uploaded files
      const markdownText = newFiles.map(file => {
        if (file.filename.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return `![${file.filename}](${file.url})`
        } else {
          return `[${file.filename}](${file.url})`
        }
      }).join('\n')
      
      onChange(value + '\n' + markdownText)
      toast.success(`${newFiles.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**', 'bold text'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*', 'italic text'), tooltip: 'Italic' },
    { icon: Code, action: () => insertMarkdown('`', '`', 'code'), tooltip: 'Inline Code' },
    { icon: Link, action: () => insertMarkdown('[', '](url)', 'link text'), tooltip: 'Link' },
    { icon: List, action: () => insertMarkdown('- ', '', 'list item'), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. ', '', 'list item'), tooltip: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('> ', '', 'quote'), tooltip: 'Quote' },
    { icon: Image, action: () => insertMarkdown('![', '](url)', 'alt text'), tooltip: 'Image' },
  ]

  return (
    <Card className="border-0 shadow-lg">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'write' | 'preview')}>
          <div className="flex items-center justify-between border-b border-border p-3">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="write">Write</TabsTrigger>
              {showPreview && <TabsTrigger value="preview">Preview</TabsTrigger>}
            </TabsList>
            
            <div className="flex items-center space-x-1">
              {allowFileUpload && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                </>
              )}
            </div>
          </div>

          <TabsContent value="write" className="m-0">
            {/* Toolbar */}
            <div className="flex items-center space-x-1 p-3 border-b border-border bg-muted/30">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  title={button.tooltip}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Editor */}
            <div className="p-3">
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="min-h-[200px] border-0 resize-none focus-visible:ring-0 text-sm font-mono"
                style={{ minHeight }}
              />
              
              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Uploaded Files:</p>
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-2 bg-muted rounded-lg"
                    >
                      <span className="text-sm truncate">{file.filename}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {showPreview && (
            <TabsContent value="preview" className="m-0">
              <div className="p-6" style={{ minHeight }}>
                {value ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{value}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-muted-foreground italic">Nothing to preview</p>
                )}
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}