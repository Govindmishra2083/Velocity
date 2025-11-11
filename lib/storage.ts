type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }

// API base URL - adjust if needed for production
const API_BASE = typeof window === 'undefined' ? process.env.NEXT_PUBLIC_API_BASE || '' : ''

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}/api/${endpoint}`
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.warn(`API request error for ${endpoint}:`, error)
    throw error
  }
}

export async function save<T extends JSONValue>(key: string, value: T) {
  // This function is kept for backward compatibility but now uses API calls
  // Individual items are handled by specific functions below
  console.warn('save() function is deprecated. Use specific API functions instead.')
}

export async function load<T extends JSONValue>(key: string, fallback: T): T {
  // This function is kept for backward compatibility but now uses API calls
  // Individual items are handled by specific functions below
  console.warn('load() function is deprecated. Use specific API functions instead.')
  return fallback
}

export function remove(key: string) {
  // This function is kept for backward compatibility
  console.warn('remove() function is deprecated. Use specific API functions instead.')
}

export function resetAll() {
  // This function is kept for backward compatibility
  console.warn('resetAll() function is deprecated. Use specific API functions instead.')
}

/**
 * Domain helpers
 */
export type Trip = {
  id: number
  title: string
  organizer: string
  organizerAvatar?: string
  organizerRating?: number
  startLocation: string
  destination: string
  date: string // yyyy-MM-dd
  time: string // HH:mm
  duration: string
  difficulty: "Easy" | "Relaxed" | "Moderate" | string
  participants: number
  maxParticipants: number
  stops: string[]
  description: string
  tags: string[]
  liked: boolean
  joined: boolean
  isPremium: boolean
  price: string
  experienceLevel: string
  city: string
  groupLocations: { id: number; lat: number; lng: number; name: string; lastSeen: number }[]
}

export type UserProfile = {
  name: string
  email: string
  phone: string
  location: string
  joinDate: string
  totalRides: number
  totalDistance: string
  favoriteRoute: string
  experienceLevel: string
  bio: string
  achievements: string[]
  stats: {
    ridesThisMonth: number
    avgRideDistance: string
    longestRide: string
    favoriteTime: string
  }
  organizerRating?: number
  isLoggedIn?: boolean
}

export type AppSettings = {
  privacy: {
    showProfilePublic: boolean
    shareRideHistory: boolean
    twoFactorAuth: boolean
  }
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
  }
  payments: {
    defaultMethod: "none" | "upi" | "card"
    upiId?: string
    cardLast4?: string
  }
  preferences: {
    theme: "dark" | "light" | "system"
    units: "metric" | "imperial"
    fastAnimations: boolean
  }
  region: {
    language: "en-IN" | "hi-IN" | "mr-IN" | "ta-IN" | "te-IN" | "bn-IN"
    region: "IN"
  }
  location: {
    shareRealtime: boolean
    precise: boolean
  }
}

export type Message = {
  id: number
  sender: string
  message?: string
  time: string
  avatar?: string
  audioUrl?: string // for radio transmissions
  channel?: string
}

export type NotificationItem = {
  id: number
  type: string
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  color: string
}

export type SplitTransaction = {
  id: number
  groupName: string
  groupMembers: { name: string; email: string; avatar?: string }[]
  transactions: {
    description: string
    amount: number
    paidBy: string
    splits: { member: string; amount: number }[]
    date: string
  }[]
  createdDate: string
  balances: { [member: string]: number }
}

const DEFAULT_SETTINGS: AppSettings = {
  privacy: { showProfilePublic: true, shareRideHistory: false, twoFactorAuth: false },
  notifications: { push: true, email: true, sms: false },
  payments: { defaultMethod: "none" },
  preferences: { theme: "dark", units: "metric", fastAnimations: true },
  region: { language: "en-IN", region: "IN" },
  location: { shareRealtime: false, precise: true },
}

export async function getSettings(): Promise<AppSettings> {
  try {
    const settings = await apiRequest<AppSettings | null>('settings', { method: 'GET' })
    return settings || DEFAULT_SETTINGS
  } catch (error) {
    console.warn('Failed to fetch settings from API, using defaults:', error)
    return DEFAULT_SETTINGS
  }
}

export async function setSettings(next: AppSettings): Promise<void> {
  try {
    await apiRequest<AppSettings>('settings', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save settings to API:', error)
  }
}

export async function getTrips(initial: Trip[]): Promise<Trip[]> {
  try {
    const trips = await apiRequest<Trip[]>('trips', { method: 'GET' })
    // sort by date asc
    return trips.sort((a, b) => a.date.localeCompare(b.date))
  } catch (error) {
    console.warn('Failed to fetch trips from API, using initial data:', error)
    return initial
  }
}

export async function setTrips(next: Trip[]): Promise<void> {
  try {
    await apiRequest<Trip[]>('trips', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save trips to API:', error)
  }
}

export async function getMessages(initial: Message[] = []): Promise<Message[]> {
  try {
    return await apiRequest<Message[]>('messages', { method: 'GET' })
  } catch (error) {
    console.warn('Failed to fetch messages from API, using initial data:', error)
    return initial
  }
}

export async function setMessages(next: Message[]): Promise<void> {
  try {
    await apiRequest<Message[]>('messages', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save messages to API:', error)
  }
}

export async function getNotifications(initial: NotificationItem[] = []): Promise<NotificationItem[]> {
  try {
    return await apiRequest<NotificationItem[]>('notifications', { method: 'GET' })
  } catch (error) {
    console.warn('Failed to fetch notifications from API, using initial data:', error)
    return initial
  }
}

export async function setNotifications(next: NotificationItem[]): Promise<void> {
  try {
    await apiRequest<NotificationItem[]>('notifications', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save notifications to API:', error)
  }
}

export async function getProfile(initial: UserProfile): Promise<UserProfile> {
  try {
    const profile = await apiRequest<UserProfile | null>('profile', { method: 'GET' })
    return profile || initial
  } catch (error) {
    console.warn('Failed to fetch profile from API, using initial data:', error)
    return initial
  }
}

export async function setProfile(next: UserProfile): Promise<void> {
  try {
    await apiRequest<UserProfile>('profile', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save profile to API:', error)
  }
}

export async function getSplits(initial: SplitTransaction[] = []): Promise<SplitTransaction[]> {
  try {
    return await apiRequest<SplitTransaction[]>('splits', { method: 'GET' })
  } catch (error) {
    console.warn('Failed to fetch splits from API, using initial data:', error)
    return initial
  }
}

export async function setSplits(next: SplitTransaction[]): Promise<void> {
  try {
    await apiRequest<SplitTransaction[]>('splits', {
      method: 'PUT',
      body: JSON.stringify(next),
    })
  } catch (error) {
    console.warn('Failed to save splits to API:', error)
  }
}

export async function addNotification(notification: Omit<NotificationItem, "id" | "time" | "read">): Promise<NotificationItem> {
  const notifications = await getNotifications()
  const newNotification: NotificationItem = {
    ...notification,
    id: Date.now(),
    time: new Date().toLocaleTimeString(),
    read: false,
  }
  await setNotifications([newNotification, ...notifications])
  return newNotification
}
