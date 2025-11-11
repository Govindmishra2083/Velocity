import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb.js'
import Notification from '@/lib/models/notification'
import type { NotificationItem } from '@/lib/storage'

export async function GET() {
  try {
    await connectDB()
    const notifications = await Notification.find({}).sort({ id: -1 })
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const notificationData: NotificationItem = await request.json()

    // Check if notification with this id already exists
    const existingNotification = await Notification.findOne({ id: notificationData.id })
    if (existingNotification) {
      return NextResponse.json({ error: 'Notification with this ID already exists' }, { status: 400 })
    }

    const notification = new Notification(notificationData)
    await notification.save()
    return NextResponse.json(notification, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const notificationsData: NotificationItem[] = await request.json()

    // Clear existing notifications and insert new ones
    await Notification.deleteMany({})
    const notifications = await Notification.insertMany(notificationsData)

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error updating notifications:', error)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
