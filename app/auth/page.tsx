"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, User, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, message: "", color: "" })
  const [isVisible, setIsVisible] = useState(false)

  const router = useRouter()
  const { signIn, signUp, isAuthenticated } = useSupabaseAuth()

  useEffect(() => {
    setIsVisible(true)
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const checkPasswordStrength = (pwd: string) => {
    let score = 0
    let message = ""
    let color = ""

    if (pwd.length === 0) {
      return { score: 0, message: "", color: "" }
    }

    if (pwd.length >= 6) score += 1
    if (pwd.length >= 8) score += 1
    if (pwd.length >= 12) score += 1
    if (/[a-z]/.test(pwd)) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    if (/123|abc|password|qwerty/i.test(pwd)) score -= 1

    switch (true) {
      case score <= 2:
        message = "Weak - Please make it stronger"
        color = "text-orange-600"
        break
      case score === 3:
        message = "Fair - Getting better"
        color = "text-yellow-600"
        break
      case score === 4:
        message = "Good - Nice password"
        color = "text-blue-600"
        break
      case score >= 5:
        message = "Strong - Excellent security"
        color = "text-green-600"
        break
    }

    return { score, message, color }
  }

  useEffect(() => {
    if (!isLogin && password) {
      setPasswordStrength(checkPasswordStrength(password))
    }
  }, [password, isLogin])

  const validateInputs = (): { isValid: boolean; message: string } => {
    if (!isLogin && username.length < 3) {
      return { isValid: false, message: "Username must be at least 3 characters long" }
    }

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return { isValid: false, message: "Please enter a valid email address" }
    }

    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters long" }
    }

    return { isValid: true, message: "" }
  }

  const handleAuth = async () => {
    setError("")
    setIsLoading(true)

    const validation = validateInputs()
    if (!validation.isValid) {
      setError(validation.message)
      setIsLoading(false)
      return
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        }
      } else {
        const { data, error } = await signUp(email, password, username)
        if (error) {
          setError(error.message)
        } else if (data?.user) {
          setError("")
          // Show success message
          const successMessage = data.user.email_confirmed_at
            ? "Account created successfully! You can now sign in."
            : "Account created! Please check your email to confirm your account before signing in."

          alert(successMessage)

          // Switch to login mode if email needs confirmation
          if (!data.user.email_confirmed_at) {
            setIsLogin(true)
            setPassword("")
            setConfirmPassword("")
          }
        }
      }
    } catch (error: any) {
      console.error("Auth error:", error)
      setError("Unable to process request. Please try again.")
    }

    setIsLoading(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAuth()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card
        className={`w-full max-w-md transform transition-all duration-700 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-500 hover:scale-110">
            <Heart className="w-8 h-8 text-white animate-pulse" />
          </div>
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Welcome to DHAP
          </CardTitle>
          <CardDescription className="animate-fade-in-delay">
            {isLogin
              ? "Enter your credentials to access your secure journal"
              : "Create your secure account to protect your journal"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium mb-2">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    onKeyPress={handleKeyPress}
                    className="pl-10 transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>
            )}

            <div className="animate-slide-down">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  onKeyPress={handleKeyPress}
                  className="pl-10 transition-all duration-300 focus:scale-105"
                />
              </div>
            </div>

            <div className="animate-slide-down">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-10 transition-all duration-300 focus:scale-105"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>

              {!isLogin && password && (
                <div className="mt-2 flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className={`text-sm transition-colors duration-300 ${passwordStrength.color}`}>
                    {passwordStrength.message}
                  </span>
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="animate-slide-down">
                <label className="block text-sm font-medium mb-2">Confirm password</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    onKeyPress={handleKeyPress}
                    className="pl-10 transition-all duration-300 focus:scale-105"
                  />
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={handleAuth}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg btn-animate"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </Button>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => {
                setIsLogin(!isLogin)
                setUsername("")
                setEmail("")
                setPassword("")
                setConfirmPassword("")
                setError("")
                setPasswordStrength({ score: 0, message: "", color: "" })
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-300"
            >
              {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign in"}
            </Button>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg animate-fade-in-delay border-l-4 border-blue-400">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Security Notice</span>
            </div>
            <p className="text-xs text-blue-700">
              Your data is securely stored and encrypted. We use industry-standard security practices to protect your
              privacy.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
