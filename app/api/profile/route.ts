import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb.js'
import UserProfile from '@/lib/models/userProfile'
import type { UserProfile as UserProfileType } from '@/lib/storage'

export async function GET() {
  try {
    await connectDB()
    const profiles = await UserProfile.find({})
    if (profiles.length === 0) {
      return NextResponse.json(null)
    }
    return NextResponse.json(profiles[0])
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const profileData: UserProfileType = await request.json()

    // Check if profile already exists (we'll use email as unique identifier)
    const existingProfile = await UserProfile.findOne({ email: profileData.email })
    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { email: profileData.email },
        profileData,
        { new: true }
      )
      return NextResponse.json(updatedProfile)
    }

    const profile = new UserProfile(profileData)
    await profile.save()
    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error saving profile:', error)
    return NextResponse.json({ error: 'Failed to save profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const profileData: UserProfileType = await request.json()

    const updatedProfile = await UserProfile.findOneAndUpdate(
      {}, // Update the first profile found (assuming single user app)
      profileData,
      { new: true, upsert: true }
    )

    return NextResponse.json(updatedProfile)
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
