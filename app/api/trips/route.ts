import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb.js'
import Trip from '@/lib/models/trip'
import type { Trip as TripType } from '@/lib/storage'

export async function GET() {
  try {
    await connectDB()
    const trips = await Trip.find({}).sort({ date: 1 })
    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error fetching trips:', error)
    return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const tripData: TripType = await request.json()

    // Check if trip with this id already exists
    const existingTrip = await Trip.findOne({ id: tripData.id })
    if (existingTrip) {
      return NextResponse.json({ error: 'Trip with this ID already exists' }, { status: 400 })
    }

    const trip = new Trip(tripData)
    await trip.save()
    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const tripsData: TripType[] = await request.json()

    // Clear existing trips and insert new ones
    await Trip.deleteMany({})
    const trips = await Trip.insertMany(tripsData)

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Error updating trips:', error)
    return NextResponse.json({ error: 'Failed to update trips' }, { status: 500 })
  }
}
