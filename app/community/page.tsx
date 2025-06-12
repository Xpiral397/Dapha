"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Plus, Search, Heart, MessageCircle, ArrowLeft, Eye, LogOut, Send, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"

interface CommunityPost {
  id: string
  user_id: string
  author_name: string
  title: string
  content: string
  category: string
  tags: string[]
  likes: number
  views: number
  is_anonymous: boolean
  is_featured: boolean
  is_resolved: boolean
  created_at: string
  updated_at: string
}

interface CommunityReply {
  id: string
  post_id: string
  user_id: string
  author_name: string
  content: string
  likes: number
  is_anonymous: boolean
  is_helpful: boolean
  created_at: string
  updated_at: string
}

const categories = [
  { value: "prayer_request", label: "Prayer Request", color: "bg-purple-100 text-purple-800" },
  { value: "testimony", label: "Testimony", color: "bg-green-100 text-green-800" },
  { value: "advice", label: "Life Advice", color: "bg-blue-100 text-blue-800" },
  { value: "academic", label: "Academic Support", color: "bg-yellow-100 text-yellow-800" },
  { value: "mental_health", label: "Mental Health", color: "bg-red-100 text-red-800" },
  { value: "relationships", label: "Relationships", color: "bg-pink-100 text-pink-800" },
  { value: "career", label: "Career", color: "bg-indigo-100 text-indigo-800" },
  { value: "spiritual_growth", label: "Spiritual Growth", color: "bg-teal-100 text-teal-800" },
  { value: "general", label: "General", color: "bg-gray-100 text-gray-800" },
]

