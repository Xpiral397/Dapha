"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  Heart,
  BookOpen,
  StickyNote,
  Users,
  CheckCircle,
  ArrowLeft,
  Target,
  Award,
  Activity,
  LogOut,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"

interface UserStats {
  total_journal_entries: number
  total_notes: number
  solved_problems: number
  community_posts: number
  total_likes_received: number
  current_streak: number
  mood_distribution: Record<string, number>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats>({
    total_journal_entries: 0,
    total_notes: 0,
    solved_problems: 0,
    community_posts: 0,
    total_likes_received: 0,
    current_streak: 0,
    mood_distribution: {},
  })
  const [weeklyActivity, setWeeklyActivity] = useState<number[]>([])
  const [recentAchievements, setRecentAchievements] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()
  const { user, userProfile, isAuthenticated, isLoading: authLoading, signOut } = useSupabaseAuth()

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth")
      } else {
        loadDashboardData()
      }
    }
  }, [isAuthenticated, authLoading, router])

  const loadDashboardData = async () => {
    if (!user) return

    try {
      // Load data manually since RPC function might not exist yet
      const { data: journalData } = await supabase.from("journal_entries").select("*").eq("user_id", user.id)

      const { data: notesData } = await supabase.from("notes").select("*").eq("user_id", user.id)

      if (journalData && notesData) {
        // Calculate streak
        const sortedDates = journalData
          .map((entry) => new Date(entry.entry_date))
          .sort((a, b) => b.getTime() - a.getTime())

        let streak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < sortedDates.length; i++) {
          const entryDate = new Date(sortedDates[i])
          entryDate.setHours(0, 0, 0, 0)

          const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000)

          if (entryDate.getTime() === expectedDate.getTime()) {
            streak++
          } else {
            break
          }
        }

        // Calculate mood distribution
        const moodDistribution: Record<string, number> = {}
        journalData.forEach((entry) => {
          moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1
        })

        const solvedProblems = notesData.filter((note) => note.type === "problem" && note.status === "solved").length

        setStats({
          total_journal_entries: journalData.length,
          total_notes: notesData.length,
          solved_problems: solvedProblems,
          community_posts: 0, // Will be implemented later
          total_likes_received: 0, // Will be implemented later
          current_streak: streak,
          mood_distribution: moodDistribution,
        })
      }

      // Calculate weekly activity
      const today = new Date()
      const weeklyActivityData = []

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]

        // Count journal entries for this date
        const { data: journalCount } = await supabase
          .from("journal_entries")
          .select("id")
          .eq("user_id", user.id)
          .eq("entry_date", dateStr)

        // Count notes created on this date
        const { data: notesCount } = await supabase
          .from("notes")
          .select("id")
          .eq("user_id", user.id)
          .gte("created_at", dateStr)
          .lt("created_at", new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split("T")[0])

        weeklyActivityData.push((journalCount?.length || 0) + (notesCount?.length || 0))
      }

      setWeeklyActivity(weeklyActivityData)

      // Generate achievements based on stats
      const achievements = []
      if (stats.current_streak >= 7) achievements.push(`${stats.current_streak} day journaling streak!`)
      if (stats.solved_problems >= 5) achievements.push(`Solved ${stats.solved_problems} problems!`)
      if (stats.total_journal_entries >= 30)
        achievements.push(`Written ${stats.total_journal_entries} journal entries!`)

      setRecentAchievements(achievements)
    } catch (error) {
      console.error("Failed to load dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
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
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-4">Please sign in to view your dashboard.</p>
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
                <BarChart3 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, {userProfile?.username || user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Journal Entries</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.total_journal_entries}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Streak</p>
                  <p className="text-3xl font-bold text-green-600">{stats.current_streak}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.solved_problems}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Notes</p>
                  <p className="text-3xl font-bold text-red-600">{stats.total_notes}</p>
                </div>
                <StickyNote className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Weekly Activity
            </CardTitle>
            <CardDescription>Your daily engagement over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyActivity.map((activity, index) => {
                const date = new Date()
                date.setDate(date.getDate() - (6 - index))
                const maxActivity = Math.max(...weeklyActivity, 1)
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm w-12 text-gray-600">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <Progress value={(activity / maxActivity) * 100} className="flex-1" />
                    <span className="text-sm w-8 text-gray-600">{activity}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Mood Distribution */}
        {Object.keys(stats.mood_distribution || {}).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Mood Distribution
              </CardTitle>
              <CardDescription>How you've been feeling in your journal entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(stats.mood_distribution || {}).map(([mood, count]) => (
                  <div key={mood} className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{count}</p>
                    <p className="text-sm text-gray-600 capitalize">{mood}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        {recentAchievements.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
              <CardDescription>Celebrating your progress and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
                  >
                    <Award className="w-6 h-6 text-blue-600" />
                    <span className="font-medium text-gray-800">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Continue your wellness journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/journal">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">New Journal Entry</h3>
                    <p className="text-sm text-gray-600">Reflect on your day</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/notes">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <StickyNote className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Track Progress</h3>
                    <p className="text-sm text-gray-600">Document problems & growth</p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/community">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h3 className="font-semibold mb-2">Join Community</h3>
                    <p className="text-sm text-gray-600">Connect with others</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
