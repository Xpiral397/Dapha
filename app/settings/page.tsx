"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Shield, AlertTriangle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const { logout } = useAuth()

  const handleDeleteAllData = () => {
    if (deleteConfirmText === "DELETE ALL MY DATA") {
      // Clear ALL data including encrypted data
      localStorage.removeItem("dhap_auth")
      localStorage.removeItem("dhap_current_pin")
      localStorage.removeItem("dhap_encrypted_data")
      localStorage.removeItem("dhap_community_posts")
      localStorage.removeItem("dhap_community_replies")
      localStorage.removeItem("dhap_contact_messages")
      localStorage.removeItem("dhap_notes_data")

      alert("All your data has been permanently deleted.")
      window.location.href = "/auth"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <h1 className="text-xl font-semibold">Settings</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
              <CardDescription>Your data is encrypted with your PIN. Only you can access it.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-800">
                  ✅ Your data is securely encrypted and stored locally on your device.
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ When you logout, your data remains safe. You can login again anytime with your PIN.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Logout */}
          <Card>
            <CardHeader>
              <CardTitle>Session Management</CardTitle>
              <CardDescription>Logout from your current session while keeping your data safe.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={logout} variant="outline" className="w-full">
                Logout (Keep Data Safe)
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Permanently delete all your data. This action cannot be undone.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm ? (
                <Button onClick={() => setShowDeleteConfirm(true)} variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete All My Data
                </Button>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      This will permanently delete ALL your data including journal entries, notes, community posts, and
                      account information. This action cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type "DELETE ALL MY DATA" to confirm:</label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="DELETE ALL MY DATA"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setShowDeleteConfirm(false)
                        setDeleteConfirmText("")
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleDeleteAllData}
                      variant="destructive"
                      className="flex-1"
                      disabled={deleteConfirmText !== "DELETE ALL MY DATA"}
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
