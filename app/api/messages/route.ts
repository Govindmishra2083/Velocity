import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb.js'
import Message from '@/lib/models/message'
import type { Message as MessageType } from '@/lib/storage'

export async function GET() {
  try {
    await connectDB()
    const messages = await Message.find({}).sort({ id: 1 })
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const messageData: MessageType = await request.json()

    // Check if message with this id already exists
    const existingMessage = await Message.findOne({ id: messageData.id })
    if (existingMessage) {
      return NextResponse.json({ error: 'Message with this ID already exists' }, { status: 400 })
    }

    const message = new Message(messageData)
    await message.save()
    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const messagesData: MessageType[] = await request.json()

    // Clear existing messages and insert new ones
    await Message.deleteMany({})
    const messages = await Message.insertMany(messagesData)

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error updating messages:', error)
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 })
  }
}
