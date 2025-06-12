"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("dhap_auth")
      if (authData) {
        try {
          const parsed = JSON.parse(authData)
          const isValid = parsed.authenticated && Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 // 24 hours
          setIsAuthenticated(isValid)
          if (!isValid) {
            localStorage.removeItem("dhap_auth")
            localStorage.removeItem("dhap_current_pin") // Use dhap_current_pin
            localStorage.removeItem("dhap_current_username")
          }
        } catch {
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }
  }, [])

  const logout = () => {
    if (typeof window !== "undefined") {
      // Only clear session data, keep encrypted accounts
      localStorage.removeItem("dhap_auth")
      localStorage.removeItem("dhap_current_pin") // Use dhap_current_pin
      localStorage.removeItem("dhap_current_username")
      setIsAuthenticated(false)
      router.push("/auth") // Redirect to auth after logout
    }
  }

  const getCurrentPassword = (): string | null => {
    if (typeof window !== "undefined") {
      const encodedPassword = localStorage.getItem("dhap_current_pin") // Use dhap_current_pin
      return encodedPassword ? atob(encodedPassword) : null
    }
    return null
  }

  const getCurrentUsername = (): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("dhap_current_username")
    }
    return null
  }

  const getCurrentAccountKey = (): string | null => {
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("dhap_auth")
      if (authData) {
        try {
          const auth = JSON.parse(authData)
          return auth.accountKey || null
        } catch {
          return null
        }
      }
    }
    return null
  }

  return {
    isAuthenticated,
    isLoading,
    logout,
    getCurrentPassword,
    getCurrentUsername,
    getCurrentAccountKey,
  }
}
