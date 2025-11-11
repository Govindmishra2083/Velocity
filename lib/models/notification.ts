import mongoose, { Schema, Document } from 'mongoose'

export interface INotificationItem extends Document {
  id: number
  type: string
  title: string
  message: string
  time: string
  read: boolean
  icon: string
  color: string
}

const NotificationSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  time: { type: String, required: true },
  read: { type: Boolean, default: false },
  icon: { type: String, required: true },
  color: { type: String, required: true }
})

export default mongoose.models.Notification || mongoose.model<INotificationItem>('Notification', NotificationSchema)
