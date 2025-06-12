"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Phone, MessageCircle, Heart, Shield, Clock, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

const supportServices = [
  {
    title: "Crisis Helpline",
    description: "24/7 immediate support for mental health emergencies",
    phone: "1-800-DHAP-HELP",
    availability: "24/7",
    type: "Emergency",
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    title: "Counseling Services",
    description: "Professional therapy and counseling sessions",
    phone: "1-800-DHAP-TALK",
    availability: "Mon-Fri 8AM-8PM",
    type: "Professional",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    title: "Spiritual Guidance",
    description: "Faith-based counseling and spiritual mentorship",
    phone: "1-800-DHAP-PRAY",
    availability: "Daily 6AM-10PM",
    type: "Spiritual",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    title: "Peer Support",
    description: "Connect with trained peer supporters",
    phone: "1-800-DHAP-PEER",
    availability: "Daily 10AM-10PM",
    type: "Peer",
    color: "bg-green-50 text-green-600 border-green-200",
  },
]

const resources = [
  {
    title: "Mental Health Resources",
    items: [
      "National Suicide Prevention Lifeline: 988",
      "Crisis Text Line: Text HOME to 741741",
      "NAMI Helpline: 1-800-950-NAMI (6264)",
      "SAMHSA Helpline: 1-800-662-4357",
    ],
  },
  {
    title: "Academic Support",
    items: [
      "Student counseling services",
      "Academic stress management",
      "Study skills and time management",
      "Exam anxiety support",
    ],
  },
  {
    title: "Financial Assistance",
    items: [
      "Emergency financial aid",
      "Scholarship opportunities",
      "Financial counseling",
      "Budgeting and planning help",
    ],
  },
  {
    title: "Legal Support",
    items: ["Legal aid referrals", "Human rights advocacy", "Domestic violence support", "Immigration assistance"],
  },
]

export default function SupportPage() {
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
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
                <p className="text-sm text-gray-600">Get the help you need, when you need it</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Phone className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-800 mb-2">In Crisis? Get Immediate Help</h2>
                <p className="text-red-700 mb-4">
                  If you're having thoughts of suicide or self-harm, please reach out immediately.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Call 988 (Suicide Prevention)
                  </Button>
                  <Button variant="outline" className="border-red-300 text-red-700">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Text HOME to 741741
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Services */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Our Support Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {supportServices.map((service, index) => (
              <Card key={index} className={`border-2 ${service.color}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <Badge variant="outline" className={service.color}>
                      {service.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5" />
                      <span className="font-mono text-lg font-semibold">{service.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5" />
                      <span>{service.availability}</span>
                    </div>
                    <Button className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-blue-600" />
                    {resource.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {resource.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How We Help */}
        <section className="mb-12">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-6">How DHAP Supports You</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Safe Space</h3>
                    <p className="opacity-90">Confidential, judgment-free environment for sharing and healing</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
                    <p className="opacity-90">Licensed professionals and trained volunteers ready to help</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Holistic Approach</h3>
                    <p className="opacity-90">Addressing spiritual, emotional, mental, and physical well-being</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold text-center mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/community">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Join Community</h3>
                  <p className="text-sm text-gray-600">Connect with others on similar journeys</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/journal">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Start Journaling</h3>
                  <p className="text-sm text-gray-600">Begin your healing journey through reflection</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/crisis">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-red-200">
                <CardContent className="p-6 text-center">
                  <Phone className="w-8 h-8 text-red-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Crisis Support</h3>
                  <p className="text-sm text-gray-600">Immediate help for urgent situations</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
