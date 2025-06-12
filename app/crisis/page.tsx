"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Phone, MessageCircle, Shield, Heart, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function CrisisPage() {
  const handleEmergencyCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/support">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Support
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crisis Support</h1>
                <p className="text-sm text-gray-600">Immediate help when you need it most</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Alert */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            <strong>If this is a life-threatening emergency, call 911 immediately.</strong>
            <br />
            If you're having thoughts of suicide or self-harm, please reach out for help right now.
          </AlertDescription>
        </Alert>

        {/* Immediate Help */}
        <section className="mb-12">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-red-800 mb-4">You Are Not Alone</CardTitle>
              <CardDescription className="text-lg text-red-700">
                Crisis support is available 24/7. Reach out now - someone is ready to help.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  size="lg"
                  className="h-16 bg-red-600 hover:bg-red-700 text-lg"
                  onClick={() => handleEmergencyCall("988")}
                >
                  <Phone className="w-6 h-6 mr-3" />
                  Call 988 - Suicide Prevention
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 border-red-300 text-red-700 text-lg"
                  onClick={() => handleEmergencyCall("741741")}
                >
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Text HOME to 741741
                </Button>
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  className="h-16 bg-blue-600 hover:bg-blue-700 text-lg px-8"
                  onClick={() => handleEmergencyCall("1-800-DHAP-HELP")}
                >
                  <Heart className="w-6 h-6 mr-3" />
                  DHAP Crisis Line: 1-800-DHAP-HELP
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Crisis Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">Crisis Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  National Suicide Prevention Lifeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-blue-600 mb-2">988</p>
                <p className="text-gray-600 mb-4">24/7 free and confidential support</p>
                <Button className="w-full" onClick={() => handleEmergencyCall("988")}>
                  Call Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Crisis Text Line
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-green-600 mb-2">Text HOME to 741741</p>
                <p className="text-gray-600 mb-4">24/7 crisis support via text</p>
                <Button variant="outline" className="w-full" onClick={() => handleEmergencyCall("741741")}>
                  Text Now
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-purple-600" />
                  NAMI Helpline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-bold text-purple-600 mb-2">1-800-950-NAMI</p>
                <p className="text-gray-600 mb-4">Mental health support and information</p>
                <Button variant="outline" className="w-full" onClick={() => handleEmergencyCall("1-800-950-6264")}>
                  Call Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Warning Signs to Watch For</CardTitle>
              <CardDescription className="text-center">
                If you or someone you know shows these signs, seek help immediately
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-red-600">Immediate Danger Signs</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Talking about wanting to die or kill themselves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Looking for ways to kill themselves</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Talking about feeling hopeless or having no purpose</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Talking about feeling trapped or in unbearable pain</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-orange-600">Other Warning Signs</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Increased use of alcohol or drugs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Withdrawing from family and friends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Sleeping too much or too little</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Giving away prized possessions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How to Help */}
        <section className="mb-12">
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-blue-800">How to Help Someone in Crisis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-green-600">DO</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Take them seriously</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Listen without judgment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Stay with them or ensure they're not alone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Help them connect with professional help</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Follow up with them</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-4 text-red-600">DON'T</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Leave them alone</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Promise to keep their suicidal thoughts secret</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Try to argue them out of suicide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Act shocked or judgmental</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0" />
                      <span>Offer simple solutions</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Safety Planning */}
        <section>
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-green-800">Create a Safety Plan</CardTitle>
              <CardDescription className="text-center">
                Having a plan can help you stay safe during difficult times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">1. Warning Signs</h3>
                    <p className="text-sm text-gray-600">
                      Identify thoughts, feelings, or situations that might lead to crisis
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">2. Coping Strategies</h3>
                    <p className="text-sm text-gray-600">
                      List things you can do to feel better without contacting others
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">3. Support People</h3>
                    <p className="text-sm text-gray-600">People you can reach out to for help and support</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">4. Professional Contacts</h3>
                    <p className="text-sm text-gray-600">Mental health professionals and crisis lines</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Shield className="w-4 h-4 mr-2" />
                    Download Safety Plan Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
