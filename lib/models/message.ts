import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  id: number
  sender: string
  message?: string
  time: string
  avatar?: string
  audioUrl?: string // for radio transmissions
  channel?: string
}

const MessageSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  sender: { type: String, required: true },
  message: { type: String },
  time: { type: String, required: true },
  avatar: { type: String },
  audioUrl: { type: String },
  channel: { type: String }
})

export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
