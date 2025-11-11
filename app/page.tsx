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
  getSplits,
  setSplits,
  addNotification,
  type Trip,
  type Message,
  type UserProfile,
  type AppSettings,
  type SplitTransaction,
} from "@/lib/storage"
import { getMonthMatrix, nextMonth, prevMonth, formatMonthYear, sameMonth } from "@/lib/calendar"
import { useWalkie } from "@/lib/radio"
import LocationMap from "@/components/location-map"
import ProfileDashboard from "@/components/profile-dashboard"
import SplitManager from "@/components/split-manager"
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

  // Profile and Split dialogs
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSplitOpen, setIsSplitOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [selectedTripForPayment, setSelectedTripForPayment] = useState<number | null>(null)

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
      organizerRating: 4.5,
      isLoggedIn: false,
    }),
  )
  const [tempUserProfile, setTempUserProfile] = useState<UserProfile>(userProfile)
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  useEffect(() => {
    setProfile(userProfile)
  }, [userProfile])

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
      icon: "👋",
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
  const [filterDate, setFilterDate] = useState("")

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
          if (selectedTripToJoin) joinTrip(selectedTripToJoin.id)
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

  const joinedGroups = useMemo(() => {
    return tripsState.filter((t) => t.joined).map((t) => ({ id: t.id, name: t.title }))
  }, [tripsState])

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
    MessageCircle: MessageCircle,
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
    "🚪": () => <UserMinus className="h-5 w-5 text-blue-400" />,
    CheckCircle2,
  }

  // Load splits from storage
  const [splits, setSplitsState] = useState<SplitTransaction[]>([])
  useEffect(() => {
    setSplitsState(getSplits())
  }, [])

  // Handle create split
  const handleCreateSplit = (split: SplitTransaction) => {
    const updated = [...splits, split]
    setSplitsState(updated)
    setSplits(updated)

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
                                          {!n.read && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                                        </div>
                                        <p className={`text-sm ${n.read ? "text-gray-400" : "text-gray-300"}`}>
                                          {n.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">{n.time}</p>
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

                  {/* Profile Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/diverse-avatars.png" alt={userProfile.name} />
                          <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </
