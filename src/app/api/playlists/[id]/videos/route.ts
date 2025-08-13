import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import { Playlist } from '@/models/Playlist'

export async function POST(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    await dbConnect()
    const { title, type = 'youtube', youtubeId, url, note } = await request.json()
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    if (type === 'youtube' && !youtubeId) {
      return NextResponse.json({ error: 'YouTube ID is required for youtube type' }, { status: 400 })
    }
    if (type === 'link' && !url) {
      return NextResponse.json({ error: 'URL is required for link type' }, { status: 400 })
    }

    const playlist = await Playlist.findById(id)
    
    if (!playlist) {
      return NextResponse.json({ error: 'Playlist not found' }, { status: 404 })
    }

    const newVideo = type === 'youtube'
      ? {
          title,
          type: 'youtube' as const,
          youtubeId,
          note: note || '',
          status: 'to-watch' as const,
          addedAt: new Date(),
        }
      : {
          title,
          type: 'link' as const,
          url,
          note: note || '',
          status: 'to-watch' as const,
          addedAt: new Date(),
        }

    playlist.videos.push(newVideo)
    await playlist.save()
    
    return NextResponse.json(playlist, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add video' }, { status: 500 })
  }
} 