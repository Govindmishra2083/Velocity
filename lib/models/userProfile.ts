import mongoose, { Schema, Document } from 'mongoose'

export interface IUserProfile extends Document {
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

const UserProfileSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  joinDate: { type: String, required: true },
  totalRides: { type: Number, default: 0 },
  totalDistance: { type: String, default: "0 km" },
  favoriteRoute: { type: String, default: "Not set" },
  experienceLevel: { type: String, required: true },
  bio: { type: String, required: true },
  achievements: [{ type: String }],
  stats: {
    ridesThisMonth: { type: Number, default: 0 },
    avgRideDistance: { type: String, default: "0 km" },
    longestRide: { type: String, default: "0 km" },
    favoriteTime: { type: String, default: "Morning" }
  },
  organizerRating: { type: Number },
  isLoggedIn: { type: Boolean, default: false }
})

export default mongoose.models.UserProfile || mongoose.model<IUserProfile>('UserProfile', UserProfileSchema)
