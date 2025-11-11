import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb.js'
import SplitTransaction from '@/lib/models/splitTransaction'
import type { SplitTransaction as SplitTransactionType } from '@/lib/storage'

export async function GET() {
  try {
    await connectDB()
    const splits = await SplitTransaction.find({}).sort({ id: 1 })
    return NextResponse.json(splits)
  } catch (error) {
    console.error('Error fetching splits:', error)
    return NextResponse.json({ error: 'Failed to fetch splits' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const splitData: SplitTransactionType = await request.json()

    // Check if split with this id already exists
    const existingSplit = await SplitTransaction.findOne({ id: splitData.id })
    if (existingSplit) {
      return NextResponse.json({ error: 'Split with this ID already exists' }, { status: 400 })
    }

    const split = new SplitTransaction(splitData)
    await split.save()
    return NextResponse.json(split, { status: 201 })
  } catch (error) {
    console.error('Error creating split:', error)
    return NextResponse.json({ error: 'Failed to create split' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB()
    const splitsData: SplitTransactionType[] = await request.json()

    // Clear existing splits and insert new ones
    await SplitTransaction.deleteMany({})
    const splits = await SplitTransaction.insertMany(splitsData)

    return NextResponse.json(splits)
  } catch (error) {
    console.error('Error updating splits:', error)
    return NextResponse.json({ error: 'Failed to update splits' }, { status: 500 })
  }
}
