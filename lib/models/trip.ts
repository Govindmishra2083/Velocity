import mongoose, { Schema, Document } from 'mongoose'

export interface ITrip extends Document {
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

const TripSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  organizer: { type: String, required: true },
  organizerAvatar: { type: String },
  organizerRating: { type: Number },
  startLocation: { type: String, required: true },
  destination: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  difficulty: { type: String, required: true },
  participants: { type: Number, required: true },
  maxParticipants: { type: Number, required: true },
  stops: [{ type: String }],
  description: { type: String, required: true },
  tags: [{ type: String }],
  liked: { type: Boolean, default: false },
  joined: { type: Boolean, default: false },
  isPremium: { type: Boolean, default: false },
  price: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  city: { type: String, required: true },
  groupLocations: [{
    id: { type: Number, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    lastSeen: { type: Number, required: true }
  }]
})

export default mongoose.models.Trip || mongoose.model<ITrip>('Trip', TripSchema)
