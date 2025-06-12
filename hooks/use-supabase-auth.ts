"use client"

import { useState, useEffect } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      }

      setIsLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setIsAuthenticated(!!session?.user)

      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }

      setIsLoading(false)

      if (event === "SIGNED_IN") {
        router.push("/")
      } else if (event === "SIGNED_OUT") {
        router.push("/auth")
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading user profile:", error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error("Error loading user profile:", error)
    }
  }

  const checkUserExists = async (email: string, username: string) => {
    try {
      // Check if email exists in auth.users
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()

      if (authError) {
        // Fallback: try to sign in to check if user exists
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password: "dummy_password_check",
        })

        if (signInError?.message.includes("Invalid login credentials")) {
          return { emailExists: false, usernameExists: false }
        }
        if (signInError?.message.includes("Email not confirmed")) {
          return { emailExists: true, usernameExists: false }
        }
      }

      // Check if username exists in users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("username")
        .eq("username", username)
        .single()

      const usernameExists = !userError && userData

      return {
        emailExists: false, // We'll handle this in the signup response
        usernameExists,
      }
    } catch (error) {
      console.error("Error checking user existence:", error)
      return { emailExists: false, usernameExists: false }
    }
  }

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Check if username already exists
      const { usernameExists } = await checkUserExists(email, username)

      if (usernameExists) {
        return {
          data: null,
          error: { message: "Username already exists. Please choose a different username." },
        }
      }

      // Attempt to sign up
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      // Handle specific signup errors
      if (error) {
        if (error.message.includes("User already registered")) {
          return {
            data: null,
            error: { message: "An account with this email already exists. Please sign in instead." },
          }
        }
        return { data, error }
      }

      // If signup successful and user is created, create profile
      if (data.user) {
        try {
          // Create user profile - this will be handled by the database trigger
          // But we'll also try to insert manually as a fallback
          const { error: profileError } = await supabase.from("users").upsert(
            {
              id: data.user.id,
              username,
              email,
              full_name: username,
            },
            {
              onConflict: "id",
            },
          )

          if (profileError) {
            console.warn("Profile creation handled by trigger or already exists:", profileError)
          }
        } catch (profileError) {
          console.warn("Profile creation error (may be handled by trigger):", profileError)
        }
      }

      return { data, error }
    } catch (error: any) {
      console.error("Signup error:", error)
      return {
        data: null,
        error: { message: "Unable to create account. Please try again." },
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return {
          data,
          error: { message: "Invalid email or password. Please check your credentials and try again." },
        }
      }
      if (error.message.includes("Email not confirmed")) {
        return {
          data,
          error: { message: "Please check your email and click the confirmation link before signing in." },
        }
      }
    }

    return { data, error }
  }

  const signOut = async () => {
    setUserProfile(null)
    return await supabase.auth.signOut()
  }

  const getCurrentUser = () => user
  const getUserProfile = () => userProfile

  return {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    getCurrentUser,
    getUserProfile,
    loadUserProfile,
  }
}
