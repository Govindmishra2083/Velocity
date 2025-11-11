import mongoose, { Schema, Document } from 'mongoose'

export interface ISplitTransaction extends Document {
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

const SplitTransactionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  groupName: { type: String, required: true },
  groupMembers: [{
    name: { type: String, required: true },
    email: { type: String, required: true },
    avatar: { type: String }
  }],
  transactions: [{
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    paidBy: { type: String, required: true },
    splits: [{
      member: { type: String, required: true },
      amount: { type: Number, required: true }
    }],
    date: { type: String, required: true }
  }],
  createdDate: { type: String, required: true },
  balances: { type: Map, of: Number, default: {} }
})

export default mongoose.models.SplitTransaction || mongoose.model<ISplitTransaction>('SplitTransaction', SplitTransactionSchema)
