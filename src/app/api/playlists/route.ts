import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Playlist } from '@/models/Playlist'

export async function GET() {
  try {
    await dbConnect()
    const playlists = await Playlist.find({}).sort({ createdAt: -1 })
    return NextResponse.json(playlists)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch playlists' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const { name } = await request.json()
    
    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Playlist name is required' }, { status: 400 })
    }

    const playlist = new Playlist({ name: name.trim() })
    await playlist.save()
    
    return NextResponse.json(playlist, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create playlist' }, { status: 500 })
  }
} 