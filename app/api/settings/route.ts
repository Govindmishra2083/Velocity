import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import AppSettings from '@/lib/models/appSettings'
import type { AppSettings as AppSettingsType } from '@/lib/storage'

export async function GET() {
  try {
    await dbConnect()
    const settings = await AppSettings.find({})
    if (settings.length === 0) {
      return NextResponse.json(null)
    }
    return NextResponse.json(settings[0])
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const settingsData: AppSettingsType = await request.json()

    // Check if settings already exist
    const existingSettings = await AppSettings.findOne({})
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await AppSettings.findOneAndUpdate(
        {},
        settingsData,
        { new: true }
      )
      return NextResponse.json(updatedSettings)
    }

    const settings = new AppSettings(settingsData)
    await settings.save()
    return NextResponse.json(settings, { status: 201 })
  } catch (error) {
    console.error('Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    const settingsData: AppSettingsType = await request.json()

    const updatedSettings = await AppSettings.findOneAndUpdate(
      {}, // Update the first settings found (assuming single user app)
      settingsData,
      { new: true, upsert: true }
    )

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
