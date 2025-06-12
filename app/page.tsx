"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Heart, Users, DollarSign, Shield, Phone, Plus, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { supabase } from "@/lib/supabase"

interface JournalEntry {
  id: string
  title: string
  content: string
  mood: string
  tags: string[]
  entry_date: string
  created_at: string
}

interface UserStats {
  total_journal_entries: number
  current_streak: number
  total_notes: number
  solved_problems: number
}

export default function HomePage() {
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([])
  const [stats, setStats] = useState<UserStats>({
    total_journal_entries: 0,
    current_streak: 0,
    total_notes: 0,
    solved_problems: 0,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const { user, userProfile, isAuthenticated, isLoading, signOut } = useSupabaseAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData()
    }
  }, [isAuthenticated, user])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load recent journal entries
      const { data: journalData } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false })
        .limit(3)

      if (journalData) {
        setRecentEntries(journalData)
      }

      // Load basic stats manually since we might not have the RPC function yet
      const { data: allJournalData } = await supabase
        .from("journal_entries")
        .select("id, entry_date")
        .eq("user_id", user.id)

      const { data: notesData } = await supabase.from("notes").select("id, type, status").eq("user_id", user.id)

      if (allJournalData && notesData) {
        // Calculate streak
        const sortedDates = allJournalData
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

        const solvedProblems = notesData.filter((note) => note.type === "problem" && note.status === "solved").length

        setStats({
          total_journal_entries: allJournalData.length,
          current_streak: streak,
          total_notes: notesData.length,
          solved_problems: solvedProblems,
        })
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    }
  }

  const features = [
    {
      icon: BookOpen,
      title: "Spiritual Wellness",
      description: "Bible-based content, devotionals, and spiritual mentorship",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Heart,
      title: "Emotional & Mental Health",
      description: "Access to therapists, counselors, emotional check-ins",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Users,
      title: "Academic Support",
      description: "Mentorship, accountability tools, student wellness",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: DollarSign,
      title: "Financial Development",
      description: "Funding support, business advisory, skill showcase",
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      icon: Shield,
      title: "Emergency Support",
      description: "Anonymous distress calls, law/human rights support",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Phone,
      title: "24/7 Helpline",
      description: "Real-time human expert service and crisis intervention",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DHAP
                </h1>
                <p className="text-xs text-gray-600">Dynamic Holistic Assistance Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/journal" className="text-gray-600 hover:text-blue-600 transition-colors">
                Journal
              </Link>
              <Link href="/notes" className="text-gray-600 hover:text-blue-600 transition-colors">
                Notes
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-blue-600 transition-colors">
                Support
              </Link>
              <Link href="/community" className="text-gray-600 hover:text-blue-600 transition-colors">
                Community
              </Link>
              {isAuthenticated && (
                <Link href="/settings" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Settings
                </Link>
              )}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Welcome, {userProfile?.username || user?.email}</span>
                  <Button variant="outline" onClick={() => signOut()}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600">Get Started</Button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span
                  className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
                ></span>
                <span
                  className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${mobileMenuOpen ? "opacity-0" : "opacity-100"}`}
                ></span>
                <span
                  className={`bg-gray-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${mobileMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4 pt-4">
                <Link
                  href="/journal"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Journal
                </Link>
                <Link
                  href="/notes"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Notes
                </Link>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/support"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Support
                </Link>
                <Link
                  href="/community"
                  className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Community
                </Link>
                {isAuthenticated && (
                  <Link
                    href="/settings"
                    className="text-gray-600 hover:text-blue-600 transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                )}
                <div className="pt-2">
                  {isAuthenticated ? (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-600">Welcome, {userProfile?.username || user?.email}</span>
                      <Button variant="outline" className="w-full" onClick={() => signOut()}>
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 w-full">Get Started</Button>
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            Transforming Lives, One Soul at a Time
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Your Journey to
            <br />
            Wholeness Starts Here
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            DHAP is more than an app — it's a revolutionary move of God wrapped in digital innovation. Supporting you
            emotionally, spiritually, mentally, academically, financially, and socially.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/journal">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 text-lg px-8 py-3">
                Start Your Journey
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Dashboard */}
      {(stats.total_journal_entries > 0 || stats.total_notes > 0 || stats.solved_problems > 0) && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-blue-600">{stats.total_journal_entries}</div>
                  <p className="text-gray-600">Total Journal Entries</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-green-600">{stats.current_streak}</div>
                  <p className="text-gray-600">Day Streak</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-purple-600">{stats.total_notes}</div>
                  <p className="text-gray-600">Total Notes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Recent Journal Entries */}
      {recentEntries.length > 0 && (
        <section className="py-12 px-4">
          <div className="container mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Recent Journal Entries</h2>
              <Link href="/journal">
                <Button variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  New Entry
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentEntries.map((entry) => (
                <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{entry.title}</CardTitle>
                    <CardDescription>{new Date(entry.entry_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3 mb-3">{entry.content}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{entry.mood}</Badge>
                      {entry.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Comprehensive Life Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DHAP covers every aspect of your life journey with Christ-centered, digitally-powered assistance that
              transforms from within.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands who have found healing, wholeness, and purpose through DHAP. Your journey to complete
            wellness starts with a single step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/journal">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
                Start Journaling Today
              </Button>
            </Link>
            <Link href="/support">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
              >
                Get Support Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DHAP</span>
              </div>
              <p className="text-gray-400">Transforming lives through Christ-centered digital innovation.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/journal" className="hover:text-white">
                    Journal
                  </Link>
                </li>
                <li>
                  <Link href="/notes" className="hover:text-white">
                    Notes
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/crisis" className="hover:text-white">
                    Crisis Support
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Emergency</h4>
              <p className="text-gray-400 mb-2">24/7 Crisis Helpline:</p>
              <p className="text-xl font-bold text-red-400">1-800-DHAP-HELP</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DHAP - Dynamic Holistic Assistance Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
