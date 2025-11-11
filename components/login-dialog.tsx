"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"
import type { UserProfile } from "@/lib/storage"

interface LoginDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onLogin: (profile: UserProfile) => void
}

export default function LoginDialog({ isOpen, onOpenChange, onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      alert("Please enter username and password")
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      const newProfile: UserProfile = {
        name: username,
        email: `${username}@velocity.com`,
        phone: "+91 9876543210",
        location: "India",
        joinDate: new Date().toLocaleDateString(),
        totalRides: 0,
        totalDistance: "0 km",
        favoriteRoute: "Not set",
        experienceLevel: "Beginner",
        bio: "Just started riding with Velocity!",
        achievements: ["Welcome to Velocity"],
        stats: {
          ridesThisMonth: 0,
          avgRideDistance: "0 km",
          longestRide: "0 km",
          favoriteTime: "Morning",
        },
        isLoggedIn: true,
      }

      onLogin(newProfile)
      setShowWelcome(true)
      setIsLoading(false)

      setTimeout(() => {
        setShowWelcome(false)
        onOpenChange(false)
        setUsername("")
        setPassword("")
      }, 2000)
    }, 500)
  }

  return (
    <>
      <Dialog open={isOpen && !showWelcome} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to Velocity
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                disabled={isLoading}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
            >
              <LogIn className="h-4 w-4 mr-2" />
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {showWelcome && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-white text-center animate-bounce">
            <h2 className="text-4xl font-bold mb-2">Welcome!</h2>
            <p className="text-xl">{username}</p>
            <p className="text-sm text-white/80 mt-4">You're all set to ride!</p>
          </div>
        </div>
      )}
    </>
  )
}