const commonTags = [
  "Prayer",
  "Support",
  "Advice",
  "Encouragement",
  "Testimony",
  "Question",
  "Academic",
  "Career",
  "Relationships",
  "Mental Health",
  "Faith",
  "Growth",
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [replies, setReplies] = useState<Record<string, CommunityReply[]>>({})
  const [showNewPost, setShowNewPost] = useState(false)
  const [viewingPost, setViewingPost] = useState<CommunityPost | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [customTag, setCustomTag] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading: authLoading, signOut } = useSupabaseAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        loadPosts()
      }
    }
  }, [isAuthenticated, authLoading, router])

  const loadPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error

      setPosts(data || [])
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadReplies = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("community_replies")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error

      setReplies((prev) => ({
        ...prev,
        [postId]: data || [],
      }))
    } catch (error) {
      console.error("Error loading replies:", error)
    }
  }

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !category || !user) return

    try {
      const authorName = isAnonymous ? "Anonymous" : userProfile?.username || user.email || "User"

      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        author_name: authorName,
        title: title.trim(),
        content: content.trim(),
        category,
        tags: selectedTags,
        is_anonymous: isAnonymous,
      })

      if (error) throw error

      await loadPosts()
      resetForm()
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, postId: string) => {
    e.preventDefault()
    if (!replyContent.trim() || !user) return

    try {
      const authorName = isAnonymous ? "Anonymous" : userProfile?.username || user.email || "User"

      const { error } = await supabase.from("community_replies").insert({
        post_id: postId,
        user_id: user.id,
        author_name: authorName,
        content: replyContent.trim(),
        is_anonymous: isAnonymous,
      })

      if (error) throw error

      await loadReplies(postId)
      setReplyContent("")
    } catch (error) {
      console.error("Error creating reply:", error)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user) return

    try {
      // Check if already liked
      const { data: existingLike } = await supabase
        .from("post_likes")
        .select("id")
        .eq("user_id", user.id)
        .eq("post_id", postId)
        .single()

      if (existingLike) {
        // Unlike
        await supabase.from("post_likes").delete().eq("id", existingLike.id)
        await supabase.rpc("decrement_post_likes", { post_uuid: postId })
      } else {
        // Like
        await supabase.from("post_likes").insert({
          user_id: user.id,
          post_id: postId,
        })
        await supabase.rpc("increment_post_likes", { post_uuid: postId })
      }

      await loadPosts()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleViewPost = async (post: CommunityPost) => {
    setViewingPost(post)
    await loadReplies(post.id)

    // Increment view count
    try {
      await supabase.rpc("increment_post_views", { post_uuid: post.id })
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setCategory("")
    setSelectedTags([])
    setCustomTag("")
    setIsAnonymous(false)
    setShowNewPost(false)
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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || post.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (categoryValue: string) => {
    return categories.find((c) => c.value === categoryValue)?.color || "bg-gray-100 text-gray-800"
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading community...</p>
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
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Join Our Community</h2>
            <p className="text-gray-600 mb-4">Please sign in to connect with others.</p>
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
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                  <p className="text-sm text-gray-600">Welcome, {userProfile?.username || user?.email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {viewingPost && (
                <Button variant="outline" onClick={() => setViewingPost(null)}>
                  Back to Posts
                </Button>
              )}
              <Button onClick={() => setShowNewPost(true)} className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Viewing Post */}
        {viewingPost && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={getCategoryColor(viewingPost.category)}>
                        {categories.find((c) => c.value === viewingPost.category)?.label}
                      </Badge>
                      {viewingPost.is_featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                      {viewingPost.is_resolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                    </div>
                    <CardTitle className="text-2xl mb-2">{viewingPost.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>By {viewingPost.author_name}</span>
                      <span>{new Date(viewingPost.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {viewingPost.views} views
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLikePost(viewingPost.id)}
                      className="flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" />
                      {viewingPost.likes}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{viewingPost.content}</p>
                </div>
                {viewingPost.tags && viewingPost.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingPost.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Replies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Replies ({replies[viewingPost.id]?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Reply Form */}
                <form onSubmit={(e) => handleSubmitReply(e, viewingPost.id)} className="space-y-4">
                  <Textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Share your thoughts, advice, or encouragement..."
                    rows={3}
                    required
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                      <span className="text-sm">Post anonymously</span>
                    </label>
                    <Button type="submit" size="sm">
                      <Send className="w-4 h-4 mr-2" />
                      Reply
                    </Button>
                  </div>
                </form>

                {/* Replies List */}
                {replies[viewingPost.id]?.map((reply) => (
                  <div key={reply.id} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{reply.author_name}</span>
                        <span className="text-sm text-gray-500">{new Date(reply.created_at).toLocaleDateString()}</span>
                        {reply.is_helpful && <Badge className="bg-green-100 text-green-800">Helpful</Badge>}
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {reply.likes}
                      </Button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{reply.content}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Post Form */}
        {showNewPost && !viewingPost && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>Share your thoughts, ask for advice, or request prayer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What would you like to share or ask?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your story, ask your question, or request prayer..."
                    rows={6}
                    required
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
                    <span className="text-sm">Post anonymously</span>
                  </label>
                  <div className="flex gap-3">
                    <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600">
                      Create Post
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        {!viewingPost && !showNewPost && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search posts..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Posts List */}
        {!viewingPost && !showNewPost && (
          <>
            {filteredPosts.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {posts.length === 0 ? "Start the Conversation" : "No posts found"}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {posts.length === 0
                      ? "Be the first to share your story or ask for support."
                      : "Try adjusting your search or filters."}
                  </p>
                  {posts.length === 0 && (
                    <Button
                      onClick={() => setShowNewPost(true)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getCategoryColor(post.category)}>
                              {categories.find((c) => c.value === post.category)?.label}
                            </Badge>
                            {post.is_featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                            {post.is_resolved && <Badge className="bg-green-100 text-green-800">Resolved</Badge>}
                          </div>
                          <CardTitle className="text-xl mb-1 hover:text-blue-600" onClick={() => handleViewPost(post)}>
                            {post.title}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-4">
                            <span>By {post.author_name}</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleLikePost(post.id)
                            }}
                            className="flex items-center gap-2"
                          >
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPost(post)}
                            className="flex items-center gap-2"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {post.tags.slice(0, 4).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}
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
