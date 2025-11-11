import mongoose, { Schema, Document } from 'mongoose'

export interface IAppSettings extends Document {
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

const AppSettingsSchema: Schema = new Schema({
  privacy: {
    showProfilePublic: { type: Boolean, default: true },
    shareRideHistory: { type: Boolean, default: false },
    twoFactorAuth: { type: Boolean, default: false }
  },
  notifications: {
    push: { type: Boolean, default: true },
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  },
  payments: {
    defaultMethod: { type: String, enum: ["none", "upi", "card"], default: "none" },
    upiId: { type: String },
    cardLast4: { type: String }
  },
  preferences: {
    theme: { type: String, enum: ["dark", "light", "system"], default: "dark" },
    units: { type: String, enum: ["metric", "imperial"], default: "metric" },
    fastAnimations: { type: Boolean, default: true }
  },
  region: {
    language: { type: String, enum: ["en-IN", "hi-IN", "mr-IN", "ta-IN", "te-IN", "bn-IN"], default: "en-IN" },
    region: { type: String, default: "IN" }
  },
  location: {
    shareRealtime: { type: Boolean, default: false },
    precise: { type: Boolean, default: true }
  }
})

export default mongoose.models.AppSettings || mongoose.model<IAppSettings>('AppSettings', AppSettingsSchema)
