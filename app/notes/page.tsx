"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  StickyNote,
  Plus,
  Search,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  Heart,
  Shield,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"

interface Note {
  id: string
  title: string
  content: string
  type: "diary" | "problem" | "fear" | "courage" | "trauma"
  status: "active" | "solved" | "progress" | "archived"
  priority: "low" | "medium" | "high"
  tags: string[]
  solved_at?: string
  reminder_date?: string
  is_private: boolean
  created_at: string
  updated_at: string
}

const noteTypes = [
  { value: "diary", label: "Diary Entry", icon: StickyNote, color: "bg-blue-100 text-blue-800" },
  { value: "problem", label: "Problem", icon: AlertTriangle, color: "bg-red-100 text-red-800" },
  { value: "fear", label: "Fear", icon: Shield, color: "bg-orange-100 text-orange-800" },
  { value: "courage", label: "Courage", icon: Heart, color: "bg-green-100 text-green-800" },
  { value: "trauma", label: "Trauma", icon: Clock, color: "bg-purple-100 text-purple-800" },
]

const statusOptions = [
  { value: "active", label: "Active", color: "bg-blue-100 text-blue-800" },
  { value: "progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "solved", label: "Solved", color: "bg-green-100 text-green-800" },
  { value: "archived", label: "Archived", color: "bg-gray-100 text-gray-800" },
]

const priorityOptions = [
  { value: "low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "High", color: "bg-red-100 text-red-800" },
]

const commonTags = [
  "Personal",
  "Work",
  "Family",
  "Health",
  "Relationships",
  "Goals",
  "Anxiety",
  "Depression",
  "Growth",
  "Healing",
  "Faith",
  "Recovery",
]

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [showNewNote, setShowNewNote] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [viewingNote, setViewingNote] = useState<Note | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [type, setType] = useState<Note["type"]>("diary")
  const [status, setStatus] = useState<Note["status"]>("active")
  const [priority, setPriority] = useState<Note["priority"]>("medium")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [reminderDate, setReminderDate] = useState("")

  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading: authLoading, signOut } = useSupabaseAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        loadNotes()
      }
    }
  }, [isAuthenticated, authLoading, router])

  const loadNotes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })

      if (error) throw error

      setNotes(data || [])
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveNote = async (noteData: Partial<Note>) => {
    if (!user) return

    try {
      if (editingNote) {
        const { error } = await supabase
          .from("notes")
          .update({
            ...noteData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingNote.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("notes").insert({
          ...noteData,
          user_id: user.id,
        })

        if (error) throw error
      }

      await loadNotes()
    } catch (error) {
      console.error("Error saving note:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) return

    await saveNote({
      title: title.trim(),
      content: content.trim(),
      type,
      status,
      priority,
      tags: selectedTags,
      reminder_date: reminderDate || null,
      solved_at:
        status === "solved" && editingNote?.status !== "solved" ? new Date().toISOString() : editingNote?.solved_at,
    })

    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setType("diary")
    setStatus("active")
    setPriority("medium")
    setSelectedTags([])
    setCustomTag("")
    setReminderDate("")
    setShowNewNote(false)
    setEditingNote(null)
  }

  const handleEdit = (note: Note) => {
    setTitle(note.title)
    setContent(note.content)
    setType(note.type)
    setStatus(note.status)
    setPriority(note.priority)
    setSelectedTags(note.tags || [])
    setReminderDate(note.reminder_date || "")
    setEditingNote(note)
    setShowNewNote(true)
    setViewingNote(null)
  }

  const handleView = (note: Note) => {
    setViewingNote(note)
    setShowNewNote(false)
    setEditingNote(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", id)

      if (error) throw error

      await loadNotes()
      if (viewingNote?.id === id) {
        setViewingNote(null)
      }
    } catch (error) {
      console.error("Error deleting note:", error)
    }
  }

  const markAsSolved = async (id: string) => {
    try {
      const { error } = await supabase
        .from("notes")
        .update({
          status: "solved",
          solved_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      await loadNotes()
    } catch (error) {
      console.error("Error marking as solved:", error)
    }
  }

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag))
  }

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim())
      setCustomTag("")
    }
  }

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || note.type === filterType
    const matchesStatus = filterStatus === "all" || note.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeInfo = (type: Note["type"]) => {
    return noteTypes.find((t) => t.value === type) || noteTypes[0]
  }

  const getStatusColor = (status: Note["status"]) => {
    return statusOptions.find((s) => s.value === status)?.color || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: Note["priority"]) => {
    return priorityOptions.find((p) => p.value === priority)?.color || "bg-gray-100 text-gray-800"
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your notes...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your notes.</p>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-red-600 hover:text-red-700">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div className="flex items-center space-x-3">
                <StickyNote className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
                  <p className="text-sm text-gray-600">Welcome back, {userProfile?.username || user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {viewingNote && (
                <Button variant="outline" onClick={() => setViewingNote(null)}>
                  Back to List
                </Button>
              )}
              <Button onClick={() => setShowNewNote(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Viewing Note */}
        {viewingNote && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => {
                      const typeInfo = getTypeInfo(viewingNote.type)
                      return <typeInfo.icon className="w-6 h-6 text-blue-600" />
                    })()}
                    <Badge className={getTypeInfo(viewingNote.type).color}>{getTypeInfo(viewingNote.type).label}</Badge>
                    <Badge className={getStatusColor(viewingNote.status)}>
                      {statusOptions.find((s) => s.value === viewingNote.status)?.label}
                    </Badge>
                    <Badge className={getPriorityColor(viewingNote.priority)}>
                      {priorityOptions.find((p) => p.value === viewingNote.priority)?.label} Priority
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2">{viewingNote.title}</CardTitle>
                  <CardDescription className="text-base">
                    Created:{" "}
                    {new Date(viewingNote.created_at).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {viewingNote.solved_at && (
                      <span className="ml-4 text-green-600">
                        Solved: {new Date(viewingNote.solved_at).toLocaleDateString()}
                      </span>
                    )}
                    {viewingNote.reminder_date && (
                      <span className="ml-4 text-blue-600">
                        Reminder: {new Date(viewingNote.reminder_date).toLocaleDateString()}
                      </span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {viewingNote.type === "problem" && viewingNote.status !== "solved" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsSolved(viewingNote.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Solved
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handleEdit(viewingNote)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(viewingNote.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingNote.content}</p>
              </div>
              {viewingNote.tags && viewingNote.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingNote.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* New/Edit Note Form */}
        {showNewNote && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingNote ? "Edit Note" : "New Note"}</CardTitle>
              <CardDescription>Document your thoughts, problems, fears, courage, or healing journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <Select value={type} onValueChange={(value) => setType(value as Note["type"])} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {noteTypes.map((noteType) => (
                          <SelectItem key={noteType.value} value={noteType.value}>
                            {noteType.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select value={status} onValueChange={(value) => setStatus(value as Note["status"])} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((statusOption) => (
                          <SelectItem key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Priority</label>
                    <Select value={priority} onValueChange={(value) => setPriority(value as Note["priority"])} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((priorityOption) => (
                          <SelectItem key={priorityOption.value} value={priorityOption.value}>
                            {priorityOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What would you like to document?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Describe your thoughts, the problem you're facing, your fears, moments of courage, or healing progress..."
                    rows={8}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reminder Date (Optional)</label>
                  <Input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonTags
                      .filter((tag) => !selectedTags.includes(tag))
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => addTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value)}
                      placeholder="Add custom tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                    />
                    <Button type="button" variant="outline" onClick={addCustomTag}>
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                    {editingNote ? "Update Note" : "Save Note"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        {!viewingNote && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search your notes..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {noteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes List */}
        {!viewingNote && (
          <>
            {filteredNotes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <StickyNote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {notes.length === 0 ? "Start Your Notes" : "No notes found"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {notes.length === 0
                      ? "Begin documenting your problems, fears, courage, and healing journey."
                      : "Try adjusting your search or filters to find what you're looking for."}
                  </p>
                  {notes.length === 0 && (
                    <Button
                      onClick={() => setShowNewNote(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Note
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNotes.map((note) => {
                  const typeInfo = getTypeInfo(note.type)
                  return (
                    <Card key={note.id} className="hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <typeInfo.icon className="w-5 h-5 text-blue-600" />
                              <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                              <Badge className={getStatusColor(note.status)}>
                                {statusOptions.find((s) => s.value === note.status)?.label}
                              </Badge>
                            </div>
                            <CardTitle className="text-lg mb-1">{note.title}</CardTitle>
                            <CardDescription>{new Date(note.updated_at).toLocaleDateString()}</CardDescription>
                          </div>
                          <div className="flex gap-1">
                            {note.type === "problem" && note.status !== "solved" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsSolved(note.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => handleView(note)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(note)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(note.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 line-clamp-3 mb-4">{note.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getPriorityColor(note.priority)}>
                            {priorityOptions.find((p) => p.value === note.priority)?.label}
                          </Badge>
                          {note.tags &&
                            note.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          {note.tags && note.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
