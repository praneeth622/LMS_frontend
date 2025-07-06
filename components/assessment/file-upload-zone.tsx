"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Upload, File, X, CheckCircle, AlertCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface UploadedFile {
  file: File
  progress: number
  status: 'uploading' | 'completed' | 'error'
  id: string
  url?: string
}

interface FileUploadZoneProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  maxFiles?: number
  onFilesUploaded: (files: { file: File; url: string }[]) => void
  disabled?: boolean
}

export function FileUploadZone({
  accept = "*/*",
  multiple = true,
  maxSize = 10,
  maxFiles = 5,
  onFilesUploaded,
  disabled = false
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>([])
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragOver(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    if (disabled) return
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }

  const handleFiles = (files: File[]) => {
    // Check file count limit
    if (uploadedFiles.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }

    // Validate files
    const validFiles = files.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    // Add files to upload queue
    const newUploadedFiles = validFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: `${file.name}-${Date.now()}`
    }))

    setUploadedFiles(prev => [...prev, ...newUploadedFiles])

    // Simulate upload process
    newUploadedFiles.forEach((uploadedFile) => {
      simulateUpload(uploadedFile.id, uploadedFile.file)
    })
  }

  const simulateUpload = (fileId: string, file: File) => {
    const interval = setInterval(() => {
      setUploadedFiles(prev => prev.map(f => {
        if (f.id === fileId) {
          const newProgress = Math.min(f.progress + Math.random() * 30, 100)
          return { ...f, progress: newProgress }
        }
        return f
      }))
    }, 200)

    setTimeout(() => {
      clearInterval(interval)
      setUploadedFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              progress: 100, 
              status: 'completed',
              url: `https://example.com/uploads/${file.name}`
            } 
          : f
      ))

      // Notify parent component
      const completedFile = { file, url: `https://example.com/uploads/${file.name}` }
      onFilesUploaded([completedFile])
    }, 2000 + Math.random() * 2000)
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          disabled 
            ? 'border-muted bg-muted/20 cursor-not-allowed'
            : isDragOver 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50 cursor-pointer'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
      >
        <Upload className={`mx-auto h-12 w-12 mb-4 ${disabled ? 'text-muted-foreground' : 'text-muted-foreground'}`} />
        <div className="space-y-2">
          <p className={`text-lg font-medium ${disabled ? 'text-muted-foreground' : ''}`}>
            {disabled ? 'Upload disabled' : 'Drag and drop files here, or click to browse'}
          </p>
          <p className="text-sm text-muted-foreground">
            Maximum file size: {maxSize}MB • Maximum {maxFiles} files
          </p>
          <p className="text-xs text-muted-foreground">
            {uploadedFiles.length}/{maxFiles} files uploaded
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </motion.div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
          {uploadedFiles.map((uploadedFile) => (
            <motion.div
              key={uploadedFile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <File className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium truncate">
                          {uploadedFile.file.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {uploadedFile.status === 'completed' && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {uploadedFile.status === 'error' && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          {uploadedFile.status === 'completed' && uploadedFile.url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              asChild
                            >
                              <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeFile(uploadedFile.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>{formatFileSize(uploadedFile.file.size)}</span>
                        <Badge variant={
                          uploadedFile.status === 'completed' ? 'default' :
                          uploadedFile.status === 'error' ? 'destructive' : 'secondary'
                        }>
                          {uploadedFile.status === 'uploading' ? 'Uploading...' :
                           uploadedFile.status === 'completed' ? 'Completed' : 'Error'}
                        </Badge>
                      </div>
                      
                      {uploadedFile.status === 'uploading' && (
                        <Progress value={uploadedFile.progress} className="h-1" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}