"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  MapPin,
  Cloud,
  Camera,
  Users,
  MessageCircle,
  Bell,
  Clock,
  RadioIcon,
  CloudRain,
  Sun,
  Plus,
  Filter,
  Route,
  Flag,
  Heart,
  UserPlus,
  Search,
  Settings,
  Crown,
  Star,
  Shield,
  Mountain,
  TreePine,
  User,
  Edit,
  LogOut,
  HelpCircle,
  Lock,
  Smartphone,
  CreditCard,
  Globe,
  Mail,
  Phone,
  MapIcon,
  Bike,
  Award,
  CalendarIcon,
  Activity,
  Target,
  CheckCircle,
  XCircle,
  Map,
  Navigation,
  Zap,
  VolumeX,
  Volume2,
  Mic,
  MicOff,
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserMinus,
  Radio,
  CheckCircle2,
} from "lucide-react"

import { INDIAN_CITIES } from "@/lib/indian-cities"
import {
  getTrips,
  setTrips,
  getMessages,
  setMessages,
  getNotifications,
  setNotifications,
  getProfile,
  setProfile,
  getSettings,
  setSettings,
  getSplits, // Import getSplits
  setSplits, // Import setSplits
  addNotification, // Import addNotification
  type Trip,
  type Message,
  type UserProfile,
  type AppSettings,
  type SplitTransaction, // Import SplitTransaction
} from "@/lib/storage"
import { getMonthMatrix, nextMonth, prevMonth, formatMonthYear, sameMonth } from "@/lib/calendar"
import { useWalkie } from "@/lib/radio"
import LocationMapPlaceholder from "@/components/location-map-placeholder"
import ProfileDashboard from "@/components/profile-dashboard" // Import ProfileDashboard
import SplitManager from "@/components/split-manager" // Import SplitManager
import LoginDialog from "@/components/login-dialog"
import PaymentModal from "@/components/payment-modal"

// Add ResizeObserver error suppression
if (typeof window !== "undefined") {
  const resizeObserverErrorHandler = (e: ErrorEvent) => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
      e.stopImmediatePropagation()
      return false
    }
    return true
  }
  window.addEventListener("error", resizeObserverErrorHandler)
}

