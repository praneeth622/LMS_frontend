"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Bookmark, 
  BookmarkCheck,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  Menu,
  X
} from "lucide-react"
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "react-hot-toast"
import { studentApi, Course, CourseContent, Lecture } from '@/lib/student-api'
import { useAuth } from '@/contexts/auth-context'

// Dynamically import ReactPlayer to avoid SSR issues
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface Bookmark {
  id: string
  timestamp: number
  title: string
}

interface Note {
  id: string
  timestamp: number
  content: string
  createdAt: Date
}

export default function CoursePlayerPage() {
  const params = useParams()
  const courseId = parseInt(params.courseId as string)
  const { userProfile } = useAuth()

  const [course, setCourse] = React.useState<Course | null>(null)
  const [courseContent, setCourseContent] = React.useState<CourseContent | null>(null)
  const [currentLecture, setCurrentLecture] = React.useState<Lecture | null>(null)
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0)
  const [currentLectureIndex, setCurrentLectureIndex] = React.useState(0)
  const [loading, setLoading] = React.useState(true)
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  // Video player state
  const [playing, setPlaying] = React.useState(false)
  const [played, setPlayed] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [playbackRate, setPlaybackRate] = React.useState(1)
  const [volume, setVolume] = React.useState(0.8)
  const [muted, setMuted] = React.useState(false)

  // Learning features
  const [bookmarks, setBookmarks] = React.useState<Bookmark[]>([])
  const [notes, setNotes] = React.useState<Note[]>([])
  const [newNote, setNewNote] = React.useState("")
  const [isNoteDialogOpen, setIsNoteDialogOpen] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  const playerRef = React.useRef<any>(null)

  React.useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  React.useEffect(() => {
    if (courseContent && courseContent.sections.length > 0) {
      const firstSection = courseContent.sections[0]
      if (firstSection.lectures.length > 0) {
        setCurrentLecture(firstSection.lectures[0])
      }
    }
  }, [courseContent])

  React.useEffect(() => {
    // Update progress when video progress changes
    if (currentLecture && userProfile?.id) {
      const lectureProgress = played * 100
      updateCourseProgress(lectureProgress)
    }
  }, [played, currentLecture, userProfile])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      
      // Fetch course details
      const courseResponse = await studentApi.getCourseById(courseId)
      if (courseResponse.success) {
        setCourse(courseResponse.data)
      }

      // Fetch course content (mock implementation)
      const mockContent: CourseContent = {
        sections: [
          {
            id: 1,
            title: "Introduction to Web Development",
            order: 1,
            lectures: [
              {
                id: 1,
                title: "Welcome to the Course",
                video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                duration: 300,
                description: "Introduction and course overview",
                order: 1
              },
              {
                id: 2,
                title: "Setting Up Your Environment",
                video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                duration: 600,
                description: "Installing necessary tools and software",
                order: 2
              }
            ]
          },
          {
            id: 2,
            title: "HTML Fundamentals",
            order: 2,
            lectures: [
              {
                id: 3,
                title: "HTML Basics",
                video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                duration: 900,
                description: "Learning HTML tags and structure",
                order: 1
              },
              {
                id: 4,
                title: "Forms and Input Elements",
                video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                duration: 720,
                description: "Creating interactive forms",
                order: 2
              }
            ]
          }
        ]
      }
      setCourseContent(mockContent)

    } catch (error) {
      console.error('Error fetching course data:', error)
      toast.error('Failed to load course content')
    } finally {
      setLoading(false)
    }
  }

  const updateCourseProgress = async (lectureProgress: number) => {
    if (!userProfile?.id || !currentLecture) return

    try {
      // Calculate overall course progress
      const totalLectures = courseContent?.sections.reduce((total, section) => 
        total + section.lectures.length, 0) || 1
      const completedLectures = currentSectionIndex * (courseContent?.sections[currentSectionIndex]?.lectures.length || 1) + currentLectureIndex
      const overallProgress = (completedLectures / totalLectures) * 100

      await studentApi.updateProgress(userProfile.id, courseId, overallProgress)
      setProgress(overallProgress)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const handleProgress = (state: any) => {
    setPlayed(state.played)
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const handleSeek = (value: number[]) => {
    const seekTo = value[0] / 100
    setPlayed(seekTo)
    playerRef.current?.seekTo(seekTo)
  }

  const addBookmark = async () => {
    if (!currentLecture || !userProfile?.id) return

    const timestamp = played * duration
    const bookmark: Bookmark = {
      id: Date.now().toString(),
      timestamp,
      title: `Bookmark at ${Math.floor(timestamp / 60)}:${Math.floor(timestamp % 60).toString().padStart(2, '0')}`
    }

    setBookmarks(prev => [...prev, bookmark])
    
    try {
      await studentApi.saveBookmark(userProfile.id, currentLecture.id, timestamp)
      toast.success('Bookmark added')
    } catch (error) {
      console.error('Error saving bookmark:', error)
    }
  }

  const addNote = async () => {
    if (!currentLecture || !userProfile?.id || !newNote.trim()) return

    const timestamp = played * duration
    const note: Note = {
      id: Date.now().toString(),
      timestamp,
      content: newNote,
      createdAt: new Date()
    }

    setNotes(prev => [...prev, note])
    setNewNote("")
    setIsNoteDialogOpen(false)
    
    try {
      await studentApi.saveNote(userProfile.id, currentLecture.id, timestamp, newNote)
      toast.success('Note saved')
    } catch (error) {
      console.error('Error saving note:', error)
    }
  }

  const goToBookmark = (timestamp: number) => {
    const seekTo = timestamp / duration
    setPlayed(seekTo)
    playerRef.current?.seekTo(seekTo)
  }

  const goToNote = (timestamp: number) => {
    const seekTo = timestamp / duration
    setPlayed(seekTo)
    playerRef.current?.seekTo(seekTo)
  }

  const navigateToLecture = (sectionIndex: number, lectureIndex: number) => {
    const section = courseContent?.sections[sectionIndex]
    if (section && section.lectures[lectureIndex]) {
      setCurrentSectionIndex(sectionIndex)
      setCurrentLectureIndex(lectureIndex)
      setCurrentLecture(section.lectures[lectureIndex])
      setPlayed(0)
    }
  }

  const goToPreviousLecture = () => {
    if (currentLectureIndex > 0) {
      navigateToLecture(currentSectionIndex, currentLectureIndex - 1)
    } else if (currentSectionIndex > 0) {
      const prevSection = courseContent?.sections[currentSectionIndex - 1]
      if (prevSection) {
        navigateToLecture(currentSectionIndex - 1, prevSection.lectures.length - 1)
      }
    }
  }

  const goToNextLecture = () => {
    const currentSection = courseContent?.sections[currentSectionIndex]
    if (currentSection && currentLectureIndex < currentSection.lectures.length - 1) {
      navigateToLecture(currentSectionIndex, currentLectureIndex + 1)
    } else if (courseContent && currentSectionIndex < courseContent.sections.length - 1) {
      navigateToLecture(currentSectionIndex + 1, 0)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={[3]}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={[3]}>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <motion.div
          initial={false}
          animate={{ width: sidebarOpen ? 400 : 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border-r border-border overflow-hidden"
        >
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold truncate">{course?.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Progress value={progress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round(progress)}% Complete
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {courseContent?.sections.map((section, sectionIdx) => (
              <div key={section.id} className="border-b border-border">
                <div className="p-4 bg-muted/50">
                  <h3 className="font-medium text-sm">{section.title}</h3>
                </div>
                <div className="space-y-1">
                  {section.lectures.map((lecture, lectureIdx) => (
                    <button
                      key={lecture.id}
                      onClick={() => navigateToLecture(sectionIdx, lectureIdx)}
                      className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                        currentLecture?.id === lecture.id ? 'bg-primary/10 border-r-2 border-primary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {currentLecture?.id === lecture.id ? (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{lecture.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatTime(lecture.duration)}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card border-b border-border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {!sidebarOpen && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <Menu className="h-4 w-4" />
                  </Button>
                )}
                <div>
                  <h1 className="font-semibold">{currentLecture?.title}</h1>
                  <p className="text-sm text-muted-foreground">{currentLecture?.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addBookmark}
                  disabled={!currentLecture}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  Bookmark
                </Button>
                
                <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!currentLecture}>
                      <StickyNote className="mr-2 h-4 w-4" />
                      Add Note
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Note</DialogTitle>
                      <DialogDescription>
                        Add a note at the current timestamp ({formatTime(played * duration)})
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                          id="note"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note..."
                          rows={4}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={addNote}>Save Note</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>

          {/* Video Player */}
          <div className="flex-1 bg-black relative">
            {currentLecture && (
              <ReactPlayer
                ref={playerRef}
                url={currentLecture.video_url}
                width="100%"
                height="100%"
                playing={playing}
                volume={volume}
                muted={muted}
                playbackRate={playbackRate}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
              />
            )}

            {/* Custom Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[played * 100]}
                    onValueChange={handleSeek}
                    max={100}
                    step={0.1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white">
                    <span>{formatTime(played * duration)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPreviousLecture}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPlaying(!playing)}
                      className="text-white hover:bg-white/20"
                    >
                      {playing ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextLecture}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMuted(!muted)}
                        className="text-white hover:bg-white/20"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Slider
                        value={[volume * 100]}
                        onValueChange={(value) => setVolume(value[0] / 100)}
                        max={100}
                        className="w-20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <Select value={playbackRate.toString()} onValueChange={(value) => setPlaybackRate(parseFloat(value))}>
                      <SelectTrigger className="w-20 bg-transparent border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.5">0.5x</SelectItem>
                        <SelectItem value="0.75">0.75x</SelectItem>
                        <SelectItem value="1">1x</SelectItem>
                        <SelectItem value="1.25">1.25x</SelectItem>
                        <SelectItem value="1.5">1.5x</SelectItem>
                        <SelectItem value="2">2x</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmarks and Notes */}
          <div className="bg-card border-t border-border p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bookmarks */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Bookmarks ({bookmarks.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {bookmarks.map((bookmark) => (
                    <button
                      key={bookmark.id}
                      onClick={() => goToBookmark(bookmark.timestamp)}
                      className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{bookmark.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(bookmark.timestamp)}
                        </span>
                      </div>
                    </button>
                  ))}
                  {bookmarks.length === 0 && (
                    <p className="text-sm text-muted-foreground">No bookmarks yet</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="font-medium mb-3 flex items-center">
                  <StickyNote className="mr-2 h-4 w-4" />
                  Notes ({notes.length})
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {notes.map((note) => (
                    <button
                      key={note.id}
                      onClick={() => goToNote(note.timestamp)}
                      className="w-full text-left p-2 rounded hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(note.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm line-clamp-2">{note.content}</p>
                    </button>
                  ))}
                  {notes.length === 0 && (
                    <p className="text-sm text-muted-foreground">No notes yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}