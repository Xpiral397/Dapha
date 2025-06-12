"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Search, BookOpen, ArrowLeft, Edit, Trash2, Eye, Lock, LogOut, Heart } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  entry_date: string
  is_favorite: boolean
  word_count: number
  created_at: string
  updated_at: string
}

const moods = [
  { value: "joyful", label: "Joyful", color: "bg-yellow-100 text-yellow-800" },
  { value: "peaceful", label: "Peaceful", color: "bg-blue-100 text-blue-800" },
  { value: "grateful", label: "Grateful", color: "bg-green-100 text-green-800" },
  { value: "hopeful", label: "Hopeful", color: "bg-purple-100 text-purple-800" },
  { value: "anxious", label: "Anxious", color: "bg-orange-100 text-orange-800" },
  { value: "sad", label: "Sad", color: "bg-gray-100 text-gray-800" },
  { value: "angry", label: "Angry", color: "bg-red-100 text-red-800" },
  { value: "confused", label: "Confused", color: "bg-indigo-100 text-indigo-800" },
]

const commonTags = [
  "Prayer",
  "Bible Study",
  "Family",
  "Work",
  "Relationships",
  "Health",
  "Goals",
  "Gratitude",
  "Challenges",
  "Growth",
  "Faith",
  "Dreams",
]

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [viewingEntry, setViewingEntry] = useState<JournalEntry | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterMood, setFilterMood] = useState("all")
  const [filterTag, setFilterTag] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [mood, setMood] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")

  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading: authLoading, signOut } = useSupabaseAuth()

  useEffect(() => {
    setIsVisible(true)
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        loadEntries()
      }
    }
  }, [isAuthenticated, authLoading, router])

  const loadEntries = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })

      if (error) throw error

      setEntries(data || [])
    } catch (error) {
      console.error("Error loading entries:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveEntry = async (entryData: Partial<JournalEntry>) => {
    if (!user) return

    try {
      if (editingEntry) {
        const { error } = await supabase
          .from("journal_entries")
          .update({
            ...entryData,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingEntry.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("journal_entries").insert({
          ...entryData,
          user_id: user.id,
          entry_date: new Date().toISOString().split("T")[0],
        })

        if (error) throw error
      }

      await loadEntries()
    } catch (error) {
      console.error("Error saving entry:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !mood) return

    await saveEntry({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags: selectedTags,
    })

    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setMood("")
    setSelectedTags([])
    setCustomTag("")
    setShowNewEntry(false)
    setEditingEntry(null)
  }

  const handleEdit = (entry: JournalEntry) => {
    setTitle(entry.title)
    setContent(entry.content)
    setMood(entry.mood)
    setSelectedTags(entry.tags || [])
    setEditingEntry(entry)
    setShowNewEntry(true)
    setViewingEntry(null)
  }

  const handleView = (entry: JournalEntry) => {
    setViewingEntry(entry)
    setShowNewEntry(false)
    setEditingEntry(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return

    try {
      const { error } = await supabase.from("journal_entries").delete().eq("id", id)

      if (error) throw error

      await loadEntries()
      if (viewingEntry?.id === id) {
        setViewingEntry(null)
      }
    } catch (error) {
      console.error("Error deleting entry:", error)
    }
  }

  const toggleFavorite = async (entry: JournalEntry) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({ is_favorite: !entry.is_favorite })
        .eq("id", entry.id)

      if (error) throw error

      await loadEntries()
    } catch (error) {
      console.error("Error toggling favorite:", error)
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

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = filterMood === "all" || entry.mood === filterMood
    const matchesTag = filterTag === "all" || (entry.tags || []).includes(filterTag)

    return matchesSearch && matchesMood && matchesTag
  })

  const getMoodColor = (moodValue: string) => {
    return moods.find((m) => m.value === moodValue)?.color || "bg-gray-100 text-gray-800"
  }

  const allTags = Array.from(new Set([...commonTags, ...entries.flatMap((e) => e.tags || [])]))

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md animate-pulse">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your journal...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md animate-bounce-in">
          <CardContent className="p-8 text-center">
            <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to access your journal.</p>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 transform hover:scale-105 transition-transform">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-all duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 animate-slide-down">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="hover:scale-105 transition-transform">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut()}
                className="text-red-600 hover:text-red-700 hover:scale-105 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <div className="flex items-center space-x-3">
                <BookOpen className="w-8 h-8 text-blue-600 animate-pulse" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Journal</h1>
                  <p className="text-sm text-gray-600">Welcome back, {userProfile?.username || user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {viewingEntry && (
                <Button
                  variant="outline"
                  onClick={() => setViewingEntry(null)}
                  className="hover:scale-105 transition-transform"
                >
                  Back to List
                </Button>
              )}
              <Button
                onClick={() => setShowNewEntry(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform btn-animate"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Entry
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Viewing Entry */}
        {viewingEntry && (
          <Card className="mb-8 animate-fade-in card-hover">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getMoodColor(viewingEntry.mood)}>
                      {moods.find((m) => m.value === viewingEntry.mood)?.label}
                    </Badge>
                    {viewingEntry.is_favorite && (
                      <Badge className="bg-red-100 text-red-800">
                        <Heart className="w-3 h-3 mr-1" />
                        Favorite
                      </Badge>
                    )}
                    <Badge variant="outline">{viewingEntry.word_count} words</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-2 animate-slide-right">{viewingEntry.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-base animate-slide-right">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(viewingEntry.entry_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFavorite(viewingEntry)}
                    className={`hover:scale-105 transition-transform ${viewingEntry.is_favorite ? "text-red-600" : ""}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${viewingEntry.is_favorite ? "fill-current" : ""}`} />
                    {viewingEntry.is_favorite ? "Unfavorite" : "Favorite"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(viewingEntry)}
                    className="hover:scale-105 transition-transform"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(viewingEntry.id)}
                    className="text-red-600 hover:text-red-700 hover:scale-105 transition-all"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6 animate-fade-in-delay">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingEntry.content}</p>
              </div>
              {viewingEntry.tags && viewingEntry.tags.length > 0 && (
                <div className="animate-slide-up">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingEntry.tags.map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="animate-bounce-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* New/Edit Entry Form */}
        {showNewEntry && (
          <Card className="mb-8 animate-slide-down card-hover">
            <CardHeader>
              <CardTitle className="animate-slide-right">{editingEntry ? "Edit Entry" : "New Journal Entry"}</CardTitle>
              <CardDescription className="animate-slide-right">
                Take a moment to reflect on your day and capture your thoughts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="animate-slide-up">
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's on your heart today?"
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
                  <label className="block text-sm font-medium mb-2">How are you feeling?</label>
                  <Select value={mood} onValueChange={setMood} required>
                    <SelectTrigger className="transition-all duration-300 focus:scale-105">
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((moodOption) => (
                        <SelectItem key={moodOption.value} value={moodOption.value}>
                          {moodOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="animate-slide-up" style={{ animationDelay: "200ms" }}>
                  <label className="block text-sm font-medium mb-2">Your thoughts</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Pour out your heart... What happened today? What are you grateful for? What challenges are you facing? How did you see God working?"
                    rows={8}
                    required
                    className="transition-all duration-300 focus:scale-105"
                  />
                </div>

                <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTags.map((tag, index) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer hover:scale-105 transition-transform animate-bounce-in"
                        onClick={() => removeTag(tag)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {commonTags
                      .filter((tag) => !selectedTags.includes(tag))
                      .map((tag, index) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50 hover:scale-105 transition-all animate-fade-in"
                          onClick={() => addTag(tag)}
                          style={{ animationDelay: `${index * 30}ms` }}
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
                      className="transition-all duration-300 focus:scale-105"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCustomTag}
                      className="hover:scale-105 transition-transform"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 animate-slide-up" style={{ animationDelay: "400ms" }}>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform btn-animate"
                  >
                    {editingEntry ? "Update Entry" : "Save Entry"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="hover:scale-105 transition-transform"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        {!viewingEntry && (
          <Card className="mb-8 animate-fade-in card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 animate-slide-right">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search your entries..."
                      className="pl-10 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                </div>
                <Select value={filterMood} onValueChange={setFilterMood}>
                  <SelectTrigger className="w-full md:w-48 transition-all duration-300 focus:scale-105">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All moods</SelectItem>
                    {moods.map((mood) => (
                      <SelectItem key={mood.value} value={mood.value}>
                        {mood.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="w-full md:w-48 transition-all duration-300 focus:scale-105">
                    <SelectValue placeholder="Filter by tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Entries List */}
        {!viewingEntry && (
          <>
            {filteredEntries.length === 0 ? (
              <Card className="animate-bounce-in">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {entries.length === 0 ? "Start Your Journey" : "No entries found"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {entries.length === 0
                      ? "Begin documenting your thoughts, prayers, and daily reflections."
                      : "Try adjusting your search or filters to find what you're looking for."}
                  </p>
                  {entries.length === 0 && (
                    <Button
                      onClick={() => setShowNewEntry(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 transition-transform btn-animate"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Write Your First Entry
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEntries.map((entry, index) => (
                  <Card
                    key={entry.id}
                    className="hover:shadow-lg transition-all duration-300 card-hover animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {entry.is_favorite && <Heart className="w-4 h-4 text-red-600 fill-current" />}
                            <Badge className={getMoodColor(entry.mood)}>
                              {moods.find((m) => m.value === entry.mood)?.label}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg mb-1">{entry.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(entry.entry_date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(entry)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(entry)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-600 hover:text-red-700 hover:scale-110 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-4 mb-4">{entry.content}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {entry.word_count} words
                        </Badge>
                        {(entry.tags || []).slice(0, 3).map((tag, tagIndex) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs animate-bounce-in"
                            style={{ animationDelay: `${tagIndex * 50}ms` }}
                          >
                            {tag}
                          </Badge>
                        ))}
                        {(entry.tags || []).length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{(entry.tags || []).length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