export default function VelocityApp() {
  // Global View
  const [currentView, setCurrentView] = useState("discover")

  // Settings dialogs
  const [openPrivacy, setOpenPrivacy] = useState(false)
  const [openNotifications, setOpenNotifications] = useState(false)
  const [openPayments, setOpenPayments] = useState(false)
  const [openPreferences, setOpenPreferences] = useState(false)
  const [openLanguage, setOpenLanguage] = useState(false)
  const [openLocServices, setOpenLocServices] = useState(false)
  const [openHelp, setOpenHelp] = useState(false)
  const [openContact, setOpenContact] = useState(false)

  // ** CHANGE ** Add state for Profile and Split dialogs
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSplitOpen, setIsSplitOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false) // For login dialog
  const [isPaymentOpen, setIsPaymentOpen] = useState(false) // For payment modal
  const [selectedTripForPayment, setSelectedTripForPayment] = useState<number | null>(null) // For payment modal

  // Anim / UI
  const [animationClass, setAnimationClass] = useState("")
  useEffect(() => {
    let animationInterval: NodeJS.Timeout
    let animationTimeout: NodeJS.Timeout
    const startAnimation = () => {
      animationInterval = setInterval(() => {
        setAnimationClass("animate-pulse")
        animationTimeout = setTimeout(() => setAnimationClass(""), 2000)
      }, 5000)
    }
    startAnimation()
    return () => {
      if (animationInterval) clearInterval(animationInterval)
      if (animationTimeout) clearTimeout(animationTimeout)
    }
  }, [])

  // Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    getProfile({
      name: "User",
      email: "user@velocity.com",
      phone: "+91 98765 43210",
      location: "India",
      joinDate: new Date().toLocaleDateString(),
      totalRides: 0,
      totalDistance: "0 km",
      favoriteRoute: "Not set",
      experienceLevel: "Beginner",
      bio: "Explorer",
      achievements: [],
      stats: { ridesThisMonth: 0, avgRideDistance: "0 km", longestRide: "0 km", favoriteTime: "Morning" },
      organizerRating: 4.5, // Added a default value
      isLoggedIn: false, // Added isLoggedIn state
    }),
  )
  const [tempUserProfile, setTempUserProfile] = useState<UserProfile>(userProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false) // Declared isEditingProfile state

  useEffect(() => {
    setProfile(userProfile)
  }, [userProfile])

  // ** CHANGE ** Add logout handler
  const handleLogout = useCallback(() => {
    setUserProfile({
      name: "User",
      email: "user@velocity.com",
      phone: "+91 9876543210",
      location: "India",
      joinDate: new Date().toLocaleDateString(),
      totalRides: 0,
      totalDistance: "0 km",
      favoriteRoute: "Not set",
      experienceLevel: "Beginner",
      bio: "Explorer",
      achievements: [],
      stats: { ridesThisMonth: 0, avgRideDistance: "0 km", longestRide: "0 km", favoriteTime: "Morning" },
      organizerRating: 4.5,
      isLoggedIn: false,
    })
    addNotification({
      type: "info",
      title: "Logged Out",
      message: "You have been successfully logged out.",
      icon: "LogOut",
      color: "text-red-400",
    })
  }, [])

  const handleEditProfile = useCallback(() => {
    setTempUserProfile(userProfile)
    setIsEditingProfile(true)
  }, [userProfile])
  const handleProfileChange = useCallback((field: keyof UserProfile, value: any) => {
    setTempUserProfile((prev) => ({ ...prev, [field]: value }))
  }, [])
  const handleSaveProfile = useCallback(() => {
    setUserProfile(tempUserProfile)
    setIsEditingProfile(false)
  }, [tempUserProfile])
  const handleCancelEditProfile = useCallback(() => {
    setIsEditingProfile(false)
    setTempUserProfile(userProfile)
  }, [userProfile])

  // Notifications
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [notifications, setNotificationsState] = useState(() =>
    getNotifications([
      {
        id: 1,
        type: "ride_invite",
        title: "New Ride Invitation",
        message: "Priya invited you to join 'Lonavala Hills Adventure' tomorrow at 5:30 AM",
        time: "2 minutes ago",
        read: false,
        icon: "UserPlus",
        color: "text-blue-400",
      },
      {
        id: 2,
        type: "weather_alert",
        title: "Weather Update",
        message: "Light drizzle expected for your scheduled ride. Consider rescheduling.",
        time: "15 minutes ago",
        read: false,
        icon: "CloudRain",
        color: "text-purple-400",
      },
      {
        id: 3,
        type: "ride_reminder",
        title: "Ride Reminder",
        message: "Your ride 'Serene Chembur Morning' starts in 2 hours. Get ready!",
        time: "1 hour ago",
        read: true,
        icon: "Clock",
        color: "text-orange-400",
      },
    ]),
  )
  useEffect(() => {
    setNotifications(notifications)
  }, [notifications])

  const markNotificationAsRead = useCallback((id: number) => {
    setNotificationsState((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])
  const clearAllNotifications = useCallback(() => setNotificationsState([]), [])
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  // Settings Data
  const [settings, setSettingsState] = useState<AppSettings>(() => getSettings())
  useEffect(() => {
    setSettings(settings)
  }, [settings])

  // Trips
  const [tripsState, setTripsState] = useState<Trip[]>(() =>
    getTrips([
      {
        id: 1,
        title: "Serene Sunday Morning Ride to Chembur",
        organizer: "Rahul 'Nature Guide' Sharma",
        organizerAvatar: "/organizer-avatar.jpg",
        organizerRating: 4.9,
        startLocation: "Bandra West Garden Point",
        destination: "Chembur Peaceful Park",
        date: "2024-11-28",
        time: "06:00",
        duration: "4 hours",
        difficulty: "Relaxed",
        participants: 8,
        maxParticipants: 12,
        stops: ["Mahim Nature Point", "Dadar Heritage Site", "Kurla Lake View"],
        description:
          "Peaceful morning ride through Mumbai's scenic routes with nature stops. Perfect for riders who love calm, safe group experiences!",
        tags: ["Scenic", "Peaceful", "Morning"],
        liked: false,
        joined: true,
        isPremium: true,
        price: "₹199",
        experienceLevel: "Guided Experience",
        city: "Mumbai",
        groupLocations: [
          { id: 1, lat: 19.076, lng: 72.8777, name: "Rahul", lastSeen: Date.now() - 30000 },
          { id: 2, lat: 19.08, lng: 72.88, name: "Priya", lastSeen: Date.now() - 45000 },
        ],
      },
      {
        id: 2,
        title: "Weekend Adventure to Lonavala Hills",
        organizer: "Priya 'Mountain Explorer' Patel",
        organizerAvatar: "/organizer-avatar.jpg",
        organizerRating: 4.8,
        startLocation: "Pune Heritage Hub",
        destination: "Lonavala Viewpoint",
        date: "2024-11-29",
        time: "05:30",
        duration: "8 hours",
        difficulty: "Moderate",
        participants: 6,
        maxParticipants: 10,
        stops: ["Khandala Rest Stop", "Bhushi Dam Scenic Point", "Tiger Point Photography"],
        description:
          "Beautiful hill station journey with breathtaking views and photo opportunities. Guided experience with safety gear and refreshments included!",
        tags: ["Adventure", "Hills", "Photography"],
        liked: true,
        joined: true,
        isPremium: true,
        price: "₹399",
        experienceLevel: "Premium Guided",
        city: "Pune",
        groupLocations: [
          { id: 1, lat: 18.75, lng: 73.4, name: "Priya", lastSeen: Date.now() - 60000 },
          { id: 2, lat: 18.76, lng: 73.41, name: "Amit", lastSeen: Date.now() - 120000 },
          { id: 3, lat: 18.745, lng: 73.395, name: "Sneha", lastSeen: Date.now() - 90000 },
        ],
      },
      {
        id: 3,
        title: "Moonlight Coastal Ride - Marine Drive",
        organizer: "Arjun 'Coastal Explorer' Singh",
        organizerAvatar: "/organizer-avatar.jpg",
        organizerRating: 4.7,
        startLocation: "Andheri Sunset Point",
        destination: "Marine Drive Promenade",
        date: "2024-11-27",
        time: "19:30",
        duration: "3 hours",
        difficulty: "Easy",
        participants: 15,
        maxParticipants: 20,
        stops: ["Bandra-Worli Sea Link", "Worli Seaface", "Nariman Point"],
        description:
          "Magical evening ride along Mumbai's beautiful coastline with city lights and ocean breeze. Safe, leisurely pace for all riders!",
        tags: ["Evening Ride", "Coastal", "City Lights"],
        liked: false,
        joined: false,
        isPremium: false,
        price: "Free",
        experienceLevel: "Community Ride",
        city: "Mumbai",
        groupLocations: [
          { id: 1, lat: 18.94, lng: 72.82, name: "Arjun", lastSeen: Date.now() - 15000 },
          { id: 2, lat: 18.95, lng: 72.83, name: "Sakshi", lastSeen: Date.now() - 75000 },
        ],
      },
    ]),
  )
  useEffect(() => {
    setTrips(tripsState)
  }, [tripsState])

  const toggleLike = useCallback((tripId: number) => {
    setTripsState((prev) => prev.map((t) => (t.id === tripId ? { ...t, liked: !t.liked } : t)))
  }, [])

  // ** CHANGE ** Updated discover tab - payment modal on join, direct leave
  const handleJoinTrip = useCallback((tripId: number) => {
    setSelectedTripToJoin(tripId)
    setIsPaymentOpen(true)
  }, [])

  const handleLeaveTrip = useCallback((tripId: number) => {
    setTripsState((prev) =>
      prev.map((t) =>
        t.id === tripId ? { ...t, joined: false, participants: t.participants > 0 ? t.participants - 1 : 0 } : t,
      ),
    )
    addNotification({
      type: "info",
      title: "Left Trip",
      message: "You have left the trip",
      icon: "👋", // Changed icon to 'waving hand'
      color: "text-blue-400",
    })
  }, [])

  const joinTrip = useCallback((tripId: number) => {
    setTripsState((prev) =>
      prev.map((t) =>
        t.id === tripId
          ? { ...t, joined: !t.joined, participants: t.joined ? t.participants - 1 : t.participants + 1 }
          : t,
      ),
    )
  }, [])

  // Discover filters
  const [selectedCity, setSelectedCity] = useState("Mumbai")
  const [manualCity, setManualCity] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [filterDate, setFilterDate] = useState("") // For date picker

  const activeCity = manualCity.trim() ? manualCity.trim() : selectedCity

  const filteredTrips = useMemo(() => {
    return tripsState.filter((trip) => {
      const cityMatch = activeCity ? trip.city.toLowerCase() === activeCity.toLowerCase() : true
      const dateMatch = selectedDate ? trip.date === format(selectedDate, "yyyy-MM-dd") : true
      return cityMatch && dateMatch
    })
  }, [tripsState, activeCity, selectedDate])

  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  useEffect(() => {
    setIsLoadingTrips(true)
    const to = setTimeout(() => setIsLoadingTrips(false), settings.preferences.fastAnimations ? 350 : 650)
    return () => clearTimeout(to)
  }, [filteredTrips, settings.preferences.fastAnimations])

  // Chat
  const [messages, setMessagesState] = useState<Message[]>(() =>
    getMessages([
      {
        id: 1,
        sender: "Nature Guide",
        message: "Beautiful weather for tomorrow's peaceful ride! 🌅",
        time: "10:30 AM",
        avatar: "/diverse-avatars.png",
      },
      {
        id: 2,
        sender: "Mountain Explorer",
        message: "Don't forget to bring your cameras for the scenic stops! 📸",
        time: "10:32 AM",
        avatar: "/diverse-avatars.png",
      },
    ]),
  )
  useEffect(() => {
    setMessages(messages)
  }, [messages])
  const [newMessage, setNewMessage] = useState("")

  const sendMessage = useCallback(() => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: messages.length + 1,
      sender: "You",
      message: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      avatar: "/diverse-avatars.png",
    }
    setMessagesState((prev) => [...prev, msg])
    setNewMessage("")
  }, [messages.length, newMessage])

  // Join flow (dialog + payment)
  const [isJoinFormOpen, setIsJoinFormOpen] = useState(false)
  const [selectedTripToJoin, setSelectedTripToJoin] = useState<Trip | null>(null)
  const [joinFormData, setJoinFormData] = useState({
    riderName: "",
    address: "",
    phoneNumber: "",
    drivingLicense: "",
    rcBook: "",
  })
  const openJoinForm = useCallback((trip: Trip) => {
    setSelectedTripToJoin(trip)
    setJoinFormData({ riderName: "", address: "", phoneNumber: "", drivingLicense: "", rcBook: "" })
    setIsJoinFormOpen(true)
  }, [])
  const handleJoinFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setJoinFormData((prev) => ({ ...prev, [name]: value }))
  }, [])
  const fillFromProfile = useCallback(() => {
    setJoinFormData((prev) => ({
      ...prev,
      riderName: userProfile.name,
      address: userProfile.location,
      phoneNumber: userProfile.phone,
    }))
  }, [userProfile])
  const [isPaymentPageOpen, setIsPaymentPageOpen] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed">("pending")
  const proceedToPayment = useCallback(() => {
    setIsJoinFormOpen(false)
    setIsPaymentPageOpen(true)
    setPaymentStatus("pending")
    const to = setTimeout(() => {
      const success = true
      if (success) {
        setPaymentStatus("success")
        setTimeout(() => {
          if (selectedTripToJoin) joinTrip(selectedTripToJoin.id) // Use the existing joinTrip function
          setIsPaymentPageOpen(false)
          setSelectedTripToJoin(null)
        }, 1200)
      } else {
        setPaymentStatus("failed")
      }
    }, 1200)
    return () => clearTimeout(to)
  }, [joinTrip, selectedTripToJoin])

  // Create form
  const [createFormData, setCreateFormData] = useState({
    title: "",
    city: "",
    startLocation: "",
    destination: "",
    date: undefined as Date | undefined,
    time: "",
    difficulty: "",
    experienceType: "",
    scenicStops: "",
    maxGroupSize: "",
    guidedFee: "",
    tags: "",
    drivingLicense: "",
    rcBook: "",
    description: "",
  })
  const handleCreateFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCreateFormData((prev) => ({ ...prev, [name]: value }))
  }, [])
  const handleCreateSelectChange = useCallback((name: string, value: string) => {
    setCreateFormData((prev) => ({ ...prev, [name]: value }))
  }, [])
  const handleCreateDateChange = useCallback((date: Date | undefined) => {
    setCreateFormData((prev) => ({ ...prev, date }))
  }, [])
  const handleCreateTrip = useCallback(() => {
    if (!createFormData.title || !(createFormData.city || activeCity) || !createFormData.date || !createFormData.time) {
      alert("Please fill in Title, City, Date and Time.")
      return
    }
    const newTrip: Trip = {
      id: (tripsState.at(-1)?.id ?? 0) + 1,
      title: createFormData.title,
      organizer: userProfile.name,
      organizerAvatar: "/desk-organizer.png",
      organizerRating: userProfile.organizerRating ?? 4.5,
      startLocation: createFormData.startLocation || "TBD",
      destination: createFormData.destination || "TBD",
      date: format(createFormData.date, "yyyy-MM-dd"),
      time: createFormData.time,
      duration: "N/A",
      difficulty:
        createFormData.difficulty === "relaxed"
          ? "Relaxed"
          : createFormData.difficulty === "moderate"
            ? "Moderate"
            : "Easy",
      participants: 1,
      maxParticipants: Number(createFormData.maxGroupSize) || 10,
      stops: createFormData.scenicStops
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: createFormData.description || "A new exciting ride!",
      tags: createFormData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      liked: false,
      joined: true,
      isPremium: createFormData.experienceType === "guided",
      price: createFormData.experienceType === "guided" ? createFormData.guidedFee || "₹199" : "Free",
      experienceLevel: createFormData.experienceType === "guided" ? "Guided Experience" : "Community Ride",
      city: createFormData.city || activeCity,
      groupLocations: [],
    }
    setTripsState((prev) => [...prev, newTrip])
    setCurrentView("discover")
    setCreateFormData({
      title: "",
      city: "",
      startLocation: "",
      destination: "",
      date: undefined,
      time: "",
      difficulty: "",
      experienceType: "",
      scenicStops: "",
      maxGroupSize: "",
      guidedFee: "",
      tags: "",
      drivingLicense: "",
      rcBook: "",
      description: "",
    })
    addNotification({
      type: "ride_created",
      title: "Ride Created",
      message: `Your ride "${newTrip.title}" has been created.`,
      time: "Just now",
      read: false,
      icon: "Crown",
      color: "text-orange-400",
    })
  }, [activeCity, createFormData, tripsState, userProfile.name, userProfile.organizerRating])

  // Weather
  const weather = useMemo(() => {
    const base = { temp: 24, condition: "Perfect Riding Weather", icon: Sun }
    if (activeCity.toLowerCase().includes("pune")) return { temp: 22, condition: "Cool & Breezy", icon: Cloud }
    if (activeCity.toLowerCase().includes("mumbai")) return { temp: 28, condition: "Humid but Pleasant", icon: Sun }
    if (activeCity.toLowerCase().includes("delhi")) return { temp: 26, condition: "Clear Skies", icon: Sun }
    return base
  }, [activeCity])

  // Location
  const [showGroupLocations, setShowGroupLocations] = useState(false)
  const [selectedLocationTripId, setSelectedLocationTripId] = useState<number | null>(null)
  const [isLocationSharing, setIsLocationSharing] = useState(settings.location.shareRealtime)
  useEffect(() => {
    setSettingsState((prev) => ({ ...prev, location: { ...prev.location, shareRealtime: isLocationSharing } }))
  }, [isLocationSharing])

  const handleShareLocation = useCallback(() => {
    if (!isLocationSharing) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          () => {
            setIsLocationSharing(true)
          },
          () => {
            alert("Error getting location. Please enable location services.")
          },
          { enableHighAccuracy: true },
        )
      } else {
        alert("Geolocation is not supported by this browser.")
      }
    } else {
      setIsLocationSharing(false)
    }
  }, [isLocationSharing])

  const getLocationStatus = useCallback((lastSeen: number) => {
    const timeDiff = Date.now() - lastSeen
    if (timeDiff < 60000) return { status: "online", color: "text-green-400", text: "Online" }
    if (timeDiff < 300000) return { status: "recent", color: "text-yellow-400", text: "5 min ago" }
    return { status: "offline", color: "text-gray-400", text: "Offline" }
  }, [])

  const currentTripLocations = useMemo(() => {
    if (showGroupLocations && selectedLocationTripId) {
      const trip = tripsState.find((t) => t.id === selectedLocationTripId)
      return trip ? trip.groupLocations : []
    }
    return []
  }, [showGroupLocations, selectedLocationTripId, tripsState])

  const selectedTrip = useMemo(() => {
    return selectedLocationTripId ? tripsState.find((t) => t.id === selectedLocationTripId) : null
  }, [selectedLocationTripId, tripsState])

  // Radio (walkie-talkie)
  const frequencies = ["Peaceful Riders", "Nature Lovers", "City Explorers", "Hill Climbers", "Coastal Cruisers"]
  const [selectedFrequency, setSelectedFrequency] = useState("Peaceful Riders")
  const { isRecording, start, stop, muted, setMuted, recent } = useWalkie(selectedFrequency)

  // ** CHANGE ** Radio tab shows only joined groups
  const joinedGroups = useMemo(() => {
    return tripsState.filter((t) => t.joined).map((t) => ({ id: t.id, name: t.title }))
  }, [tripsState])

  // Added state for selected radio group
  const [selectedRadioGroup, setSelectedRadioGroup] = useState<string>("")

  // Calendar (Schedule) state
  const [activeMonth, setActiveMonth] = useState<Date>(new Date())
  const weeks = useMemo(() => getMonthMatrix(activeMonth), [activeMonth])

  // Derived: trips on selectedDate
  const tripsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    const key = format(selectedDate, "yyyy-MM-dd")
    return tripsState.filter((t) => t.date === key)
  }, [selectedDate, tripsState])

  // Utility: map string icon name from notifications to actual component in render
  const LucideMap: Record<string, React.ComponentType<any>> = {
    UserPlus,
    CloudRain,
    Clock,
    Award,
    MessageCircle,
    Crown,
    MessageCircle: MessageCircle, // Explicitly map MessageCircle if it's used elsewhere
    Shield: Shield,
    LogOut: LogOut,
    HelpCircle: HelpCircle,
    Lock: Lock,
    Smartphone: Smartphone,
    CreditCard: CreditCard,
    Globe: Globe,
    Mail: Mail,
    Phone: Phone,
    MapIcon: MapIcon,
    Bike: Bike,
    Award: Award,
    CalendarIcon: CalendarIcon,
    Activity: Activity,
    Target: Target,
    CheckCircle: CheckCircle,
    XCircle: XCircle,
    Map: Map,
    Navigation: Navigation,
    Zap: Zap,
    VolumeX: VolumeX,
    Volume2: Volume2,
    Mic: Mic,
    MicOff: MicOff,
    ChevronLeft: ChevronLeft,
    ChevronRight: ChevronRight,
    Search: Search,
    Filter: Filter,
    Plus: Plus,
    Cloud: Cloud,
    Camera: Camera,
    Users: Users,
    Bell: Bell,
    Settings: Settings,
    Heart: Heart,
    User: User,
    Route: Route,
    Flag: Flag,
    Star: Star,
    Mountain: Mountain,
    TreePine: TreePine,
    Edit: Edit,
    RadioIcon: RadioIcon,
    Sun: Sun,
    "👋": () => <div className="text-xl">👋</div>,
    "✂️": () => <div className="text-xl">✂️</div>,
    "✅": () => <CheckCircle className="h-5 w-5 text-green-500" />,
    "🚪": () => <UserMinus className="h-5 w-5 text-blue-400" />, // Added for leaving group notification
    CheckCircle2, // Add CheckCircle2 to the map
  }

  // ** CHANGE ** Load splits from storage
  const [splits, setSplitsState] = useState<SplitTransaction[]>([])
  useEffect(() => {
    setSplitsState(getSplits())
  }, [])

  // ** CHANGE ** Handle create split
  const handleCreateSplit = (split: SplitTransaction) => {
    const updated = [...splits, split]
    setSplitsState(updated)
    setSplits(updated)

    // Create notification
    addNotification({
      type: "split",
      title: `${split.groupName} split created`,
      message: `You created a split with ${split.groupMembers.length} members`,
      icon: "Users",
      color: "text-purple-400",
    })
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle background effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500 to-transparent"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
      </div>

      {/* Floating dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-orange-500/30 rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-1/3 w-1 h-1 bg-green-400/30 rounded-full animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="bg-black/95 backdrop-blur-xl shadow-2xl border-b border-gray-800/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div
                className={`bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-3 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-200 hover:scale-110 hover:-translate-y-1 cursor-pointer group ${animationClass}`}
              >
                <Zap className="h-8 w-8 text-white group-hover:rotate-12 transition-transform duration-200" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  Velocity
                </h1>
                <p className="text-xs text-gray-400 font-medium tracking-wider">RIDE SOLO? NEVER AGAIN. RIDE TO VIBE</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {!userProfile.isLoggedIn ? (
                <Button onClick={() => setIsLoginOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              ) : (
                <>
                  {/* Notifications */}
                  <Popover open={isNotificationsOpen} onOpenChange={setIsNotificationsOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-blue-400 relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 bg-black/95 border-gray-800 text-white p-0 shadow-2xl" align="end">
                      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{unreadCount} new</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllNotifications}
                            className="text-gray-400 hover:text-white"
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>
                      <ScrollArea className="max-h-96">
                        <div className="p-2">
                          {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>No notifications yet</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {notifications.map((n) => {
                                const Icon = LucideMap[n.icon] || Bell
                                return (
                                  <div
                                    key={n.id}
                                    onClick={() => markNotificationAsRead(n.id)}
                                    className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                      n.read ? "bg-gray-900/30 border-gray-800" : "bg-blue-500/5 border-blue-500/20"
                                    }`}
                                  >
                                    <div className="flex items-start space-x-3">
                                      <div className={`p-2 rounded-full ${n.read ? "bg-gray-800" : "bg-blue-500/10"}`}>
                                        <Icon className={`h-4 w-4 ${n.color}`} />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                          <p
                                            className={`text-sm font-medium ${n.read ? "text-gray-300" : "text-white"}`}
                                          >
                                            {n.title}
                                          </p>
                                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                                        </div>
                                        <p className={`text-sm mt-1 ${n.read ? "text-gray-400" : "text-gray-300"}`}>
                                          {n.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">{n.time}</p>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>

                  {/* Settings Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-purple-400">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-black/95 border-gray-800 text-gray-300 shadow-2xl">
                      <DropdownMenuLabel className="text-blue-400">Account Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        onClick={() => setIsProfileOpen(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenPrivacy(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        <span>Privacy & Security</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenNotifications(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenPayments(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Payment Methods</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuLabel className="text-purple-400">App Settings</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => setOpenPreferences(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <Smartphone className="mr-2 h-4 w-4" />
                        <span>App Preferences</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenLanguage(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        <span>Language & Region</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenLocServices(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <MapIcon className="mr-2 h-4 w-4" />
                        <span>Location Services</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuLabel className="text-orange-400">Support</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => setOpenHelp(true)} className="hover:bg-gray-800 cursor-pointer">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        <span>Help & Support</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setOpenContact(true)}
                        className="hover:bg-gray-800 cursor-pointer"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Contact Us</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-800" />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="hover:bg-red-900/20 cursor-pointer text-red-400"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Split Button */}
                  <Button
                    onClick={() => setIsSplitOpen(true)}
                    className="bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-400"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Split
                  </Button>

                  {/* Profile - Click Avatar */}
                  <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{userProfile.name}</div>
                      <div className="text-xs text-gray-400">{userProfile.experienceLevel}</div>
                    </div>
                    <Avatar className="ring-2 ring-blue-400/30">
                      <AvatarImage src="/diverse-avatars.png" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        {userProfile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-4xl bg-black/95 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              View and manage your Velocity profile information
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  {!isEditingProfile ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleEditProfile}
                      className="border-gray-700 text-gray-300 bg-transparent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveProfile}
                        className="border-green-700 text-green-300 bg-transparent"
                      >
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEditProfile}
                        className="border-red-700 text-red-300 bg-transparent"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400">Full Name</label>
                      {isEditingProfile ? (
                        <Input
                          value={tempUserProfile.name}
                          onChange={(e) => handleProfileChange("name", e.target.value)}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{userProfile.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Experience Level</label>
                      {isEditingProfile ? (
                        <Input
                          value={tempUserProfile.experienceLevel}
                          onChange={(e) => handleProfileChange("experienceLevel", e.target.value)}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium">{userProfile.experienceLevel}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Email</label>
                      {isEditingProfile ? (
                        <Input
                          value={tempUserProfile.email}
                          onChange={(e) => handleProfileChange("email", e.target.value)}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-gray-400" />
                          {userProfile.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Phone</label>
                      {isEditingProfile ? (
                        <Input
                          value={tempUserProfile.phone}
                          onChange={(e) => handleProfileChange("phone", e.target.value)}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-gray-400" />
                          {userProfile.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Location</label>
                      {isEditingProfile ? (
                        <Input
                          value={tempUserProfile.location}
                          onChange={(e) => handleProfileChange("location", e.target.value)}
                          className="bg-black/50 border-gray-700 text-white"
                        />
                      ) : (
                        <p className="text-white font-medium flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                          {userProfile.location}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm text-gray-400">Member Since</label>
                      <p className="text-white font-medium flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                        {userProfile.joinDate}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Bio</label>
                    {isEditingProfile ? (
                      <Textarea
                        value={tempUserProfile.bio}
                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                        rows={3}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                    ) : (
                      <p className="text-white mt-1">{userProfile.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Riding Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Bike className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userProfile.totalRides}</div>
                      <div className="text-sm text-gray-400">Total Rides</div>
                    </div>
                    <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <Route className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userProfile.totalDistance}</div>
                      <div className="text-sm text-gray-400">Total Distance</div>
                    </div>
                    <div className="text-center p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                      <Activity className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userProfile.stats.ridesThisMonth}</div>
                      <div className="text-sm text-gray-400">This Month</div>
                    </div>
                    <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <Target className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{userProfile.stats.avgRideDistance}</div>
                      <div className="text-sm text-gray-400">Avg Distance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <Avatar className="w-32 h-32 mx-auto ring-4 ring-blue-400/30 cursor-pointer">
                      <AvatarImage src="/diverse-avatars.png" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-4xl">
                        JE
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold text-white">{userProfile.name}</h3>
                      <p className="text-gray-400">{userProfile.experienceLevel} Rider</p>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Award className="h-5 w-5 mr-2 text-orange-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userProfile.achievements.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20"
                      >
                        <Star className="h-5 w-5 text-blue-400" />
                        <span className="text-white font-medium">{a}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longest Ride</span>
                    <span className="text-white font-medium">{userProfile.stats.longestRide}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favorite Time</span>
                    <span className="text-white font-medium">{userProfile.stats.favoriteTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Favorite Route</span>
                    <span className="text-white font-medium">{userProfile.favoriteRoute}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialogs - Privacy */}
      <Dialog open={openPrivacy} onOpenChange={setOpenPrivacy}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Privacy & Security</DialogTitle>
            <DialogDescription className="text-gray-400">Control how your data is shared.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="showPublic">Public Profile</Label>
              <Switch
                id="showPublic"
                checked={settings.privacy.showProfilePublic}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, privacy: { ...s.privacy, showProfilePublic: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="shareHistory">Share Ride History</Label>
              <Switch
                id="shareHistory"
                checked={settings.privacy.shareRideHistory}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, privacy: { ...s.privacy, shareRideHistory: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="twoFA">Two Factor Auth</Label>
              <Switch
                id="twoFA"
                checked={settings.privacy.twoFactorAuth}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, privacy: { ...s.privacy, twoFactorAuth: v } }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenPrivacy(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialogs - Notifications */}
      <Dialog open={openNotifications} onOpenChange={setOpenNotifications}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
            <DialogDescription className="text-gray-400">Choose how you want to be notified.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push">Push Notifications</Label>
              <Switch
                id="push"
                checked={settings.notifications.push}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, notifications: { ...s.notifications, push: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notif">Email</Label>
              <Switch
                id="email-notif"
                checked={settings.notifications.email}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, notifications: { ...s.notifications, email: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notif">SMS</Label>
              <Switch
                id="sms-notif"
                checked={settings.notifications.sms}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, notifications: { ...s.notifications, sms: v } }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenNotifications(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialogs - Payments */}
      <Dialog open={openPayments} onOpenChange={setOpenPayments}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Payment Methods</DialogTitle>
            <DialogDescription className="text-gray-400">Manage how you pay for guided rides.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Label>Default Method</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["none", "upi", "card"] as const).map((m) => (
                <Button
                  key={m}
                  variant={settings.payments.defaultMethod === m ? "default" : "outline"}
                  className={settings.payments.defaultMethod === m ? "bg-blue-600" : ""}
                  onClick={() => setSettingsState((s) => ({ ...s, payments: { ...s.payments, defaultMethod: m } }))}
                >
                  {m.toUpperCase()}
                </Button>
              ))}
            </div>
            {settings.payments.defaultMethod === "upi" && (
              <div>
                <Label htmlFor="upi">UPI ID</Label>
                <Input
                  id="upi"
                  placeholder="yourname@bank"
                  value={settings.payments.upiId || ""}
                  onChange={(e) =>
                    setSettingsState((s) => ({ ...s, payments: { ...s.payments, upiId: e.target.value } }))
                  }
                  className="bg-black/50 border-gray-700 text-white mt-1"
                />
              </div>
            )}
            {settings.payments.defaultMethod === "card" && (
              <div>
                <Label htmlFor="card">Card Last 4</Label>
                <Input
                  id="card"
                  placeholder="1234"
                  value={settings.payments.cardLast4 || ""}
                  onChange={(e) =>
                    setSettingsState((s) => ({
                      ...s,
                      payments: { ...s.payments, cardLast4: e.target.value.slice(0, 4) },
                    }))
                  }
                  className="bg-black/50 border-gray-700 text-white mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">For demo only. Do not enter real card info.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenPayments(false)}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialogs - Preferences */}
      <Dialog open={openPreferences} onOpenChange={setOpenPreferences}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>App Preferences</DialogTitle>
            <DialogDescription className="text-gray-400">Customize your experience.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Theme</Label>
              <div className="space-x-2">
                {(["dark", "light", "system"] as const).map((t) => (
                  <Button
                    key={t}
                    variant={settings.preferences.theme === t ? "default" : "outline"}
                    className={settings.preferences.theme === t ? "bg-purple-600" : ""}
                    onClick={() => setSettingsState((s) => ({ ...s, preferences: { ...s.preferences, theme: t } }))}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Units</Label>
              <div className="space-x-2">
                {(["metric", "imperial"] as const).map((u) => (
                  <Button
                    key={u}
                    variant={settings.preferences.units === u ? "default" : "outline"}
                    className={settings.preferences.units === u ? "bg-purple-600" : ""}
                    onClick={() => setSettingsState((s) => ({ ...s, preferences: { ...s.preferences, units: u } }))}
                  >
                    {u}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="fastAnim">Fast Animations</Label>
              <Switch
                id="fastAnim"
                checked={settings.preferences.fastAnimations}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, preferences: { ...s.preferences, fastAnimations: v } }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenPreferences(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings - Language & Region */}
      <Dialog open={openLanguage} onOpenChange={setOpenLanguage}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Language & Region</DialogTitle>
            <DialogDescription className="text-gray-400">Localize your content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Language</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(["en-IN", "hi-IN", "mr-IN", "ta-IN", "te-IN", "bn-IN"] as const).map((lang) => (
                  <Button
                    key={lang}
                    variant={settings.region.language === lang ? "default" : "outline"}
                    className={settings.region.language === lang ? "bg-green-600" : ""}
                    onClick={() => setSettingsState((s) => ({ ...s, region: { ...s.region, language: lang } }))}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Region</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="default" className="bg-green-600">
                  IN
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenLanguage(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings - Location Services */}
      <Dialog open={openLocServices} onOpenChange={setOpenLocServices}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Location Services</DialogTitle>
            <DialogDescription className="text-gray-400">Control live location sharing.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="shareRealtime">Share Real-time Location</Label>
              <Switch
                id="shareRealtime"
                checked={settings.location.shareRealtime}
                onCheckedChange={(v) =>
                  setSettingsState((s) => ({ ...s, location: { ...s.location, shareRealtime: v } }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="precise">Precise Location</Label>
              <Switch
                id="precise"
                checked={settings.location.precise}
                onCheckedChange={(v) => setSettingsState((s) => ({ ...s, location: { ...s.location, precise: v } }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenLocServices(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings - Help & Contact */}
      <Dialog open={openHelp} onOpenChange={setOpenHelp}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Help & Support</DialogTitle>
            <DialogDescription className="text-gray-400">Find answers and resources.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-300">
              For assistance, check the FAQ in the app or reach out using the Contact form. For deployment issues, use
              the Deploy button in the top right of v0 or see Vercel docs.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenHelp(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openContact} onOpenChange={setOpenContact}>
        <DialogContent className="max-w-lg bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Contact Us</DialogTitle>
            <DialogDescription className="text-gray-400">We typically reply within 24 hours.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Your email" className="bg-black/50 border-gray-700 text-white" />
            <Textarea placeholder="How can we help?" className="bg-black/50 border-gray-700 text-white" rows={4} />
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenContact(false)}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Join Group Form */}
      <Dialog open={isJoinFormOpen} onOpenChange={setIsJoinFormOpen}>
        <DialogContent className="max-w-md bg-black/95 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Join {selectedTripToJoin?.title}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Fill your details to join this riding group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Rider Name</label>
              <Input
                name="riderName"
                value={joinFormData.riderName}
                onChange={handleJoinFormChange}
                placeholder="Your Full Name"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
              <Input
                name="address"
                value={joinFormData.address}
                onChange={handleJoinFormChange}
                placeholder="Your Address"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <Input
                name="phoneNumber"
                value={joinFormData.phoneNumber}
                onChange={handleJoinFormChange}
                placeholder="Your Phone Number"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Driving License Number</label>
              <Input
                name="drivingLicense"
                value={joinFormData.drivingLicense}
                onChange={handleJoinFormChange}
                placeholder="DL1234567890"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">RC Book Number</label>
              <Input
                name="rcBook"
                value={joinFormData.rcBook}
                onChange={handleJoinFormChange}
                placeholder="RC1234567890"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <Button
              variant="outline"
              onClick={fillFromProfile}
              className="w-full border-gray-700 text-gray-300 bg-transparent"
            >
              <User className="h-4 w-4 mr-2" />
              Fill from Profile
            </Button>
            <p className="text-xs text-orange-400">
              <span className="font-bold">Note:</span> Please bring original Driving License and RC Book on the ride
              day.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsJoinFormOpen(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button onClick={proceedToPayment} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              Proceed to Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={isPaymentPageOpen} onOpenChange={setIsPaymentPageOpen}>
        <DialogContent className="max-w-sm bg-black/95 border-gray-800 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {paymentStatus === "pending" && "Processing Payment..."}
              {paymentStatus === "success" && "Payment Successful!"}
              {paymentStatus === "failed" && "Payment Failed"}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {paymentStatus === "pending" && "Please wait while your payment is being processed."}
              {paymentStatus === "success" && "You have successfully joined the group!"}
              {paymentStatus === "failed" && "There was an issue with your payment. Please try again."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 flex justify-center">
            {paymentStatus === "pending" && (
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500"></div>
            )}
            {paymentStatus === "success" && <CheckCircle className="h-20 w-20 text-green-500" />}
            {paymentStatus === "failed" && <XCircle className="h-20 w-20 text-red-500" />}
          </div>
          <DialogFooter className="flex justify-center">
            {paymentStatus === "failed" && (
              <Button
                onClick={() => setIsPaymentPageOpen(false)}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white"
              >
                Try Again
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={currentView} onValueChange={setCurrentView} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-xl">
            <TabsTrigger
              value="discover"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <Search className="h-4 w-4" />
              <span>Discover</span>
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </TabsTrigger>
            <TabsTrigger
              value="walkie"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <RadioIcon className="h-4 w-4" />
              <span>Radio</span>
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger
              value="weather"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <Cloud className="h-4 w-4" />
              <span>Weather</span>
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-400"
            >
              <Map className="h-4 w-4" />
              <span>Location</span>
            </TabsTrigger>
          </TabsList>

          {/* Discover */}
          <TabsContent value="discover" className="space-y-8">
            <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-orange-500/10 border border-gray-800/50">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-4xl font-bold text-white">
                  Find Your{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Riding Companions
                  </span>
                </h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  Connect with fellow riders for safe, peaceful journeys. Discover scenic routes, make new friends, and
                  vibe together.
                </p>
                <div className="flex justify-center space-x-4 pt-2">
                  <Badge className="bg-green-400/10 text-green-400 border-green-400/20 px-4 py-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Safety First Community
                  </Badge>
                  <Badge className="bg-blue-400/10 text-blue-400 border-blue-400/20 px-4 py-2">
                    <Users className="h-4 w-4 mr-2" />
                    1,247 Active Riders
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Filter className="h-5 w-5 text-blue-400" />
                  <span>Find Your Perfect Riding Group</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">City (Select)</Label>
                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-700">
                        {INDIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city} className="text-white">
                            {city}
                          </SelectItem>
                        ))}
                        <Separator className="my-2 bg-gray-800" />
                        <SelectItem value={selectedCity} disabled className="text-gray-400">
                          Or type manually →
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-gray-300 mb-2 block">City (Type manually)</Label>
                    <Input
                      placeholder="Type any Indian city"
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="text-gray-300 mb-2 block">Pick a date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-black/50 border-gray-700 text-white",
                            !selectedDate && "text-gray-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-gray-700">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          initialFocus
                          className="text-white"
                          classNames={{
                            day_selected: "bg-blue-500 text-white hover:bg-blue-600",
                            day_today: "bg-purple-500/20 text-purple-400",
                            caption_label: "text-white font-medium",
                            nav_button: "text-gray-300 hover:bg-gray-800",
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="md:col-span-1">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                      <Search className="h-4 w-4 mr-2" />
                      Find
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {isLoadingTrips ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Bike className="h-20 w-20 text-blue-500 animate-bounce" />
                <p className="mt-4 text-lg text-gray-300">Searching for amazing rides...</p>
              </div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <Bike className="h-24 w-24 text-orange-500 mx-auto animate-pulse" />
                <h2 className="text-3xl font-bold text-white">
                  No riding groups found in {activeCity || "selected area"}.
                </h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Be the first to create a group and invite others to join the vibe!
                </p>
                <Button
                  onClick={() => setCurrentView("create")}
                  className="mt-2 bg-gradient-to-r from-green-500 to-blue-500 text-white"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Group
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 relative overflow-hidden"
                  >
                    {trip.isPremium && (
                      <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        <Crown className="h-3 w-3 inline mr-1" />
                        GUIDED
                      </div>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="ring-2 ring-blue-400/30">
                            <AvatarImage
                              src={trip.organizerAvatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {trip.organizer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-white">{trip.title}</CardTitle>
                            <div className="flex items-center space-x-2">
                              <p className="text-sm text-gray-400">by {trip.organizer}</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-orange-400 fill-current" />
                                <span className="text-xs text-orange-400">{trip.organizerRating ?? "4.7"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleLike(trip.id)}
                          className={trip.liked ? "text-red-400" : "text-gray-400"}
                        >
                          <Heart className={`h-5 w-5 ${trip.liked ? "fill-current" : ""}`} />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-blue-400" />
                          <span className="text-gray-300">{trip.startLocation}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-4 w-4 text-purple-400" />
                          <span className="text-gray-300">{trip.destination}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <CalendarIcon className="h-4 w-4 text-orange-400" />
                          <span className="text-gray-300">
                            {trip.date} at {trip.time}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-green-400" />
                          <span className="text-gray-300">{trip.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Badge
                            variant="outline"
                            className={cn(
                              "cursor-default",
                              trip.difficulty === "Moderate"
                                ? "border-purple-400 text-purple-400"
                                : trip.difficulty === "Relaxed"
                                  ? "border-blue-400 text-blue-400"
                                  : "border-green-400 text-green-400",
                            )}
                          >
                            <Mountain className="h-3 w-3 mr-1" />
                            {trip.difficulty}
                          </Badge>
                          {trip.isPremium && (
                            <Badge className="bg-orange-400/10 text-orange-400 border-orange-400/20">
                              {trip.price}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>
                            {trip.participants}/{trip.maxParticipants} riders
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-300 leading-relaxed">{trip.description}</p>

                      {trip.stops.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-300 mb-2 flex items-center">
                            <Route className="h-4 w-4 mr-2 text-purple-400" />
                            Scenic Stops:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {trip.stops.map((stop, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs border-purple-400/20 text-purple-400 bg-purple-400/10"
                              >
                                <TreePine className="h-3 w-3 mr-1" />
                                {stop}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {trip.tags.map((tag, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="text-xs bg-gray-800/50 text-gray-400 border-gray-700"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex space-x-3 pt-2">
                        {/* ** CHANGE ** Updated discover tab - payment modal on join, direct leave */}
                        {trip.joined ? (
                          <Button
                            onClick={() => handleLeaveTrip(trip.id)}
                            className="flex-1 font-semibold text-white bg-red-600 hover:bg-red-700"
                          >
                            <UserMinus className="h-4 w-4 mr-2" />
                            Leave Group
                          </Button>
                        ) : (
                          <Button
                            onClick={() => handleJoinTrip(trip.id)}
                            className="flex-1 font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          >
                            <UserPlus className="h-4 w-4 mr-2" />
                            Join Group
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="border-gray-700 text-gray-300 bg-transparent"
                          onClick={() => {
                            setCurrentView("calendar")
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Create */}
          <TabsContent value="create" className="space-y-8">
            <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Plus className="h-5 w-5 text-blue-400" />
                  <span>Create Your Riding Group</span>
                </CardTitle>
                <p className="text-gray-400 mt-2">Plan a peaceful ride and invite fellow riders</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Ride Title</label>
                    <Input
                      name="title"
                      value={createFormData.title}
                      onChange={handleCreateFormChange}
                      placeholder="e.g., Serene Sunday Morning Ride to Chembur"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">City</label>
                    <Select value={createFormData.city} onValueChange={(v) => handleCreateSelectChange("city", v)}>
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select City" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-700">
                        {INDIAN_CITIES.map((city) => (
                          <SelectItem key={city} value={city} className="text-white">
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2">
                      <Input
                        placeholder="Or type manually"
                        value={createFormData.city ? "" : activeCity}
                        onChange={(e) => handleCreateSelectChange("city", e.target.value)}
                        className="bg-black/50 border-gray-800 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Starting Point</label>
                    <Input
                      name="startLocation"
                      value={createFormData.startLocation}
                      onChange={handleCreateFormChange}
                      placeholder="e.g., Bandra West Garden Point"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Destination</label>
                    <Input
                      name="destination"
                      value={createFormData.destination}
                      onChange={handleCreateFormChange}
                      placeholder="e.g., Chembur Peaceful Park"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal bg-black/50 border-gray-700 text-white",
                            !createFormData.date && "text-gray-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {createFormData.date ? format(createFormData.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-black border-gray-700">
                        <Calendar
                          mode="single"
                          selected={createFormData.date}
                          onSelect={handleCreateDateChange}
                          initialFocus
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Start Time</label>
                    <Input
                      name="time"
                      type="time"
                      value={createFormData.time}
                      onChange={handleCreateFormChange}
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Difficulty Level</label>
                    <Select
                      value={createFormData.difficulty}
                      onValueChange={(v) => handleCreateSelectChange("difficulty", v)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select Level" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-700">
                        <SelectItem value="relaxed" className="text-white">
                          Relaxed
                        </SelectItem>
                        <SelectItem value="easy" className="text-white">
                          Easy
                        </SelectItem>
                        <SelectItem value="moderate" className="text-white">
                          Moderate
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Experience Type</label>
                    <Select
                      value={createFormData.experienceType}
                      onValueChange={(v) => handleCreateSelectChange("experienceType", v)}
                    >
                      <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-gray-700">
                        <SelectItem value="community" className="text-white">
                          Community Ride
                        </SelectItem>
                        <SelectItem value="guided" className="text-white">
                          Guided Experience
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Scenic Stops</label>
                  <Input
                    name="scenicStops"
                    value={createFormData.scenicStops}
                    onChange={handleCreateFormChange}
                    placeholder="Mahim Nature Point, Dadar Heritage Site, Kurla Lake View"
                    className="bg-black/50 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Ride Description</label>
                  <Textarea
                    name="description"
                    value={createFormData.description}
                    onChange={handleCreateFormChange}
                    placeholder="Describe your peaceful ride, scenic highlights, safety measures, and what riders can expect..."
                    rows={4}
                    className="bg-black/50 border-gray-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Max Group Size</label>
                    <Input
                      name="maxGroupSize"
                      type="number"
                      value={createFormData.maxGroupSize}
                      onChange={handleCreateFormChange}
                      placeholder="12"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Guided Experience Fee</label>
                    <Input
                      name="guidedFee"
                      value={createFormData.guidedFee}
                      onChange={handleCreateFormChange}
                      placeholder="₹199"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Tags</label>
                    <Input
                      name="tags"
                      value={createFormData.tags}
                      onChange={handleCreateFormChange}
                      placeholder="Peaceful, Scenic, Morning"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="createDrivingLicense" className="block text-sm font-medium text-gray-300 mb-1">
                      Driving License Number
                    </label>
                    <Input
                      id="createDrivingLicense"
                      name="drivingLicense"
                      value={createFormData.drivingLicense}
                      onChange={handleCreateFormChange}
                      placeholder="DL1234567890"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="createRcBook" className="block text-sm font-medium text-gray-300 mb-1">
                      RC Book Number
                    </label>
                    <Input
                      id="createRcBook"
                      name="rcBook"
                      value={createFormData.rcBook}
                      onChange={handleCreateFormChange}
                      placeholder="RC1234567890"
                      className="bg-black/50 border-gray-700 text-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-orange-400">
                  <span className="font-bold">Note:</span> Bring original Driving License and RC Book on the day of
                  riding.
                </p>

                <Button
                  onClick={handleCreateTrip}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 text-lg"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Riding Group
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Radio */}
          <TabsContent value="walkie" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <RadioIcon className="h-5 w-5 text-blue-400" />
                    <span>Group Communication (Walkie‑Talkie)</span>
                  </CardTitle>
                  <p className="text-gray-400 mt-2">Push‑to‑talk with local playback and cross‑tab sharing.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ** CHANGE ** Radio tab shows only joined groups */}
                  <div>
                    <Label className="text-white font-semibold flex items-center">
                      <Radio className="h-4 w-4 mr-2" />
                      Select Group Channel
                    </Label>
                    <select
                      value={selectedRadioGroup}
                      onChange={(e) => {
                        setSelectedRadioGroup(e.target.value)
                        // Find the frequency corresponding to the selected group title
                        const selectedTrip = tripsState.find((trip) => trip.title === e.target.value)
                        if (selectedTrip) {
                          // You might need a mapping from trip title/ID to frequency if not directly available
                          // For now, assuming a direct mapping or using a placeholder
                          setSelectedFrequency(
                            selectedTrip.tags.includes("Peaceful") ? "Peaceful Riders" : "City Explorers",
                          ) // Example mapping
                        } else {
                          setSelectedFrequency("Peaceful Riders") // Default
                        }
                      }}
                      className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:border-blue-500 outline-none transition-colors mt-3"
                    >
                      <option value="">Choose a group...</option>
                      {joinedGroups.map((group) => (
                        <option key={group.id} value={group.name}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-center space-y-4">
                    <div className="text-lg font-medium text-white">
                      Connected to: <span className="text-blue-400 font-bold">{selectedFrequency}</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Button
                        size="lg"
                        onMouseDown={start}
                        onMouseUp={stop}
                        onTouchStart={start}
                        onTouchEnd={stop}
                        className={cn(
                          "w-40 h-40 rounded-full text-white font-bold text-lg shadow-2xl",
                          isRecording ? "bg-red-600 animate-pulse" : "bg-gradient-to-r from-blue-500 to-purple-500",
                        )}
                      >
                        {isRecording ? (
                          <div className="flex flex-col items-center">
                            <Mic className="h-12 w-12 mb-2" />
                            <span className="text-sm">SPEAKING</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                            <MicOff className="h-12 w-12 mb-2" />
                            <span className="text-sm">PUSH TO TALK</span>
                          </div>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setMuted((m) => !m)}
                        className="border-gray-700 text-gray-300"
                      >
                        {muted ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
                        {muted ? "Muted" : "Sound On"}
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">Hold the button to speak. Release to send.</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Recent Transmissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {recent.length === 0 ? (
                        <div className="text-center text-gray-400 py-12">
                          No transmissions yet. Press and hold to speak.
                        </div>
                      ) : (
                        recent.map((tx) => (
                          <div
                            key={tx.id}
                            className="p-3 bg-black/30 rounded-lg border border-gray-800 flex items-center justify-between"
                          >
                            <div className="text-gray-300">
                              <div className="font-medium text-white">Channel: {tx.channel}</div>
                              <div className="text-xs text-gray-500">{new Date(tx.createdAt).toLocaleTimeString()}</div>
                            </div>
                            <audio controls src={tx.url} className="h-8" />
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="calendar" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <CalendarIcon className="h-5 w-5 text-blue-400" />
                      <span>Riding Calendar</span>
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-700 text-gray-300 bg-transparent"
                        onClick={() => setActiveMonth((m) => prevMonth(m))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="text-gray-300 font-medium w-48 text-center">{formatMonthYear(activeMonth)}</div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="border-gray-700 text-gray-300 bg-transparent"
                        onClick={() => setActiveMonth((m) => nextMonth(m))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                        <div key={day} className="text-center text-sm font-medium text-gray-400 p-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      {weeks.map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-2">
                          {week.map((d, di) => {
                            const dateKey = format(d, "yyyy-MM-dd")
                            const hasRides = tripsState.some((t) => t.date === dateKey)
                            const isInMonth = sameMonth(d, activeMonth)
                            const isSelected = selectedDate && format(selectedDate, "yyyy-MM-dd") === dateKey
                            return (
                              <button
                                key={di}
                                onClick={() => {
                                  setSelectedDate(d)
                                  setFilterDate(format(d, "yyyy-MM-dd")) // Update filterDate
                                }}
                                className={cn(
                                  "aspect-square rounded-lg text-sm flex items-center justify-center border transition-all",
                                  isSelected
                                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent"
                                    : "bg-transparent border-gray-800 text-gray-300 hover:bg-gray-800",
                                  !isInMonth && "opacity-40",
                                  hasRides && !isSelected && "ring-1 ring-green-500/40",
                                )}
                              >
                                {format(d, "d")}
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Rides on {selectedDate ? format(selectedDate, "PPP") : "Selected Day"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDate ? (
                      tripsOnSelectedDate.length ? (
                        <div className="space-y-3">
                          {tripsOnSelectedDate.map((t) => (
                            <div key={t.id} className="p-3 bg-black/30 rounded-lg border border-gray-800">
                              <div className="font-medium text-white">{t.title}</div>
                              <div className="text-xs text-gray-400">
                                {t.time} • {t.city} • {t.participants}/{t.maxParticipants} riders
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400">No rides on this day. Create one from the Create tab!</div>
                      )
                    ) : (
                      <div className="text-gray-400">Pick a day in the calendar to see rides.</div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                  <CardHeader>
                    <CardTitle className="text-white">Group Chat</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48 mb-4">
                      <div className="space-y-3">
                        {messages.map((msg) => (
                          <div key={msg.id} className="flex items-start space-x-2">
                            <Avatar className="w-8 h-8 ring-1 ring-blue-400/20">
                              <AvatarImage src={msg.avatar || "/placeholder.svg?height=32&width=32&query=avatar"} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                                {msg.sender[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-black/30 rounded-lg p-2 border border-gray-800">
                                <div className="font-medium text-sm text-blue-400">{msg.sender}</div>
                                {msg.message && <div className="text-sm text-gray-300">{msg.message}</div>}
                                {msg.audioUrl && (
                                  <div className="mt-1">
                                    <audio controls src={msg.audioUrl} className="w-full" />
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        className="bg-black/50 border-gray-700 text-white"
                      />
                      <Button onClick={sendMessage} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Improved calendar styling for date picker - darker and more visible */}
            <div className="text-center mt-4">
              <label htmlFor="filterDate" className="text-sm font-medium text-gray-300 mb-2 block">
                Filter by Date
              </label>
              <input
                type="date"
                id="filterDate"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value)
                  setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)
                }}
                className="px-3 py-2 bg-black/80 border-2 border-blue-500/50 rounded-lg text-white font-semibold focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 cursor-pointer"
                style={{
                  colorScheme: "dark",
                }}
              />
            </div>
          </TabsContent>

          {/* Weather */}
          <TabsContent value="weather" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-white">
                    <weather.icon className="h-5 w-5 text-orange-400" />
                    <span>Riding Conditions in {activeCity}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-400">
                      {weather.temp}°C
                    </div>
                    <div className="text-2xl text-gray-300 font-semibold">{weather.condition}</div>
                    <div className="grid grid-cols-3 gap-6 mt-8">
                      <div className="text-center p-4 bg-black/30 rounded-lg border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">Humidity</div>
                        <div className="text-2xl font-bold text-purple-400">65%</div>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">Wind Speed</div>
                        <div className="text-2xl font-bold text-blue-400">12 km/h</div>
                      </div>
                      <div className="text-center p-4 bg-black/30 rounded-lg border border-gray-800">
                        <div className="text-sm text-gray-400 mb-1">UV Index</div>
                        <div className="text-2xl font-bold text-orange-400">6</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
                <CardHeader>
                  <CardTitle className="text-white">3-Day Riding Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { day: "Today", temp: `${weather.temp}°C`, icon: weather.icon, condition: weather.condition },
                      {
                        day: "Tomorrow",
                        temp: `${Math.max(18, weather.temp - 2)}°C`,
                        icon: CloudRain,
                        condition: "Light Drizzle",
                      },
                      { day: "Sunday", temp: `${Math.min(34, weather.temp + 2)}°C`, icon: Sun, condition: "Ideal" },
                    ].map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-800"
                      >
                        <div className="flex items-center space-x-3">
                          <d.icon className="h-6 w-6 text-orange-400" />
                          <div>
                            <span className="font-medium text-white">{d.day}</span>
                            <div className="text-xs text-gray-400">{d.condition}</div>
                          </div>
                        </div>
                        <span className="font-bold text-lg text-gray-300">{d.temp}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="text-white">Riding Conditions Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Shield className="h-6 w-6 text-blue-400" />
                      <span className="font-bold text-blue-400 text-lg">Perfect Riding Weather</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      Ideal conditions for safe group riding with excellent visibility.
                    </p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-purple-500/10 to-orange-500/10 rounded-lg border border-purple-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <Sun className="h-6 w-6 text-purple-400" />
                      <span className="font-bold text-purple-400 text-lg">Best Riding Time</span>
                    </div>
                    <p className="text-sm text-gray-300">Early morning (6-8 AM) offers the most peaceful experience.</p>
                  </div>
                  <div className="p-6 bg-gradient-to-r from-orange-500/10 to-green-500/10 rounded-lg border border-orange-400/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <CloudRain className="h-6 w-6 text-orange-400" />
                      <span className="font-bold text-orange-400 text-lg">Weather Alert</span>
                    </div>
                    <p className="text-sm text-gray-300">Light drizzle expected tomorrow - plan accordingly.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location */}
          <TabsContent value="location" className="space-y-8">
            <Card className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Map className="h-5 w-5 text-blue-400" />
                  <span>Live Location Tracking</span>
                </CardTitle>
                <p className="text-gray-400 mt-2">Track your location and see your group members on the map.</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <LocationMapPlaceholder />

                <div className="flex flex-col md:flex-row gap-4">
                  <Button
                    onClick={() => {
                      setShowGroupLocations(false)
                      setSelectedLocationTripId(null)
                    }}
                    className={cn(
                      "flex-1 font-semibold",
                      !showGroupLocations
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-800/50 text-gray-300",
                    )}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    My Location
                  </Button>
                  <Button
                    onClick={() => setShowGroupLocations(true)}
                    className={cn(
                      "flex-1 font-semibold",
                      showGroupLocations
                        ? "bg-gradient-to-r from-blue-500 to-purple-500"
                        : "bg-gray-800/50 text-gray-300",
                    )}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Group Locations
                  </Button>
                  <Button
                    onClick={handleShareLocation}
                    className={cn(
                      "flex-1 font-semibold",
                      isLocationSharing
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gradient-to-r from-orange-500 to-orange-600",
                    )}
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {isLocationSharing ? "Stop Sharing" : "Share Location"}
                  </Button>
                </div>

                {showGroupLocations && (
                  <Select
                    value={selectedLocationTripId?.toString()}
                    onValueChange={(value) => setSelectedLocationTripId(Number(value))}
                  >
                    <SelectTrigger className="bg-black/50 border-gray-700 text-white">
                      <SelectValue placeholder="Select a Group to Track" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-gray-700">
                      {tripsState.map((trip) => (
                        <SelectItem key={trip.id} value={trip.id.toString()} className="text-white">
                          {trip.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-black/30 border-gray-800">
                    <CardContent className="p-4 text-center">
                      <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-white">Precision Tracking</div>
                      <div className="text-xs text-gray-400 mt-1">GPS accuracy within 3m</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/30 border-gray-800">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-white">Safety First</div>
                      <div className="text-xs text-gray-400 mt-1">Emergency alerts enabled</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-black/30 border-gray-800">
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                      <div className="text-sm font-semibold text-white">Group Sync</div>
                      <div className="text-xs text-gray-400 mt-1">Real-time updates</div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <LoginDialog
        isOpen={isLoginOpen}
        onOpenChange={setIsLoginOpen}
        onLogin={(profile) => {
          setUserProfile({ ...profile, isLoggedIn: true })
          addNotification({
            type: "info",
            title: "Welcome!",
            message: `Welcome to Velocity, ${profile.name}!`,
            icon: "👋",
            color: "text-blue-400",
          })
        }}
      />

      <ProfileDashboard
        isOpen={isProfileOpen}
        onOpenChange={setIsProfileOpen}
        profile={userProfile}
        joinedTrips={tripsState.filter((t) => t.joined)} // Use tripsState here
        splits={splits}
        onLogout={handleLogout} // Pass onLogout handler
      />

      <SplitManager
        isOpen={isSplitOpen}
        onOpenChange={setIsSplitOpen}
        existingSplits={splits}
        onCreateSplit={(newSplit) => {
          const updatedSplits = [...splits, newSplit]
          setSplitsState(updatedSplits)
          setSplits(updatedSplits) // Persist to storage
          addNotification({
            type: "info",
            title: "Split Created",
            message: `Split "${newSplit.groupName}" created successfully!`,
            icon: "CheckCircle2", // Changed to CheckCircle2
            color: "text-green-400", // Changed color
          })
        }}
        currentUserName={userProfile.name} // Pass currentUserName
        existingMembers={[
          { name: "You", email: userProfile.email },
          { name: "Friend 1", email: "friend1@velocity.com" },
          { name: "Friend 2", email: "friend2@velocity.com" },
        ]}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onOpenChange={setIsPaymentPageOpen}
        tripTitle={selectedTripToJoin?.title || "Trip"}
        tripPrice={selectedTripToJoin?.price || "0"}
        onConfirmPayment={() => {
          if (selectedTripToJoin) {
            // ** CHANGE ** Updated discover tab - payment modal on join, direct leave
            joinTrip(selectedTripToJoin.id) // Call the joinTrip function
            addNotification({
              type: "success",
              title: "Payment Successful",
              message: `You've joined "${selectedTripToJoin.title}"!`,
              icon: "✅",
              color: "text-green-500",
            })
            setSelectedTripToJoin(null) // Reset selected trip
          }
          setIsPaymentPageOpen(false)
        }}
      />
    </div>
  )
}
