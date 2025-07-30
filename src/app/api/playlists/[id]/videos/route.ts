import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Playlist } from '@/models/Playlist'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { title, youtubeId, note } = await request.json()
    
    if (!title || !youtubeId) {
      return NextResponse.json({ error: 'Title and YouTube ID are required' }, { status: 400 })
    }

    const playlist = await Playlist.findById(params.id)
    
    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    const newVideo = {
      title,
      youtubeId,
      note: note || '',
      status: 'to-watch' as const,
      addedAt: new Date()
    }

    playlist.videos.push(newVideo)
    await playlist.save()
    
    return NextResponse.json(playlist, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 })
  }
} 