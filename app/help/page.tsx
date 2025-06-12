"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, HelpCircle, ArrowLeft, BookOpen, MessageCircle, Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "How do I create an account on DHAP?",
        answer:
          "To create an account, click 'Get Started' on the homepage and set up a secure PIN. Your PIN encrypts all your data and ensures your privacy. Choose a PIN you'll remember, as it cannot be recovered if lost.",
      },
      {
        question: "Is my data secure and private?",
        answer:
          "Yes, absolutely. DHAP uses advanced encryption to protect your data. Your PIN acts as an encryption key, meaning only you can access your information. Even if someone gains access to your device, they cannot read your encrypted data without your PIN.",
      },
      {
        question: "How do I start journaling?",
        answer:
          "After signing in, go to the Journal section and click 'New Entry'. You can write about your thoughts, feelings, prayers, and daily experiences. Add mood tracking and tags to help organize your entries.",
      },
    ],
  },
  {
    category: "Journal Features",
    questions: [
      {
        question: "Can I edit or delete my journal entries?",
        answer:
          "Yes, you can edit or delete any of your journal entries. Click the edit icon on any entry to modify it, or the trash icon to delete it. Deleted entries cannot be recovered, so please be careful.",
      },
      {
        question: "How does mood tracking work?",
        answer:
          "When creating a journal entry, you can select from 8 different moods (joyful, peaceful, grateful, hopeful, anxious, sad, angry, confused). This helps you track emotional patterns over time and identify triggers or positive influences.",
      },
      {
        question: "What are tags and how do I use them?",
        answer:
          "Tags are keywords that help categorize your entries. You can use common tags like 'Prayer', 'Family', 'Work' or create custom ones. Tags make it easy to search and filter your entries by topic.",
      },
    ],
  },
  {
    category: "Community",
    questions: [
      {
        question: "How do I join the community?",
        answer:
          "Once you're signed in, click on 'Community' in the navigation. You can read posts, share your own experiences, ask for advice, or offer support to others. You can post anonymously if you prefer privacy.",
      },
      {
        question: "Can I post anonymously?",
        answer:
          "Yes, when creating a post or reply, you can check the 'Post anonymously' option. This will hide your identity while still allowing you to participate in community discussions.",
      },
      {
        question: "What types of posts are allowed?",
        answer:
          "We welcome prayer requests, testimonies, life advice questions, academic support needs, mental health discussions, relationship guidance, career questions, and spiritual growth topics. Please keep posts respectful and supportive.",
      },
    ],
  },
  {
    category: "Support Services",
    questions: [
      {
        question: "What support services does DHAP offer?",
        answer:
          "DHAP offers crisis helplines (24/7), counseling services, spiritual guidance, peer support, academic assistance, financial guidance, and legal support referrals. All services are designed to support your holistic well-being.",
      },
      {
        question: "How do I access crisis support?",
        answer:
          "If you're in crisis, call our 24/7 helpline at 1-800-DHAP-HELP, or use national resources like 988 (Suicide Prevention) or text HOME to 741741. For immediate life-threatening emergencies, call 911.",
      },
      {
        question: "Are the support services free?",
        answer:
          "Many of our basic support services are free, including crisis support and peer counseling. Some specialized professional services may have fees, but we also offer subsidized and NGO-sponsored options for those in need.",
      },
    ],
  },
  {
    category: "Technical Issues",
    questions: [
      {
        question: "I forgot my PIN. How can I recover my account?",
        answer:
          "Unfortunately, PINs cannot be recovered due to our security design. Your PIN is used to encrypt your data, so without it, the data cannot be decrypted. You'll need to create a new account with a new PIN.",
      },
      {
        question: "Why can't I see my journal entries?",
        answer:
          "If you can't see your entries, make sure you're using the correct PIN. Different PINs will show different data due to our encryption system. Also ensure you're using the same device and browser where you created the entries.",
      },
      {
        question: "The app is running slowly. What can I do?",
        answer:
          "Try clearing your browser cache and cookies. If you have many journal entries, the app might take longer to load. Consider archiving older entries or using a more recent browser version for better performance.",
      },
    ],
  },
]

const guides = [
  {
    title: "Getting Started with DHAP",
    description: "Complete guide to setting up your account and first steps",
    topics: ["Account creation", "PIN security", "First journal entry", "Exploring features"],
  },
  {
    title: "Journaling for Mental Health",
    description: "How to use journaling effectively for emotional wellness",
    topics: ["Daily reflection", "Mood tracking", "Identifying patterns", "Goal setting"],
  },
  {
    title: "Community Guidelines",
    description: "How to participate safely and supportively in our community",
    topics: ["Posting guidelines", "Anonymous posting", "Supporting others", "Reporting issues"],
  },
  {
    title: "Crisis Resources",
    description: "Understanding when and how to seek immediate help",
    topics: ["Warning signs", "Emergency contacts", "Safety planning", "Supporting others"],
  },
]

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")

  const filteredFAQs = faqs.filter((category) => {
    if (selectedCategory && category.category !== selectedCategory) return false

    if (searchTerm) {
      return category.questions.some(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return true
  })

  const categories = faqs.map((faq) => faq.category)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Help Center</h1>
                <p className="text-sm text-gray-600">Find answers and get support</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/support">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                <CardContent className="p-6 text-center">
                  <Phone className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Need Immediate Help?</h3>
                  <p className="text-gray-600">Access crisis support and emergency resources</p>
                  <Badge className="mt-3 bg-red-100 text-red-800">24/7 Available</Badge>
                </CardContent>
              </Card>
            </Link>
            <Link href="/community">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Ask the Community</h3>
                  <p className="text-gray-600">Get support from others who understand</p>
                  <Badge className="mt-3 bg-blue-100 text-blue-800">Peer Support</Badge>
                </CardContent>
              </Card>
            </Link>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Browse Guides</h3>
                <p className="text-gray-600">Step-by-step tutorials and best practices</p>
                <Badge className="mt-3 bg-green-100 text-green-800">Self-Help</Badge>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search help articles..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedCategory === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("")}
                  >
                    All Topics
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* User Guides */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">User Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {guide.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span className="text-sm text-gray-600">{topic}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Read Guide
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          {filteredFAQs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No results found</h3>
                <p className="text-gray-500">Try adjusting your search terms or browse all topics.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {filteredFAQs.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-blue-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`item-${categoryIndex}-${faqIndex}`}>
                          <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                          <AccordionContent className="text-gray-600">{faq.answer}</AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Contact Support */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-lg mb-6 opacity-90">
                Our support team is here to help you with any questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/support">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Phone className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </Link>
                <Link href="/community">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-blue-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ask Community
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
